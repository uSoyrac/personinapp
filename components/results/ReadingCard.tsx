"use client";

import { useState } from "react";
import type { ReadingQuestion } from "@/types";

interface ReadingCardProps {
  questions: ReadingQuestion[];
  examType: "IELTS_ACADEMIC" | "TOEFL_IBT";
}

export default function ReadingCard({ questions, examType }: ReadingCardProps) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  function selectAnswer(qId: string, idx: number) {
    setAnswers((prev) => ({ ...prev, [qId]: idx }));
  }

  function revealAnswer(qId: string) {
    setRevealed((prev) => ({ ...prev, [qId]: true }));
  }

  const correctCount = questions.filter(
    (q) => answers[q.id] === q.correctIndex
  ).length;
  const answered = Object.keys(answers).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h3 style={{ color: "var(--foreground)", margin: 0, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "1rem" }}>
            Reading Comprehension
          </h3>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
            {examType === "IELTS_ACADEMIC" ? "IELTS Academic" : "TOEFL iBT"} exam-style questions
          </p>
        </div>
        {answered > 0 && (
          <div className="badge badge-primary">
            {correctCount}/{answered} correct
          </div>
        )}
      </div>

      {/* Questions */}
      {questions.map((q, i) => {
        const selected = answers[q.id];
        const isRevealed = revealed[q.id];
        const isCorrect = selected === q.correctIndex;

        return (
          <div key={q.id} className="question-card">
            {/* Question header */}
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                gap: "0.75rem",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  minWidth: "1.75rem",
                  height: "1.75rem",
                  background: "var(--primary-glow)",
                  border: "1px solid var(--primary)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "var(--primary-light)",
                }}
              >
                {i + 1}
              </span>
              <p style={{ margin: 0, color: "var(--foreground)", fontSize: "0.9375rem", lineHeight: 1.5 }}>
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {q.options.map((option, idx) => {
                let optionClass = "option-btn";
                if (isRevealed) {
                  if (idx === q.correctIndex) optionClass += " correct";
                  else if (idx === selected && !isCorrect) optionClass += " incorrect";
                } else if (selected === idx) {
                  optionClass += " correct";
                }

                return (
                  <button
                    key={idx}
                    className={optionClass}
                    onClick={() => !isRevealed && selectAnswer(q.id, idx)}
                    id={`option-${q.id}-${idx}`}
                  >
                    {option}
                  </button>
                );
              })}

              {/* Actions */}
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                {selected !== null && selected !== undefined && !isRevealed && (
                  <button
                    className="btn-secondary"
                    style={{ fontSize: "0.875rem", padding: "0.5rem 1rem" }}
                    onClick={() => revealAnswer(q.id)}
                  >
                    Check Answer
                  </button>
                )}
                {isRevealed && (
                  <div
                    style={{
                      background: "var(--surface)",
                      border: `1px solid ${isCorrect ? "var(--accent)" : "var(--rose)"}`,
                      borderRadius: "var(--radius-md)",
                      padding: "0.875rem 1rem",
                      width: "100%",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 0.375rem",
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: isCorrect ? "var(--accent-light)" : "#fb7185",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
                    </p>
                    <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.6 }}>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Score summary */}
      {answered === questions.length && (
        <div
          className="card-elevated animate-fadeIn"
          style={{
            background: correctCount === questions.length
              ? "var(--accent-glow)"
              : "var(--primary-glow)",
            border: `1px solid ${correctCount === questions.length ? "var(--accent)" : "var(--primary)"}`,
            textAlign: "center",
          }}
        >
          <p style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
            You scored {correctCount} / {questions.length}
          </p>
          <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem" }}>
            {correctCount === questions.length
              ? "🎉 Perfect score! Outstanding work."
              : correctCount >= questions.length * 0.7
              ? "Good effort! Review the explanations for any missed questions."
              : "Keep practising — read the explanations carefully to improve."}
          </p>
        </div>
      )}
    </div>
  );
}
