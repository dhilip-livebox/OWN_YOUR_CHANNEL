export type DailyPoint = { date: string; count: number };
export type LeadStats = {
  total: number;
  today: number;
  week: number;
  month: number;
  daily: DailyPoint[];
};

function emptyStats(): LeadStats {
  const days: DailyPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setUTCDate(d.getUTCDate() - i);
    days.push({ date: d.toISOString().slice(0, 10), count: 0 });
  }
  return { total: 0, today: 0, week: 0, month: 0, daily: days };
}

export const adminLogin = async (data: { password: string }) => {
  if (data.password === "admin123") {
    // 1 hour session (60 minutes * 60 seconds * 1000 ms)
    const expiry = new Date().getTime() + 60 * 60 * 1000;
    localStorage.setItem("admin_session_expiry", expiry.toString());
    // Also remove the old legacy key if it exists
    localStorage.removeItem("admin_unlocked");
    return { ok: true as const };
  }
  return { ok: false as const, error: "Incorrect password" };
};

export const adminLogout = async () => {
  localStorage.removeItem("admin_session_expiry");
  return { ok: true as const };
};

export const adminStatus = async () => {
  const expiryStr = localStorage.getItem("admin_session_expiry");
  if (!expiryStr) return { unlocked: false };
  
  const expiry = parseInt(expiryStr, 10);
  if (isNaN(expiry) || new Date().getTime() > expiry) {
    // Session expired
    localStorage.removeItem("admin_session_expiry");
    return { unlocked: false };
  }
  
  return { unlocked: true };
};

export const getLeadStats = async (): Promise<LeadStats> => {
  const status = await adminStatus();
  if (!status.unlocked) throw new Error("Unauthorized");

  // Hardcode the Google Apps Script endpoint here or use a VITE_ env var
  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec"; // Update to the actual URL
  if (!endpoint) return emptyStats();
  
  try {
    const res = await fetch(endpoint, { method: "GET" });
    if (!res.ok) return emptyStats();
    const json = (await res.json()) as Partial<LeadStats>;
    return {
      total: json.total ?? 0,
      today: json.today ?? 0,
      week: json.week ?? 0,
      month: json.month ?? 0,
      daily: json.daily?.length ? json.daily : emptyStats().daily,
    };
  } catch (err) {
    console.error("getLeadStats failed", err);
    return emptyStats();
  }
};

export type PricingService = {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number | null;
  monthlyOfferPrice: number | null;
  annualDiscountPercent: number;
};

const PRICING_CACHE_KEY = "cached_pricing_v1";

// Apps Script cold-starts are slow (often 1-5s). Caching last-known-good pricing lets both
// the admin table and the public page render instantly and refresh in the background instead
// of showing a blank loading state on every visit.
export function getCachedPricingSync(): PricingService[] {
  try {
    const raw = localStorage.getItem(PRICING_CACHE_KEY);
    return raw ? (JSON.parse(raw) as PricingService[]) : [];
  } catch {
    return [];
  }
}

function setCachedPricing(services: PricingService[]) {
  try {
    localStorage.setItem(PRICING_CACHE_KEY, JSON.stringify(services));
  } catch {
    // storage full/unavailable — cache is a perf nicety, safe to skip
  }
}

export const getPricing = async (): Promise<PricingService[]> => {
  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec";
  if (!endpoint) return getCachedPricingSync();

  try {
    const res = await fetch(`${endpoint}?action=pricing`, { method: "GET" });
    if (!res.ok) return getCachedPricingSync();
    const json = (await res.json()) as { services: PricingService[] };
    const services = json.services || [];
    if (services.length > 0) setCachedPricing(services);
    return services;
  } catch (err) {
    console.error("getPricing failed", err);
    return getCachedPricingSync();
  }
};

export const updatePricing = async (services: PricingService[]) => {
  const status = await adminStatus();
  if (!status.unlocked) throw new Error("Unauthorized");

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzL5u2QfR4t-P3tW9J7J9jR7J9/exec";
  if (!endpoint) throw new Error("No endpoint configured");

  // Update the local cache immediately and fire the request without awaiting it — Apps Script's
  // round trip can take seconds, and mode:"no-cors" means we can't read a real success response
  // anyway, so blocking the Save button on it only adds latency with no accuracy benefit.
  setCachedPricing(services);
  fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "update_pricing", services }),
  }).catch((err) => console.error("updatePricing failed", err));

  return { ok: true };
};

