"use client";

import Link from "next/link";
import { ArrowLeft, Map } from "lucide-react";

export default function NotFound() {
  return (
    <div className="section" style={{ minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", paddingTop: "6rem" }}>
      <div className="container-sm" style={{ maxWidth: "600px" }}>
        
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
            <Map size={40} strokeWidth={1.5} />
          </div>
        </div>

        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>
          Lost in translation?
        </h1>
        
        <p style={{ fontSize: "1.25rem", color: "var(--foreground-muted)", marginBottom: "3rem", lineHeight: 1.6 }}>
          We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or you simply took a wrong turn. Let&apos;s get you back to practicing!
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <Link href="/practice" className="btn-primary" style={{ display: "inline-flex", alignItems: "center" }}>
            Go to Practice Lab
          </Link>
        </div>

      </div>
    </div>
  );
}
