import type { PracticeGenerationResult } from "@/types";
import Link from "next/link";

interface WritingCardProps {
  result: PracticeGenerationResult;
}

export default function WritingCard({ result }: WritingCardProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Writing Prompt */}
      <div className="card-elevated">
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, #7c3aed, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
            ✍️
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>Writing Prompt</h3>
            <p style={{ margin: 0, fontSize: "0.8125rem" }}>{result.writingPromptType} · Exam-style practice</p>
          </div>
          <span className="badge badge-primary" style={{ marginLeft: "auto" }}>{result.writingPromptType}</span>
        </div>
        <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1.25rem", borderLeft: "3px solid var(--primary)" }}>
          <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.7, color: "var(--foreground)" }}>{result.writingPrompt}</p>
        </div>
        <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {result.examType === "IELTS_ACADEMIC" ? (
            <><span className="badge badge-gray">📏 Min. 250 words</span><span className="badge badge-gray">⏱ 40 min recommended</span></>
          ) : (
            <><span className="badge badge-gray">📏 Min. 300 words</span><span className="badge badge-gray">⏱ 30 min recommended</span></>
          )}
        </div>
      </div>

      {/* Speaking Prompt */}
      <div className="card-elevated">
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
          <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, var(--accent-light), #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem" }}>
            🎙️
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>Speaking Prompt</h3>
            <p style={{ margin: 0, fontSize: "0.8125rem" }}>{result.examType === "IELTS_ACADEMIC" ? "IELTS Part 2" : "TOEFL Speaking"} · Exam-style</p>
          </div>
        </div>
        <div style={{ background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1.25rem", borderLeft: "3px solid var(--accent)", marginBottom: "1rem" }}>
          <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.7, color: "var(--foreground)" }}>{result.speakingPrompt}</p>
        </div>
        {result.speakingFollowUps.length > 0 && (
          <div>
            <p style={{ margin: "0 0 0.5rem", fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground-muted)" }}>Follow-up Questions</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {result.speakingFollowUps.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem" }}>
                  <span style={{ minWidth: "1.5rem", height: "1.5rem", background: "var(--accent-glow)", border: "1px solid var(--accent)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700, color: "var(--accent-light)" }}>{i + 1}</span>
                  <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--foreground)", lineHeight: 1.5 }}>{q}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div style={{ background: "var(--primary-glow)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "var(--radius-lg)", padding: "2rem", textAlign: "center" }}>
        <p style={{ margin: "0 0 0.5rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>Ready to write your response?</p>
        <p style={{ margin: "0 0 1.25rem", fontSize: "0.9375rem" }}>Get detailed AI practice feedback with an estimated band range.</p>
        <Link href={{ pathname: "/practice/writing-feedback", query: { prompt: result.writingPrompt, examType: result.examType, level: result.level } }} className="btn-primary" id="go-to-writing-feedback" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
          ✍️ Write &amp; Get Feedback
        </Link>
      </div>
    </div>
  );
}
