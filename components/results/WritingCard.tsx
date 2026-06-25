"use client";

import { useState } from "react";
import type { PracticeGenerationResult } from "@/types";
import { analyzeWriting } from "@/lib/writingAnalyzer";
import type { WritingAnalysis } from "@/lib/writingAnalyzer";
import { addXP, awardBadge } from "@/lib/gamification";
import ProgressRing from "@/components/ProgressRing";

interface WritingCardProps {
  result: PracticeGenerationResult;
}

type WritingStep = "choose" | "write" | "feedback";

function generatePrompts(result: PracticeGenerationResult): string[] {
  const themes = result.keyThemes ?? [];
  const t0 = themes[0] ?? "modern technology";
  const t1 = themes[1] ?? "education";
  const t2 = themes[2] ?? "society";
  const isIELTS = result.examType === "IELTS_ACADEMIC";

  if (isIELTS) {
    return [
      `Some people believe that ${t0.toLowerCase()} has a positive impact on ${t1.toLowerCase()}, while others disagree. Discuss both views and give your opinion. (IELTS Task 2 — Discussion)`,
      `To what extent do you agree or disagree that ${t0.toLowerCase()} is the most important factor in ${t2.toLowerCase()} today? Give reasons and examples. (IELTS Task 2 — Opinion)`,
      `${t0} is becoming increasingly important in modern life. What are the advantages and disadvantages of this trend? (IELTS Task 2 — Advantages/Disadvantages)`,
    ];
  }
  return [
    `Do you agree or disagree with the following statement? ${t0} plays a critical role in ${t1.toLowerCase()}. Use specific reasons and examples. (TOEFL Independent)`,
    `Some experts argue that ${t0.toLowerCase()} should be prioritized over ${t1.toLowerCase()}. Others disagree. Which view do you support? Explain why. (TOEFL Independent)`,
    `Describe how ${t0.toLowerCase()} has changed ${t2.toLowerCase()} in recent years. What further changes do you expect? (TOEFL Independent)`,
  ];
}

