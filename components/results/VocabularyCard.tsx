"use client";

import { useState } from "react";
import type { VocabularyItem } from "@/types";
import { saveWords } from "@/lib/wordList";

interface VocabularyCardProps {
  vocabulary: VocabularyItem[];
}

const DIFFICULTY_COLORS: Record<string, string> = {
  B2: "badge-accent",
  C1: "badge-primary",
  C2: "badge-rose",
};

export default function VocabularyCard({ vocabulary }: VocabularyCardProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  function handleSaveWord(item: VocabularyItem) {
    const count = saveWords([{
      word: item.word,
      definition: item.definition,
      contextSentence: item.exampleSentence,
      partOfSpeech: item.partOfSpeech,
      difficulty: item.difficulty,
    }]);
    setSavedWords(prev => new Set([...prev, item.word]));
    if (count > 0) {
      setSaveMessage(`"${item.word}" saved to your word list!`);
    } else {
      setSaveMessage(`"${item.word}" is already in your word list.`);
    }
    setTimeout(() => setSaveMessage(null), 2000);
  }

  function handleSaveAll() {
    const words = vocabulary.map(v => ({
      word: v.word,
      definition: v.definition,
      contextSentence: v.exampleSentence,
      partOfSpeech: v.partOfSpeech,
      difficulty: v.difficulty,
    }));
    const count = saveWords(words);
    setSavedWords(new Set(vocabulary.map(v => v.word)));
    setSaveMessage(`${count} new word(s) saved to your word list!`);
    setTimeout(() => setSaveMessage(null), 3000);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", background: "var(--surface-2)", padding: "1.25rem", borderRadius: "var(--radius-md)" }}>
        <div>
          <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.25rem", fontWeight: 700, color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: "var(--primary)" }}>📚</span> Academic Vocabulary
          </h3>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--foreground-muted)" }}>
            {vocabulary.length} high-value words for exam success. Click any word to see full details.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          id="save-all-vocab"
          className="btn-primary"
          style={{ fontSize: "0.875rem", padding: "0.75rem 1.25rem", whiteSpace: "nowrap", borderRadius: "9999px" }}
        >
           Save All to Word List
        </button>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div
          className="animate-fadeInFast"
          style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid var(--mint)",
            borderRadius: "var(--radius-md)",
            padding: "1rem",
            fontSize: "0.9375rem",
            color: "var(--mint-dark)",
            fontWeight: 500,
            display: "flex", alignItems: "center", gap: "0.5rem"
          }}
        >
           <span>✓</span> {saveMessage}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1rem",
        }}
      >
        {vocabulary.map((item) => {
          const isOpen = expanded === item.word;
          const isSaved = savedWords.has(item.word);

          return (
            <div
              key={item.word}
              className="card"
              id={`vocab-${item.word.replace(/\s+/g, "-")}`}
              style={{ cursor: "pointer", transition: "all 0.3s ease", padding: "1.25rem", border: isOpen ? "1px solid var(--primary-light)" : "1px solid var(--border)", boxShadow: isOpen ? "var(--shadow-md)" : "var(--shadow-sm)" }}
            >
              {/* Word header */}
              <div
                onClick={() => setExpanded(isOpen ? null : item.word)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}
              >
                <div>
                  <p style={{ margin: "0 0 0.25rem", fontSize: "1.125rem", fontWeight: 700, color: "var(--foreground)" }}>
                    {item.word}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.8125rem", fontStyle: "italic", color: "var(--primary)" }}>
                    {item.partOfSpeech}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexShrink: 0 }}>
                  <span className={`badge ${DIFFICULTY_COLORS[item.difficulty] ?? "badge"}`} style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem" }}>
                    {item.difficulty}
                  </span>
                  <span style={{ color: "var(--foreground-muted)", fontSize: "0.875rem", background: "var(--surface-2)", width: "1.5rem", height: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Short definition */}
              <p
                onClick={() => setExpanded(isOpen ? null : item.word)}
                style={{
                  margin: 0,
                  fontSize: "0.9375rem",
                  lineHeight: 1.6,
                  color: "var(--foreground-muted)",
                  overflow: isOpen ? "visible" : "hidden",
                  display: isOpen ? "block" : "-webkit-box",
                  WebkitLineClamp: isOpen ? undefined : 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.definition}
              </p>

              {/* Expanded content */}
              {isOpen && (
                <div
                  className="animate-fadeInFast"
                  style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}
                >

                  {/* Example sentence */}
                  <div style={{ background: "rgba(124, 58, 237, 0.05)", padding: "1rem", borderRadius: "var(--radius-sm)", borderLeft: "3px solid var(--primary)" }}>
                    <p style={{ margin: "0 0 0.375rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--primary)" }}>
                      Example
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.9375rem",
                        lineHeight: 1.6,
                        color: "var(--foreground)",
                        fontStyle: "italic",
                      }}
                    >
                      &ldquo;{item.exampleSentence}&rdquo;
                    </p>
                  </div>

                  {/* Collocations */}
                  {item.collocations && item.collocations.length > 0 && (
                    <div>
                      <p style={{ margin: "0 0 0.5rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground-muted)" }}>
                        Key Collocations
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {item.collocations.map((col) => (
                          <span
                            key={col}
                            style={{
                              background: "var(--surface-2)",
                              border: "1px solid var(--border)",
                              borderRadius: "9999px",
                              padding: "0.25rem 0.75rem",
                              fontSize: "0.8125rem",
                              color: "var(--foreground-muted)",
                            }}
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Save button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSaveWord(item); }}
                    className={isSaved ? "btn-secondary" : "btn-primary"}
                    style={{ fontSize: "0.875rem", padding: "0.5rem 1rem", alignSelf: "flex-start", borderRadius: "9999px", marginTop: "0.5rem" }}
                    disabled={isSaved}
                  >
                    {isSaved ? "✓ Saved" : "+ Save to Word List"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: "1rem", background: "var(--surface-2)", borderRadius: "var(--radius-sm)", textAlign: "center", marginTop: "1rem" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
           💡 Tip: Save words to your list, then practice them in the <a href="/vocabulary" style={{ color: "var(--primary)", fontWeight: 600 }}>Vocabulary Quiz</a>!
        </p>
      </div>
    </div>
  );
}
