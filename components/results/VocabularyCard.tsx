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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h3 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>
            Academic Vocabulary
          </h3>
          <p style={{ margin: 0, fontSize: "0.875rem" }}>
            {vocabulary.length} high-value words for exam success. Click any word to see full details.
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          id="save-all-vocab"
          className="btn-primary"
          style={{ fontSize: "0.8125rem", padding: "0.5rem 1rem", whiteSpace: "nowrap" }}
        >
           Save All to Word List
        </button>
      </div>

      {/* Save message */}
      {saveMessage && (
        <div
          className="animate-fadeInFast"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.3)",
            borderRadius: "var(--radius-md)",
            padding: "0.625rem 1rem",
            fontSize: "0.875rem",
            color: "var(--accent-light)",
          }}
        >
           {saveMessage}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "0.75rem",
        }}
      >
        {vocabulary.map((item) => {
          const isOpen = expanded === item.word;
          const isSaved = savedWords.has(item.word);

          return (
            <div
              key={item.word}
              className="vocab-card"
              id={`vocab-${item.word.replace(/\s+/g, "-")}`}
              style={{ cursor: "pointer" }}
            >
              {/* Word header */}
              <div
                onClick={() => setExpanded(isOpen ? null : item.word)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}
              >
                <div>
                  <p style={{ margin: "0 0 0.125rem", fontSize: "1rem", fontWeight: 700, color: "var(--foreground)" }}>
                    {item.word}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.75rem", fontStyle: "italic" }}>
                    {item.partOfSpeech}
                  </p>
                </div>
                <div style={{ display: "flex", gap: "0.375rem", alignItems: "center", flexShrink: 0 }}>
                  <span className={`badge ${DIFFICULTY_COLORS[item.difficulty] ?? "badge-gray"}`}>
                    {item.difficulty}
                  </span>
                  <span style={{ color: "var(--foreground-faint)", fontSize: "0.875rem" }}>
                    {isOpen ? "▲" : "▼"}
                  </span>
                </div>
              </div>

              {/* Short definition */}
              <p
                onClick={() => setExpanded(isOpen ? null : item.word)}
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
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
                  style={{ marginTop: "0.875rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
                >
                  <hr className="divider" style={{ margin: "0.25rem 0" }} />

                  {/* Example sentence */}
                  <div>
                    <p style={{ margin: "0 0 0.25rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Example
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.875rem",
                        lineHeight: 1.6,
                        color: "var(--foreground)",
                        fontStyle: "italic",
                        borderLeft: "2px solid var(--primary)",
                        paddingLeft: "0.75rem",
                      }}
                    >
                      &ldquo;{item.exampleSentence}&rdquo;
                    </p>
                  </div>

                  {/* Collocations */}
                  {item.collocations && item.collocations.length > 0 && (
                    <div>
                      <p style={{ margin: "0 0 0.375rem", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Key Collocations
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                        {item.collocations.map((col) => (
                          <span
                            key={col}
                            style={{
                              background: "var(--surface-elevated)",
                              border: "1px solid var(--border)",
                              borderRadius: "0.375rem",
                              padding: "0.2rem 0.6rem",
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
                    style={{ fontSize: "0.8125rem", padding: "0.4rem 0.875rem", alignSelf: "flex-start" }}
                    disabled={isSaved}
                  >
                    {isSaved ? " Saved" : " Save to Word List"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: "0.8125rem", color: "var(--foreground-faint)", textAlign: "center" }}>
         Tip: Save words to your list, then practice them in the <a href="/vocabulary" style={{ color: "var(--primary-light)" }}>Vocabulary Quiz</a>!
      </p>
    </div>
  );
}
