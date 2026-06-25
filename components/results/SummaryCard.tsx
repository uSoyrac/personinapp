import type { PracticeGenerationResult } from "@/types";

interface SummaryCardProps {
  result: PracticeGenerationResult;
}

export default function SummaryCard({ result }: SummaryCardProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Summary text */}
      <div className="card-elevated">
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.5rem",
              background: "linear-gradient(135deg, var(--primary), var(--accent))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.25rem",
            }}
          >
            
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>
              Text Summary
            </h3>
            <p style={{ margin: 0, fontSize: "0.8125rem" }}>AI-generated academic summary</p>
          </div>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.9375rem",
            lineHeight: 1.7,
            color: "var(--foreground)",
            padding: "1rem",
            background: "var(--background)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
          }}
        >
          {result.summary}
        </p>
      </div>

      {/* Key themes */}
      <div className="card">
        <h4 style={{ margin: "0 0 1rem", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground-muted)" }}>
          Key Academic Themes
        </h4>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {result.keyThemes.map((theme, i) => (
            <span key={i} className="badge badge-primary">
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* Session info */}
      <div
        className="card"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 150px), 1fr))",
          gap: "1rem",
        }}
      >
        {[
          { icon: "", label: "Exam", value: result.examType === "IELTS_ACADEMIC" ? "IELTS Academic" : "TOEFL iBT" },
          { icon: "", label: "Skill Focus", value: result.skillFocus },
          { icon: "", label: "Level", value: result.level },
          {
            icon: "",
            label: "Content",
            value: result.isUsingMockData ? "Demo mode" : "AI-generated",
          },
        ].map((item) => (
          <div key={item.label} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>{item.icon}</div>
            <p style={{ margin: "0 0 0.125rem", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {item.label}
            </p>
            <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {result.isUsingMockData && (
        <div
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "var(--radius-md)",
            padding: "0.875rem 1rem",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
          }}
        >
          <span></span>
          <p style={{ margin: 0, fontSize: "0.875rem", color: "#fbbf24" }}>
            <strong>Demo mode:</strong> This is example content shown because no API key is configured. Add{" "}
            <code
              style={{
                background: "rgba(0,0,0,0.3)",
                borderRadius: "0.25rem",
                padding: "0.1em 0.3em",
                fontSize: "0.8125rem",
              }}
            >
              OPENAI_API_KEY
            </code>{" "}
            to <code style={{ background: "rgba(0,0,0,0.3)", borderRadius: "0.25rem", padding: "0.1em 0.3em", fontSize: "0.8125rem" }}>.env.local</code> to generate real practice from your text.
          </p>
        </div>
      )}
    </div>
  );
}
