export type PricingInputs = {
  monthlyPrice: number | null;
  monthlyOfferPrice: number | null;
  annualDiscountPercent: number;
};

export type AnnualPricing = {
  annualRegularPrice: number | null; // monthlyPrice * 12, always shown struck-through when discounted
  annualPrice: number | null; // discounted price actually charged
  amountSaved: number | null;
  discountPercent: number | null;
};

export type BillingCycle = "monthly" | "annual";

// Annual pricing is always derived from the plain monthly price (never the monthly offer price) —
// the admin only ever needs to maintain one "default" monthly rate.
export function computeAnnualPricing(inputs: PricingInputs): AnnualPricing {
  if (inputs.monthlyPrice === null) {
    return { annualRegularPrice: null, annualPrice: null, amountSaved: null, discountPercent: null };
  }

  const annualRegularPrice = Math.round(inputs.monthlyPrice * 12);
  const pct = Math.min(Math.max(inputs.annualDiscountPercent, 0), 100);
  return {
    annualRegularPrice,
    annualPrice: Math.round(annualRegularPrice * (1 - pct / 100)),
    amountSaved: Math.round(annualRegularPrice * (pct / 100)),
    discountPercent: Math.round(pct),
  };
}

// Reverse direction for the admin UI: admin types a discounted annual price directly,
// this derives the equivalent percent (kept unrounded so it round-trips back exactly).
export function percentFromAnnualPrice(monthlyPrice: number | null, discountedAnnualPrice: number): number {
  if (!monthlyPrice || monthlyPrice <= 0) return 0;
  const base = monthlyPrice * 12;
  const pct = (1 - discountedAnnualPrice / base) * 100;
  return Math.min(Math.max(pct, 0), 100);
}

export function getEffectivePrice(inputs: PricingInputs, cycle: BillingCycle): number | null {
  if (cycle === "annual") return computeAnnualPricing(inputs).annualPrice;
  return inputs.monthlyOfferPrice ?? inputs.monthlyPrice ?? null;
}
