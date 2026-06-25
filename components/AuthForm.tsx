"use client";

import { useState } from "react";
import Link from "next/link";
import { showToast } from "@/components/Toast";
import { bridgeTierAfterLogin } from "@/lib/authClient";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (isSignup && !agreed) {
      setError("Please accept the Privacy Policy and Terms of Service to continue.");
      return;
    }
    if (!email || !password) return;
    if (isSignup && password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(isSignup ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName: email.split("@")[0] }),
      });

      if (res.ok) {
        if (inviteCode) localStorage.setItem("practiceforge_invite_code", inviteCode);
        bridgeTierAfterLogin();
        showToast(isSignup ? "Welcome to PracticeForge!" : "Welcome back!", "success");
        window.location.href = "/practice";
        return;
      }
      if (res.status === 503) {
        // Backend not configured yet → keep the demo flow working.
        localStorage.setItem("practiceforge_tier", "free");
        window.location.href = "/practice";
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error || "Authentication failed. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogle() {
    showToast("Google sign-in is coming soon — please use email for now.", "info");
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--foreground)",
  };

  return (
    <div className="card-elevated" style={{ width: "100%", maxWidth: "420px", padding: "2.5rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          {isSignup ? "Create your free account" : "Welcome back"}
        </h1>
        <p style={{ color: "var(--foreground-muted)", fontSize: "0.9375rem" }}>
          {isSignup ? "Unlock daily practice and your personal dictionary." : "Log in to continue your progress."}
        </p>
      </div>

      <button type="button" className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", background: "#fff", color: "#333", border: "1px solid #ddd", marginBottom: "1.5rem" }} onClick={handleGoogle}>
        <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: "0.5rem" }}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
        Continue with Google
      </button>

      <div style={{ display: "flex", alignItems: "center", margin: "0 0 1.5rem", color: "var(--foreground-faint)" }}>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        <span style={{ margin: "0 0.75rem", fontSize: "0.875rem" }}>OR EMAIL</span>
        <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
      </div>

      {error && (
        <div style={{ marginBottom: "1rem", padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", background: "rgba(244,63,94,0.08)", border: "1px solid var(--rose)", color: "var(--rose)", fontSize: "0.875rem", fontWeight: 600 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600 }}>Email Address</label>
          <input id="auth-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600 }}>Password</label>
          <input id="auth-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
        </div>

        {isSignup && (
          <>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600 }}>Referral / Affiliate Code (optional)</label>
              <input type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="e.g. PARTNER20" style={inputStyle} />
            </div>
            <label style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", fontSize: "0.8125rem", color: "var(--foreground-muted)", cursor: "pointer", lineHeight: 1.5 }}>
              <input id="auth-consent" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: "0.15rem" }} />
              <span>
                I agree to the{" "}
                <Link href="/privacy" style={{ color: "var(--primary)", fontWeight: 600 }}>Privacy Policy</Link> and{" "}
                <Link href="/terms" style={{ color: "var(--primary)", fontWeight: 600 }}>Terms of Service</Link>.
              </span>
            </label>
          </>
        )}

        <button id="auth-submit" type="submit" disabled={loading || (isSignup && !agreed)} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem", padding: "0.875rem", opacity: loading || (isSignup && !agreed) ? 0.6 : 1, cursor: loading || (isSignup && !agreed) ? "not-allowed" : "pointer" }}>
          {loading ? "Please wait…" : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
        {isSignup ? "Already have an account? " : "New to PracticeForge? "}
        <Link href={isSignup ? "/login" : "/signup"} style={{ color: "var(--primary)", fontWeight: 700 }}>
          {isSignup ? "Log in" : "Sign up free"}
        </Link>
      </p>
    </div>
  );
}
