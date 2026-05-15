"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedWord } from "@/lib/wordList";
import { getWordList, saveWords, removeWord, clearWordList, getWordStats, updateWordProgress } from "@/lib/wordList";
import { addXP, awardBadge } from "@/lib/gamification";
import { useAppContext } from "@/lib/AppContext";
import ProgressBar from "@/components/ProgressBar";
import Confetti from "@/components/Confetti";
import { showToast } from "@/components/Toast";

type ViewMode = "sets" | "quiz" | "results";
type QuizDirection = "word-def" | "def-word";
const SET_SIZE = 20;

interface QuizQ { 
  word: string; 
  definition: string; 
  options: string[]; 
  correctIndex: number; 
  direction: QuizDirection; 
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]; 
  for (let i = a.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [a[i], a[j]] = [a[j], a[i]]; 
  } 
  return a;
}

function buildQuiz(words: SavedWord[], mode: QuizDirection): QuizQ[] {
  const allEnWords = words.map(w => w.word);
  const allDefs = words.map(w => w.definition);
  
  return words.map(w => {
    // If mode is mixed (optional later), we could randomize, but let's stick to chosen direction
    const isReverse = mode === "def-word";
    
    if (isReverse) {
      // Show definition, guess word
      const correctWord = w.word;
      const wrongs = shuffleArray(allEnWords.filter(e => e !== correctWord)).slice(0, 3);
      while (wrongs.length < 3) wrongs.push(["ubiquitous", "ephemeral", "pragmatic", "lucid"][wrongs.length] ?? "—");
      const opts = shuffleArray([correctWord, ...wrongs]);
      return { 
        word: w.word, definition: w.definition, 
        options: opts, correctIndex: opts.indexOf(correctWord), direction: "def-word" 
      };
    } else {
      // Show word, guess definition
      const correctDef = w.definition;
      const wrongs = shuffleArray(allDefs.filter(d => d !== correctDef)).slice(0, 3);
      while (wrongs.length < 3) wrongs.push(["A common misconception", "Relating to the study of stars", "Without logical reasoning", "To increase in volume"][wrongs.length] ?? "—");
      const opts = shuffleArray([correctDef, ...wrongs]);
      return { 
        word: w.word, definition: w.definition, 
        options: opts, correctIndex: opts.indexOf(correctDef), direction: "word-def" 
      };
    }
  });
}

