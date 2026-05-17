import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "4rem 1rem 2rem",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand & SEO Paragraph */}
          <div style={{ gridColumn: "span 2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "0.5rem",
                  background: "linear-gradient(135deg, var(--primary), var(--accent))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              ></div>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem" }}>
                PracticeForge
              </span>
            </div>
            <p style={{ fontSize: "0.9375rem", color: "var(--foreground-muted)", lineHeight: 1.7, maxWidth: "400px", marginBottom: "1.5rem" }}>
              PracticeForge is an AI-powered language tutor designed to help students achieve Band 8+ in IELTS Academic and 100+ in TOEFL iBT through instantly generated, personalized exam-style practice.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <span className="badge badge-gray">IELTS</span>
              <span className="badge badge-gray">TOEFL</span>
              <span className="badge badge-gray">General English</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem" }}>
              Product
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { href: "/practice", label: "IELTS & TOEFL Practice" },
                { href: "/general-english", label: "General English Lab" },
                { href: "/vocabulary", label: "My Dictionary" },
                { href: "/question-bank", label: "Question Bank" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Legal */}
          <div>
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground)", marginBottom: "1rem" }}>
              Resources & Legal
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { href: "/academy", label: "PracticeForge Academy" },
                { href: "/pricing", label: "Pricing & Plans" },
                { href: "/affiliate", label: "Partner Program" },
                { href: "#", label: "Privacy Policy" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{ fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Partner / Affiliate Callout CTA */}
        <div 
          className="card-elevated" 
          style={{ 
            marginBottom: "3rem", 
            padding: "2rem", 
            background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)", 
            border: "1px solid var(--border)", 
            display: "flex", 
            flexWrap: "wrap", 
            alignItems: "center", 
            justifyContent: "space-between", 
            gap: "2rem", 
            borderRadius: "var(--radius-lg)" 
          }}
        >
          <div>
            <div className="badge badge-accent" style={{ marginBottom: "0.5rem" }}>Partner Program</div>
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", color: "var(--foreground)" }}>Become an Affiliate Partner</h3>
            <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--foreground-muted)", maxWidth: "500px", lineHeight: 1.6 }}>
              Refer your audience to PracticeForge and earn generous recurring commissions. Join our exclusive affiliate network today and grow with us.
            </p>
          </div>
          <Link href="/affiliate" className="btn-primary" style={{ padding: "0.875rem 1.5rem", borderRadius: "999px", whiteSpace: "nowrap" }}>
            Become a Partner →
          </Link>
        </div>

        {/* Disclaimer & Copyright */}
        <div>
          <hr className="divider" style={{ marginBottom: "1.5rem" }} />
          <p style={{ fontSize: "0.75rem", color: "var(--foreground-faint)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
            <strong>Disclaimer:</strong> PracticeForge is an independent study tool and is not affiliated with, endorsed by, or associated with IELTS (IDP Education, British Council, or Cambridge Assessment English) or TOEFL (Educational Testing Service / ETS). All content is AI-generated for self-study purposes.
          </p>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <p style={{ fontSize: "0.8125rem", color: "var(--foreground-faint)", margin: 0 }}>
              © {new Date().getFullYear()} PracticeForge. Accelerate your fluency.
            </p>
            <span className="badge badge-accent" style={{ fontSize: "0.7rem", opacity: 0.8 }}>
               Beta Release
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
