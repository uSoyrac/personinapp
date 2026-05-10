"use client";

import { useState, useEffect } from "react";
import { saveWords } from "@/lib/wordList";
import type { UserTier } from "@/types";

type Activity = "hub" | "cloze" | "shadowing" | "grammar";

const TIER_LIMITS: Record<UserTier, number> = {
  guest: 1,
  free: 1,
  pro: 5,
  gold: 99999,
};

// Mock extracted words for the UI
const MOCK_WORDS = [
  { word: "Profoundly", def: "extremely or greatly", pos: "adverb", diff: "C1" as const },
  { word: "Ecosystems", def: "biological communities of interacting organisms", pos: "noun", diff: "B2" as const },
  { word: "Fragmented", def: "broken into pieces", pos: "adjective", diff: "C1" as const },
  { word: "Biodiversity", def: "variety of life in the world", pos: "noun", diff: "C1" as const },
  { word: "Mitigate", def: "make less severe, serious, or painful", pos: "verb", diff: "C2" as const }
];

export default function GeneralEnglishPage() {
  const [sourceType, setSourceType] = useState<"text" | "youtube">("youtube");
  const [inputValue, setInputValue] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<Activity>("hub");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [tier, setTier] = useState<UserTier>("guest");
  const [usageCount, setUsageCount] = useState(0);
  
  const [savedWords, setSavedWords] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    // Load tier and usage limits
    const savedTier = localStorage.getItem("practiceforge_tier") as UserTier;
    if (savedTier) setTier(savedTier);

    const today = new Date().toISOString().split("T")[0];
    const lastUsageDate = localStorage.getItem("practiceforge_ge_date");
    const count = parseInt(localStorage.getItem("practiceforge_ge_count") || "0", 10);

    if (lastUsageDate !== today) {
      setUsageCount(0);
      localStorage.setItem("practiceforge_ge_date", today);
      localStorage.setItem("practiceforge_ge_count", "0");
    } else {
      setUsageCount(count);
    }
  }, []);

  const limit = TIER_LIMITS[tier];
  const isOverLimit = usageCount >= limit;

  const activities = [
    { id: "hub", title: "Study Hub", desc: "Get a concise summary, key vocabulary, and comprehension questions.", icon: "📚" },
    { id: "cloze", title: "Interactive Cloze", desc: "Fill-in-the-blanks test automatically generated from the text context.", icon: "🧩" },
    { id: "shadowing", title: "Sentence Shadowing", desc: "Listen and repeat line-by-line to perfect your pronunciation.", icon: "🗣️" },
    { id: "grammar", title: "Grammar Breakdown", desc: "Highlight complex sentence structures to understand native phrasing.", icon: "🔍" }
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (tier === "guest" && usageCount >= 1) {
      setError("GUEST_WALL");
      return;
    }
    if (tier === "free" && usageCount >= 1) {
      setError("FREE_WALL");
      return;
    }

    if (isOverLimit) {
      setError(`Daily limit reached. Your ${tier} plan allows ${limit} generation(s) per day.`);
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    setShowResults(false);

    try {
      if (sourceType === "youtube") {
        const res = await fetch("/api/youtube-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: inputValue })
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Failed to fetch transcript");
        }
        // Wait for mocked text to come back
        await res.json();
      } else {
        // Text mode - simulate AI processing
        await new Promise(r => setTimeout(r, 1200));
      }

      // Record usage
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem("practiceforge_ge_count", newCount.toString());

      setIsGenerating(false);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setIsGenerating(false);
    }
  };

  const handleSaveWord = (w: typeof MOCK_WORDS[0]) => {
    saveWords([{
      word: w.word,
      definition: w.def,
      partOfSpeech: w.pos,
      difficulty: w.diff,
      contextSentence: "Urbanisation has profoundly transformed ecosystems across the globe." // mocked context
    }]);
    setSavedWords(prev => new Set([...prev, w.word]));
    setToast(`"${w.word}" added to Dictionary`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="section" style={{ paddingTop: "3rem", position: "relative" }}>
      
      {/* Toast Notification */}
      {toast && (
        <div className="animate-fadeInFast" style={{ position: "fixed", top: "2rem", right: "2rem", background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", color: "var(--foreground)", padding: "1rem 1.5rem", borderRadius: "var(--radius-md)", zIndex: 9999, fontWeight: 600, display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "var(--primary)" }}>✓</span> {toast}
        </div>
      )}

      <div className="container">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-flex" }}>Beta Feature</div>
          <h1 style={{ margin: "0 0 1rem" }}>
            <span className="gradient-text">Personal Language Lab</span>
          </h1>
          <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto", color: "var(--foreground-muted)" }}>
            Learn General English dynamically. Drop a YouTube video or any text, and we'll instantly generate interactive learning activities just for you.
          </p>
        </div>

        {/* Usage Limits Badge */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
          <div className="badge" style={{ background: "var(--surface-2)", color: "var(--foreground-muted)", fontWeight: 500 }}>
            <span style={{ color: "var(--primary)", fontWeight: 700, marginRight: "0.25rem", textTransform: "capitalize" }}>{tier} Plan:</span> 
            {usageCount} / {tier === "gold" ? "∞" : limit} Generations Today
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr lg:1.5fr", gap: "2rem", alignItems: "start" }}>
          
          {/* Controls / Input Panel */}
          <div className="card" style={{ padding: "2rem" }}>
            
            {/* Upsell Walls */}
            {error === "GUEST_WALL" && (
              <div className="card-elevated animate-fadeIn" style={{ padding: "2rem", marginBottom: "1.75rem", background: "linear-gradient(to right, var(--surface), var(--surface-2))", borderLeft: "4px solid var(--primary)" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>You've unlocked your potential!</h3>
                <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>You've used your 1 free guest trial. Create a free account to unlock daily practice, a personalized dictionary, and progress tracking.</p>
                <button className="btn-primary" onClick={() => window.dispatchEvent(new Event("open-signup"))}>Create Free Account</button>
              </div>
            )}

            {error === "FREE_WALL" && (
              <div className="card-elevated animate-fadeIn" style={{ padding: "2rem", marginBottom: "1.75rem", background: "linear-gradient(to right, var(--surface), var(--surface-2))", borderLeft: "4px solid var(--primary)" }}>
                <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Daily Limit Reached</h3>
                <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>You've reached your free daily limit. Upgrade to Pro Study to unlock unlimited practice and AI writing feedback.</p>
                <button className="btn-primary" onClick={() => { localStorage.setItem("practiceforge_tier", "pro"); window.location.reload(); }}>Upgrade to Pro Study</button>
              </div>
            )}

            {error && error !== "GUEST_WALL" && error !== "FREE_WALL" && (
              <div style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.3)", borderRadius: "var(--radius-md)", padding: "0.875rem 1rem", marginBottom: "1rem" }}>
                <p style={{ margin: 0, fontSize: "0.9375rem", color: "#fb7185", fontWeight: 500 }}>⚠️ {error}</p>
              </div>
            )}

            <div style={{ opacity: (error === "GUEST_WALL" || error === "FREE_WALL") ? 0.5 : 1, pointerEvents: (error === "GUEST_WALL" || error === "FREE_WALL") ? "none" : "auto" }}>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", background: "var(--surface-2)", padding: "0.375rem", borderRadius: "var(--radius-sm)" }}>
                <button 
                  onClick={() => setSourceType("youtube")}
                  style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", background: sourceType === "youtube" ? "var(--surface)" : "transparent", color: sourceType === "youtube" ? "var(--primary)" : "var(--foreground-muted)", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s", boxShadow: sourceType === "youtube" ? "var(--shadow-sm)" : "none" }}
                >
                YouTube Link
              </button>
              <button 
                onClick={() => setSourceType("text")}
                style={{ flex: 1, padding: "0.5rem", borderRadius: "4px", background: sourceType === "text" ? "var(--surface)" : "transparent", color: sourceType === "text" ? "var(--primary)" : "var(--foreground-muted)", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s", boxShadow: sourceType === "text" ? "var(--shadow-sm)" : "none" }}
              >
                Raw Text
              </button>
            </div>

            <form onSubmit={handleGenerate}>
              <div style={{ marginBottom: "2rem" }}>
                <label className="label">
                  {sourceType === "youtube" ? "Paste YouTube Video URL" : "Paste your text here"}
                </label>
                {sourceType === "youtube" ? (
                  <input 
                    type="url" 
                    className="input-base" 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    required
                  />
                ) : (
                  <textarea 
                    className="input-base" 
                    placeholder="Urbanisation has profoundly transformed ecosystems..."
                    rows={6}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    required
                    style={{ resize: "vertical" }}
                  />
                )}
                {sourceType === "youtube" && (
                  <p style={{ fontSize: "0.75rem", marginTop: "0.5rem", color: "var(--foreground-faint)" }}>
                    *Video must have closed captions (subtitles) enabled.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label className="label">Select Activity</label>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                  {activities.map(act => (
                    <div 
                      key={act.id} 
                      onClick={() => setSelectedActivity(act.id as Activity)}
                      style={{ 
                        padding: "1rem", 
                        border: `2px solid ${selectedActivity === act.id ? "var(--primary)" : "var(--border)"}`, 
                        borderRadius: "var(--radius-sm)", 
                        cursor: "pointer", 
                        background: selectedActivity === act.id ? "var(--primary-glow)" : "var(--surface)",
                        display: "flex", gap: "1rem", alignItems: "center",
                        transition: "all 0.2s",
                        boxShadow: selectedActivity === act.id ? "var(--shadow-sm)" : "none"
                      }}
                    >
                      <div style={{ fontSize: "1.5rem" }}>{act.icon}</div>
                      <div>
                        <h4 style={{ margin: "0 0 0.25rem", fontSize: "0.9375rem", color: selectedActivity === act.id ? "var(--primary-dark)" : "var(--foreground)" }}>{act.title}</h4>
                        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--foreground-muted)" }}>{act.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "1rem", fontSize: "1.0625rem", opacity: isOverLimit ? 0.5 : 1 }} disabled={isGenerating || isOverLimit}>
                {isGenerating ? "Transcribing & Generating..." : "Create Activity"}
              </button>
            </form>
            </div>
          </div>

          {/* Results Panel */}
          <div style={{ minHeight: "600px", display: "flex", flexDirection: "column" }}>
            {showResults ? (
              <div className="card animate-fadeIn" style={{ flex: 1, padding: "2rem" }}>
                
                {selectedActivity === "hub" && (
                  <div>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      📚 Study Hub Dashboard
                    </h2>
                    <div style={{ display: "grid", gap: "1.5rem" }}>
                      <div style={{ padding: "1.25rem", background: "var(--surface-2)", borderRadius: "var(--radius-sm)" }}>
                        <h4 style={{ margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground)" }}><span style={{ color: "var(--mint)" }}>📝</span> Summary</h4>
                        <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6, color: "var(--foreground-muted)" }}>This source discusses the profound impact of urbanization on global ecosystems. It highlights how city expansion fragments natural habitats, reducing biodiversity. However, it also suggests that thoughtfully designed green infrastructure can mitigate these effects.</p>
                      </div>
                      
                      <div>
                        <h4 style={{ margin: "0 0 0.75rem", display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground)" }}><span style={{ color: "var(--gold)" }}>🎯</span> Key Vocabulary</h4>
                        <p style={{ fontSize: "0.875rem", color: "var(--foreground-faint)", margin: "0 0 1rem" }}>Click the + button to save words directly to your dictionary.</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                          {MOCK_WORDS.map(w => {
                            const isSaved = savedWords.has(w.word);
                            return (
                              <div key={w.word} style={{ padding: "0.75rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", display: "flex", flexDirection: "column", gap: "0.5rem", transition: "all 0.2s" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <span style={{ fontWeight: 700, color: "var(--foreground)" }}>{w.word}</span>
                                  <button 
                                    onClick={() => handleSaveWord(w)}
                                    disabled={isSaved}
                                    style={{ background: isSaved ? "rgba(16,185,129,0.1)" : "var(--surface)", border: `1px solid ${isSaved ? "var(--mint)" : "var(--border)"}`, borderRadius: "4px", width: "1.75rem", height: "1.75rem", display: "flex", alignItems: "center", justifyContent: "center", cursor: isSaved ? "default" : "pointer", color: isSaved ? "var(--mint)" : "var(--foreground-muted)", transition: "all 0.2s" }}
                                    title="Add to Dictionary"
                                  >
                                    {isSaved ? "✓" : "+"}
                                  </button>
                                </div>
                                <span style={{ fontSize: "0.8125rem", color: "var(--foreground-muted)", fontStyle: "italic" }}>{w.pos} · {w.diff}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div style={{ padding: "1.25rem", background: "rgba(124, 58, 237, 0.05)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
                        <h4 style={{ margin: "0 0 0.75rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>🧠 Quick Check</h4>
                        <p style={{ margin: "0 0 1rem", fontWeight: 500, color: "var(--foreground)" }}>What is a proposed solution to urban habitat fragmentation?</p>
                        <div style={{ display: "grid", gap: "0.75rem" }}>
                          <button className="btn-secondary" style={{ textAlign: "left", fontSize: "0.9375rem", padding: "0.75rem 1rem", justifyContent: "flex-start", background: "var(--surface)" }}>A) Expanding city limits further</button>
                          <button className="btn-secondary" style={{ textAlign: "left", fontSize: "0.9375rem", padding: "0.75rem 1rem", justifyContent: "flex-start", background: "var(--surface)" }}>B) Thoughtfully designed green infrastructure</button>
                          <button className="btn-secondary" style={{ textAlign: "left", fontSize: "0.9375rem", padding: "0.75rem 1rem", justifyContent: "flex-start", background: "var(--surface)" }}>C) Reducing global biodiversity</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedActivity === "cloze" && (
                  <div>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>🧩 Interactive Cloze Test</h2>
                    <p style={{ marginBottom: "2rem", color: "var(--foreground-muted)", fontSize: "0.9375rem" }}>Fill in the missing words based on the context of the material.</p>
                    <div style={{ lineHeight: 2.2, fontSize: "1.0625rem", color: "var(--foreground)" }}>
                      Urbanisation has <input type="text" className="input-base" style={{ display: "inline-block", width: "120px", padding: "0.25rem 0.5rem", height: "auto" }} placeholder="..." /> transformed ecosystems across the globe. As cities expand, natural <input type="text" className="input-base" style={{ display: "inline-block", width: "100px", padding: "0.25rem 0.5rem", height: "auto" }} placeholder="..." /> are increasingly fragmented, reducing <input type="text" className="input-base" style={{ display: "inline-block", width: "140px", padding: "0.25rem 0.5rem", height: "auto" }} placeholder="..." /> and disrupting ecological corridors.
                    </div>
                    <button className="btn-primary" style={{ marginTop: "2rem" }}>Check Answers</button>
                  </div>
                )}

                {selectedActivity === "shadowing" && (
                  <div>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>🗣️ Sentence Shadowing</h2>
                    <p style={{ marginBottom: "2rem", color: "var(--foreground-muted)", fontSize: "0.9375rem" }}>Listen to the native pronunciation and repeat immediately after.</p>
                    
                    <div style={{ display: "grid", gap: "1rem" }}>
                      {[
                        "Urbanisation has profoundly transformed ecosystems across the globe.",
                        "As cities expand, natural habitats are increasingly fragmented.",
                        "This reduces biodiversity and disrupts ecological corridors."
                      ].map((sentence, idx) => (
                        <div key={idx} style={{ padding: "1.25rem", background: "var(--surface-2)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <button className="btn-primary" style={{ padding: "0", borderRadius: "50%", width: "2.5rem", height: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          </button>
                          <p style={{ margin: 0, flex: 1, fontWeight: 500, color: "var(--foreground)", lineHeight: 1.5 }}>{sentence}</p>
                          <button className="btn-secondary" style={{ padding: "0", borderRadius: "50%", width: "2.5rem", height: "2.5rem", color: "var(--rose)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "var(--surface)" }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedActivity === "grammar" && (
                  <div>
                    <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>🔍 Grammar Breakdown</h2>
                    <p style={{ marginBottom: "2rem", color: "var(--foreground-muted)", fontSize: "0.9375rem" }}>Hover or click on highlighted structures to understand their grammatical function.</p>
                    
                    <div style={{ padding: "1.5rem", background: "var(--surface-2)", borderRadius: "var(--radius-sm)", fontSize: "1.0625rem", lineHeight: 2, color: "var(--foreground)" }}>
                      <span style={{ background: "rgba(236, 72, 153, 0.1)", padding: "0.125rem 0.25rem", borderRadius: "4px", borderBottom: "2px solid var(--rose)", cursor: "pointer" }}>Urbanisation has profoundly transformed</span> ecosystems across the globe. 
                      <span style={{ background: "rgba(37, 99, 235, 0.1)", padding: "0.125rem 0.25rem", borderRadius: "4px", borderBottom: "2px solid #3b82f6", cursor: "pointer", marginLeft: "4px" }}>As cities expand</span>, natural habitats 
                      <span style={{ background: "rgba(16, 185, 129, 0.1)", padding: "0.125rem 0.25rem", borderRadius: "4px", borderBottom: "2px solid var(--mint)", cursor: "pointer", marginLeft: "4px" }}>are increasingly fragmented</span>...
                    </div>

                    <div style={{ marginTop: "1.5rem", padding: "1.25rem", border: "1px solid var(--border)", borderLeft: "4px solid var(--rose)", borderRadius: "var(--radius-sm)", background: "var(--surface)" }}>
                      <h4 style={{ margin: "0 0 0.5rem", color: "var(--rose)", fontSize: "1rem" }}>Present Perfect Tense</h4>
                      <p style={{ margin: 0, fontSize: "0.9375rem", color: "var(--foreground)", lineHeight: 1.6 }}>"has profoundly transformed" describes an action that started in the past and has a strong connection to or result in the present.</p>
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "2px dashed var(--border)", borderRadius: "var(--radius-md)", color: "var(--foreground-faint)", background: "rgba(255,255,255,0.5)" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🧪</div>
                <h3 style={{ margin: "0 0 0.5rem", color: "var(--foreground-muted)" }}>Your Lab is Ready</h3>
                <p style={{ margin: 0, maxWidth: "300px", textAlign: "center", fontSize: "0.9375rem" }}>Provide a source and select an activity on the left to generate your custom learning experience.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
