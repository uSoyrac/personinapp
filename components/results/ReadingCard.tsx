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

    // XP popup
    const popupId = `${qId}-${Date.now()}`;
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", position: "relative" }}>
      {toast && (
        <div style={{ position: "fixed", top: "1rem", right: "1rem", background: "var(--brutal-yellow)", border: "2px solid #000", boxShadow: "4px 4px 0px #000", color: "#000", padding: "1rem", zIndex: 9999, fontWeight: 700 }}>
          {toast}
        </div>
      )}
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

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h3 style={{ color: "var(--foreground)", margin: 0, fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.125rem" }}>
            Reading Comprehension
          </h3>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
            {examType === "IELTS_ACADEMIC" ? "IELTS Academic" : "TOEFL iBT"} · Click to answer instantly
          </p>
        </div>
        {answered > 0 && (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <span className="badge badge-accent">{correctCount} </span>
            <span className="badge badge-gray">{answered}/{questions.length}</span>
          </div>
        )}
      </div>

      {/* Questions */}
      {questions.map((q, i) => {
        const selected = answers[q.id];
        const isAnswered = selected !== undefined;
        const isCorrect = selected === q.correctIndex;

        return (
          <div key={q.id} className={`question-card ${isAnswered ? (isCorrect ? "animate-correctPulse" : "animate-wrongShake") : ""}`} style={{ position: "relative" }}>
            <button 
              onClick={() => handleSave(q)}
              style={{ position: "absolute", top: "0.5rem", right: "0.5rem", background: "var(--brutal-yellow)", border: "2px solid #000", padding: "0.25rem 0.5rem", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer", zIndex: 10 }}
            >
              ➕ Bankama Ekle
            </button>
            <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", display: "flex", gap: "0.75rem", alignItems: "flex-start", paddingRight: "7rem" }}>
              <span style={{
                minWidth: "1.75rem", height: "1.75rem",
                background: isAnswered ? (isCorrect ? "var(--mint)" : "var(--rose)") : "var(--lavender)",
                border: `2px solid #000`,
                boxShadow: "2px 2px 0px #000",
                borderRadius: "0", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.875rem", fontWeight: 800,
                color: "#000",
              }}>
                {isAnswered ? (isCorrect ? "" : "") : i + 1}
              </span>
              <p style={{ margin: 0, color: "var(--foreground)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
                {q.question}
              </p>
            </div>

            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
                    id={`option-${q.id}-${idx}`}
                  >
                    {option}
                  </button>
                );
              })}

              {/* Instant feedback */}
              {isAnswered && (
                <div className="animate-fadeInFast" style={{
                  background: isCorrect ? "var(--mint)" : "var(--rose)",
                  border: `3px solid #000`,
                  boxShadow: "4px 4px 0px #000",
                  borderRadius: "var(--radius-md)", padding: "0.875rem 1rem", marginTop: "0.5rem",
                }}>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "0.875rem", fontWeight: 800,
                    color: "#000",
                    textTransform: "uppercase", letterSpacing: "0.05em" }}>
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

      {/* Final score */}
      {allDone && (
        <div className="card-elevated animate-scaleIn" style={{
          background: correctCount === questions.length ? "var(--mint)" : "var(--lavender)",
          border: `3px solid #000`,
          boxShadow: "6px 6px 0px #000",
          textAlign: "center",
        }}>
          <p style={{ margin: 0, fontSize: "2rem" }}>
            {correctCount === questions.length ? "" : correctCount >= questions.length * 0.7 ? "" : ""}
          </p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)" }}>
            {correctCount} / {questions.length} correct
          </p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
            {correctCount === questions.length ? "Perfect score! Outstanding work." :
              correctCount >= questions.length * 0.7 ? "Good effort! Review the explanations." :
              "Keep practising — read explanations carefully."}
          </p>
        </div>
      )}
    </div>
  );
}
