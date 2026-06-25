import { getCurrentUser } from "@/lib/auth/user";
import { query } from "@/lib/db";

export type Subscription = {
  plan: string;
  status: string;
  current_period_end: string | null;
};

/**
 * Reads the signed-in user's subscription row (server-side). The single source
 * of truth for premium access — never trust the client.
 */
export async function getCurrentSubscription(): Promise<Subscription | null> {
  const user = await getCurrentUser();
  if (!user) return null;

  const rows = await query<Subscription>(
    "select plan, status, current_period_end from subscriptions where user_id = $1",
    [user.id]
  );
  return rows[0] ?? null;
}

/** True only for an active/trialing paid plan. */
export function isActivePremium(sub: Subscription | null): boolean {
  if (!sub) return false;
  const paid = sub.plan === "pro" || sub.plan === "elite";
  const live = sub.status === "active" || sub.status === "trialing";
  return paid && live;
}
