"use client";

import Link from "next/link";
import { useState } from "react";
import XPBar from "@/components/XPBar";

const NAV_LINKS = [
  { href: "/practice", label: "Practice" },
  { href: "/vocabulary", label: "My Words" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "var(--bg)",
      borderBottom: "var(--border-width) solid #000",
      boxShadow: "0px 2px 0px #000"
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.75rem 1rem",
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{
            width: "2.5rem", height: "2.5rem", borderRadius: "0",
            background: "var(--peach)", border: "2px solid #000", boxShadow: "2px 2px 0px #000",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: "900",
          }}>
            P
          </div>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 700,
            color: "var(--foreground)",
          }}>
            PracticeForge
          </span>
        </Link>

        {/* Desktop */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.5rem 0.875rem", borderRadius: "var(--radius-md)",
                fontSize: "0.875rem", fontWeight: 500, color: "var(--foreground-muted)",
                transition: "color 0.2s, background 0.2s", display: "flex", alignItems: "center", gap: "0.375rem",
              }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "var(--foreground)"; (e.target as HTMLElement).style.background = "var(--surface)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "var(--foreground-muted)"; (e.target as HTMLElement).style.background = "transparent"; }}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ width: "1px", height: "1.25rem", background: "var(--border)", margin: "0 0.25rem" }} />

          <XPBar />

          <Link href="/practice" className="btn-primary" style={{ marginLeft: "0.5rem", fontSize: "0.8125rem", padding: "0.5rem 1rem" }}>
            Generate →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="btn-secondary"
          style={{ padding: "0.5rem 0.75rem", display: "none" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {mobileOpen ? "" : ""}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          borderTop: "1px solid var(--border)", padding: "1rem",
          display: "flex", flexDirection: "column", gap: "0.5rem",
        }}>
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              style={{ padding: "0.75rem 1rem", borderRadius: "var(--radius-md)", color: "var(--foreground-muted)", fontWeight: 500 }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ padding: "0.5rem 1rem" }}><XPBar /></div>
          <Link href="/practice" className="btn-primary" onClick={() => setMobileOpen(false)}>
            Generate Practice →
          </Link>
        </div>
      )}
    </nav>
  );
}