export default function VocabularyPage() {
  const { isPremium, userProfile, updateUserProfile } = useAppContext();
  const [view, setView] = useState<ViewMode>("sets");
  const [words, setWords] = useState<SavedWord[]>([]);
  const [stats, setStats] = useState({ total: 0, learned: 0, needsReview: 0, accuracy: 0 });
  const [activeSet, setActiveSet] = useState("Set 1");
  const [quizMode, setQuizMode] = useState<QuizDirection>("word-def");
  const [quiz, setQuiz] = useState<{ qs: QuizQ[]; ci: number; ans: (number | null)[] } | null>(null);
  const [confetti, setConfetti] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Manual word entry state
  const [manualWord, setManualWord] = useState("");
  const [manualDef, setManualDef] = useState("");
  const [manualSet, setManualSet] = useState("Set 1");

  const refresh = useCallback(() => { setWords(getWordList()); setStats(getWordStats()); }, []);

  useEffect(() => { setMounted(true); refresh(); }, [refresh]);

  // Group words by setName
  const setsMap: Record<string, SavedWord[]> = {};
  words.forEach(w => {
    const setName = w.setName || "Set 1";
    if (!setsMap[setName]) setsMap[setName] = [];
    setsMap[setName].push(w);
  });
  const setNames = Object.keys(setsMap).length > 0 ? Object.keys(setsMap) : ["Set 1"];

  const currentSet = activeSet === "hard" ? words.filter(w => w.difficulty === "hard") : (setsMap[activeSet] ?? []);
  const hardWords = words.filter(w => w.difficulty === "hard");

  const [isStartingQuiz, setIsStartingQuiz] = useState(false);

  function startQuiz(setName: string) {
    if (!isPremium && words.length > 20) {
      showToast("Free users can only practice up to 20 words. Please upgrade to Premium to unlock unlimited practice.", "warning");
      return;
    }

    let s: SavedWord[] = [];
    if (setName === "hard") s = hardWords;
    else s = setsMap[setName] ?? [];
    
    if (s.length < 2) return;

    setIsStartingQuiz(true);
    
    const limit = isPremium ? s.length : Math.min(20, s.length);
    const qs = buildQuiz(shuffleArray(s).slice(0, limit), quizMode);
    setQuiz({ qs, ci: 0, ans: new Array(qs.length).fill(null) });
    setActiveSet(setName);
    setView("quiz");
    setIsStartingQuiz(false);
  }

  function handleAnswer(idx: number) {
    if (!quiz || quiz.ans[quiz.ci] !== null) return; // Prevent changing answer
    const a = [...quiz.ans]; a[quiz.ci] = idx;
    const q = quiz.qs[quiz.ci];
    const ok = idx === q.correctIndex;
    updateWordProgress(q.word, ok);
    
    // Add XP to Context Profile (only once, here in handleAnswer)
    if (ok) {
      addXP(10);
      updateUserProfile({ points: userProfile.points + 10 });
      setConfetti(true); setTimeout(() => setConfetti(false), 1500);
    } else {
      addXP(2);
      updateUserProfile({ points: userProfile.points + 2 });
    }
    
    setQuiz({ ...quiz, ans: a });
  }

  function nextQ() {
    if (!quiz) return;
    if (quiz.ci + 1 >= quiz.qs.length) {
      const correct = quiz.qs.filter((q, i) => quiz.ans[i] === q.correctIndex).length;
      if (correct === quiz.qs.length) awardBadge("perfect_score");
      refresh();
      setView("results");
    } else {
      setQuiz({ ...quiz, ci: quiz.ci + 1 });
    }
  }

  function prevQ() {
    if (!quiz || quiz.ci <= 0) return;
    setQuiz({ ...quiz, ci: quiz.ci - 1 });
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
      difficulty: "manual",
      setName: manualSet.trim() || "Set 1"
    }]);
    
    setManualWord("");
    setManualDef("");
    setManualSet("Set 1");
    refresh();
  }

  function handleAddAndTest() {
    if (!manualWord.trim() || !manualDef.trim()) return;
    const sName = manualSet.trim() || "Set 1";
    addWordInternal();
    
    // Wait a tick for states to sync before starting quiz
    setTimeout(() => startQuiz(sName), 50);
  }

  if (!mounted) return null;

  return (
    <div className="section" style={{ paddingTop: "2.5rem" }}>
      <div className="container">
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {confetti && <Confetti />}

          {/* Header */}
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h1 style={{ margin: "0 0 0.75rem", fontSize: "clamp(2rem, 5vw, 3rem)" }}>
              <span className="gradient-text">My Dictionary</span>
            </h1>
            <p style={{ margin: "0 auto", fontSize: "1.125rem", maxWidth: "600px" }}>Build your ultimate English vocabulary. Master definitions contextually to boost your IELTS score.</p>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            {[
              { l: "Total Words", v: stats.total, c: "var(--primary)" },
              { l: "Learned", v: stats.learned, c: "var(--mint)" },
              { l: "To Review", v: stats.needsReview, c: "var(--gold)" },
              { l: "Accuracy", v: `${stats.accuracy}%`, c: "var(--sky)" },
            ].map(s => (
              <div key={s.l} className="card" style={{ textAlign: "center", padding: "1.5rem 1rem", borderTop: `4px solid ${s.c}` }}>
                <p style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: "var(--foreground)", fontFamily: "var(--font-display)", lineHeight: 1.2 }}>{s.v}</p>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.8125rem", color: "var(--foreground-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* Quiz Mode Selector */}
          {words.length > 0 && (
            <div className="card" style={{ marginBottom: "2rem", display: "flex", flexDirection: "column", gap: "1rem", padding: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--foreground)", textTransform: "uppercase", letterSpacing: "0.05em" }}>QUIZ MODE:</span>
                {[
                  { id: "word-def", label: "Guess Definition" },
                  { id: "def-word", label: "Guess Word" },
                ].map(m => (
                  <button
                    key={m.id}
                    onClick={() => setQuizMode(m.id as QuizDirection)}
                    style={{
                      padding: "0.5rem 1rem", borderRadius: "9999px", fontSize: "0.875rem", fontWeight: 600,
                      background: quizMode === m.id ? "var(--primary-glow)" : "transparent",
                      border: `1px solid ${quizMode === m.id ? "var(--primary)" : "var(--border)"}`,
                      color: quizMode === m.id ? "var(--primary-dark)" : "var(--foreground-muted)",
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ===== SETS VIEW ===== */}
          {view === "sets" && (
            <div className="animate-fadeIn">
              {/* Add Manual Word Form */}
              <div className="card" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <h3 style={{ margin: 0, fontSize: "1.125rem" }}>Add New Word</h3>
                </div>
                <form onSubmit={handleAddManualWord} style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
                  <div style={{ flex: "1 1 150px" }}>
                    <label className="label">Word</label>
                    <input 
                      type="text" 
                      className="input-base" 
                      placeholder="e.g., Ubiquitous" 
                      value={manualWord}
                      onChange={(e) => setManualWord(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: "2 1 250px" }}>
                    <label className="label">Definition</label>
                    <input 
                      type="text" 
                      className="input-base" 
                      placeholder="e.g., Present, everywhere." 
                      value={manualDef}
                      onChange={(e) => setManualDef(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: "1 1 150px" }}>
                    <label className="label">Set</label>
                    <input 
                      type="text" 
                      className="input-base" 
                      placeholder="e.g., Set 1" 
                      value={manualSet}
                      onChange={(e) => setManualSet(e.target.value)}
                      list="set-names"
                    />
                    <datalist id="set-names">
                      {setNames.map(name => (
                        <option key={name} value={name} />
                      ))}
                    </datalist>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <button type="submit" className="btn-secondary" style={{ padding: "0.875rem 1.25rem" }}>
                      Add Only
                    </button>
                    <button type="button" onClick={handleAddAndTest} className="btn-primary" style={{ padding: "0.875rem 1.25rem" }}>
                      Add & Test Now
                    </button>
                  </div>
                </form>
              </div>

              {words.length === 0 ? (
                <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", borderStyle: "dashed" }}>
                  <div style={{ width: "4rem", height: "4rem", margin: "0 auto 1.5rem", borderRadius: "50%", background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  </div>
                  <h3 style={{ margin: "0 0 0.75rem", color: "var(--foreground)", fontFamily: "var(--font-display)", fontSize: "1.5rem" }}>Your Dictionary is Empty</h3>
                  <p style={{ margin: "0 auto 2rem", fontSize: "1rem", maxWidth: "400px" }}>Start adding words manually above, or generate practice content from articles to build your vocabulary list automatically.</p>
                  <a href="/practice" className="btn-primary">Generate from Reading →</a>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  
                  {/* Hard Words Set */}
                  {hardWords.length > 0 && (
                    <div className="card" style={{ padding: "1.5rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                          <h3 style={{ margin: "0 0 0.25rem", fontSize: "1.25rem", color: "var(--premium-red)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                            Words Needing Review
                          </h3>
                          <p style={{ margin: 0, fontSize: "0.875rem" }}>{hardWords.length} words require attention. Practice to remove the 'hard' tag.</p>
                        </div>
                        <button onClick={() => startQuiz("hard")} className="btn-primary" style={{ background: "var(--premium-red)", boxShadow: "0 4px 14px 0 rgba(239, 68, 68, 0.39)" }} disabled={hardWords.length < 2 || isStartingQuiz}>
                          {isStartingQuiz ? "Preparing..." : "Practice Hard Words"}
                        </button>
                      </div>
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
                    {Object.entries(setsMap).map(([setName, s]) => {
                      const learned = s.filter(w => w.correctCount >= 3).length;
                      const pct = s.length > 0 ? (learned / s.length) * 100 : 0;
                      const isComplete = pct === 100;

                      return (
                        <div
                          key={setName}
                          className="card"
                          onClick={() => setActiveSet(setName)}
                          style={{ 
                            cursor: "pointer",
                            borderColor: activeSet === setName ? "var(--primary)" : "var(--border)",
                            boxShadow: activeSet === setName ? "0 0 0 1px var(--primary)" : "var(--shadow-sm)",
                            padding: "1.25rem",
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                <h4 style={{ margin: 0, fontSize: "1.125rem" }}>{setName}</h4>
                                {isComplete && <span className="badge badge-accent" style={{ padding: "0.125rem 0.5rem" }}>Mastered</span>}
                              </div>
                              <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--foreground-faint)" }}>
                                {s.length} words
                              </p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); startQuiz(setName); }}
                              className="btn-secondary"
                              style={{ padding: "0.375rem 0.75rem", fontSize: "0.8125rem" }}
                              disabled={s.length < 2 || isStartingQuiz}
                            >
                              Quiz
                            </button>
                          </div>
                          
                          <div style={{ width: "100%" }}>
                            <ProgressBar progress={pct} color={isComplete ? "var(--mint)" : "var(--primary)"} label={`${learned}/${s.length} Learned`} />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Word list for active set */}
                  <div className="card" style={{ marginTop: "1rem", padding: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                      <h3 style={{ margin: 0, fontSize: "1.25rem" }}>
                        {activeSet === "hard" ? "Review Words" : `Dictionary ${activeSet}`}
                      </h3>
                      {words.length > 0 && (
                        <button onClick={() => { if (confirm("Clear all words in dictionary?")) { clearWordList(); refresh(); } }} className="btn-secondary" style={{ fontSize: "0.75rem", padding: "0.375rem 0.75rem", color: "var(--premium-red)", borderColor: "rgba(239, 68, 68, 0.2)" }}>
                          Clear Dictionary
                        </button>
                      )}
                    </div>

                    <div style={{ display: "grid", gap: "0.75rem" }}>
                      {currentSet.map(w => (
                        <div key={w.word} style={{ display: "flex", alignItems: "flex-start", gap: "1rem", padding: "1rem", background: "var(--surface-2)", borderRadius: "var(--radius-sm)" }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                              <span style={{ fontWeight: 700, color: "var(--foreground)", fontSize: "1rem" }}>{w.word}</span>
                              {w.correctCount >= 3 && <span className="badge badge-accent" style={{ padding: "0.125rem 0.5rem" }}>Learned</span>}
                            </div>
                            <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>{w.definition}</p>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                            {w.totalAttempts > 0 && (
                              <span className="badge badge-primary" style={{ fontSize: "0.75rem" }}>{w.correctCount}/{w.totalAttempts} Score</span>
                            )}
                            <button onClick={() => { removeWord(w.word); refresh(); }} style={{ background: "none", border: "none", color: "var(--foreground-faint)", cursor: "pointer", fontSize: "0.875rem", padding: "0.25rem", transition: "color 0.2s" }} onMouseOver={(e) => e.currentTarget.style.color = "var(--premium-red)"} onMouseOut={(e) => e.currentTarget.style.color = "var(--foreground-faint)"}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
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
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground-muted)" }}>Question {quiz.ci + 1} of {quiz.qs.length}</span>
                  <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--mint)" }}>{quiz.ans.filter((a, i) => a === quiz.qs[i].correctIndex).length} Correct</span>
                </div>
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" style={{ width: `${((quiz.ci) / quiz.qs.length) * 100}%` }} />
                </div>
              </div>

              <div className="card" style={{ padding: "3rem 2rem", textAlign: "center" }}>
                {/* Save to Difficult Words Button */}
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
                  <button 
                    onClick={() => {
                      if (!isPremium) { 
                        showToast("Adding to Difficult Words is a Premium feature. Upgrade to unlock!", "warning");
                        return; 
                      }
                      const currentWord = quiz.qs[quiz.ci].word;
                      // Actually mark as hard in localStorage
                      const allWords = getWordList();
                      const wordData = allWords.find(w => w.word === currentWord);
                      if (wordData) {
                        saveWords([{ ...wordData, difficulty: "hard" }]);
                        showToast(`"${currentWord}" added to Difficult Words folder!`, "success");
                      } else {
                        showToast(`"${currentWord}" marked for review!`, "success");
                      }
                    }}
                    className="btn-secondary" 
                    style={{ fontSize: "0.75rem", padding: "0.5rem 0.75rem" }}
                  >
                    + Add to Difficult Words
                  </button>
                </div>

                <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--primary)" }}>
                  {quiz.qs[quiz.ci].direction === "def-word" 
                    ? "Which word matches this definition?" 
                    : "What is the definition of this word?"}
                </p>
                <h2 style={{ margin: "0 auto 2rem", color: "var(--foreground)", fontSize: "1.75rem", maxWidth: "600px", lineHeight: 1.4 }}>
                  {quiz.qs[quiz.ci].direction === "def-word" 
                    ? `"${quiz.qs[quiz.ci].definition}"`
                    : quiz.qs[quiz.ci].word}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: "600px", margin: "0 auto" }}>
                  {quiz.qs[quiz.ci].options.map((opt, idx) => {
                    const hasAnswered = quiz.ans[quiz.ci] !== null;
                    const sel = quiz.ans[quiz.ci] === idx;
                    const cor = idx === quiz.qs[quiz.ci].correctIndex;
                    let cls = "quiz-option";
                    if (hasAnswered) { if (cor) cls += " correct"; else if (sel && !cor) cls += " incorrect"; }

                    return (
                      <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={hasAnswered}>
                        <span className="quiz-option-letter">{String.fromCharCode(65 + idx)}</span>
                        <span style={{ fontSize: "1rem", lineHeight: 1.5, flex: 1 }}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Navigation Controls */}
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", maxWidth: "600px", margin: "2rem auto 0" }}>
                  <button className="btn-secondary" onClick={prevQ} disabled={quiz.ci <= 0} style={{ padding: "0.75rem 1.5rem" }}>
                    ← Previous
                  </button>
                  <button className="btn-primary" onClick={nextQ} style={{ padding: "0.75rem 1.5rem" }}>
                    {quiz.ci + 1 >= quiz.qs.length ? "See Results" : "Next →"}
                  </button>
                </div>

                {quiz.ans[quiz.ci] !== null && (
                  <div className="animate-fadeInFast" style={{ marginTop: "1rem", maxWidth: "600px", margin: "1rem auto 0" }}>
                    <div style={{
                      background: quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                      border: `1px solid ${quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex ? "var(--mint)" : "var(--premium-red)"}`,
                      borderRadius: "var(--radius-md)", padding: "1.25rem", textAlign: "left"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                        {quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex 
                          ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                          : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--premium-red)" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        }
                        <p style={{ margin: 0, fontWeight: 700, fontSize: "1rem", color: quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex ? "var(--mint)" : "var(--premium-red)" }}>
                          {quiz.ans[quiz.ci] === quiz.qs[quiz.ci].correctIndex ? "Correct!" : "Incorrect"}
                        </p>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--foreground)" }}>
                        <strong>{quiz.qs[quiz.ci].word}</strong>: {quiz.qs[quiz.ci].definition}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== RESULTS ===== */}
          {view === "results" && quiz && (
            <div className="animate-scaleIn">
              <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
                <div style={{ margin: "0 auto 1.5rem" }}>
                  <div className="score-badge">
                    <span className="score-value">{getScore().correct} / {getScore().total}</span>
                    <span className="score-label">Final Score</span>
                  </div>
                </div>
                <h2 style={{ margin: "0 0 0.5rem", color: "var(--foreground)" }}>
                  {getScore().correct === getScore().total ? "Perfect Score! 🎉" : "Quiz Complete"}
                </h2>
                <p style={{ margin: "0 0 2rem", fontSize: "1.125rem" }}>
                  {getScore().correct === getScore().total
                    ? "Outstanding! You answered every question correctly."
                    : `Keep reviewing to lock these words in your memory.`
                  }
                </p>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary" onClick={() => startQuiz(activeSet)}>Retry Set</button>
                  <button className="btn-secondary" onClick={() => { setView("sets"); refresh(); }}>Back to Dictionary</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
