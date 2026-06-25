import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/user";
import { query } from "@/lib/db";
import { getStripe, isStripeConfigured } from "@/lib/stripe/server";

// Opens the Stripe Customer Portal so users can manage/cancel their subscription.
export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ error: "Payments are not configured yet." }, { status: 503 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const rows = await query<{ stripe_customer_id: string | null }>(
    "select stripe_customer_id from subscriptions where user_id = $1",
    [user.id]
  );
  const customerId = rows[0]?.stripe_customer_id;
  if (!customerId) {
    return NextResponse.json({ error: "No active subscription found." }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const portal = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${siteUrl}/pricing`,
  });

  return NextResponse.json({ url: portal.url });
}
