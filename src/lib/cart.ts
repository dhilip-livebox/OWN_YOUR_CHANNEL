import type { BillingCycle } from "@/lib/pricing";

export type CartState = { selectedIds: number[]; cycle: BillingCycle };

const CART_KEY = "pricing_cart_v1";

export function loadCart(): CartState | null {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartState) : null;
  } catch {
    return null;
  }
}

export function saveCart(state: CartState) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(state));
  } catch {
    // storage full/unavailable — cart persistence is a convenience, safe to skip
  }
}

export function clearCart() {
  try {
    localStorage.removeItem(CART_KEY);
  } catch {
    // noop
  }
}
