"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { WritingFeedbackResult, ExamType, EnglishLevel } from "@/types";
import WritingFeedbackCard from "@/components/WritingFeedbackCard";

function WritingFeedbackContent() {
  const params = useSearchParams();
  const prompt = params.get("prompt") ?? "";
  const examType = (params.get("examType") ?? "IELTS_ACADEMIC") as ExamType;
  const level = (params.get("level") ?? "B2") as EnglishLevel;

  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<WritingFeedbackResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length;

  async function handleAnalyze() {
    if (wordCount < 50) {
      setError("Please write at least 50 words before requesting feedback.");
      return;
    }

    setLoading(true);
    setError(null);
    setFeedback(null);

    try {
      const res = await fetch("/api/writing-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAnswer, writingPrompt: prompt, examType, level }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Feedback generation failed");
      }

      const data: WritingFeedbackResult = await res.json();
      setFeedback(data);

      setTimeout(() => {
        document.getElementById("feedback-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section" style={{ paddingTop: "3rem" }}>
      <div className="container">
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
            <div className="badge badge-primary" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
              ✍️ Writing Feedback
            </div>
            <h1 style={{ margin: "0 0 0.75rem", color: "var(--foreground)", fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
              Writing Practice & Feedback
            </h1>
            <p style={{ margin: 0, fontSize: "1.0625rem" }}>
              Write your response below, then click Analyse to receive detailed AI practice feedback.
            </p>
          </div>

          {/* Writing Prompt Display */}
          {prompt ? (
            <div className="card-elevated" style={{ marginBottom: "1.75rem", borderLeft: "3px solid var(--primary)" }}>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground-muted)" }}>
                  📋 Your Writing Prompt
                </span>
                <span className="badge badge-primary" style={{ fontSize: "0.7rem" }}>
                  {examType === "IELTS_ACADEMIC" ? "IELTS Task 2" : "TOEFL Independent"}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.7, color: "var(--foreground)" }}>{prompt}</p>
              <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {examType === "IELTS_ACADEMIC" ? (
                  <><span className="badge badge-gray">📏 Min. 250 words</span><span className="badge badge-gray">⏱ 40 min recommended</span></>
                ) : (
                  <><span className="badge badge-gray">📏 Min. 300 words</span><span className="badge badge-gray">⏱ 30 min recommended</span></>
                )}
              </div>
            </div>
          ) : (
            <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "var(--radius-md)", padding: "1rem", marginBottom: "1.75rem" }}>
              <p style={{ margin: 0, fontSize: "0.9375rem", color: "#fbbf24" }}>
                💡 No prompt passed. You can still paste your own prompt below or write freely. For a guided experience, generate practice from the{" "}
                <a href="/practice" style={{ color: "var(--primary-light)", textDecoration: "underline" }}>Practice page</a>.
              </p>
            </div>
          )}

          {/* User answer textarea */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.5rem" }}>
              <p className="label" style={{ margin: 0 }}>Your Response</p>
              <span style={{ fontSize: "0.8125rem", color: wordCount >= 250 ? "var(--accent-light)" : wordCount >= 50 ? "var(--foreground-muted)" : "var(--foreground-faint)" }}>
                {wordCount} words {wordCount >= 250 && "✓"}
              </span>
            </div>
            <textarea
              id="user-answer"
              className="input-base"
              rows={14}
              placeholder={`Write your ${examType === "IELTS_ACADEMIC" ? "Task 2 essay (min. 250 words)" : "independent essay (min. 300 words)"} here…\n\nTip: Plan your essay structure first — introduction, 2–3 body paragraphs, conclusion.`}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              style={{ resize: "vertical", lineHeight: 1.8, fontSize: "0.9375rem" }}
            />
            <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "var(--foreground-faint)" }}>
              Write your full response. The AI will analyse task response, coherence, vocabulary, and grammar.
            </p>
          </div>

          {error && (
            <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "var(--radius-md)", padding: "0.875rem 1rem", marginBottom: "1rem" }}>
              <p style={{ margin: 0, fontSize: "0.9375rem", color: "#fb7185" }}>⚠️ {error}</p>
            </div>
          )}

          <button
            id="analyze-btn"
            className="btn-primary"
            onClick={handleAnalyze}
            disabled={loading}
            style={{ fontSize: "1.0625rem", padding: "1rem 2rem", width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "⚙️ Analysing your writing…" : "🔍 Analyse My Writing"}
          </button>

          <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--foreground-faint)", marginTop: "0.75rem" }}>
            Results include estimated band range, 4 feedback dimensions, improved version, and next steps.
          </p>

          {/* Loading state */}
          {loading && (
            <div style={{ marginTop: "2rem", padding: "2rem", textAlign: "center", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
              <div className="animate-spin-slow" style={{ fontSize: "2rem", display: "block", marginBottom: "1rem" }}>⚙️</div>
              <p style={{ margin: "0 0 0.375rem", fontWeight: 700, color: "var(--foreground)" }}>Analysing your writing…</p>
              <p style={{ margin: 0, fontSize: "0.875rem" }}>Evaluating task response, coherence, vocabulary, and grammar</p>
            </div>
          )}

          {/* Feedback results */}
          {feedback && (
            <div id="feedback-section" style={{ marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
              <h2 style={{ margin: "0 0 1.5rem", color: "var(--foreground)", fontSize: "1.5rem" }}>
                Your Feedback
              </h2>
              <WritingFeedbackCard feedback={feedback} examType={examType} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WritingFeedbackPage() {
  return (
    <Suspense fallback={
      <div className="section" style={{ textAlign: "center" }}>
        <p style={{ color: "var(--foreground-muted)" }}>Loading…</p>
      </div>
    }>
      <WritingFeedbackContent />
    </Suspense>
  );
}
