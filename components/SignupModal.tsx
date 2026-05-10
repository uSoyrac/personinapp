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
