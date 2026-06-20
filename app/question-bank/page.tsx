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
                  <div
                    key={q.id}
                    className={`card ${isAnswered && isCorrect ? "animate-scaleIn" : ""}`}
                    style={{ position: "relative", padding: 0, overflow: "hidden" }}
                  >
                    {/* Header bar: status + delete */}
                    <div style={{ padding: "1rem 1.25rem", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
                        <span style={{
                          width: "2rem", height: "2rem", flexShrink: 0,
                          background: isAnswered ? (isCorrect ? "var(--mint)" : "var(--rose)") : "var(--surface)",
                          color: isAnswered ? "#fff" : "var(--primary)",
                          border: isAnswered ? "none" : "1px solid var(--primary-light)",
                          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.875rem", fontWeight: 700, transition: "all 0.3s ease",
                        }}>
                          {isAnswered ? (isCorrect ? "✓" : "✗") : i + 1}
                        </span>
                        <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>
                          Question {i + 1}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(q.id)}
                        className="btn-secondary"
                        title="Delete Question"
                        style={{ padding: "0.375rem 0.875rem", fontSize: "0.75rem", borderRadius: "9999px", color: "var(--rose)", borderColor: "rgba(244, 63, 94, 0.35)", flexShrink: 0 }}
                      >
                        Delete
                      </button>
                    </div>

                    {/* Question text */}
                    <div style={{ padding: "1.5rem 1.5rem 0.5rem" }}>
                      <p style={{ margin: 0, color: "var(--foreground)", fontSize: "1.0625rem", lineHeight: 1.6, fontWeight: 600 }}>
                        {q.question}
                      </p>
                    </div>

                    {/* Options */}
                    <div style={{ padding: "1rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {q.options.map((option, idx) => {
                        let bg = "var(--surface)";
                        let borderColor = "var(--border)";
                        let badgeBg = "var(--surface-2)";
                        let badgeColor = "var(--foreground-muted)";

                        if (isAnswered) {
                          if (idx === q.correctIndex) {
                            bg = "rgba(16, 185, 129, 0.1)";
                            borderColor = "var(--mint)";
                            badgeBg = "var(--mint)";
                            badgeColor = "#fff";
                          } else if (idx === selected) {
                            bg = "rgba(244, 63, 94, 0.1)";
                            borderColor = "var(--rose)";
                            badgeBg = "var(--rose)";
                            badgeColor = "#fff";
                          }
                        }

                        const dimmed = isAnswered && idx !== q.correctIndex && idx !== selected;

                        return (
                          <button
                            key={idx}
                            onClick={() => selectAnswer(q.id, idx, q.correctIndex)}
                            disabled={isAnswered}
                            style={{
                              display: "flex", alignItems: "center", gap: "0.875rem",
                              width: "100%", textAlign: "left",
                              padding: "0.875rem 1.125rem",
                              background: bg, border: `2px solid ${borderColor}`,
                              borderRadius: "var(--radius-md)", color: "var(--foreground)",
                              fontSize: "1rem", fontWeight: 500,
                              cursor: isAnswered ? "default" : "pointer",
                              transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                              opacity: dimmed ? 0.55 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!isAnswered) {
                                e.currentTarget.style.borderColor = "var(--primary)";
                                e.currentTarget.style.transform = "translate(-2px, -2px)";
                                e.currentTarget.style.boxShadow = "var(--shadow-md)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!isAnswered) {
                                e.currentTarget.style.borderColor = borderColor;
                                e.currentTarget.style.transform = "translate(0, 0)";
                                e.currentTarget.style.boxShadow = "none";
                              }
                            }}
                          >
                            <span style={{
                              minWidth: "2rem", height: "2rem", flexShrink: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              borderRadius: "50%", background: badgeBg, color: badgeColor,
                              fontSize: "0.8125rem", fontWeight: 700, transition: "all 0.2s ease",
                            }}>
                              {isAnswered && idx === q.correctIndex ? "✓" : (isAnswered && idx === selected ? "✗" : String.fromCharCode(65 + idx))}
                            </span>
                            <span style={{ flex: 1, minWidth: 0 }}>{option}</span>
                          </button>
                        );
                      })}

                      {/* Explanation */}
                      {isAnswered && (
                        <div className="animate-fadeInFast" style={{
                          background: isCorrect ? "rgba(16, 185, 129, 0.08)" : "rgba(244, 63, 94, 0.08)",
                          border: `2px solid ${isCorrect ? "var(--mint)" : "var(--rose)"}`,
                          borderRadius: "var(--radius-md)", padding: "1rem 1.125rem", marginTop: "0.25rem",
                        }}>
                          <p style={{ margin: "0 0 0.375rem", fontSize: "0.8125rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", color: isCorrect ? "var(--mint-dark)" : "var(--rose)" }}>
                            {isCorrect ? "✓ Correct · +10 XP" : "✗ Incorrect · +2 XP"}
                          </p>
                          <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--foreground)" }}>
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
