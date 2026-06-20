import { createClient } from "@/lib/supabase/server";

export type Subscription = {
  plan: string;
  status: string;
  current_period_end: string | null;
};

/**
 * Reads the signed-in user's subscription row (server-side, RLS-protected).
 * Returns null when there is no user or no row. This is the single source of
 * truth for premium access — never trust the client.
 */
export async function getCurrentSubscription(): Promise<Subscription | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("subscriptions")
    .select("plan, status, current_period_end")
    .eq("user_id", user.id)
    .single();

  return data ?? null;
}

/** True only for an active/trialing paid plan. */
export function isActivePremium(sub: Subscription | null): boolean {
  if (!sub) return false;
  const paid = sub.plan === "pro" || sub.plan === "elite";
  const live = sub.status === "active" || sub.status === "trialing";
  return paid && live;
}
