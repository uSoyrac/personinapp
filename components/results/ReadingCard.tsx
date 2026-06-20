"use client";

import { useState } from "react";
import type { ReadingQuestion, ExamType } from "@/types";
import { addXP } from "@/lib/gamification";
import Confetti from "@/components/Confetti";
import { saveQuestion } from "@/lib/questionBank";

interface ReadingCardProps {
  questions: ReadingQuestion[];
  examType: ExamType;
}

export default function ReadingCard({ questions, examType }: ReadingCardProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [xpPopups, setXpPopups] = useState<{ id: string; amount: number; x: number }[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function handleSave(q: ReadingQuestion) {
    const res = saveQuestion(q);
    setToast(res.message);
    setTimeout(() => setToast(null), 3000);
  }

  function selectAnswer(qId: string, idx: number, correctIdx: number) {
    if (answers[qId] !== undefined) return; // Already answered
    setAnswers(prev => ({ ...prev, [qId]: idx }));

    const isCorrect = idx === correctIdx;
    const xp = isCorrect ? 10 : 2;
    addXP(xp);

    // XP popup — qId is unique per popup since a question can only be answered once
    const popupId = qId;
    setXpPopups(prev => [...prev, { id: popupId, amount: xp, x: Math.random() * 60 + 20 }]);
    setTimeout(() => setXpPopups(prev => prev.filter(p => p.id !== popupId)), 1200);

    // Confetti on correct
    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }

  const answered = Object.keys(answers).length;
  const correctCount = questions.filter(q => answers[q.id] === q.correctIndex).length;
  const allDone = answered === questions.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative" }}>
      {toast && (
        <div className="animate-fadeInFast" style={{ position: "fixed", top: "2rem", right: "2rem", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", color: "var(--foreground)", padding: "1rem 1.5rem", borderRadius: "var(--radius-md)", zIndex: 9999, fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--primary)" }}>✓</span> {toast}
        </div>
      )}
      {showConfetti && <Confetti />}

      {/* XP popups */}
      {xpPopups.map(p => (
        <div key={p.id} className="animate-xpFloat" style={{
          position: "fixed", top: "50%", left: `${p.x}%`, zIndex: 9998,
          fontSize: "1.5rem", fontWeight: 800, color: p.amount >= 10 ? "var(--primary)" : "var(--foreground-muted)",
          textShadow: "0 2px 10px rgba(0,0,0,0.1)",
          pointerEvents: "none",
        }}>
          +{p.amount} XP
        </div>
      ))}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem", background: "var(--surface-2)", padding: "1rem 1.5rem", borderRadius: "var(--radius-md)" }}>
        <div>
          <h3 style={{ color: "var(--foreground)", margin: 0, fontWeight: 700, fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--primary)" }}>📖</span> Reading Comprehension
          </h3>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
            {examType === "IELTS_ACADEMIC" ? "IELTS Academic" : "TOEFL iBT"} · Select an answer to get instant feedback
          </p>
        </div>
        {answered > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span className="badge" style={{ background: "var(--mint)", color: "#fff", fontWeight: 700 }}>{correctCount} Correct</span>
            <span className="badge" style={{ background: "var(--surface)", color: "var(--foreground-muted)" }}>{answered}/{questions.length} Total</span>
          </div>
        )}
      </div>

      {/* Questions */}
      {questions.map((q, i) => {
        const selected = answers[q.id];
        const isAnswered = selected !== undefined;
        const isCorrect = selected === q.correctIndex;

        return (
          <div key={q.id} className={`card ${isAnswered && isCorrect ? "animate-scaleIn" : ""}`} style={{ position: "relative", padding: 0, overflow: "hidden" }}>
            
            {/* Top Action Bar */}
            <div style={{ padding: "1rem 1.5rem", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{
                  width: "2rem", height: "2rem",
                  background: isAnswered ? (isCorrect ? "var(--mint)" : "var(--rose)") : "var(--surface)",
                  color: isAnswered ? "#fff" : "var(--primary)",
                  border: isAnswered ? "none" : "1px solid var(--primary-light)",
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.875rem", fontWeight: 700,
                  transition: "all 0.3s ease"
                }}>
                  {isAnswered ? (isCorrect ? "✓" : "✗") : i + 1}
                </span>
                <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Question {i + 1}</span>
              </div>
              
              <button 
                onClick={() => handleSave(q)}
                className="btn-secondary"
                style={{ padding: "0.375rem 0.75rem", fontSize: "0.75rem", borderRadius: "9999px" }}
              >
                + Add to Bank
              </button>
            </div>

            {/* Question Text */}
            <div style={{ padding: "1.5rem" }}>
              <p style={{ margin: 0, color: "var(--foreground)", fontSize: "1.0625rem", lineHeight: 1.6, fontWeight: 500 }}>
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div style={{ padding: "0 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {q.options.map((option, idx) => {
                
                // Determine styling based on state
                let bg = "var(--surface)";
                let borderColor = "var(--border)";
                let textColor = "var(--foreground)";
                let icon = "";

                if (isAnswered) {
                  if (idx === q.correctIndex) {
                    bg = "rgba(16, 185, 129, 0.1)"; // soft mint background
                    borderColor = "var(--mint)";
                    textColor = "var(--mint-dark)";
                    icon = "✓";
                  } else if (idx === selected && !isCorrect) {
                    bg = "rgba(244, 63, 94, 0.1)"; // soft rose background
                    borderColor = "var(--rose)";
                    textColor = "var(--rose)";
                    icon = "✗";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => selectAnswer(q.id, idx, q.correctIndex)}
                    disabled={isAnswered}
                    id={`option-${q.id}-${idx}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      width: "100%",
                      textAlign: "left",
                      padding: "1rem 1.25rem",
                      background: bg,
                      border: `2px solid ${borderColor}`,
                      borderRadius: "var(--radius-md)",
                      color: textColor,
                      fontSize: "1rem",
                      cursor: isAnswered ? "default" : "pointer",
                      transition: "all 0.2s ease",
                      transform: isAnswered ? "none" : "translateY(0)",
                      boxShadow: isAnswered ? "none" : "var(--shadow-sm)",
                      opacity: isAnswered && idx !== q.correctIndex && idx !== selected ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isAnswered) {
                        e.currentTarget.style.borderColor = "var(--primary-light)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "var(--shadow-md)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isAnswered) {
                        e.currentTarget.style.borderColor = borderColor;
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                      }
                    }}
                  >
                    <div style={{
                      width: "1.5rem", height: "1.5rem", borderRadius: "50%", 
                      border: `1.5px solid ${isAnswered && (idx === q.correctIndex || idx === selected) ? borderColor : "var(--border)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: isAnswered && (idx === q.correctIndex || idx === selected) ? borderColor : "transparent",
                      color: "#fff", fontSize: "0.75rem", fontWeight: 800, flexShrink: 0
                    }}>
                      {icon}
                    </div>
                    <span style={{ lineHeight: 1.5 }}>{option}</span>
                  </button>
                );
              })}

              {/* Instant feedback box */}
              {isAnswered && (
                <div className="animate-fadeInFast" style={{
                  background: isCorrect ? "rgba(16, 185, 129, 0.05)" : "rgba(244, 63, 94, 0.05)",
                  border: `1px solid ${isCorrect ? "rgba(16, 185, 129, 0.2)" : "rgba(244, 63, 94, 0.2)"}`,
                  borderLeft: `4px solid ${isCorrect ? "var(--mint)" : "var(--rose)"}`,
                  borderRadius: "var(--radius-sm)", 
                  padding: "1.25rem", 
                  marginTop: "0.5rem",
                }}>
                  <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", fontWeight: 800,
                    color: isCorrect ? "var(--mint-dark)" : "var(--rose)",
                    textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {isCorrect ? "✨ Correct! +10 XP" : "💡 Incorrect (+2 XP)"}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--foreground)", fontWeight: 500 }}>
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Final score */}
      {allDone && (
        <div className="card-elevated animate-scaleIn" style={{
          background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)",
          border: `2px solid ${correctCount === questions.length ? "var(--mint)" : "var(--primary-light)"}`,
          textAlign: "center",
          padding: "3rem 2rem",
          marginTop: "2rem"
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            {correctCount === questions.length ? "🏆" : correctCount >= questions.length * 0.7 ? "🌟" : "💪"}
          </div>
          <p style={{ margin: "0.5rem 0 0", fontSize: "2rem", fontWeight: 800, color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
            {correctCount} / {questions.length} Correct
          </p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "1.125rem", color: "var(--foreground-muted)" }}>
            {correctCount === questions.length ? "Perfect score! Outstanding work." :
              correctCount >= questions.length * 0.7 ? "Good effort! Review the explanations to master the rest." :
              "Keep practising — read explanations carefully. You've got this!"}
          </p>
        </div>
      )}
    </div>
  );
}
