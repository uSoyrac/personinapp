import type { WritingFeedbackResult, ExamType } from "@/types";

interface WritingFeedbackCardProps {
  feedback: WritingFeedbackResult;
  examType: ExamType;
}

const DIMENSION_ICONS: Record<string, string> = {
  "Task Response": "",
  "Coherence & Cohesion": "",
  "Lexical Resource": "",
  "Grammatical Range & Accuracy": "️",
  "Task Development": "",
  Organization: "",
  "Language Use": "",
};

function DimensionBlock({
  label,
  feedback,
  strengths,
  improvements,
}: {
  label: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}) {
  return (
    <div
      className="card"
      style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}
    >
      <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
        <span style={{ fontSize: "1.25rem" }}>{DIMENSION_ICONS[label] ?? ""}</span>
        <h4 style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-sans)" }}>{label}</h4>
      </div>
      <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>{feedback}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <div>
          <p style={{ margin: "0 0 0.375rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent-light)" }}> Strengths</p>
          <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {strengths.map((s, i) => <li key={i} style={{ fontSize: "0.875rem", color: "var(--foreground-muted)" }}>{s}</li>)}
          </ul>
        </div>
        <div>
          <p style={{ margin: "0 0 0.375rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "#fb7185" }}>↑ Improve</p>
          <ul style={{ margin: 0, paddingLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {improvements.map((s, i) => <li key={i} style={{ fontSize: "0.875rem", color: "var(--foreground-muted)" }}>{s}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function WritingFeedbackCard({ feedback, examType }: WritingFeedbackCardProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }} className="animate-fadeIn">
      {/* Score band header */}
      <div
        className="card-elevated"
        style={{
          background: "linear-gradient(135deg, rgba(79,70,229,0.2), rgba(16,185,129,0.1))",
          border: "1px solid var(--primary)",
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div className="score-badge">
          <span className="score-value">{feedback.estimatedBand}</span>
          <span className="score-label">{examType === "IELTS_ACADEMIC" ? "Est. IELTS Band" : "Est. TOEFL Score"}</span>
        </div>
        <div style={{ flex: 1, minWidth: "200px" }}>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>
            Practice Feedback Summary
          </h3>
          <p style={{ margin: "0 0 0.5rem", fontSize: "0.9375rem", lineHeight: 1.6 }}>{feedback.overallFeedback}</p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <span className="badge badge-gray"> {feedback.wordCount} words</span>
            {feedback.isUsingMockData && <span className="badge badge-amber">Demo mode</span>}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: "var(--radius-md)", padding: "0.875rem 1rem" }}>
        <p style={{ margin: 0, fontSize: "0.8125rem", color: "#fbbf24" }}>{feedback.disclaimer}</p>
      </div>

      {/* Dimensions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        <h3 style={{ margin: 0, fontSize: "0.9375rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>Detailed Feedback</h3>
        <DimensionBlock label={feedback.taskResponse.label} feedback={feedback.taskResponse.feedback} strengths={feedback.taskResponse.strengths} improvements={feedback.taskResponse.improvements} />
        <DimensionBlock label={feedback.coherenceCohesion.label} feedback={feedback.coherenceCohesion.feedback} strengths={feedback.coherenceCohesion.strengths} improvements={feedback.coherenceCohesion.improvements} />
        <DimensionBlock label={feedback.lexicalResource.label} feedback={feedback.lexicalResource.feedback} strengths={feedback.lexicalResource.strengths} improvements={feedback.lexicalResource.improvements} />
        <DimensionBlock label={feedback.grammaticalRange.label} feedback={feedback.grammaticalRange.feedback} strengths={feedback.grammaticalRange.strengths} improvements={feedback.grammaticalRange.improvements} />
      </div>

      {/* Improved version */}
      <div className="card-elevated">
        <h3 style={{ margin: "0 0 1rem", fontSize: "0.9375rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>
           AI-Improved Version
        </h3>
        <p style={{ margin: "0 0 0.75rem", fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>
          Study this rewritten version to see how your ideas can be expressed at a higher level.
        </p>
        <div
          style={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "1.25rem",
            borderLeft: "3px solid var(--primary)",
          }}
        >
          {feedback.improvedVersion.split("\n\n").map((para, i) => (
            <p key={i} style={{ margin: i === 0 ? "0" : "0.875rem 0 0", fontSize: "0.9375rem", lineHeight: 1.7, color: "var(--foreground)" }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Next exercises */}
      <div>
        <h3 style={{ margin: "0 0 1rem", fontSize: "0.9375rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>
           3 Concrete Next Steps
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {feedback.nextExercises.map((ex, i) => (
            <div
              key={i}
              className="card"
              style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
            >
              <div
                style={{
                  minWidth: "2.25rem",
                  height: "2.25rem",
                  borderRadius: "50%",
                  background: "var(--primary-glow)",
                  border: "2px solid var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "var(--primary-light)",
                }}
              >
                {i + 1}
              </div>
              <div>
                <p style={{ margin: "0 0 0.25rem", fontWeight: 700, fontSize: "0.9375rem", color: "var(--foreground)" }}>{ex.title}</p>
                <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.6 }}>{ex.description}</p>
                <span className="badge badge-gray" style={{ marginTop: "0.5rem" }}>{ex.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
