"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/components/Toast";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import { bridgeTierAfterLogin } from "@/lib/authClient";

type Mode = "signup" | "login";

export default function SignupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-signup", handleOpen);
    return () => window.removeEventListener("open-signup", handleOpen);
  }, []);

  if (!isOpen) return null;

  const configured = isSupabaseConfigured();
  const isSignup = mode === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setError(null);

    // Demo fallback: no backend configured yet — keep the original mock flow.
    if (!configured) {
      if (inviteCode) localStorage.setItem("practiceforge_invite_code", inviteCode);
      localStorage.setItem("practiceforge_tier", "free");
      window.location.reload();
      return;
    }

    setLoading(true);
    const supabase = createClient();
    try {
      if (isSignup) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: inviteCode ? { invite_code: inviteCode } : undefined,
          },
        });
        if (signUpError) throw signUpError;

        if (data.session) {
          // Email confirmation disabled → user is signed in immediately.
          bridgeTierAfterLogin();
          showToast("Welcome to PracticeForge!", "success");
          window.location.reload();
        } else {
          // Email confirmation required.
          showToast("Check your email to confirm your account.", "info");
          setIsOpen(false);
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        bridgeTierAfterLogin();
        showToast("Welcome back!", "success");
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "Google" | "Apple" | "Facebook") => {
    // Only Google is wired for now; the rest stay "coming soon".
    if (!configured || provider !== "Google") {
      showToast(`Log in with ${provider} is coming soon. Please use email.`, "info");
      return;
    }
    setError(null);
    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (oauthError) setError(oauthError.message);
  };

  return (
    <div
      className="animate-fadeInFast"
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 999, padding: "1rem"
      }}
    >
      <div
        className="card-elevated"
        style={{
          background: "var(--surface)", width: "100%", maxWidth: "400px", padding: "2.5rem",
          position: "relative"
        }}
      >
        <button
          id="close-signup-modal"
          onClick={() => setIsOpen(false)}
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--foreground-muted)", fontSize: "1.5rem" }}
        >
          &times;
        </button>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
            {isSignup ? "Create Free Account" : "Welcome back"}
          </h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9375rem" }}>
            {isSignup ? "Unlock daily practice and your personal dictionary." : "Log in to continue your progress."}
          </p>
        </div>

        {/* Social Logins */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button type="button" className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", background: "#fff", color: "#333", border: "1px solid #ddd" }} onClick={() => handleSocialLogin("Google")}>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: "0.5rem" }}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <button type="button" className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", background: "#000", color: "#fff", border: "1px solid #000" }} onClick={() => handleSocialLogin("Apple")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "0.5rem" }}><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.79 1.5-.02 2.76.6 3.54 1.5-3.14 1.83-2.61 5.92.51 7.21-.73 1.86-1.57 3.63-2.71 4.25zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.35 2.4-1.84 4.38-3.74 4.25z"/></svg>
            Continue with Apple
          </button>
          <button type="button" className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", background: "#1877F2", color: "#fff", border: "1px solid #1877F2" }} onClick={() => handleSocialLogin("Facebook")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "0.5rem" }}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", color: "var(--foreground-faint)" }}>
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
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--foreground)" }}
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600 }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--foreground)" }}
            />
          </div>

          {isSignup && (
            <div style={{ marginTop: "0.5rem", padding: "1.25rem", borderRadius: "var(--radius-md)", background: "var(--surface-2)", border: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: "var(--primary)" }} />
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                  Referral / Affiliate Code
                </span>
                {inviteCode.length >= 3 && (
                  <span className="animate-fadeIn" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--mint)", fontSize: "0.75rem", fontWeight: 800 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Valid
                  </span>
                )}
              </label>
              <input
                type="text"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                placeholder="e.g. PARTNER20"
                style={{ width: "100%", padding: "0.875rem", borderRadius: "var(--radius-sm)", border: `2px dashed ${inviteCode.length >= 3 ? "var(--mint)" : "var(--primary-light)"}`, background: "var(--surface)", color: inviteCode.length >= 3 ? "var(--mint-dark)" : "var(--primary)", fontWeight: 700, textAlign: "center", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: "1rem", transition: "all 0.3s" }}
              />
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem", padding: "0.875rem", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Please wait…" : isSignup ? "Sign up" : "Log in"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
          {isSignup ? "Already have an account?" : "New to PracticeForge?"}{" "}
          <button
            type="button"
            onClick={() => { setMode(isSignup ? "login" : "signup"); setError(null); }}
            style={{ background: "none", border: "none", color: "var(--primary)", fontWeight: 700, cursor: "pointer", padding: 0 }}
          >
            {isSignup ? "Log in" : "Sign up free"}
          </button>
        </p>
      </div>
    </div>
  );
}
