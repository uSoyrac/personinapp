"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import XPBar from "@/components/XPBar";
import type { UserTier } from "@/types";

const NAV_LINKS = [
  { href: "/practice", label: "IELTS & TOEFL Practice" },
  { href: "/general-english", label: "General English" },
  { href: "/vocabulary", label: "My Dictionary" },
  { href: "/question-bank", label: "Question Bank" },
  { href: "/pricing", label: "Pricing" },
  { href: "/academy", label: "Academy" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tier, setTier] = useState<UserTier>("guest");

  useEffect(() => {
    // Hidden Dev Tool: Clear cache if ?reset=true
    if (window.location.search.includes("reset=true")) {
      localStorage.clear();
      window.history.replaceState({}, document.title, window.location.pathname);
      setTier("guest");
      return;
    }

    const savedTier = localStorage.getItem("practiceforge_tier") as UserTier;
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
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.5rem 0.875rem", borderRadius: "var(--radius-sm)",
                fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground-muted)",
                transition: "all 0.2s", display: "flex", alignItems: "center"
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "var(--primary)"; (e.target as HTMLElement).style.background = "var(--primary-glow)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "var(--foreground-muted)"; (e.target as HTMLElement).style.background = "transparent"; }}
            >
              {link.label}
            </Link>
          ))}

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
            <Link href="/practice" className="btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", borderRadius: "var(--radius-sm)", whiteSpace: "nowrap", height: "fit-content" }}>
              Start Practice
            </Link>
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
            <Link href="/practice" className="btn-primary" onClick={() => setMobileOpen(false)} style={{ justifyContent: "center", padding: "0.75rem", borderRadius: "var(--radius-sm)" }}>
              Start Practice
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
