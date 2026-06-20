// NOTE: These legal pages are practical TEMPLATES, not legal advice.
// Have a qualified lawyer review Terms and Privacy before going live.

export default function LegalPage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="section" style={{ paddingTop: "3rem" }}>
      <div className="container" style={{ maxWidth: "820px" }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 2.75rem)", marginBottom: "0.5rem" }}>{title}</h1>
        <p style={{ color: "var(--foreground-muted)", marginBottom: "2.5rem" }}>Last updated: {lastUpdated}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", lineHeight: 1.75, color: "var(--foreground)", fontSize: "1rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "var(--foreground)" }}>{heading}</h2>
      <div style={{ color: "var(--foreground-muted)", lineHeight: 1.75 }}>{children}</div>
    </section>
  );
}
