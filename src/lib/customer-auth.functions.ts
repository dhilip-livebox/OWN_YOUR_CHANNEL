export type CustomerSession = { name: string; email: string; mobile: string; expiry: number };

const SESSION_KEY = "customer_session";
export const SESSION_EVENT = "customer-session-changed";
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

function endpoint() {
  return import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec";
}

type Customer = { name: string; email: string; mobile: string };

function setSession(customer: Customer, remember: boolean) {
  const session: CustomerSession = { ...customer, expiry: Date.now() + SESSION_DURATION_MS };
  (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(SESSION_EVENT));
}

export function getCustomerSession(): CustomerSession | null {
  for (const store of [localStorage, sessionStorage]) {
    try {
      const raw = store.getItem(SESSION_KEY);
      if (!raw) continue;
      const session = JSON.parse(raw) as CustomerSession;
      if (!session.expiry || Date.now() > session.expiry) {
        store.removeItem(SESSION_KEY);
        continue;
      }
      return session;
    } catch {
      // ignore malformed entry
    }
  }
  return null;
}

// There is no server-side session to invalidate here — this just clears the local state,
// same as adminLogout(). Not a secure "logout" in any real sense, just state clearing.
export function customerLogout() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(SESSION_EVENT));
}

async function postJson<T>(payload: object): Promise<T> {
  const res = await fetch(endpoint(), {
    method: "POST",
    // Deliberately not mode:"no-cors" — unlike the fire-and-forget order/lead writes elsewhere,
    // login/register/reset all need to read {ok, error} back. Content-Type stays text/plain so
    // this remains a CORS "simple request" (no preflight OPTIONS, which Apps Script can't answer).
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

type AuthResult = { ok: boolean; error?: string; customer?: Customer };

export async function registerCustomer(data: { name: string; email: string; mobile: string; password: string }) {
  const res = await postJson<AuthResult>({ type: "register", ...data });
  if (res.ok && res.customer) setSession(res.customer, true);
  return res;
}

export async function loginCustomer(data: { identifier: string; password: string; remember: boolean }) {
  const res = await postJson<AuthResult>({ type: "login", identifier: data.identifier, password: data.password });
  if (res.ok && res.customer) setSession(res.customer, data.remember);
  return res;
}

export const requestPasswordReset = (email: string) =>
  postJson<{ ok: boolean; error?: string }>({ type: "request_password_reset", email });

export const verifyResetOtp = (email: string, otp: string) =>
  postJson<{ ok: boolean; error?: string }>({ type: "verify_reset_otp", email, otp });

export const resetPassword = (email: string, otp: string, newPassword: string) =>
  postJson<{ ok: boolean; error?: string }>({ type: "reset_password", email, otp, newPassword });

export async function updateProfile(data: { name: string; email: string; mobile: string }) {
  const session = getCustomerSession();
  if (!session) return { ok: false, error: "Not signed in." };
  const res = await postJson<AuthResult>({ type: "update_profile", currentEmail: session.email, ...data });
  if (res.ok && res.customer) {
    // Preserve whichever storage already held the session (i.e. the original Remember Me choice).
    const remember = !!localStorage.getItem(SESSION_KEY);
    setSession(res.customer, remember);
  }
  return res;
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const session = getCustomerSession();
  if (!session) return { ok: false, error: "Not signed in." };
  return postJson<{ ok: boolean; error?: string }>({ type: "change_password", email: session.email, ...data });
}
