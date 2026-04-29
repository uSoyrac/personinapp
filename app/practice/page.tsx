"use client";

import { useState } from "react";
import type {
  ExamType,
  SkillFocus,
  EnglishLevel,
  PracticeGenerationResult,
  GenerationStatus,
} from "@/types";
import ResultTabs from "@/components/ResultTabs";

const EXAM_OPTIONS: { id: ExamType; label: string; desc: string; icon: string }[] = [
  { id: "IELTS_ACADEMIC", label: "IELTS Academic", desc: "For university admission in UK, Australia & more", icon: "🇬🇧" },
  { id: "TOEFL_IBT", label: "TOEFL iBT", desc: "For US university admission & visa requirements", icon: "🇺🇸" },
];

const SKILL_OPTIONS: { id: SkillFocus; label: string; icon: string }[] = [
  { id: "Full", label: "Full Practice", icon: "⚡" },
  { id: "Reading", label: "Reading", icon: "📖" },
  { id: "Writing", label: "Writing", icon: "✍️" },
  { id: "Speaking", label: "Speaking", icon: "🎙️" },
  { id: "Vocabulary", label: "Vocabulary", icon: "🔤" },
];

const LEVEL_OPTIONS: { id: EnglishLevel; label: string; desc: string }[] = [
  { id: "B1", label: "B1 — Intermediate", desc: "Can handle familiar topics" },
  { id: "B2", label: "B2 — Upper Intermediate", desc: "Can handle complex topics" },
  { id: "C1", label: "C1 — Advanced", desc: "Near-native fluency" },
];

function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
        <div className="animate-spin-slow" style={{ fontSize: "1.5rem" }}>⚙️</div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: "var(--foreground)" }}>Generating your practice content…</p>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>This may take a few seconds</p>
        </div>
      </div>
      {[200, 140, 120, 180, 100].map((w, i) => (
        <div key={i} className="skeleton" style={{ height: "1.25rem", width: `${w}px`, maxWidth: "100%" }} />
      ))}
      <div className="skeleton" style={{ height: "6rem" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }}>
        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: "4rem" }} />)}
      </div>
    </div>
  );
}

