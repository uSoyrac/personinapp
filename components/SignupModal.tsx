"use client";

import { useState, useEffect } from "react";

export default function SignupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-signup", handleOpen);
    return () => window.removeEventListener("open-signup", handleOpen);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    // Simulate API registration, store code if provided
    if (inviteCode) {
      localStorage.setItem("practiceforge_invite_code", inviteCode);
    }
    localStorage.setItem("practiceforge_tier", "free");
    window.location.reload();
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
          onClick={() => setIsOpen(false)}
          style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", cursor: "pointer", color: "var(--foreground-muted)", fontSize: "1.5rem" }}
        >
          &times;
        </button>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>Create Free Account</h2>
          <p style={{ color: "var(--foreground-muted)", fontSize: "0.9375rem" }}>Unlock daily practice and your personal dictionary.</p>
        </div>

        {/* Social Logins */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", background: "#fff", color: "#333", border: "1px solid #ddd" }} onClick={handleSubmit}>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: "0.5rem" }}><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", background: "#000", color: "#fff", border: "1px solid #000" }} onClick={handleSubmit}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "0.5rem" }}><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.79 1.5-.02 2.76.6 3.54 1.5-3.14 1.83-2.61 5.92.51 7.21-.73 1.86-1.57 3.63-2.71 4.25zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.35 2.4-1.84 4.38-3.74 4.25z"/></svg>
            Continue with Apple
          </button>
          <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "0.75rem", background: "#1877F2", color: "#fff", border: "1px solid #1877F2" }} onClick={handleSubmit}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: "0.5rem" }}><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", color: "var(--foreground-faint)" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ margin: "0 0.75rem", fontSize: "0.875rem" }}>OR EMAIL</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

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
          <div style={{ marginTop: "0.5rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--primary)" }}>Partner / Invite Code (Optional)</label>
            <input 
              type="text" 
              value={inviteCode}
              onChange={e => setInviteCode(e.target.value)}
              placeholder="e.g. ACADEMY30" 
              style={{ width: "100%", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px dashed var(--primary-light)", background: "var(--primary-glow)", color: "var(--primary)", fontWeight: 600 }} 
            />
          </div>

          <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem", padding: "0.875rem" }}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
