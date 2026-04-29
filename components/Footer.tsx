import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "3rem 1rem 2rem",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
            marginBottom: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <div
                style={{
                  width: "1.75rem",
                  height: "1.75rem",
                  borderRadius: "0.375rem",
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.875rem",
                }}
              >
                ⚡
              </div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem" }}>
                PracticeForge
              </span>
            </div>
            <p style={{ fontSize: "0.875rem", maxWidth: "20rem" }}>
              AI-powered IELTS & TOEFL exam-style practice. Turn any text into personalised study material.
            </p>
          </div>

          {/* Links */}
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--foreground-muted)", marginBottom: "0.75rem" }}>
              Product
            </p>
            {[
              { href: "/practice", label: "Practice Generator" },
              { href: "/pricing", label: "Pricing" },
            ].map((l) => (
              <div key={l.href} style={{ marginBottom: "0.5rem" }}>
                <Link
                  href={l.href}
                  style={{ fontSize: "0.875rem", color: "var(--foreground-muted)", transition: "color 0.2s" }}
                >
                  {l.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{ gridColumn: "1 / -1" }}>
            <hr className="divider" />
            <p style={{ fontSize: "0.75rem", color: "var(--foreground-faint)", lineHeight: 1.7 }}>
              <strong style={{ color: "var(--foreground-muted)" }}>Disclaimer:</strong> PracticeForge is an independent study tool and is <strong>not affiliated with, endorsed by, or associated with</strong> IELTS (IDP Education, British Council, or Cambridge Assessment English), TOEFL (Educational Testing Service / ETS), or any other official examination body. All practice content is AI-generated and intended for self-study purposes only. Estimated band scores and practice feedback are not official scores and should not be used for official purposes.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "var(--foreground-faint)" }}>
            © {new Date().getFullYear()} PracticeForge. For study purposes only.
          </p>
          <span className="badge badge-gray" style={{ fontSize: "0.7rem" }}>
            🚧 MVP — Not for official exam use
          </span>
        </div>
      </div>
    </footer>
  );
}
