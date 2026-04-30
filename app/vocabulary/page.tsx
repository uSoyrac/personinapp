"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedWord } from "@/lib/wordList";
import { getWordList, removeWord, clearWordList, getWordStats, updateWordProgress } from "@/lib/wordList";
import { getTranslation, getNativeLanguage, setNativeLanguage, LANGUAGE_LABELS, LANGUAGE_FLAGS } from "@/lib/translations";
import type { NativeLanguage } from "@/lib/translations";
import { addXP, awardBadge, getGameState } from "@/lib/gamification";
import ProgressRing from "@/components/ProgressRing";
import Confetti from "@/components/Confetti";

type ViewMode = "sets" | "quiz" | "results";
const SET_SIZE = 20;

interface QuizQ { word: string; definition: string; nativeTranslation?: string; options: string[]; correctIndex: number; }

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
}

function buildQuiz(words: SavedWord[], lang: NativeLanguage | null): QuizQ[] {
  const allDefs = words.map(w => lang ? (getTranslation(w.word, lang) ?? w.definition) : w.definition);
  return words.map(w => {
    const correctDef = lang ? (getTranslation(w.word, lang) ?? w.definition) : w.definition;
    const wrongs = shuffleArray(allDefs.filter(d => d !== correctDef)).slice(0, 3);
    while (wrongs.length < 3) wrongs.push(["İlgisiz kavram", "Concepte sin relación", "Unrelatiertes Konzept", "Concept sans rapport"][wrongs.length] ?? "—");
    const opts = shuffleArray([correctDef, ...wrongs]);
    return { word: w.word, definition: w.definition, nativeTranslation: lang ? getTranslation(w.word, lang) ?? undefined : undefined, options: opts, correctIndex: opts.indexOf(correctDef) };
  });
}