export default function PracticePage() {
  const [examType, setExamType] = useState<ExamType>("IELTS_ACADEMIC");
  const [skillFocus, setSkillFocus] = useState<SkillFocus>("Full");
  const [inputText, setInputText] = useState("");
  const [level, setLevel] = useState<EnglishLevel>("B2");
  const [targetScore, setTargetScore] = useState("");
  const [examDate, setExamDate] = useState("");
  const [weakArea, setWeakArea] = useState("");
  const [status, setStatus] = useState<GenerationStatus>("idle");
  const [result, setResult] = useState<PracticeGenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

  async function handleGenerate() {
    if (inputText.trim().length < 50) {
      setError("Please paste at least 50 characters of text to generate practice content.");
      return;
    }

    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examType, skillFocus, inputText, level, targetScore, examDate, weakArea }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }

      const data: PracticeGenerationResult = await res.json();
      setResult(data);
      setStatus("success");

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="section" style={{ paddingTop: "3rem" }}>
      <div className="container">
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          {/* Page header */}
          <div style={{ marginBottom: "2.5rem" }}>
            <div className="badge badge-primary" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
              ⚡ Practice Generator
            </div>
            <h1 style={{ margin: "0 0 0.75rem", color: "var(--foreground)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
              Generate Your Practice
            </h1>
            <p style={{ margin: 0, fontSize: "1.0625rem" }}>
              Paste any academic text below and configure your session. Content is generated in seconds.
            </p>
          </div>

          {/* ===== FORM ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

            {/* Exam Type */}
            <div>
              <p className="label">1. Select Exam Type</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
                {EXAM_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    id={`exam-${opt.id}`}
                    onClick={() => setExamType(opt.id)}
                    style={{
                      background: examType === opt.id ? "var(--primary-glow)" : "var(--surface)",
                      border: `2px solid ${examType === opt.id ? "var(--primary)" : "var(--border)"}`,
                      borderRadius: "var(--radius-md)",
                      padding: "1rem",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", marginBottom: "0.25rem" }}>
                      <span style={{ fontSize: "1.25rem" }}>{opt.icon}</span>
                      <span style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "0.9375rem" }}>{opt.label}</span>
                      {examType === opt.id && <span className="badge badge-primary" style={{ marginLeft: "auto", fontSize: "0.7rem" }}>Selected</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: "0.8125rem" }}>{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Focus */}
            <div>
              <p className="label">2. Skill Focus</p>
              <div className="tab-list">
                {SKILL_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    id={`skill-${opt.id}`}
                    className={`tab-item ${skillFocus === opt.id ? "active" : ""}`}
                    onClick={() => setSkillFocus(opt.id)}
                  >
                    {opt.icon} {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Text */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p className="label">3. Paste Your Text</p>
                <span style={{ fontSize: "0.8125rem", color: wordCount > 50 ? "var(--accent-light)" : "var(--foreground-faint)" }}>
                  {wordCount} words {wordCount >= 50 && "✓"}
                </span>
              </div>
              <textarea
                id="input-text"
                className="input-base"
                rows={10}
                placeholder="Paste any academic article, lesson notes, textbook excerpt, podcast transcript, or study material here…

Example: 'Urbanisation has profoundly transformed ecosystems across the globe. As cities expand, natural habitats are increasingly fragmented, reducing biodiversity...'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ resize: "vertical", lineHeight: 1.7 }}
              />
              <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: "var(--foreground-faint)" }}>
                Minimum 50 characters. Recommended: 200–800 words for best results.
              </p>
            </div>

            {/* Optional details */}
            <div className="card" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                4. Optional Details (improves personalisation)
              </p>

              {/* Level */}
              <div>
                <p className="label">Current English Level</p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {LEVEL_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      id={`level-${opt.id}`}
                      onClick={() => setLevel(opt.id)}
                      style={{
                        background: level === opt.id ? "var(--primary-glow)" : "var(--background)",
                        border: `1px solid ${level === opt.id ? "var(--primary)" : "var(--border)"}`,
                        borderRadius: "var(--radius-md)",
                        padding: "0.625rem 1rem",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "0.9375rem", display: "block" }}>{opt.id}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                <div>
                  <p className="label">Target Score</p>
                  <input
                    id="target-score"
                    type="text"
                    className="input-base"
                    placeholder={examType === "IELTS_ACADEMIC" ? "e.g. Band 7.0" : "e.g. 100+"}
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                  />
                </div>
                <div>
                  <p className="label">Exam Date</p>
                  <input
                    id="exam-date"
                    type="date"
                    className="input-base"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <p className="label">Weak Area (optional)</p>
                <input
                  id="weak-area"
                  type="text"
                  className="input-base"
                  placeholder="e.g. coherence, academic vocabulary, reading speed…"
                  value={weakArea}
                  onChange={(e) => setWeakArea(e.target.value)}
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: "rgba(244,63,94,0.08)",
                  border: "1px solid rgba(244,63,94,0.3)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.875rem 1rem",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.9375rem", color: "#fb7185" }}>⚠️ {error}</p>
              </div>
            )}

            {/* Generate button */}
            <button
              id="generate-btn"
              className="btn-primary"
              onClick={handleGenerate}
              disabled={status === "loading"}
              style={{
                fontSize: "1.0625rem",
                padding: "1rem 2rem",
                width: "100%",
                justifyContent: "center",
                opacity: status === "loading" ? 0.7 : 1,
                cursor: status === "loading" ? "not-allowed" : "pointer",
              }}
            >
              {status === "loading" ? "⚙️ Generating…" : "✨ Generate Practice Content"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--foreground-faint)" }}>
              No API key? No problem — demo content will be shown automatically.
            </p>
          </div>

          {/* ===== RESULTS ===== */}
          {(status === "loading" || status === "success") && (
            <div
              id="results-section"
              style={{
                marginTop: "3rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--border)",
              }}
            >
              <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ margin: "0 0 0.25rem", color: "var(--foreground)", fontSize: "1.5rem" }}>
                  Your Practice Session
                </h2>
                {result?.isUsingMockData && (
                  <span className="badge badge-amber">Demo mode — connect OpenAI for real generation</span>
                )}
              </div>

              {status === "loading" && <LoadingSkeleton />}
              {status === "success" && result && <ResultTabs result={result} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
