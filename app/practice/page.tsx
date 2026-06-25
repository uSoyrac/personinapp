"use client";

import { useState, useEffect } from "react";
import type {
  ExamType,
  SkillFocus,
  EnglishLevel,
  PracticeGenerationResult,
  GenerationStatus,
  UserTier,
} from "@/types";
import ResultTabs from "@/components/ResultTabs";
import { TIER_LIMITS } from "@/lib/quiz-engine";

const EXAM_OPTIONS: { id: ExamType; label: string; desc: string }[] = [
  { id: "IELTS_ACADEMIC", label: "IELTS Academic", desc: "For university admission in UK, Australia & more" },
  { id: "TOEFL_IBT", label: "TOEFL iBT", desc: "For US university admission & visa requirements" },
  { id: "GENERAL_ENGLISH", label: "General English", desc: "Improve daily vocabulary, grammar, and reading" },
];

const SKILL_OPTIONS: { id: SkillFocus; label: string }[] = [
  { id: "Full", label: "Full Practice" },
  { id: "Reading", label: "Reading" },
  { id: "Writing", label: "Writing" },
  { id: "Speaking", label: "Speaking" },
  { id: "Vocabulary", label: "Vocabulary" },
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
        <div className="animate-spin-slow" style={{ fontSize: "1.5rem" }}>️</div>
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
  const [tier, setTier] = useState<UserTier>("guest");
  const [usageCount, setUsageCount] = useState(0);

  // Load tier and usage from localStorage
  useEffect(() => {
    const savedTier = localStorage.getItem("practiceforge_tier") as UserTier;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring tier persisted in localStorage on mount; must run client-side to stay hydration-safe
    if (savedTier) setTier(savedTier);

    const today = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem("practiceforge_usage_date");
    
    if (savedDate !== today) {
      localStorage.setItem("practiceforge_usage_date", today);
      localStorage.setItem("practiceforge_usage_count", "0");
      setUsageCount(0);
    } else {
      const count = parseInt(localStorage.getItem("practiceforge_usage_count") || "0", 10);
      setUsageCount(count);
    }

    // Load saved text from homepage
    const savedText = sessionStorage.getItem("practiceforge_initial_text");
    if (savedText) {
      setInputText(savedText);
      sessionStorage.removeItem("practiceforge_initial_text");
    }
  }, []);

  function toggleTier() {
    const map: Record<UserTier, UserTier> = { guest: "free", free: "pro", pro: "gold", gold: "guest" };
    const newTier = map[tier];
    setTier(newTier);
    localStorage.setItem("practiceforge_tier", newTier);
  }

  const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;
  const limits = TIER_LIMITS[tier];
  const isOverLimit = wordCount > limits.maxWords;

  async function handleGenerate() {
    if (tier === "guest" && usageCount >= 1) {
      setError("GUEST_WALL");
      return;
    }
    if (tier === "free" && usageCount >= 1) {
      setError("FREE_WALL");
      return;
    }

    if (inputText.trim().length < 50) {
      setError("Please paste at least 50 characters of text to generate practice content.");
      return;
    }

    if (isOverLimit) {
      setError(`To maintain quality and prevent abuse, your ${tier} plan allows texts up to ${limits.maxWords} words. Your text has ${wordCount} words. Please shorten it or upgrade.`);
      return;
    }

    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examType, skillFocus, inputText, level, targetScore, examDate, weakArea, tier }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Generation failed");
      }

      const data: PracticeGenerationResult = await res.json();
      setResult(data);
      setStatus("success");
      
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem("practiceforge_usage_count", newCount.toString());

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
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <div className="badge badge-primary" style={{ display: "inline-flex" }}>
                Practice Generator
              </div>
              {tier === "guest" && (
                <div className="badge animate-fadeIn" style={{ display: "inline-flex", background: "var(--surface-2)", color: "var(--foreground)", border: "1px solid var(--border)", gap: "0.35rem" }}>
                  <span style={{ color: "var(--mint)" }}>⚡</span> Free Trial: {Math.max(0, 1 - usageCount)} / 1 Remaining
                </div>
              )}
            </div>
            <h1 style={{ margin: "0 0 0.75rem", color: "var(--foreground)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
              Generate Your Practice
            </h1>
            <p style={{ margin: 0, fontSize: "1.0625rem" }}>
              Paste any academic text below and configure your session. Content is generated instantly — no API needed.
            </p>
          </div>

          {/* Tier toggle */}
          <div className="card" style={{ padding: "1.25rem 1.5rem", marginBottom: "1.75rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", background: "#FFFFFF" }}>
            <div>
              <p style={{ margin: "0 0 0.25rem", fontWeight: 800, color: "var(--foreground)", fontSize: "0.9375rem", textTransform: "capitalize" }}>
                {tier} Plan
              </p>
              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>
                Up to {limits.maxWords} words · {limits.questionCount} questions · {limits.vocabCount} vocabulary
                {tier === "pro" && " · Writing · Study plan"}
                {tier === "gold" && " · Writing · Study plan · AI Speaking Agent"}
              </p>
            </div>
            {process.env.NODE_ENV === "development" && (
              <button
                onClick={toggleTier}
                id="tier-toggle"
                className={tier === "guest" || tier === "free" ? "btn-primary" : "btn-secondary"}
                style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem", whiteSpace: "nowrap" }}
              >
                Cycle Tier: {tier} ➔ {tier === "guest" ? "free" : tier === "free" ? "pro" : tier === "pro" ? "gold" : "guest"}
              </button>
            )}
          </div>

          {/* Upsell Banner for non-premium */}
          {(tier === "guest" || tier === "free") && !error && (
            <div className="card-elevated animate-fadeIn" style={{ padding: "2rem", marginBottom: "1.75rem", background: "#FDE047", border: "3px solid #000", boxShadow: "8px 8px 0px #000", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem", justifyContent: "space-between", borderRadius: "8px" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>⭐</span>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#000", fontWeight: 900 }}>Accelerate Your Score</h3>
                </div>
                <p style={{ margin: 0, fontSize: "0.9375rem", color: "#000", fontWeight: 600, lineHeight: 1.6 }}>
                  You are currently on the <strong style={{ textTransform: "capitalize", background: "#FFF", padding: "0 0.2rem", border: "2px solid #000" }}>{tier}</strong> plan. Upgrade to Pro or Gold to unlock unlimited generations, writing feedback, and AI Speaking Evaluations.
                </p>
              </div>
              <button className="btn-primary" onClick={() => window.dispatchEvent(new Event("open-signup"))} style={{ padding: "0.875rem 1.5rem", whiteSpace: "nowrap", borderRadius: "8px" }}>
                View Premium Plans
              </button>
            </div>
          )}

          {/* Upsell Walls */}
          {error === "GUEST_WALL" && (
            <div className="card-elevated animate-fadeIn" style={{ padding: "2rem", marginBottom: "1.75rem", background: "linear-gradient(to right, var(--surface), var(--surface-2))", borderLeft: "4px solid var(--primary)" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>You&apos;ve unlocked your potential!</h3>
              <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>You&apos;ve used your 1 free guest trial. Create a free account to unlock daily practice, a personalized dictionary, and progress tracking.</p>
              <button className="btn-primary" onClick={() => window.dispatchEvent(new Event("open-signup"))}>Create Free Account</button>
            </div>
          )}

          {error === "FREE_WALL" && (
            <div className="card-elevated animate-fadeIn" style={{ padding: "2rem", marginBottom: "1.75rem", background: "linear-gradient(to right, var(--surface), var(--surface-2))", borderLeft: "4px solid var(--primary)" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Daily Limit Reached</h3>
              <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>You&apos;ve reached your free daily limit. Upgrade to Pro Study to unlock unlimited practice and AI writing feedback.</p>
              <button className="btn-primary" onClick={() => { localStorage.setItem("practiceforge_tier", "pro"); window.location.reload(); }}>Upgrade to Pro Study</button>
            </div>
          )}

          {error && error !== "GUEST_WALL" && error !== "FREE_WALL" && (
            <div style={{ color: "var(--red)", background: "rgba(239, 68, 68, 0.1)", padding: "1rem", borderRadius: "0.5rem", marginBottom: "1.75rem" }}>
              {error}
            </div>
          )}

          {/* ===== FORM ===== */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem", opacity: (error === "GUEST_WALL" || error === "FREE_WALL") ? 0.5 : 1, pointerEvents: (error === "GUEST_WALL" || error === "FREE_WALL") ? "none" : "auto" }}>

            {/* Exam Type */}
            <div>
              <p className="label">1. Select Exam Type</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))", gap: "0.75rem" }}>
                {EXAM_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    id={`exam-${opt.id}`}
                    onClick={() => setExamType(opt.id)}
                    style={{
                      background: examType === opt.id ? "#D2FF3A" : "#FFFFFF",
                      border: "3px solid #000",
                      borderRadius: "8px",
                      padding: "1.25rem",
                      cursor: "pointer",
                      textAlign: "left",
                      boxShadow: examType === opt.id ? "none" : "4px 4px 0px #000",
                      transform: examType === opt.id ? "translate(4px, 4px)" : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", marginBottom: "0.25rem" }}>
                      <span style={{ fontWeight: 800, color: "var(--foreground)", fontSize: "0.9375rem" }}>{opt.label}</span>
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
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Text */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <p className="label">3. Paste Your Text</p>
                <span style={{
                  fontSize: "0.8125rem",
                  color: isOverLimit ? "#fb7185" : wordCount > 10 ? "var(--accent-light)" : "var(--foreground-faint)",
                  fontWeight: isOverLimit ? 700 : 400,
                }}>
                  {wordCount} / {limits.maxWords} words {wordCount >= 10 && !isOverLimit && ""} {isOverLimit && "️"}
                </span>
              </div>
              <textarea
                id="input-text"
                className="input-base"
                rows={10}
                placeholder="Paste any academic article, lesson notes, podcast transcript, or study material here…

Example: 'Urbanisation has profoundly transformed ecosystems across the globe. As cities expand, natural habitats are increasingly fragmented, reducing biodiversity...'"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ resize: "vertical", lineHeight: 1.7 }}
              />
              <p style={{ marginTop: "0.375rem", fontSize: "0.8125rem", color: isOverLimit ? "#fb7185" : "var(--foreground-faint)" }}>
                {isOverLimit
                  ? `️ Text exceeds ${limits.maxWords} word limit. ${tier === "free" ? "Upgrade to Premium for 2000 words." : "Please shorten your text."}`
                  : `Minimum 50 characters. Maximum ${limits.maxWords} words (${tier} plan).`}
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
                        background: level === opt.id ? "#A855F7" : "#FFFFFF",
                        color: level === opt.id ? "#FFF" : "#000",
                        border: "3px solid #000",
                        borderRadius: "8px",
                        padding: "0.625rem 1rem",
                        cursor: "pointer",
                        fontWeight: level === opt.id ? 800 : 600,
                        textAlign: "left",
                        boxShadow: level === opt.id ? "none" : "3px 3px 0px #000",
                        transform: level === opt.id ? "translate(3px, 3px)" : "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "0.9375rem", display: "block" }}>{opt.id}</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "1rem" }}>
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
                <p style={{ margin: 0, fontSize: "0.9375rem", color: "#fb7185" }}>️ {error}</p>
              </div>
            )}

            {/* Generate button */}
            <button
              id="generate-btn"
              className="btn-primary"
              onClick={handleGenerate}
              disabled={status === "loading" || isOverLimit}
              style={{
                fontSize: "1.0625rem",
                padding: "1rem 2rem",
                width: "100%",
                justifyContent: "center",
                opacity: status === "loading" || isOverLimit ? 0.7 : 1,
                cursor: status === "loading" || isOverLimit ? "not-allowed" : "pointer",
              }}
            >
              {status === "loading" ? "Generating…" : "Generate Practice Content"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "var(--foreground-faint)" }}>
               No API key needed — all content is generated instantly by our system.
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
                <span className={`badge ${tier !== "free" ? "badge-primary" : "badge-accent"}`}>
                  {tier === "gold" ? "Gold" : tier === "pro" ? "Pro" : "Free"} · {result?.readingQuestions?.length ?? "..."} questions
                </span>
              </div>

              {status === "loading" && <LoadingSkeleton />}
              {status === "success" && result && (
                <>
                  <ResultTabs result={result} />
                  <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
                    <button onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); handleGenerate(); }} className="btn-primary" style={{ background: "var(--brutal-yellow)", color: "#000" }}>
                      Regenerate
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
