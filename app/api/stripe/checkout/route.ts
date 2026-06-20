import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, isStripeConfigured, priceForPlan, type PaidPlan } from "@/lib/stripe/server";

// Creates a Stripe Checkout Session (subscription mode) for the signed-in user.
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  const { plan } = (await request.json().catch(() => ({}))) as { plan?: PaidPlan };
  const priceId = priceForPlan(plan === "elite" ? "elite" : "pro");
  if (!priceId) {
    return NextResponse.json({ error: "That plan is not available yet." }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const stripe = getStripe();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: user.email,
    client_reference_id: user.id,
    success_url: `${siteUrl}/pricing?success=1`,
    cancel_url: `${siteUrl}/pricing?canceled=1`,
    metadata: { user_id: user.id, plan: plan ?? "pro" },
    subscription_data: { metadata: { user_id: user.id } },
  });

  return NextResponse.json({ url: session.url });
}
