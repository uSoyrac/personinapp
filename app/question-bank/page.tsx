"use client";

import { useState, useEffect } from "react";
import type { SavedQuestion } from "@/types";
import { getQuestionBank, deleteQuestion } from "@/lib/questionBank";
import { addXP } from "@/lib/gamification";
import Confetti from "@/components/Confetti";
import Link from "next/link";

export default function QuestionBankPage() {
  const [questions, setQuestions] = useState<SavedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [xpPopups, setXpPopups] = useState<{ id: string; amount: number; x: number }[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads persisted questions from localStorage on mount; must run client-side to stay hydration-safe
    setQuestions(getQuestionBank());
  }, []);

  function selectAnswer(qId: string, idx: number, correctIdx: number) {
    if (answers[qId] !== undefined) return; 
    setAnswers(prev => ({ ...prev, [qId]: idx }));

    const isCorrect = idx === correctIdx;
    const xp = isCorrect ? 10 : 2;
    addXP(xp);

    // qId is unique per popup since a question can only be answered once
    const popupId = qId;
    setXpPopups(prev => [...prev, { id: popupId, amount: xp, x: Math.random() * 60 + 20 }]);
    setTimeout(() => setXpPopups(prev => prev.filter(p => p.id !== popupId)), 1200);

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }

  function handleDelete(id: string) {
    deleteQuestion(id);
    setQuestions(getQuestionBank());
  }

  return (
    <div className="section" style={{ paddingTop: "3rem" }}>
      {showConfetti && <Confetti />}
      
      {/* XP popups */}
      {xpPopups.map(p => (
        <div key={p.id} className="animate-xpFloat" style={{
          position: "fixed", top: "50%", left: `${p.x}%`, zIndex: 9998,
          fontSize: "1.25rem", fontWeight: 800, color: p.amount >= 10 ? "var(--gold)" : "var(--foreground-muted)",
          pointerEvents: "none",
        }}>
          +{p.amount} XP
        </div>
      ))}

      <div className="container">
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div className="badge badge-primary" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
                Soru Bankası
              </div>
              <h1 style={{ margin: "0 0 0.5rem", color: "var(--foreground)", fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
                Question Bank
              </h1>
              <p style={{ margin: 0, fontSize: "1.0625rem" }}>
                Your personal collection of saved reading questions.
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0 0 0.25rem", fontWeight: 800 }}>{questions.length} / 500</p>
              <div style={{ width: "150px", height: "8px", background: "var(--surface)", border: "2px solid #000" }}>
                <div style={{ height: "100%", background: "var(--brutal-yellow)", width: `${(questions.length / 500) * 100}%` }} />
              </div>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
              <h3 style={{ margin: "0 0 1rem", fontSize: "1.5rem" }}>Bankanız boş.</h3>
              <p style={{ margin: "0 0 2rem", color: "var(--foreground-muted)" }}>
                Generate practice tests and click &quot;➕ Bankama Ekle&quot; to save questions here.
              </p>
              <Link href="/practice" className="btn-primary" style={{ display: "inline-block" }}>Go to Practice</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {questions.map((q, i) => {
                const selected = answers[q.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === q.correctIndex;

                return (
                  <div key={q.id} className={`question-card ${isAnswered ? (isCorrect ? "animate-correctPulse" : "animate-wrongShake") : ""}`} style={{ position: "relative" }}>
                    <button 
                      onClick={() => handleDelete(q.id)}
                      style={{ position: "absolute", top: "-0.5rem", right: "-0.5rem", background: "var(--rose)", border: "2px solid #000", padding: "0.25rem 0.5rem", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer", zIndex: 10, borderRadius: "50%", width: "30px", height: "30px" }}
                      title="Delete Question"
                    >
                      X
                    </button>
                    
                    <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                      <p style={{ margin: 0, color: "var(--foreground)", fontSize: "1.0625rem", lineHeight: 1.5, fontWeight: 700 }}>
                        <span style={{ color: "var(--primary)", marginRight: "0.5rem" }}>{i + 1}.</span>
                        {q.question}
                      </p>
                    </div>

                    <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {q.options.map((option, idx) => {
                        let cls = "option-btn";
                        if (isAnswered) {
                          if (idx === q.correctIndex) cls += " correct";
                          else if (idx === selected && !isCorrect) cls += " incorrect";
                        }

                        return (
                          <button
                            key={idx}
                            className={cls}
                            onClick={() => selectAnswer(q.id, idx, q.correctIndex)}
                            disabled={isAnswered}
                          >
                            {option}
                          </button>
                        );
                      })}

                      {isAnswered && (
                        <div className="animate-fadeInFast" style={{
                          background: isCorrect ? "var(--mint)" : "var(--rose)",
                          border: `3px solid #000`,
                          boxShadow: "4px 4px 0px #000",
                          borderRadius: "0", padding: "1rem", marginTop: "1rem",
                        }}>
                          <p style={{ margin: "0 0 0.25rem", fontSize: "0.875rem", fontWeight: 800, color: "#000", textTransform: "uppercase" }}>
                            {isCorrect ? " Correct! +10 XP" : " Incorrect +2 XP"}
                          </p>
                          <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6, color: "#000", fontWeight: 600 }}>
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
