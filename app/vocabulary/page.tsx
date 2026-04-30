"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedWord } from "@/lib/wordList";
import { getWordList, saveWords, removeWord, clearWordList, getWordStats, updateWordProgress } from "@/lib/wordList";
import { getTranslation, getNativeLanguage, setNativeLanguage, LANGUAGE_LABELS, LANGUAGE_FLAGS } from "@/lib/translations";
import type { NativeLanguage } from "@/lib/translations";
import { addXP, awardBadge, getGameState } from "@/lib/gamification";
import ProgressBar from "@/components/ProgressBar";
import Confetti from "@/components/Confetti";

type ViewMode = "sets" | "quiz" | "results";
type QuizDirection = "en-native" | "native-en" | "mixed";
const SET_SIZE = 20;

interface QuizQ { word: string; definition: string; nativeTranslation?: string; options: string[]; correctIndex: number; direction: "en-native" | "native-en"; }

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a;
}

function buildQuiz(words: SavedWord[], lang: NativeLanguage | null, mode: QuizDirection): QuizQ[] {
  const allEnWords = words.map(w => w.word);
  const allDefs = words.map(w => lang ? (getTranslation(w.word, lang) ?? w.definition) : w.definition);
  
  return words.map(w => {
    let isReverse = false;
    if (lang) {
      if (mode === "native-en") isReverse = true;
      else if (mode === "mixed") isReverse = Math.random() > 0.5;
    }
    
    if (isReverse) {
      const correctWord = w.word;
      const wrongs = shuffleArray(allEnWords.filter(e => e !== correctWord)).slice(0, 3);
      while (wrongs.length < 3) wrongs.push(["random", "example", "test", "dummy"][wrongs.length] ?? "—");
      const opts = shuffleArray([correctWord, ...wrongs]);
      return { 
        word: w.word, definition: w.definition, nativeTranslation: getTranslation(w.word, lang as NativeLanguage) ?? undefined, 
        options: opts, correctIndex: opts.indexOf(correctWord), direction: "native-en" 
      };
    } else {
      const correctDef = lang ? (getTranslation(w.word, lang) ?? w.definition) : w.definition;
      const wrongs = shuffleArray(allDefs.filter(d => d !== correctDef)).slice(0, 3);
      while (wrongs.length < 3) wrongs.push(["İlgisiz kavram", "Concepte sin relación", "Unrelatiertes Konzept", "Concept sans rapport"][wrongs.length] ?? "—");
      const opts = shuffleArray([correctDef, ...wrongs]);
      return { 
        word: w.word, definition: w.definition, nativeTranslation: lang ? getTranslation(w.word, lang) ?? undefined : undefined, 
        options: opts, correctIndex: opts.indexOf(correctDef), direction: "en-native" 
      };
    }
  });
}

