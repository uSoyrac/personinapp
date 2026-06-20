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

/** Map a Stripe Price id back to our internal plan name. */
export function planForPrice(priceId: string | null | undefined): "pro" | "elite" | "free" {
  if (priceId && priceId === process.env.STRIPE_PRICE_ELITE) return "elite";
  if (priceId && priceId === process.env.STRIPE_PRICE_PRO) return "pro";
  return "free";
}

/** Map an internal plan name to its configured Stripe Price id. */
export function priceForPlan(plan: PaidPlan): string | undefined {
  return plan === "elite" ? process.env.STRIPE_PRICE_ELITE : process.env.STRIPE_PRICE_PRO;
}
