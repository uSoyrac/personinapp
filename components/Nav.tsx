"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/practice", label: "Practice" },
  { href: "/pricing", label: "Pricing" },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(15, 23, 42, 0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.875rem 1rem",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div
            style={{
              width: "2rem",
              height: "2rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1rem",
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.25rem",
              fontWeight: 700,
              color: "var(--foreground)",
            }}
          >
            PracticeForge
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hide-mobile" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "var(--foreground-muted)",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--foreground)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--foreground-muted)")
              }
            >
              {link.label}
            </Link>
          ))}
          <Link href="/practice" className="btn-primary" style={{ marginLeft: "0.5rem" }}>
            Generate Practice →
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="btn-secondary"
          style={{ padding: "0.5rem 0.75rem", display: "none" }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          id="mobile-menu-toggle"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                color: "var(--foreground-muted)",
                fontWeight: 500,
              }}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/practice"
            className="btn-primary"
            onClick={() => setMobileOpen(false)}
          >
            Generate Practice →
          </Link>
        </div>
      )}
    </nav>
  );
}
