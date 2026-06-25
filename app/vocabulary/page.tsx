"use client";

import { useState, useEffect, useCallback } from "react";
import type { SavedWord } from "@/lib/wordList";
import {
  getWordList,
  saveWords,
  removeWord,
  getWordStats,
  updateWordProgress,
  deleteSet,
  renameSet,
  updateWordSet
} from "@/lib/wordList";
import { addXP, awardBadge } from "@/lib/gamification";
import { useAppContext } from "@/lib/AppContext";
import { useHydrated } from "@/lib/useHydrated";
import Confetti from "@/components/Confetti";
import { showToast } from "@/components/Toast";

type ViewMode = "sets" | "quiz" | "results";
type QuizDirection = "word-def" | "def-word";

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
    const isReverse = mode === "def-word";
    
    if (isReverse) {
      const correctWord = w.word;
      const wrongs = shuffleArray(allEnWords.filter(e => e !== correctWord)).slice(0, 3);
      while (wrongs.length < 3) wrongs.push(["ubiquitous", "ephemeral", "pragmatic", "lucid"][wrongs.length] ?? "—");
      const opts = shuffleArray([correctWord, ...wrongs]);
      return { 
        word: w.word, definition: w.definition, 
        options: opts, correctIndex: opts.indexOf(correctWord), direction: "def-word" 
      };
    } else {
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
  const mounted = useHydrated();
  
  const [manualWord, setManualWord] = useState("");
  const [manualDef, setManualDef] = useState("");
  const [manualSet, setManualSet] = useState("Set 1");
  const [isEditingSet, setIsEditingSet] = useState<string | null>(null);
  const [newSetName, setNewSetName] = useState("");
  const [customSets, setCustomSets] = useState<string[]>([]);

  const refresh = useCallback(() => { 
    const currentWords = getWordList();
    setWords(currentWords); 
    setStats(getWordStats()); 
    
    let cSets: string[] = [];
    if (typeof window !== "undefined") {
      const str = localStorage.getItem("practiceforge_custom_sets");
      if (str) cSets = JSON.parse(str);
    }
    setCustomSets(cSets);

    // Ensure activeSet still exists, otherwise default to first available or "Set 1"
    const sets = Array.from(new Set([...currentWords.map(w => w.setName || "Set 1"), ...cSets]));
    
    // Use functional state update to break dependency cycle
    setActiveSet(prevActive => {
      if (prevActive !== "hard" && sets.length > 0 && !sets.includes(prevActive)) {
        return sets[0];
      } else if (sets.length === 0 && prevActive !== "hard") {
        return "Set 1";
      }
      return prevActive;
    });
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- refresh() hydrates word lists from localStorage on mount; must run client-side to stay hydration-safe
  useEffect(() => { refresh(); }, [refresh]);

  const setsMap: Record<string, SavedWord[]> = {};
  words.forEach(w => {
    const setName = w.setName || "Set 1";
    if (!setsMap[setName]) setsMap[setName] = [];
    setsMap[setName].push(w);
  });
  customSets.forEach(c => {
    if (!setsMap[c]) setsMap[c] = [];
  });
  const setNames = Object.keys(setsMap).sort();

  const currentSet = activeSet === "hard" ? words.filter(w => w.difficulty === "hard") : (setsMap[activeSet] ?? []);
  const hardWords = words.filter(w => w.difficulty === "hard");


  function startQuiz(setName: string) {
    if (!isPremium && words.length > 20) {
      showToast("Free users can only practice up to 20 words. Please upgrade to Premium.", "warning");
      return;
    }

    let s: SavedWord[] = [];
    if (setName === "hard") s = hardWords;
    else s = setsMap[setName] ?? [];
    
    if (s.length < 2) {
      showToast("Need at least 2 words to start a quiz.", "info");
      return;
    }

    const limit = isPremium ? s.length : Math.min(20, s.length);
    const qs = buildQuiz(shuffleArray(s).slice(0, limit), quizMode);
    setQuiz({ qs, ci: 0, ans: new Array(qs.length).fill(null) });
    setActiveSet(setName);
    setView("quiz");
  }

  function handleAnswer(idx: number) {
    if (!quiz || quiz.ans[quiz.ci] !== null) return;
    const a = [...quiz.ans]; a[quiz.ci] = idx;
    const q = quiz.qs[quiz.ci];
    const ok = idx === q.correctIndex;
    updateWordProgress(q.word, ok);
    
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
    if (!manualWord.trim() || !manualDef.trim()) {
      showToast("Word and definition are required.", "error");
      return;
    }
    
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
    refresh();
    showToast(`Added "${manualWord.trim()}" to ${manualSet.trim() || "Set 1"}`, "success");
  }

  function handleDeleteSet(setName: string) {
    if (confirm(`Are you sure you want to delete the entire set "${setName}" and all its words?`)) {
      deleteSet(setName);
      if (typeof window !== "undefined") {
        let cSets = [];
        const str = localStorage.getItem("practiceforge_custom_sets");
        if (str) cSets = JSON.parse(str);
        cSets = cSets.filter((c: string) => c !== setName);
        localStorage.setItem("practiceforge_custom_sets", JSON.stringify(cSets));
      }
      refresh();
      showToast(`Set "${setName}" deleted.`, "success");
    }
  }

  function handleRenameSet(oldName: string) {
    if (!newSetName.trim()) return;
    renameSet(oldName, newSetName.trim());
    setIsEditingSet(null);
    setNewSetName("");
    refresh();
    showToast(`Set renamed to "${newSetName.trim()}".`, "success");
  }

  function handleMoveWord(word: string, newSet: string) {
    updateWordSet(word, newSet);
    refresh();
    showToast(`Moved to ${newSet}`, "success");
  }

  if (!mounted) return null;

  return (
    <div className="section" style={{ paddingTop: "2.5rem" }}>
      <div className="container">
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {confetti && <Confetti />}

          {/* Header */}
          <div style={{ marginBottom: "2.5rem", textAlign: "center" }}>
            <h1 style={{ margin: "0 0 0.75rem", fontSize: "clamp(2.5rem, 6vw, 3.5rem)" }}>
              <span className="gradient-text">Vocabulary Master</span>
            </h1>
            <p style={{ margin: "0 auto", fontSize: "1.25rem", maxWidth: "700px", color: "var(--foreground-muted)" }}>
              Organize your learning with custom sets and track your progress to fluency.
            </p>
          </div>

          {/* Stats Section */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
            {[
              { l: "Total Vocabulary", v: stats.total, c: "var(--primary)", icon: "📚" },
              { l: "Mastered Words", v: stats.learned, c: "var(--mint)", icon: "🏆" },
              { l: "Needs Review", v: stats.needsReview, c: "var(--gold)", icon: "⏳" },
              { l: "Quiz Accuracy", v: `${stats.accuracy}%`, c: "var(--sky)", icon: "🎯" },
            ].map(s => (
              <div key={s.l} className="card" style={{ textAlign: "center", padding: "1.75rem 1rem", borderBottom: `4px solid ${s.c}`, position: "relative", overflow: "hidden" }}>
                <span style={{ position: "absolute", top: "0.5rem", right: "0.5rem", opacity: 0.15, fontSize: "1.5rem" }}>{s.icon}</span>
                <p style={{ margin: 0, fontSize: "2.25rem", fontWeight: 800, color: "var(--foreground)", fontFamily: "var(--font-display)", lineHeight: 1 }}>{s.v}</p>
                <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", color: "var(--foreground-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.05em" }}>{s.l}</p>
              </div>
            ))}
          </div>

          {/* Premium Upgrade CTA */}
          {!isPremium && (
            <div className="card-elevated animate-fadeIn" style={{ marginBottom: "2.5rem", background: "linear-gradient(135deg, var(--primary-glow) 0%, rgba(124, 58, 237, 0.05) 100%)", border: "1px solid var(--primary-light)", padding: "2rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "2rem", justifyContent: "space-between", borderRadius: "var(--radius-lg)" }}>
              <div style={{ flex: 1, minWidth: "250px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "1.5rem" }}>🚀</span>
                  <h3 style={{ margin: 0, fontSize: "1.25rem", color: "var(--primary)" }}>Unlock Unlimited Vocabulary</h3>
                </div>
                <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--foreground-muted)", lineHeight: 1.6 }}>
                  Free users are limited to practicing 20 words per set. Upgrade to Premium to unlock unlimited quizzes, advanced AI analytics, and guaranteed score acceleration.
                </p>
              </div>
              <button className="btn-primary" onClick={() => window.dispatchEvent(new Event("open-signup"))} style={{ padding: "0.875rem 1.5rem", whiteSpace: "nowrap", boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)", borderRadius: "999px" }}>
                Upgrade to Premium
              </button>
            </div>
          )}

          {/* ===== SETS VIEW ===== */}
          {view === "sets" && (
            <div className="animate-fadeIn">
              
              {/* Quick Add & Set Management Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
                
                {/* Add Word Card */}
                <div className="card" style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "12px", background: "var(--primary-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    </div>
                    <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Quick Add</h3>
                  </div>
                  <form onSubmit={handleAddManualWord} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      <div>
                        <label className="label">Word</label>
                        <input type="text" className="input-base" placeholder="Abundant" value={manualWord} onChange={(e) => setManualWord(e.target.value)} />
                      </div>
                      <div>
                        <label className="label">Set Name</label>
                        <input type="text" className="input-base" placeholder="Set 1" value={manualSet} onChange={(e) => setManualSet(e.target.value)} list="set-names-list" />
                        <datalist id="set-names-list">{setNames.map(n => <option key={n} value={n} />)}</datalist>
                      </div>
                    </div>
                    <div>
                      <label className="label">Definition</label>
                      <input type="text" className="input-base" placeholder="Existing in large quantities; plentiful." value={manualDef} onChange={(e) => setManualDef(e.target.value)} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: "0.5rem" }}>Add Word</button>
                  </form>
                </div>

                {/* Quiz Settings Card */}
                <div className="card" style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                    <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "12px", background: "var(--accent-glow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <h3 style={{ margin: 0, fontSize: "1.25rem" }}>Quiz Mode</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <p style={{ margin: 0, fontSize: "0.9375rem" }}>Choose how you want to be tested:</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                      {[
                        { id: "word-def", label: "Word → Def" },
                        { id: "def-word", label: "Def → Word" },
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => setQuizMode(m.id as QuizDirection)}
                          style={{
                            padding: "0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", fontWeight: 600,
                            background: quizMode === m.id ? "var(--primary)" : "var(--surface-2)",
                            border: `1px solid ${quizMode === m.id ? "var(--primary)" : "var(--border)"}`,
                            color: quizMode === m.id ? "#fff" : "var(--foreground-muted)",
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                    <div style={{ marginTop: "0.5rem" }}>
                      <button onClick={() => startQuiz(activeSet)} className="btn-secondary" style={{ width: "100%", borderColor: "var(--primary)", color: "var(--primary)" }} disabled={currentSet.length < 2}>
                        Start {activeSet} Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hard Words Alert */}
              {hardWords.length > 0 && (
                <div className="card" style={{ marginBottom: "2rem", background: "linear-gradient(to right, rgba(239, 68, 68, 0.08), transparent)", borderLeft: "4px solid var(--premium-red)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ color: "var(--premium-red)", fontSize: "1.5rem" }}>⚠️</div>
                      <div>
                        <h4 style={{ margin: 0, color: "var(--premium-red)" }}>Review Needed</h4>
                        <p style={{ margin: 0, fontSize: "0.875rem" }}>You have {hardWords.length} words that need extra attention.</p>
                      </div>
                    </div>
                    <button onClick={() => startQuiz("hard")} className="btn-primary" style={{ background: "var(--premium-red)", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }}>
                      Practice Hard Words
                    </button>
                  </div>
                </div>
              )}

              {/* Set Navigation Tabs */}
              <div style={{ display: "flex", gap: "0.75rem", overflowX: "auto", paddingBottom: "1rem", marginBottom: "1rem", scrollbarWidth: "none", alignItems: "center" }}>
                <button
                  onClick={() => {
                    const name = prompt("Enter new set name:");
                    if (name && name.trim()) {
                      const trimmed = name.trim();
                      if (!setNames.includes(trimmed)) {
                        let cSets: string[] = [];
                        if (typeof window !== "undefined") {
                          const str = localStorage.getItem("practiceforge_custom_sets");
                          if (str) cSets = JSON.parse(str);
                        }
                        cSets.push(trimmed);
                        localStorage.setItem("practiceforge_custom_sets", JSON.stringify(cSets));
                        setActiveSet(trimmed);
                        refresh();
                      } else {
                        showToast("Set already exists.", "info");
                      }
                    }
                  }}
                  style={{
                    padding: "0.625rem 1rem", borderRadius: "999px", whiteSpace: "nowrap",
                    fontSize: "0.9375rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                    background: "var(--primary-glow)", color: "var(--primary)",
                    border: "1px dashed var(--primary)", display: "flex", alignItems: "center", gap: "0.35rem"
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                  New Set
                </button>
                {setNames.map(name => (
                  <button
                    key={name}
                    onClick={() => setActiveSet(name)}
                    style={{
                      padding: "0.625rem 1.25rem", borderRadius: "999px", whiteSpace: "nowrap",
                      fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                      background: activeSet === name ? "var(--primary)" : "var(--surface)",
                      color: activeSet === name ? "#fff" : "var(--foreground-muted)",
                      border: `1px solid ${activeSet === name ? "var(--primary)" : "var(--border)"}`,
                      boxShadow: activeSet === name ? "var(--shadow-md)" : "none"
                    }}
                  >
                    {name} ({setsMap[name]?.length || 0})
                  </button>
                ))}
              </div>

              {/* Active Set Content */}
              <div className="card" style={{ padding: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    {isEditingSet === activeSet ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <input 
                          autoFocus
                          className="input-base" 
                          style={{ padding: "0.4rem 0.75rem", fontSize: "1.125rem" }} 
                          value={newSetName} 
                          onChange={e => setNewSetName(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && handleRenameSet(activeSet)}
                        />
                        <button className="btn-primary" style={{ padding: "0.4rem 0.75rem" }} onClick={() => handleRenameSet(activeSet)}>Save</button>
                        <button className="btn-secondary" style={{ padding: "0.4rem 0.75rem" }} onClick={() => setIsEditingSet(null)}>Cancel</button>
                      </div>
                    ) : (
                      <>
                        <h2 style={{ margin: 0 }}>{activeSet}</h2>
                        <button onClick={() => { setIsEditingSet(activeSet); setNewSetName(activeSet); }} style={{ background: "none", border: "none", color: "var(--foreground-faint)", cursor: "pointer" }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                      </>
                    )}
                  </div>
                  
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <button 
                      onClick={() => handleDeleteSet(activeSet)} 
                      className="btn-secondary" 
                      style={{ color: "var(--premium-red)", borderColor: "rgba(239, 68, 68, 0.2)", padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                    >
                      Delete Set
                    </button>
                    <button 
                      onClick={() => startQuiz(activeSet)} 
                      className="btn-primary" 
                      style={{ padding: "0.5rem 1.25rem", fontSize: "0.875rem" }}
                      disabled={currentSet.length < 2}
                    >
                      Quiz Now
                    </button>
                  </div>
                </div>

                {currentSet.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "3rem" }}>
                    <p style={{ color: "var(--foreground-muted)" }}>This set is empty. Add some words above!</p>
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "1rem" }}>
                    {currentSet.map(w => (
                      <div key={w.word} className="animate-fadeIn" style={{ display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.25rem", background: "var(--surface-2)", borderRadius: "var(--radius-md)", border: "1px solid transparent", transition: "all 0.2s" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                            <span style={{ fontWeight: 800, color: "var(--foreground)", fontSize: "1.125rem" }}>{w.word}</span>
                            {w.correctCount >= 3 && <span className="badge badge-accent">Mastered</span>}
                            {w.difficulty === "hard" && <span className="badge badge-coral">Hard</span>}
                          </div>
                          <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--foreground-muted)", lineHeight: 1.5 }}>{w.definition}</p>
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ margin: 0, fontSize: "0.75rem", fontWeight: 700, color: "var(--foreground-faint)", textTransform: "uppercase" }}>Progress</p>
                            <p style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "var(--primary)" }}>{w.correctCount}/{w.totalAttempts}</p>
                          </div>
                          
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <select 
                              onChange={(e) => handleMoveWord(w.word, e.target.value)} 
                              value={activeSet}
                              style={{ padding: "0.4rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", fontSize: "0.75rem", background: "var(--surface)" }}
                            >
                              {setNames.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <button onClick={() => { removeWord(w.word); refresh(); }} style={{ background: "none", border: "none", color: "var(--foreground-faint)", cursor: "pointer", padding: "0.5rem" }} title="Remove word">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== QUIZ VIEW ===== */}
          {view === "quiz" && quiz && (
            <div className="animate-fadeIn">
              <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--foreground-muted)" }}>Question {quiz.ci + 1} of {quiz.qs.length}</span>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--mint)" }}>✓ {quiz.ans.filter((a, i) => a === quiz.qs[i].correctIndex).length}</span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "var(--premium-red)" }}>✗ {quiz.ans.filter((a, i) => a !== null && a !== quiz.qs[i].correctIndex).length}</span>
                  </div>
                </div>
                <div className="quiz-progress-bar">
                  <div className="quiz-progress-fill" style={{ width: `${((quiz.ci + 1) / quiz.qs.length) * 100}%` }} />
                </div>
              </div>

              <div className="card" style={{ padding: "4rem 2rem", textAlign: "center", position: "relative" }}>
                <button 
                  onClick={() => setView("sets")}
                  style={{ position: "absolute", top: "1.5rem", left: "1.5rem", background: "none", border: "none", color: "var(--foreground-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 600 }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg> Exit Quiz
                </button>

                <p style={{ margin: "0 0 1rem", fontSize: "0.875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--primary)" }}>
                  {quiz.qs[quiz.ci].direction === "def-word" ? "Definition Match" : "Vocabulary Recall"}
                </p>
                <h2 style={{ margin: "0 auto 3rem", color: "var(--foreground)", fontSize: "2rem", maxWidth: "700px", lineHeight: 1.3, fontWeight: 800 }}>
                  {quiz.qs[quiz.ci].direction === "def-word" ? `"${quiz.qs[quiz.ci].definition}"` : quiz.qs[quiz.ci].word}
                </h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "650px", margin: "0 auto" }}>
                  {quiz.qs[quiz.ci].options.map((opt, idx) => {
                    const hasAnswered = quiz.ans[quiz.ci] !== null;
                    const sel = quiz.ans[quiz.ci] === idx;
                    const cor = idx === quiz.qs[quiz.ci].correctIndex;
                    let cls = "quiz-option";
                    if (hasAnswered) { if (cor) cls += " correct"; else if (sel && !cor) cls += " incorrect"; }

                    return (
                      <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={hasAnswered} style={{ padding: "1.25rem 1.5rem", fontSize: "1.125rem" }}>
                        <span className="quiz-option-letter" style={{ width: "2.5rem", height: "2.5rem" }}>{String.fromCharCode(65 + idx)}</span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {hasAnswered && cor && <span style={{ color: "var(--mint)" }}>✓</span>}
                        {hasAnswered && sel && !cor && <span style={{ color: "var(--premium-red)" }}>✗</span>}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "3rem", maxWidth: "650px", margin: "3rem auto 0" }}>
                  <button className="btn-secondary" onClick={prevQ} disabled={quiz.ci <= 0} style={{ width: "120px" }}>Previous</button>
                  <button className="btn-primary" onClick={nextQ} style={{ width: "120px" }} disabled={quiz.ans[quiz.ci] === null}>
                    {quiz.ci + 1 >= quiz.qs.length ? "Finish" : "Next"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ===== RESULTS VIEW ===== */}
          {view === "results" && quiz && (
            <div className="animate-scaleIn">
              <div className="card" style={{ textAlign: "center", padding: "5rem 2rem" }}>
                <div style={{ marginBottom: "2.5rem" }}>
                  <div className="score-badge" style={{ transform: "scale(1.1)" }}>
                    <span className="score-value">{getScore().correct} / {getScore().total}</span>
                    <span className="score-label">Correct Answers</span>
                  </div>
                </div>
                <h2 style={{ margin: "0 0 1rem", fontSize: "2.5rem" }}>
                  {getScore().correct === getScore().total ? "Masterful! 🌟" : "Quiz Finished"}
                </h2>
                <p style={{ margin: "0 0 3rem", fontSize: "1.25rem", color: "var(--foreground-muted)" }}>
                  {getScore().correct === getScore().total
                    ? "Perfect score! You've mastered this set."
                    : `You got ${getScore().correct} correct out of ${getScore().total}. Keep practicing!`
                  }
                </p>

                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                  <button className="btn-primary" onClick={() => startQuiz(activeSet)} style={{ padding: "1rem 2.5rem" }}>Retry Set</button>
                  <button className="btn-secondary" onClick={() => { setView("sets"); refresh(); }} style={{ padding: "1rem 2.5rem" }}>Return Home</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
