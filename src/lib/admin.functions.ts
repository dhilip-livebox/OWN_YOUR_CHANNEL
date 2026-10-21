import { type ComponentItem, serverComponents as defaultServerComponents, requirementOptions as defaultRequirementOptions } from "../data/serverComponents";
export type { ComponentItem };

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
  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec"; // Update to the actual URL
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

export type ConsultationLead = {
  timestamp: string;
  name: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  language: string;
  interest: string;
  status: string;
};

export const getConsultations = async (): Promise<ConsultationLead[]> => {
  const status = await adminStatus();
  if (!status.unlocked) throw new Error("Unauthorized");

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) return [];

  try {
    const res = await fetch(`${endpoint}?action=leads`, { method: "GET" });
    if (!res.ok) return [];
    const json = (await res.json()) as { leads: ConsultationLead[] };
    return json.leads || [];
  } catch (err) {
    console.error("getConsultations failed", err);
    return [];
  }
};

export type OrderRecord = {
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  services: string;
  subTotal: number;
  gst: number;
  amount: number;
  billingCycle: string;
  status: string;
  transactionId?: string;
  accountName?: string;
};

export const getOrders = async (): Promise<OrderRecord[]> => {
  const status = await adminStatus();
  if (!status.unlocked) throw new Error("Unauthorized");

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) return [];

  try {
    const res = await fetch(`${endpoint}?action=orders`, { method: "GET" });
    if (!res.ok) return [];
    const json = (await res.json()) as { orders: OrderRecord[] };
    return json.orders || [];
  } catch (err) {
    console.error("getOrders failed", err);
    return [];
  }
};

export const updateOrderStatus = async (timestamp: string, email: string, status: string) => {
  const auth = await adminStatus();
  if (!auth.unlocked) throw new Error("Unauthorized");

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) throw new Error("No endpoint configured");

  fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "update_order_status", timestamp, email, status }),
  }).catch((err) => console.error("updateOrderStatus failed", err));

  return { ok: true };
};

export const updateLeadStatus = async (timestamp: string, email: string, status: string) => {
  const auth = await adminStatus();
  if (!auth.unlocked) throw new Error("Unauthorized");

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) throw new Error("No endpoint configured");

  fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "update_lead_status", timestamp, email, status }),
  }).catch((err) => console.error("updateLeadStatus failed", err));

  return { ok: true };
};

export type UniversalEnquiry = {
  timestamp: string;
  name: string;
  company: string;
  whatsapp: string;
  email: string;
  country: string;
  goal: string;
  platforms: string;
  audience: string;
  continuous: string;
  brand: string;
  infrastructure: string;
  description: string;
  status: string;
};

export const getUniversalEnquiries = async (): Promise<UniversalEnquiry[]> => {
  const status = await adminStatus();
  if (!status.unlocked) throw new Error("Unauthorized");

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) return [];

  try {
    const res = await fetch(`${endpoint}?action=universal_enquiries`, { method: "GET" });
    if (!res.ok) return [];
    const json = (await res.json()) as { enquiries: UniversalEnquiry[] };
    return json.enquiries || [];
  } catch (err) {
    console.error("getUniversalEnquiries failed", err);
    return [];
  }
};

export const updateUniversalEnquiryStatus = async (timestamp: string, email: string, status: string) => {
  const auth = await adminStatus();
  if (!auth.unlocked) throw new Error("Unauthorized");

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) throw new Error("No endpoint configured");

  fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "update_universal_enquiry_status", timestamp, email, status }),
  }).catch((err) => console.error("updateUniversalEnquiryStatus failed", err));

  return { ok: true };
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
  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
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

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
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

const SERVER_COMPS_CACHE_KEY = "cached_server_comps_v1";
const REQ_OPTS_CACHE_KEY = "cached_req_opts_v1";

export function getCachedServerComponentsSync(): ComponentItem[] {
  try {
    const raw = localStorage.getItem(SERVER_COMPS_CACHE_KEY);
    return raw ? JSON.parse(raw) : defaultServerComponents;
  } catch {
    return defaultServerComponents;
  }
}

function setCachedServerComponents(components: ComponentItem[]) {
  try {
    localStorage.setItem(SERVER_COMPS_CACHE_KEY, JSON.stringify(components));
  } catch {}
}

export const getServerComponents = async (): Promise<ComponentItem[]> => {
  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) return getCachedServerComponentsSync();

  try {
    const res = await fetch(`${endpoint}?action=server_components`, { method: "GET" });
    if (!res.ok) return getCachedServerComponentsSync();
    const json = await res.json();
    const components = json.components || [];
    if (components.length > 0) setCachedServerComponents(components);
    return components.length > 0 ? components : getCachedServerComponentsSync();
  } catch (err) {
    console.error("getServerComponents failed", err);
    return getCachedServerComponentsSync();
  }
};

export const updateServerComponents = async (components: ComponentItem[]) => {
  const status = await adminStatus();
  if (!status.unlocked) throw new Error("Unauthorized");

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) throw new Error("No endpoint configured");

  setCachedServerComponents(components);
  fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "update_server_components", components }),
  }).catch((err) => console.error("updateServerComponents failed", err));

  return { ok: true };
};

export type RequirementOption = { id: string; name: string; price: number; value?: number };
export type RequirementsConfig = { bandwidth: RequirementOption[]; player: RequirementOption[]; storage: RequirementOption[] };

export function getCachedRequirementOptionsSync(): RequirementsConfig | null {
  try {
    const raw = localStorage.getItem(REQ_OPTS_CACHE_KEY);
    return raw ? JSON.parse(raw) : defaultRequirementOptions as unknown as RequirementsConfig;
  } catch {
    return defaultRequirementOptions as unknown as RequirementsConfig;
  }
}

function setCachedRequirementOptions(opts: RequirementsConfig) {
  try {
    localStorage.setItem(REQ_OPTS_CACHE_KEY, JSON.stringify(opts));
  } catch {}
}

export const getRequirementOptions = async (): Promise<RequirementsConfig | null> => {
  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) return getCachedRequirementOptionsSync();

  try {
    const res = await fetch(`${endpoint}?action=requirement_options`, { method: "GET" });
    if (!res.ok) return getCachedRequirementOptionsSync();
    const json = await res.json();
    const opts = json.options;
    if (opts) setCachedRequirementOptions(opts);
    return opts || getCachedRequirementOptionsSync();
  } catch (err) {
    console.error("getRequirementOptions failed", err);
    return getCachedRequirementOptionsSync();
  }
};

export const updateRequirementOptions = async (options: RequirementsConfig) => {
  const status = await adminStatus();
  if (!status.unlocked) throw new Error("Unauthorized");

  const endpoint = import.meta.env.VITE_SHEETS_ENDPOINT || "https://script.google.com/macros/s/AKfycbyGLOXSq1QHFZGxuaGZDDKRXQY9mpNqdXrEnVSC7R9Jn5fp4wj4-ohXk1p2mKbWsfVIRA/exec";
  if (!endpoint) throw new Error("No endpoint configured");

  setCachedRequirementOptions(options);
  fetch(endpoint, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "update_requirement_options", options }),
  }).catch((err) => console.error("updateRequirementOptions failed", err));

  return { ok: true };
};
