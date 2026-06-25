"use client";

import { useEffect } from "react";

// Replaces the old signup modal: every legacy `open-signup` trigger now routes
// to the dedicated /signup page (fixes the modal that wouldn't reopen/close).
export default function AuthRedirect() {
  useEffect(() => {
    const go = () => {
      window.location.href = "/signup";
    };
    window.addEventListener("open-signup", go);
    return () => window.removeEventListener("open-signup", go);
  }, []);

  return null;
}
