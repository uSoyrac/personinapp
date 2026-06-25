import Stripe from "stripe";

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

let cached: Stripe | null = null;

/** Lazily-created server-side Stripe client (uses the account's default API version). */
export function getStripe(): Stripe {
  if (!cached) {
    cached = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return cached;
}

export type PaidPlan = "pro" | "elite";
export type BillingCycle = "monthly" | "quarterly" | "annual";

const PLAN_ENV_KEYS: Record<PaidPlan, string[]> = {
  pro: ["STRIPE_PRICE_PRO", "STRIPE_PRICE_PRO_MONTHLY", "STRIPE_PRICE_PRO_QUARTERLY", "STRIPE_PRICE_PRO_ANNUAL"],
  elite: ["STRIPE_PRICE_ELITE", "STRIPE_PRICE_ELITE_MONTHLY", "STRIPE_PRICE_ELITE_QUARTERLY", "STRIPE_PRICE_ELITE_ANNUAL"],
};

/** Map a Stripe Price id back to our internal plan name (any billing cycle). */
export function planForPrice(priceId: string | null | undefined): "pro" | "elite" | "free" {
  if (!priceId) return "free";
  if (PLAN_ENV_KEYS.elite.map((k) => process.env[k]).includes(priceId)) return "elite";
  if (PLAN_ENV_KEYS.pro.map((k) => process.env[k]).includes(priceId)) return "pro";
  return "free";
}

/** Map an internal plan name to its base (monthly) Stripe Price id. */
export function priceForPlan(plan: PaidPlan): string | undefined {
  return plan === "elite" ? process.env.STRIPE_PRICE_ELITE : process.env.STRIPE_PRICE_PRO;
}

/**
 * Resolve the Stripe Price id for a plan + billing cycle. Prefers a
 * cycle-specific env var (e.g. STRIPE_PRICE_PRO_ANNUAL) and falls back to the
 * base monthly price for the monthly cycle.
 */
export function priceForPlanCycle(plan: PaidPlan, cycle: BillingCycle): string | undefined {
  const cycleKey = `STRIPE_PRICE_${plan.toUpperCase()}_${cycle.toUpperCase()}`;
  return process.env[cycleKey] || (cycle === "monthly" ? priceForPlan(plan) : undefined);
}
