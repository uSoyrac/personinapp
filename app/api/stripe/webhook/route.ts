import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe, isStripeConfigured, planForPrice } from "@/lib/stripe/server";
import { query } from "@/lib/db";

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

  async function syncSubscription(sub: Stripe.Subscription) {
    const userId = sub.metadata?.user_id;
    if (!userId) return;

    const priceId = sub.items.data[0]?.price.id;
    const live = sub.status === "active" || sub.status === "trialing";
    const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end;
    const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

    await query(
      `insert into subscriptions
         (user_id, stripe_customer_id, stripe_subscription_id, plan, status, current_period_end, updated_at)
       values ($1, $2, $3, $4, $5, $6, now())
       on conflict (user_id) do update set
         stripe_customer_id     = excluded.stripe_customer_id,
         stripe_subscription_id = excluded.stripe_subscription_id,
         plan                   = excluded.plan,
         status                 = excluded.status,
         current_period_end     = excluded.current_period_end,
         updated_at             = now()`,
      [
        userId,
        customerId,
        sub.id,
        live ? planForPrice(priceId) : "free",
        sub.status,
        periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      ]
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
