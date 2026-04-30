"use client";

const WHAT_IT_CREATES = [
  { icon: "", label: "Text Summary" },
  { icon: "", label: "Reading Questions" },
  { icon: "", label: "Vocabulary List" },
  { icon: "️", label: "Writing Prompt" },
  { icon: "️", label: "Speaking Prompt" },
  { icon: "", label: "7-Day Study Plan" },
  { icon: "", label: "Answer Explanations" },
  { icon: "", label: "Writing Feedback" },
];

export default function FeatureGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "1rem",
      }}
    >
      {WHAT_IT_CREATES.map((item) => (
        <div
          key={item.label}
          className="card"
          style={{
            textAlign: "center",
            padding: "1.5rem 1rem",
            transition: "all 0.2s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--primary)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{item.icon}</div>
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
