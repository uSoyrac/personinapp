import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured, planForPrice } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe sends raw JSON we must verify with the signing secret, so we read the
// body as text and never let a framework parse it first.
export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const stripe = getStripe();
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const admin = createAdminClient();

  async function syncSubscription(sub: Stripe.Subscription) {
    const userId = sub.metadata?.user_id;
    if (!userId) return;

    const priceId = sub.items.data[0]?.price.id;
    const live = sub.status === "active" || sub.status === "trialing";
    // `current_period_end` shape varies across Stripe API versions; read defensively.
    const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;

    await admin
      .from("subscriptions")
      .upsert(
        {
          user_id: userId,
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
          stripe_subscription_id: sub.id,
          plan: live ? planForPrice(priceId) : "free",
          status: sub.status,
          current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.subscription) {
        const sub = await stripe.subscriptions.retrieve(session.subscription as string);
        await syncSubscription(sub);
      }
      break;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await syncSubscription(event.data.object as Stripe.Subscription);
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