export default function WritingCard({ result }: WritingCardProps) {
  const [step, setStep] = useState<WritingStep>(result.writingPrompt ? "choose" : "choose");
  const [prompts] = useState(() => generatePrompts(result));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [essay, setEssay] = useState("");
  const [analysis, setAnalysis] = useState<WritingAnalysis | null>(null);

  const minWords = result.examType === "IELTS_ACADEMIC" ? 250 : 300;
  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;

  function handleSelectPrompt(idx: number) {
    setSelectedIdx(idx);
  }

  function handleStartWriting() {
    if (selectedIdx === null) return;
    setStep("write");
  }

  function handleSubmit() {
    if (wordCount < 30) return;
    const a = analyzeWriting(essay, minWords);
    setAnalysis(a);
    setStep("feedback");
    addXP(25);
    awardBadge("writing_first");
  }

  // Step 1: Choose prompt
  if (step === "choose") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div>
          <h3 style={{ margin: "0 0 0.25rem", fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--foreground)", fontSize: "1.125rem" }}>
            Choose Your Writing Topic
          </h3>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>Select one of the three exam-style prompts below.</p>
        </div>

        {prompts.map((p, i) => (
          <div
            key={i}
            className={`card ${selectedIdx === i ? "animate-scaleIn" : ""}`}
            onClick={() => handleSelectPrompt(i)}
            id={`prompt-${i}`}
            style={{ 
              cursor: "pointer", 
              transition: "all 0.2s ease",
              border: selectedIdx === i ? "2px solid var(--primary)" : "1px solid var(--border)",
              background: selectedIdx === i ? "var(--primary-glow)" : "var(--surface)",
              boxShadow: selectedIdx === i ? "var(--shadow-md)" : "var(--shadow-sm)"
            }}
          >
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <span style={{
                minWidth: "2rem", height: "2rem", borderRadius: "50%",
                background: selectedIdx === i ? "var(--primary)" : "var(--surface-2)",
                color: selectedIdx === i ? "white" : "var(--foreground-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.875rem", fontWeight: 700,
                transition: "all 0.2s",
              }}>
                {i + 1}
              </span>
              <p style={{ margin: 0, fontSize: "1.0625rem", lineHeight: 1.6, color: "var(--foreground)" }}>
                {p}
              </p>
            </div>
          </div>
        ))}

        <button
          className="btn-primary"
          onClick={handleStartWriting}
          disabled={selectedIdx === null}
          style={{ width: "100%", justifyContent: "center", opacity: selectedIdx === null ? 0.5 : 1 }}
          id="start-writing-btn"
        >
          Start Writing
        </button>
      </div>
    );
  }

  // Step 2: Write essay
  if (step === "write") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div style={{
          background: "var(--surface-2)", borderLeft: "4px solid var(--primary)",
          borderRadius: "var(--radius-sm)", padding: "1.25rem",
        }}>
          <p style={{ margin: 0, fontSize: "1.0625rem", lineHeight: 1.6, color: "var(--foreground)" }}>
            {prompts[selectedIdx!]}
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <span className={`badge ${wordCount >= minWords ? "badge-accent" : "badge-gray"}`}>
            {wordCount} / {minWords} words {wordCount >= minWords ? "" : ""}
          </span>
          <span className="badge badge-gray">
             {result.examType === "IELTS_ACADEMIC" ? "40 min" : "30 min"} recommended
          </span>
        </div>

        <textarea
          className="input-base"
          rows={14}
          placeholder="Start writing your essay here... Focus on clear paragraphs: introduction, body paragraphs with examples, and a conclusion."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          style={{ resize: "vertical", lineHeight: 1.8, fontSize: "1rem" }}
          id="essay-textarea"
        />

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button onClick={() => setStep("choose")} className="btn-secondary" style={{ fontSize: "0.875rem" }}>
            ← Change Topic
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={wordCount < 30}
            style={{ flex: 1, justifyContent: "center", opacity: wordCount < 30 ? 0.5 : 1 }}
            id="submit-essay-btn"
          >
            Analyze My Writing (+25 XP)
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Feedback
  if (step === "feedback" && analysis) {
    const levelColors: Record<string, string> = { C1: "var(--mint)", B2: "var(--lavender)", B1: "var(--coral)", A2: "var(--rose)" };

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Overall score */}
        <div className="card-elevated animate-scaleIn" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
          <ProgressRing progress={analysis.overallScore} size={100} stroke={8} color={levelColors[analysis.estimatedLevel] ?? "var(--lavender)"}>
            <span style={{ fontSize: "1.125rem" }}>{analysis.estimatedLevel}</span>
          </ProgressRing>
          <p style={{ margin: "0.75rem 0 0.25rem", fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
            Estimated Level: {analysis.estimatedLevel}
          </p>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            Overall Score: {analysis.overallScore}/100 · {analysis.wordCount} words · {analysis.sentenceCount} sentences
          </p>
        </div>

        {/* 4 Dimensions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "0.75rem" }}>
          {analysis.dimensions.map((d) => (
            <div key={d.label} className="dimension-card">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.25rem" }}>{d.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--foreground)" }}>{d.label}</p>
                  <div style={{ width: "100%", height: "6px", background: "var(--surface-2)", borderRadius: "9999px", marginTop: "0.5rem", overflow: "hidden" }}>
                    <div style={{
                      width: `${d.score}%`, height: "100%",
                      background: d.score >= 70 ? "var(--mint)" : d.score >= 45 ? "var(--lavender)" : "var(--rose)",
                      transition: "width 0.6s ease"
                    }} />
                  </div>
                </div>
                <span style={{ fontSize: "1rem", fontWeight: 700, color: d.score >= 70 ? "var(--mint-dark)" : d.score >= 45 ? "var(--lavender-dark)" : "var(--rose)" }}>
                  {d.score}
                </span>
              </div>

              {d.strengths.length > 0 && (
                <div style={{ marginBottom: "0.75rem", padding: "0.75rem", background: "rgba(16, 185, 129, 0.05)", borderRadius: "var(--radius-sm)" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--mint-dark)", textTransform: "uppercase" }}>Strengths</p>
                  {d.strengths.map((s, i) => (
                    <p key={i} style={{ margin: "0.125rem 0", fontSize: "0.875rem", color: "var(--foreground)" }}>✓ {s}</p>
                  ))}
                </div>
              )}
              {d.improvements.length > 0 && (
                <div style={{ padding: "0.75rem", background: "rgba(244, 63, 94, 0.05)", borderRadius: "var(--radius-sm)" }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", fontWeight: 700, color: "var(--rose)", textTransform: "uppercase" }}>Areas to Improve</p>
                  {d.improvements.map((s, i) => (
                    <p key={i} style={{ margin: "0.125rem 0", fontSize: "0.875rem", color: "var(--foreground)" }}>→ {s}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div style={{ background: "var(--surface-2)", borderLeft: "4px solid var(--primary)", borderRadius: "var(--radius-sm)", padding: "1.5rem" }}>
            <p style={{ margin: "0 0 0.75rem", fontWeight: 700, fontSize: "1.125rem", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              💡 General Improvement Tips
            </p>
            {analysis.suggestions.map((s, i) => (
              <p key={i} style={{ margin: "0.5rem 0", fontSize: "0.9375rem", color: "var(--foreground-muted)", display: "flex", gap: "0.5rem" }}>
                <span style={{ color: "var(--primary)" }}>•</span> {s}
              </p>
            ))}
          </div>
        )}

        {/* Try again */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button onClick={() => { setStep("write"); setAnalysis(null); }} className="btn-secondary">
            Revise Essay
          </button>
          <button onClick={() => { setStep("choose"); setEssay(""); setAnalysis(null); setSelectedIdx(null); }} className="btn-primary">
            Try Different Topic
          </button>
        </div>
      </div>
    );
  }

  return null;
}