export default function VocabularyPage() {
  const [view, setView] = useState<ViewMode>("sets");
  const [words, setWords] = useState<SavedWord[]>([]);
  const [stats, setStats] = useState({ total: 0, learned: 0, needsReview: 0, accuracy: 0 });
  const [lang, setLang] = useState<NativeLanguage | null>(null);
  const [activeSet, setActiveSet] = useState(0);
  const [quizMode, setQuizMode] = useState<QuizDirection>("en-native");
  const [quiz, setQuiz] = useState<{ qs: QuizQ[]; ci: number; ans: (number | null)[]; fb: boolean } | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Manual word entry state
  const [manualWord, setManualWord] = useState("");
  const [manualDef, setManualDef] = useState("");

  const refresh = useCallback(() => { setWords(getWordList()); setStats(getWordStats()); }, []);

  useEffect(() => { setMounted(true); refresh(); const l = getNativeLanguage(); if (l) setLang(l); }, [refresh]);

  const sets: SavedWord[][] = [];
  for (let i = 0; i < words.length; i += SET_SIZE) sets.push(words.slice(i, i + SET_SIZE));
  if (sets.length === 0) sets.push([]);

  const currentSet = activeSet === -1 ? words.filter(w => w.difficulty === "hard") : (sets[activeSet] ?? []);
  const hardWords = words.filter(w => w.difficulty === "hard");

  function changeLang(l: NativeLanguage) { setLang(l); setNativeLanguage(l); }

  function startQuiz(setIdx: number) {
    let s: SavedWord[] = [];
    if (setIdx === -1) s = hardWords;
    else s = sets[setIdx] ?? [];
    
    if (s.length < 2) return;
    const qs = buildQuiz(shuffleArray(s).slice(0, Math.min(20, s.length)), lang, quizMode);
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

  function handleAddManualWord(e: React.FormEvent) {
    e.preventDefault();
    addWordInternal();
  }

  function addWordInternal() {
    if (!manualWord.trim() || !manualDef.trim()) return;
    
    saveWords([{
      word: manualWord.trim(),
      definition: manualDef.trim(),
      contextSentence: "Manually added.",
      partOfSpeech: "unknown",
      difficulty: "manual"
    }]);
    
    setManualWord("");
    setManualDef("");
    refresh();
  }

  function handleAddAndTest() {
    if (!manualWord.trim() || !manualDef.trim()) return;
    const w = manualWord.trim();
    addWordInternal();
    
    // Find the word in the updated list
    const updatedWords = getWordList();
    const idx = updatedWords.findIndex(x => x.word === w);
    if (idx !== -1) {
      const setIdx = Math.floor(idx / SET_SIZE);
      // Wait a tick for states to sync before starting quiz
      setTimeout(() => startQuiz(setIdx), 50);
    }
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
              { l: "Total", v: stats.total, c: "var(--lavender)" },
              { l: "Learned", v: stats.learned, c: "var(--mint)" },
              { l: "Review", v: stats.needsReview, c: "var(--coral)" },
              { l: "Accuracy", v: `${stats.accuracy}%`, c: "var(--gold)" },
            ].map(s => (
              <div key={s.l} className="card" style={{ textAlign: "center", padding: "1rem" }}>
                <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: s.c, fontFamily: "var(--font-display)" }}>{s.v}</p>
                <p style={{ margin: "0.125rem 0 0", fontSize: "0.75rem", color: "var(--foreground-muted)", textTransform: "uppercase", fontWeight: 800 }}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* Language selector & Quiz Mode */}
          <div className="card" style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.8125rem", fontWeight: 800, color: "var(--foreground)" }}>NATIVE LANGUAGE:</span>
              {(["tr", "es", "de", "fr"] as NativeLanguage[]).map(l => (
                <button
                  key={l}
                  onClick={() => changeLang(l)}
                  style={{
                    padding: "0.375rem 0.75rem", borderRadius: "0", fontSize: "0.8125rem", fontWeight: 800,
                    background: lang === l ? "var(--peach)" : "var(--surface)",
                    border: `2px solid #000`,
                    color: "#000",
                    boxShadow: lang === l ? "2px 2px 0px #000" : "none",
                    cursor: "pointer", transition: "all 0.1s",
                  }}
                >
                  {LANGUAGE_FLAGS[l]} {LANGUAGE_LABELS[l]}
                </button>
              ))}
            </div>

            {lang && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.8125rem", fontWeight: 800, color: "var(--foreground)", textTransform: "uppercase" }}>Test Mode:</span>
                {[
                  { id: "en-native", label: `EN ➔ ${LANGUAGE_LABELS[lang].substring(0,3).toUpperCase()}` },
                  { id: "native-en", label: `${LANGUAGE_LABELS[lang].substring(0,3).toUpperCase()} ➔ EN` },
                  { id: "mixed", label: "Mixed 🔀" },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setQuizMode(m.id as QuizDirection)}
                    style={{
                      padding: "0.375rem 0.75rem", borderRadius: "0", fontSize: "0.8125rem", fontWeight: 800,
                      background: quizMode === m.id ? "var(--brutal-purple)" : "var(--surface)",
                      border: `2px solid #000`,
                      color: quizMode === m.id ? "#fff" : "#000",
                      boxShadow: quizMode === m.id ? "2px 2px 0px #000" : "none",
                      cursor: "pointer", transition: "all 0.1s",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== SETS VIEW ===== */}
          {view === "sets" && (
            <div className="animate-fadeIn">
              {/* Add Manual Word Form */}
              <div className="card" style={{ marginBottom: "1.5rem", padding: "1.25rem" }}>
                <h3 style={{ margin: "0 0 1rem", fontSize: "1.125rem" }}>Add Word Manually</h3>
                <form onSubmit={handleAddManualWord} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  <input 
                    type="text" 
                    className="input-base" 
                    placeholder="Word (e.g., Ubiquitous)" 
                    value={manualWord}
                    onChange={(e) => setManualWord(e.target.value)}
                    style={{ flex: "1 1 200px" }}
                  />
                  <input 
                    type="text" 
                    className="input-base" 
                    placeholder="Definition" 
                    value={manualDef}
                    onChange={(e) => setManualDef(e.target.value)}
                    style={{ flex: "2 1 300px" }}
                  />
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <button type="submit" className="btn-secondary">
                      + Add
                    </button>
                    <button type="button" onClick={handleAddAndTest} className="btn-primary" style={{ background: "var(--brutal-yellow)" }}>
                      + Add & Test Now
                    </button>
                  </div>
                </form>
              </div>

              {words.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
                  <p style={{ fontSize: "2.5rem", margin: "0 0 1rem" }}></p>
                  <h3 style={{ margin: "0 0 0.5rem", color: "var(--foreground)", fontFamily: "var(--font-display)" }}>No words yet</h3>
                  <p style={{ margin: "0 0 1.5rem", fontSize: "0.9375rem" }}>Generate practice content and save words to build your list.</p>
                  <a href="/practice" className="btn-primary">Go to Practice →</a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  
                  {/* Hard Words Set */}
                  {hardWords.length > 0 && (
                    <div className="card" style={{ padding: "1.5rem", background: "var(--brutal-red)", color: "#000", border: "4px solid #000", marginBottom: "1rem", boxShadow: "6px 6px 0px #000" }}>
                      <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 900, textTransform: "uppercase" }}>Zor Kelimeler (Hard Words)</h3>
                      <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", fontWeight: 600 }}>{hardWords.length} words need review. Practice them to remove the 'hard' tag.</p>
                      <button onClick={() => startQuiz(-1)} className="btn-primary" style={{ background: "#fff", color: "#000" }} disabled={hardWords.length < 2}>
                        Practice Hard Words
                      </button>
                      {hardWords.length < 2 && <p style={{ margin: "0.5rem 0 0", fontSize: "0.75rem", fontWeight: 800 }}>Need at least 2 hard words to start quiz.</p>}
                    </div>
                  )}

                  {sets.map((s, si) => {
                    const learned = s.filter(w => w.correctCount >= 3).length;
                    const pct = s.length > 0 ? (learned / s.length) * 100 : 0;
                    const isComplete = pct === 100;

                    return (
                      <div
                        key={si}
                        className={`set-card ${activeSet === si ? "active" : ""}`}
                        onClick={() => setActiveSet(si)}
                        style={{ flexDirection: "column", alignItems: "stretch", gap: "0.5rem" }}
                      >
                        <div style={{ width: "100%", marginBottom: "1rem" }}>
                          <ProgressBar progress={pct} color={isComplete ? "var(--brutal-green)" : "var(--brutal-yellow)"} label={`${learned}/${s.length} Learned`} />
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                              <p style={{ margin: 0, fontWeight: 700, fontSize: "0.9375rem", color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
                                Set {si + 1}
                              </p>
                              {isComplete && <span className="badge badge-accent" style={{ fontSize: "0.625rem" }}> Complete</span>}
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
                            Start Quiz
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Word list for active set */}
                  <div style={{ marginTop: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
                        {activeSet === -1 ? "Hard Words" : `Set ${activeSet + 1}`} · {currentSet.length} word{currentSet.length !== 1 ? "s" : ""}
                      </p>
                      {words.length > 0 && (
                        <button onClick={() => { if (confirm("Clear all?")) { clearWordList(); refresh(); } }} className="btn-secondary" style={{ fontSize: "0.75rem", padding: "0.25rem 0.625rem", color: "var(--rose)" }}>
                          Clear All
                        </button>
                      )}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                      {currentSet.map(w => (
                        <div key={w.word} className="card" style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.75rem 1rem" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.125rem" }}>
                              <span style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "0.9375rem" }}>{w.word}</span>
                              {w.correctCount >= 3 && <span className="badge badge-accent" style={{ fontSize: "0.625rem" }}></span>}
                              {lang && getTranslation(w.word, lang) && (
                                <span className="badge badge-coral" style={{ fontSize: "0.625rem" }}>{getTranslation(w.word, lang)}</span>
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--foreground-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.definition}</p>
                          </div>
                          {w.totalAttempts > 0 && (
                            <span style={{ fontSize: "0.75rem", color: "var(--foreground-faint)", whiteSpace: "nowrap" }}>{w.correctCount}/{w.totalAttempts}</span>
                          )}
                          <button onClick={() => { removeWord(w.word); refresh(); }} style={{ background: "none", border: "none", color: "var(--foreground-faint)", cursor: "pointer", fontSize: "0.875rem", padding: "0.25rem" }}></button>
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
                  <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>{quiz.ans.filter((a, i) => a === quiz.qs[i].correctIndex).length} </span>
                </div>
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" style={{ width: `${((quiz.ci + (quiz.fb ? 1 : 0)) / quiz.qs.length) * 100}%` }} />
                </div>
              </div>

              <div className="card" style={{ padding: "2rem 1.5rem" }}>
                <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground-faint)" }}>
                  {quiz.qs[quiz.ci].direction === "native-en" 
                    ? "What is the English word for:" 
                    : (lang ? `What is the ${LANGUAGE_LABELS[lang]} meaning of:` : "What is the meaning of:")}
                </p>
                <h2 style={{ margin: "0 0 1.5rem", color: "var(--foreground)", fontSize: "1.5rem", fontFamily: "var(--font-display)" }}>
                  {quiz.qs[quiz.ci].direction === "native-en" 
                    ? (quiz.qs[quiz.ci].nativeTranslation ?? quiz.qs[quiz.ci].definition)
                    : quiz.qs[quiz.ci].word}
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
                        {quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex ? " Correct! +10 XP" : " Incorrect +2 XP"}
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
                  {getScore().correct === getScore().total ? "" : getScore().correct >= getScore().total * 0.7 ? "" : ""}
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
                        <span>{ok ? "" : ""}</span>
                        <span style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "0.9375rem" }}>{q.word}</span>
                        {q.nativeTranslation && <span className="badge badge-coral" style={{ fontSize: "0.625rem" }}>{q.nativeTranslation}</span>}
                      </div>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={() => startQuiz(activeSet)}>Retry Set</button>
                  <button className="btn-secondary" onClick={() => { setView("sets"); refresh(); }}>Back to Sets</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
