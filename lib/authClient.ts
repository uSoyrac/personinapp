"use client";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";

/**
 * Bridges real Supabase auth to the existing localStorage `tier` UI while the
 * app is mid-migration. Once a user really signs in we mark them as a "free"
 * tier so the current Nav/premium UI reflects a logged-in state; server-side
 * subscription gating replaces this in Phase 3.
 */
export function bridgeTierAfterLogin() {
  if (typeof window === "undefined") return;
  const current = localStorage.getItem("practiceforge_tier");
  if (!current || current === "guest") {
    localStorage.setItem("practiceforge_tier", "free");
  }
}

/** Sign out of Supabase (when configured) and reset the demo tier state. */
export async function signOutAndReset() {
  if (isSupabaseConfigured()) {
    try {
      await createClient().auth.signOut();
    } catch {
      // ignore network/sign-out errors — we still clear local state below
    }
  }
  if (typeof window !== "undefined") {
    localStorage.setItem("practiceforge_tier", "guest");
    window.location.href = "/";
  }
}