export default function VocabularyPage() {
  const [view, setView] = useState<ViewMode>("sets");
  const [words, setWords] = useState<SavedWord[]>([]);
  const [stats, setStats] = useState({ total: 0, learned: 0, needsReview: 0, accuracy: 0 });
  const [lang, setLang] = useState<NativeLanguage | null>(null);
  const [activeSet, setActiveSet] = useState(0);
  const [quiz, setQuiz] = useState<{ qs: QuizQ[]; ci: number; ans: (number | null)[]; fb: boolean } | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => { setWords(getWordList()); setStats(getWordStats()); }, []);

  useEffect(() => { setMounted(true); refresh(); const l = getNativeLanguage(); if (l) setLang(l); }, [refresh]);

  const sets: SavedWord[][] = [];
  for (let i = 0; i < words.length; i += SET_SIZE) sets.push(words.slice(i, i + SET_SIZE));
  if (sets.length === 0) sets.push([]);

  const currentSet = sets[activeSet] ?? [];
  const setLearned = currentSet.filter(w => w.correctCount >= 3).length;

  function changeLang(l: NativeLanguage) { setLang(l); setNativeLanguage(l); }

  function startQuiz(setIdx: number) {
    const s = sets[setIdx] ?? [];
    if (s.length < 2) return;
    const qs = buildQuiz(shuffleArray(s).slice(0, Math.min(20, s.length)), lang);
    setQuiz({ qs, ci: 0, ans: new Array(qs.length).fill(null), fb: false });
    setActiveSet(setIdx);
    setView("quiz");
  }

  function handleAnswer(idx: number) {
    if (!quiz || quiz.fb) return;
    const a = [...quiz.ans]; a[quiz.ci] = idx;
    const q = quiz.qs[quiz.ci];
    const ok = idx === q.correctIndex;
    updateWordProgress(q.word, ok);
    addXP(ok ? 10 : 2);
    if (ok) { setConfetti(true); setTimeout(() => setConfetti(false), 1500); }
    setQuiz({ ...quiz, ans: a, fb: true });
  }

  function nextQ() {
    if (!quiz) return;
    if (quiz.ci + 1 >= quiz.qs.length) {
      const correct = quiz.qs.filter((q, i) => quiz.ans[i] === q.correctIndex).length;
      if (correct === quiz.qs.length) awardBadge("perfect_score");
      refresh();
      setView("results");
    } else {
      setQuiz({ ...quiz, ci: quiz.ci + 1, fb: false });
    }
  }

  function getScore() {
    if (!quiz) return { correct: 0, total: 0 };
    return { correct: quiz.qs.filter((q, i) => quiz.ans[i] === q.correctIndex).length, total: quiz.qs.length };
  }

  if (!mounted) return null;

  return (
    <div className="section" style={{ paddingTop: "2.5rem" }}>
      <div className="container">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {confetti && <Confetti />}

          {/* Header */}
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ margin: "0 0 0.5rem", color: "var(--foreground)", fontSize: "clamp(1.75rem, 4vw, 2.25rem)" }}>
              <span className="gradient-text">My Words</span>
            </h1>
            <p style={{ margin: 0, fontSize: "1rem" }}>Master vocabulary in 20-word sets. 3 correct = learned!</p>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "0.625rem", marginBottom: "1.5rem" }}>
            {[
              { l: "Total", v: stats.total, icon: "📖", c: "var(--lavender-light)" },
              { l: "Learned", v: stats.learned, icon: "✅", c: "var(--mint-light)" },
              { l: "Review", v: stats.needsReview, icon: "🔄", c: "var(--coral-light)" },
              { l: "Accuracy", v: `${stats.accuracy}%`, icon: "🎯", c: "var(--gold)" },
            ].map(s => (
              <div key={s.l} className="card" style={{ textAlign: "center", padding: "1rem" }}>
                <p style={{ margin: 0, fontSize: "1.25rem" }}>{s.icon}</p>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: s.c, fontFamily: "var(--font-display)" }}>{s.v}</p>
                <p style={{ margin: "0.125rem 0 0", fontSize: "0.75rem", color: "var(--foreground-muted)" }}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* Language selector */}
          <div className="card" style={{ marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", padding: "0.875rem 1rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--foreground-muted)" }}>Native language:</span>
            {(["tr", "es", "de", "fr"] as NativeLanguage[]).map(l => (
              <button
                key={l}
                onClick={() => changeLang(l)}
                style={{
                  padding: "0.375rem 0.75rem", borderRadius: "9999px", fontSize: "0.8125rem", fontWeight: 600,
                  background: lang === l ? "var(--coral-glow)" : "transparent",
                  border: `1px solid ${lang === l ? "var(--coral)" : "var(--border)"}`,
                  color: lang === l ? "var(--coral-light)" : "var(--foreground-muted)",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {LANGUAGE_FLAGS[l]} {LANGUAGE_LABELS[l]}
              </button>
            ))}
          </div>

          {/* ===== SETS VIEW ===== */}
          {view === "sets" && (
            <div className="animate-fadeIn">
              {words.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                  <p style={{ fontSize: "2.5rem", margin: "0 0 1rem" }}>📝</p>
                  <h3 style={{ margin: "0 0 0.5rem", color: "var(--foreground)", fontFamily: "var(--font-display)" }}>No words yet</h3>
                  <p style={{ margin: "0 0 1.5rem", fontSize: "0.9375rem" }}>Generate practice content and save words to build your list.</p>
                  <a href="/practice" className="btn-primary">Go to Practice →</a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {sets.map((s, si) => {
                    const learned = s.filter(w => w.correctCount >= 3).length;
                    const pct = s.length > 0 ? (learned / s.length) * 100 : 0;
                    const isComplete = pct === 100;

                    return (
                      <div
                        key={si}
                        className={`set-card ${activeSet === si ? "active" : ""}`}
                        onClick={() => setActiveSet(si)}
                      >
                        <ProgressRing progress={pct} size={52} stroke={4} color={isComplete ? "var(--mint)" : "var(--coral)"}>
                          <span style={{ fontSize: "0.6875rem" }}>{learned}/{s.length}</span>
                        </ProgressRing>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                            <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
                              Set {si + 1}
                            </p>
                            {isComplete && <span className="badge badge-accent" style={{ fontSize: "0.625rem" }}>✓ Complete</span>}
                          </div>
                          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>
                            {s.slice(0, 5).map(w => w.word).join(", ")}{s.length > 5 ? "…" : ""}
                          </p>
                        </div>

                        <button
                          onClick={(e) => { e.stopPropagation(); startQuiz(si); }}
                          className="btn-primary"
                          style={{ fontSize: "0.8125rem", padding: "0.5rem 1rem", flexShrink: 0 }}
                          disabled={s.length < 2}
                        >
                          🧠 Quiz
                        </button>
                      </div>
                    );
                  })}

                  {/* Word list for active set */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
                        Set {activeSet + 1} · {currentSet.length} word{currentSet.length !== 1 ? "s" : ""}
                      </p>
                      {words.length > 0 && (
                        <button onClick={() => { if (confirm("Clear all?")) { clearWordList(); refresh(); } }} className="btn-secondary" style={{ fontSize: "0.75rem", padding: "0.25rem 0.625rem", color: "var(--rose)" }}>
                          🗑️ Clear All
                        </button>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {currentSet.map(w => (
                        <div key={w.word} className="card" style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem 1rem" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.125rem" }}>
                              <span style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "0.9375rem" }}>{w.word}</span>
                              {w.correctCount >= 3 && <span className="badge badge-accent" style={{ fontSize: "0.625rem" }}>✓</span>}
                              {lang && getTranslation(w.word, lang) && (
                                <span className="badge badge-coral" style={{ fontSize: "0.625rem" }}>{getTranslation(w.word, lang)}</span>
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--foreground-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.definition}</p>
                          </div>
                          {w.totalAttempts > 0 && (
                            <span style={{ fontSize: "0.75rem", color: "var(--foreground-faint)", whiteSpace: "nowrap" }}>{w.correctCount}/{w.totalAttempts}</span>
                          )}
                          <button onClick={() => { removeWord(w.word); refresh(); }} style={{ background: "none", border: "none", color: "var(--foreground-faint)", cursor: "pointer", fontSize: "0.875rem", padding: "0.25rem" }}>✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== QUIZ VIEW ===== */}
          {view === "quiz" && quiz && (
            <div className="animate-fadeIn">
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>Question {quiz.ci + 1}/{quiz.qs.length}</span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>{quiz.ans.filter((a, i) => a === quiz.qs[i].correctIndex).length} ✓</span>
                </div>
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" style={{ width: `${((quiz.ci + (quiz.fb ? 1 : 0)) / quiz.qs.length) * 100}%` }} />
                </div>
              </div>

              <div className="card" style={{ padding: "2rem 1.5rem" }}>
                <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground-faint)" }}>
                  {lang ? `What is the ${LANGUAGE_LABELS[lang]} meaning of:` : "What is the meaning of:"}
                </p>
                <h2 style={{ margin: "0 0 1.5rem", color: "var(--foreground)", fontSize: "1.5rem", fontFamily: "var(--font-display)" }}>
                  {quiz.qs[quiz.ci].word}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {quiz.qs[quiz.ci].options.map((opt, idx) => {
                    const sel = quiz.ans[quiz.ci] === idx;
                    const cor = idx === quiz.qs[quiz.ci].correctIndex;
                    let cls = "quiz-option";
                    if (quiz.fb) { if (cor) cls += " correct"; else if (sel && !cor) cls += " incorrect"; }

                    return (
                      <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={quiz.fb}>
                        <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
                        <span style={{ fontSize: "0.9375rem", lineHeight: 1.5, textAlign: "left" }}>
                          {opt.length > 100 ? opt.substring(0, 100) + "…" : opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {quiz.fb && (
                  <div className="animate-fadeInFast" style={{ marginTop: "1rem" }}>
                    <div style={{
                      background: quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex ? "var(--mint-glow)" : "var(--rose-glow)",
                      border: `1px solid ${quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex ? "var(--mint)" : "var(--rose)"}`,
                      borderRadius: "var(--radius-md)", padding: "0.875rem 1rem",
                    }}>
                      <p style={{ margin: "0 0 0.375rem", fontWeight: 700, fontSize: "0.875rem", color: quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex ? "var(--mint-light)" : "var(--rose)" }}>
                        {quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex ? "✓ Correct! +10 XP" : "✗ Incorrect +2 XP"}
                      </p>
                      <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
                        <strong style={{ color: "var(--foreground)" }}>{quiz.qs[quiz.ci].word}</strong>: {quiz.qs[quiz.ci].definition}
                        {quiz.qs[quiz.ci].nativeTranslation && <span style={{ color: "var(--coral-light)" }}> ({quiz.qs[quiz.ci].nativeTranslation})</span>}
                      </p>
                    </div>
                    <button className="btn-primary" onClick={nextQ} style={{ marginTop: "0.75rem", width: "100%", justifyContent: "center" }}>
                      {quiz.ci + 1 >= quiz.qs.length ? "See Results" : "Next →"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== RESULTS ===== */}
          {view === "results" && quiz && (
            <div className="animate-scaleIn">
              <div className="card" style={{ textAlign: "center", padding: "2rem 1.5rem" }}>
                <p style={{ fontSize: "3rem", margin: "0 0 0.75rem" }}>
                  {getScore().correct === getScore().total ? "🏆" : getScore().correct >= getScore().total * 0.7 ? "🎉" : "💪"}
                </p>
                <h2 style={{ margin: "0 0 0.25rem", color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
                  {getScore().correct === getScore().total ? "Perfect!" : "Quiz Complete"}
                </h2>
                <p style={{ margin: "0 0 1.25rem", fontSize: "1.25rem", color: "var(--foreground)" }}>
                  <strong style={{ color: "var(--mint-light)" }}>{getScore().correct}</strong> / {getScore().total}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1.25rem", textAlign: "left" }}>
                  {quiz.qs.map((q, i) => {
                    const ok = quiz.ans[i] === q.correctIndex;
                    return (
                      <div key={q.word} style={{
                        display: "flex", alignItems: "center", gap: "0.625rem",
                        padding: "0.5rem 0.75rem", borderRadius: "var(--radius-md)",
                        background: ok ? "var(--mint-glow)" : "var(--rose-glow)",
                        border: `1px solid ${ok ? "rgba(0,201,167,0.2)" : "rgba(255,77,109,0.2)"}`,
                      }}>
                        <span>{ok ? "✓" : "✗"}</span>
                        <span style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "0.9375rem" }}>{q.word}</span>
                        {q.nativeTranslation && <span className="badge badge-coral" style={{ fontSize: "0.625rem" }}>{q.nativeTranslation}</span>}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={() => startQuiz(activeSet)}>🔄 Retry Set</button>
                  <button className="btn-secondary" onClick={() => { setView("sets"); refresh(); }}>📋 Back to Sets</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
