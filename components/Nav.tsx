"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, Users, Settings, LogOut, Zap } from "lucide-react";
import XPBar from "@/components/XPBar";
import { showToast } from "@/components/Toast";
import { signOutAndReset } from "@/lib/authClient";
import type { UserTier } from "@/types";

const NAV_LINKS = [
  { href: "/practice", label: "Practice" },
  { href: "/vocabulary", label: "Dictionary" },
  { href: "/library", label: "Library" },
  { href: "/academy", label: "Academy" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tier, setTier] = useState<UserTier>("guest");
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hidden Dev Tool: Clear cache if ?reset=true
    if (window.location.search.includes("reset=true")) {
      localStorage.clear();
      window.history.replaceState({}, document.title, window.location.pathname);
      // tier already defaults to "guest", so no state update is needed here
      return;
    }

    const savedTier = localStorage.getItem("practiceforge_tier") as UserTier;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring tier persisted in localStorage on mount; must run client-side to stay hydration-safe
    if (savedTier) setTier(savedTier);
  }, []);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      boxShadow: "var(--shadow-sm)"
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.875rem 1.5rem",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{
            width: "2.5rem", height: "2.5rem", borderRadius: "8px",
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            color: "#fff",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: "800",
            boxShadow: "0 4px 10px rgba(124, 58, 237, 0.3)"
          }}>
            P
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{
              fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 800,
              color: "var(--foreground)", letterSpacing: "-0.02em", lineHeight: 1
            }}>
              PracticeForge
            </span>
            <span style={{ fontSize: "0.625rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              IELTS & TOEFL Expert
            </span>
          </div>
        </Link>

        {/* Desktop */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.5rem 1rem", borderRadius: "6px",
                  fontSize: "0.875rem", fontWeight: isActive ? 900 : 700,
                  color: isActive ? "#000" : "var(--foreground-faint)",
                  background: isActive ? "#D2FF3A" : "transparent",
                  border: isActive ? "3px solid #000" : "3px solid transparent",
                  boxShadow: isActive ? "3px 3px 0px #000" : "none",
                  transition: "transform 0.1s, box-shadow 0.1s", display: "flex", alignItems: "center",
                }}
              >
                {link.label}
              </Link>
            );
          })}

          <div style={{ width: "1px", height: "1.5rem", background: "var(--border)", margin: "0 0.5rem" }} />

          <div style={{ marginRight: "1rem" }}>
            {tier !== "guest" && <XPBar />}
          </div>

          {tier === "guest" ? (
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <button className="btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "var(--radius-sm)", whiteSpace: "nowrap", height: "fit-content" }} onClick={() => window.dispatchEvent(new Event("open-signup"))}>
                Log in
              </button>
              <button className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "var(--radius-sm)", whiteSpace: "nowrap", height: "fit-content" }} onClick={() => window.dispatchEvent(new Event("open-signup"))}>
                Sign up for Free
              </button>
            </div>
          ) : (
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setProfileOpen(!profileOpen)}
                style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", fontWeight: 800, borderRadius: "9999px", whiteSpace: "nowrap", height: "fit-content", display: "flex", alignItems: "center", gap: "0.375rem", background: "#000", color: tier === "gold" ? "var(--gold)" : "#FFF", border: "1px solid #000", cursor: "pointer", transition: "transform 0.15s ease", boxShadow: "1px 1px 0px rgba(0,0,0,0.5)" }}
              >
                <div style={{ width: "1.125rem", height: "1.125rem", borderRadius: "50%", background: tier === "gold" ? "linear-gradient(135deg, var(--gold), #D97706)" : "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: tier === "gold" ? "#000" : "#FFF", fontSize: "0.6rem", fontWeight: "bold" }}>
                  U
                </div>
                <span>{tier.toUpperCase()}</span>
              </button>
              
              {profileOpen && (
                <div style={{
                  position: "absolute", top: "100%", right: 0, marginTop: "0.5rem",
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-lg)",
                  width: "220px", zIndex: 1000, padding: "0.5rem"
                }}>
                  <div style={{ padding: "0.75rem", borderBottom: "1px solid var(--border)", marginBottom: "0.5rem" }}>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--foreground-muted)" }}>Current Plan</p>
                    <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold", color: "var(--primary)" }}>{tier.toUpperCase()} Plan</p>
                  </div>
                  
                  {tier !== "gold" && (
                    <button 
                      onClick={() => { localStorage.setItem("practiceforge_tier", "gold"); window.location.reload(); }}
                      style={{ width: "100%", textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", background: "var(--primary-glow)", color: "var(--primary)", border: "none", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.375rem" }}
                    >
                      <Zap size={16} /> Upgrade to Gold
                    </button>
                  )}

                  <Link href="/question-bank" style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.375rem", textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--foreground)", fontSize: "0.875rem", cursor: "pointer", marginBottom: "0.5rem" }}>
                    <BookOpen size={16} /> Question Bank
                  </Link>
                  <Link href="/community" style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.375rem", textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--foreground)", fontSize: "0.875rem", cursor: "pointer", marginBottom: "0.5rem" }}>
                    <Users size={16} /> Community
                  </Link>
                  
                  <button 
                    onClick={() => showToast("Subscription management coming soon. Contact support@practiceforge.com", "info")}
                    style={{ width: "100%", textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--foreground)", border: "none", fontSize: "0.875rem", cursor: "pointer", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.375rem" }}
                    onMouseEnter={e => (e.target as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.target as HTMLElement).style.background = "transparent"}
                  >
                    <Settings size={16} /> Manage Subscription
                  </button>
                  
                  <button 
                    onClick={() => signOutAndReset()}
                    style={{ width: "100%", textAlign: "left", padding: "0.5rem 0.75rem", borderRadius: "var(--radius-sm)", background: "transparent", color: "var(--rose)", border: "none", fontSize: "0.875rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem" }}
                    onMouseEnter={e => (e.target as HTMLElement).style.background = "var(--surface-2)"}
                    onMouseLeave={e => (e.target as HTMLElement).style.background = "transparent"}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="btn-secondary hide-desktop"
          style={{ padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center", border: "none", boxShadow: "none" }}
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay (click outside to close) */}
      {mobileOpen && (
        <div 
          className="hide-desktop animate-fadeInFast"
          onClick={() => setMobileOpen(false)}
          style={{
            position: "absolute", top: "100%", left: 0, right: 0, height: "100vh",
            background: "rgba(0, 0, 0, 0.4)", backdropFilter: "blur(4px)", zIndex: 90
          }}
        />
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="hide-desktop animate-fadeInFast" style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "1rem 1.5rem",
          display: "flex", flexDirection: "column", gap: "0.5rem", background: "var(--surface)",
          zIndex: 95, boxShadow: "var(--shadow-lg)"
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-sm)", color: "var(--foreground)", fontWeight: 500, background: "var(--surface-2)" }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ padding: "1rem 0" }}>
            {tier !== "guest" ? <XPBar /> : null}
          </div>
          {tier === "guest" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button className="btn-secondary" style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", justifyContent: "center" }} onClick={() => { setMobileOpen(false); window.dispatchEvent(new Event("open-signup")); }}>
                Log in
              </button>
              <button className="btn-primary" style={{ padding: "0.75rem", borderRadius: "var(--radius-sm)", justifyContent: "center" }} onClick={() => { setMobileOpen(false); window.dispatchEvent(new Event("open-signup")); }}>
                Sign up for Free
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ padding: "0.75rem", background: "var(--surface-2)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--foreground-muted)" }}>Logged in as</p>
                <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold", color: "var(--primary)" }}>{tier.toUpperCase()} User</p>
              </div>
              {tier !== "gold" && (
                <button 
                  onClick={() => { localStorage.setItem("practiceforge_tier", "gold"); window.location.reload(); }}
                  className="btn-primary" 
                  style={{ justifyContent: "center", padding: "0.75rem", borderRadius: "var(--radius-sm)" }}
                >
                  🚀 Upgrade to Gold
                </button>
              )}
              <button 
                onClick={() => showToast("Subscription management coming soon. Contact support@practiceforge.com", "info")}
                className="btn-secondary"
                style={{ justifyContent: "center", padding: "0.75rem", borderRadius: "var(--radius-sm)" }}
              >
                ⚙️ Manage Subscription
              </button>
              <button 
                onClick={() => signOutAndReset()}
                className="btn-secondary"
                style={{ justifyContent: "center", padding: "0.75rem", borderRadius: "var(--radius-sm)", color: "var(--rose)", borderColor: "var(--rose)" }}
              >
                🚪 Log Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
