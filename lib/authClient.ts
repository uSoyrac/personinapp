"use client";

/**
 * Bridges the real auth flow to the existing localStorage `tier` UI while the
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

/** Clear the server session + reset the demo tier state, then go home. */
export async function signOutAndReset() {
  try {
    await fetch("/api/auth/logout", { method: "POST" });
  } catch {
    // ignore network errors — we still clear local state below
  }
  if (typeof window !== "undefined") {
    localStorage.setItem("practiceforge_tier", "guest");
    window.location.href = "/";
  }
}
