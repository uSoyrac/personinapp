"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Gift } from "lucide-react";

type AppMode = "ielts" | "toefl" | "general";

export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AppMode>("ielts");
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    setIsGenerating(true);
    sessionStorage.setItem("practiceforge_initial_text", inputText);
    setTimeout(() => {
      if (mode === "general") {
        router.push("/general-english");
      } else {
        router.push("/practice");
      }
    }, 800);
  };

  return (
    <div>
      {/* ==================== NEO-BRUTAL HERO ==================== */}
      <section
        style={{
          padding: "8rem 1.5rem 6rem",
          position: "relative",
          overflow: "hidden",
          minHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "var(--bg)"
        }}
      >
        <div className="container-sm animate-fadeIn" style={{ position: "relative", maxWidth: "960px", margin: "0 auto" }}>
          
          <div style={{ textAlign: "left", marginBottom: "4rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <h1 style={{ 
              marginBottom: "1.5rem", 
              color: "var(--foreground)", 
              fontSize: "clamp(3.5rem, 8vw, 6rem)", 
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontWeight: 900
            }}>
              Master <span className="highlight-box">IELTS & TOEFL</span> instantly.
            </h1>
            <p style={{ fontSize: "1.35rem", maxWidth: "600px", color: "var(--foreground)", fontWeight: 500, lineHeight: 1.5 }}>
              We are a digital asset and language leader helping ambitious students target Band 7.0+ and 100+ scores effortlessly.
            </p>
          </div>

          {/* Interactive Input Box */}
          <div className="card-elevated" style={{ padding: "1.5rem", background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(16px)" }}>
            
            {/* Mode Selector Tabs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem", background: "var(--surface-2)", padding: "0.375rem", borderRadius: "var(--radius-sm)" }}>
              {[
                { id: "ielts", label: "IELTS Academic" },
                { id: "toefl", label: "TOEFL iBT" },
                { id: "general", label: "General English" },
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setMode(t.id as AppMode)}
                  className="hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  style={{ 
                    flex: 1, padding: "0.75rem", borderRadius: "var(--radius-sm)", 
                    background: mode === t.id ? "#000000" : "transparent", 
                    color: mode === t.id ? "var(--gold)" : "var(--foreground-muted)", 
                    fontWeight: 900, border: mode === t.id ? "var(--border-width) solid var(--border)" : "var(--border-width) solid transparent", 
                    cursor: "pointer", transition: "all 0.2s", 
                    boxShadow: mode === t.id ? "var(--shadow-sm)" : "none",
                    fontSize: "0.9375rem"
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleGenerate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ position: "relative" }}>
                <textarea 
                  className="input-base"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={
                    mode === "ielts" ? "e.g., Paste an article, essay, or transcript here to generate IELTS Reading, Vocabulary, and Writing practice..." :
                    mode === "toefl" ? "e.g., Paste a lecture transcript or reading passage here to generate TOEFL iBT style questions..." :
                    "e.g., Paste any English text here to open the Personal Language Lab..."
                  }
                  style={{ minHeight: "150px", resize: "vertical", fontSize: "1.125rem", padding: "1.25rem", border: "3px solid #000", boxShadow: "4px 4px 0px #000", borderRadius: "8px" }}
                />
                <div style={{ position: "absolute", bottom: "1rem", right: "1rem", fontSize: "0.875rem", color: "var(--foreground-muted)", fontWeight: 500 }}>
                  {inputText.length} chars
                </div>
              </div>
              
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ minWidth: "200px", padding: "1.25rem 2rem", fontSize: "1.125rem", borderRadius: "8px", background: "#D2FF3A" }}
                  disabled={isGenerating || !inputText.trim()}
                >
                  {isGenerating ? "Analyzing text..." : <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>EXPLORE <ArrowUpRight size={20} strokeWidth={3} /></span>}
                </button>
              </div>
            </form>
          </div>
          
          <div style={{ textAlign: "center", marginTop: "2rem", color: "var(--foreground-faint)", fontSize: "0.875rem" }}>
            Trusted by 15,000+ ambitious students targeting Band 7.0+ and 100+ scores.
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS (CHORKE STYLE CARDS) ==================== */}
      <section id="how-it-works" className="section" style={{ background: "var(--bg)", borderTop: "var(--border-width) solid var(--border)" }}>
        <div className="container">
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))", gap: "1.5rem" }}>
            {/* Card 1: Yellow */}
            <div className="card" style={{ background: "var(--gold)", border: "var(--border-width) solid var(--border)", padding: "2.5rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>💡</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem", color: "#000" }}>Bring Your Content</h3>
              <p style={{ fontSize: "1.0625rem", color: "#111", lineHeight: 1.6 }}>Paste any text—an article, transcript, or lecture notes. You choose what interests you. Institutional-grade study materials.</p>
            </div>
            
            {/* Card 2: Mint */}
            <div className="card" style={{ background: "var(--mint)", border: "var(--border-width) solid var(--border)", padding: "2.5rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🎯</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem", color: "#000" }}>Set Your Goal</h3>
              <p style={{ fontSize: "1.0625rem", color: "#111", lineHeight: 1.6 }}>Select IELTS or TOEFL, your current level, and your dream score. Full lifecycle tracking and strategic advisory.</p>
            </div>
            
            {/* Card 3: Lila */}
            <div className="card" style={{ background: "var(--lavender)", border: "var(--border-width) solid var(--border)", padding: "2.5rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🚀</div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem", color: "#000" }}>Accelerate Mastery</h3>
              <p style={{ fontSize: "1.0625rem", color: "#111", lineHeight: 1.6 }}>Instantly receive a complete, exam-style practice session tailored to push you to the next band. Direct insights and feedback.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== WALL OF LOVE (TESTIMONIALS) ==================== */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-flex" }}>Wall of Love</div>
            <h2 style={{ color: "var(--foreground)", marginBottom: "1rem" }}>Trusted by students worldwide</h2>
            <p style={{ fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto", color: "var(--foreground-muted)" }}>
              See how our AI examiner has transformed the learning journey for thousands of ambitious test-takers.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "2rem" }}>
            {[
              { name: "Sarah L.", role: "IELTS Candidate", score: "IELTS Band 6.0 → 7.5", text: "I was stuck at 6.0 in Writing for months. The line-by-line grammar breakdown and vocabulary suggestions here finally pushed me to a 7.5. Absolutely game-changing.", bg: "var(--lavender)" },
              { name: "Ahmed K.", role: "TOEFL Test Taker", score: "TOEFL iBT 85 → 102", text: "The speaking agent is terrifyingly accurate. It caught my pronunciation errors that my human tutor missed. Got my target score in 3 weeks!", bg: "var(--surface)" },
              { name: "Elena V.", role: "English Learner", score: "General English", text: "I used the text analysis feature in the General English lab every day. Learning from articles I actually liked made studying effortless.", bg: "var(--surface)" },
            ].map((review, i) => (
              <div key={i} className="card" style={{ padding: "0", background: review.bg, position: "relative", display: "flex", flexDirection: "column" }}>
                <div style={{ padding: "1.5rem", borderBottom: "var(--border-width) solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)" }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, color: "var(--foreground)", fontSize: "1.125rem" }}>{review.name}</p>
                    <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground-muted)" }}>{review.role}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.25rem", color: "var(--gold)" }}>
                    {"★★★★★".split("").map((star, idx) => <span key={idx}>{star}</span>)}
                  </div>
                </div>
                <div style={{ padding: "2rem" }}>
                  <p style={{ fontSize: "1rem", lineHeight: 1.6, color: "var(--foreground)", marginBottom: "1.5rem" }}>{review.text}</p>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--foreground)", fontWeight: 800, background: "var(--surface-2)", padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)", display: "inline-block", border: "1px solid var(--border)" }}>{review.score}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 3-TIER PRICING HOOK ==================== */}
      <section id="plans" className="section" style={{ background: "var(--surface-2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="badge badge-accent" style={{ marginBottom: "1rem" }}>Clear Progression</div>
            <h2 style={{ color: "var(--foreground)", marginBottom: "1rem" }}>Choose your path to mastery</h2>
            <p style={{ fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
              Start for free, or unlock advanced AI examiner features to guarantee your target score.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))", gap: "2rem", alignItems: "start" }}>
            
            {/* Starter Plan */}
            <div className="card" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", height: "100%" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Starter</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--foreground)", marginBottom: "0.5rem" }}>$0</p>
              <p style={{ fontSize: "0.9375rem", marginBottom: "2rem", color: "var(--foreground-muted)" }}>Immediate value & daily practice for self-studiers.</p>
              
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  "1 full practice generation per day",
                  "Includes Mock Tests (up to 15 questions)",
                  "Personal Dictionary (up to 50 words)",
                  "Requires free account signup"
                ].map((feature, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.9375rem" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--mint)" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}><polyline points="20 6 9 17 4 12"/></svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="btn-secondary" style={{ width: "100%", justifyContent: "center" }} onClick={() => window.dispatchEvent(new Event("open-signup"))}>Create Free Account</button>
            </div>

            {/* Pro Plan */}
            <div className="card" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", height: "100%", background: "#FFFFFF", position: "relative" }}>
              <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)" }}>
                <span style={{ background: "#A855F7", color: "#FFF", padding: "0.375rem 1rem", border: "3px solid #000", borderRadius: "8px", fontWeight: 900, textTransform: "uppercase", fontSize: "0.875rem", letterSpacing: "0.05em", boxShadow: "4px 4px 0px #000" }}>Most Popular</span>
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#A855F7", fontWeight: 800 }}>Pro Study</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: "var(--font-display)", color: "#000", marginBottom: "0.5rem", display: "flex", alignItems: "baseline", gap: "0.1rem" }}>$14.99<span style={{ fontSize: "1rem", color: "#000", fontWeight: 800 }}>/mo</span></p>
              <p style={{ fontSize: "0.9375rem", marginBottom: "2rem", color: "#4B5563", fontWeight: 600, lineHeight: 1.5 }}>For core students needing comprehensive writing support.</p>
              
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  "Unlimited Reading & Writing generation",
                  "Advanced General English Lab",
                  "Line-by-line AI Writing feedback",
                  "Unlimited Personal Dictionary"
                ].map(feature => (
                  <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.9375rem", fontWeight: 700, color: "#111827" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#A855F7" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "-2px" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "#A855F7" }} onClick={() => window.dispatchEvent(new Event("open-signup"))}>UPGRADE TO PRO</button>
            </div>

            {/* Elite Plan */}
            <div className="card" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", height: "100%", background: "#FFFFFF", position: "relative" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "#EAB308", fontWeight: 800 }}>Elite Mastery</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: 900, fontFamily: "var(--font-display)", color: "#000", marginBottom: "0.5rem", display: "flex", alignItems: "baseline", gap: "0.1rem" }}>$29.99<span style={{ fontSize: "1rem", color: "#000", fontWeight: 800 }}>/mo</span></p>
              <p style={{ fontSize: "0.9375rem", marginBottom: "2rem", color: "#4B5563", fontWeight: 600, lineHeight: 1.5 }}>For students urgently needing Band 7.0+ or 100+.</p>
              
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  "Everything in Pro Study",
                  "AI Speaking Evaluations (Daily Token Limit)",
                  "Unlimited Mock Tests",
                  "Guaranteed Score Acceleration Path"
                ].map(feature => (
                  <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.9375rem", fontWeight: 700, color: "#111827" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#FDE047" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "-2px" }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", background: "#FDE047" }} onClick={() => window.dispatchEvent(new Event("open-signup"))}>GET ELITE MASTERY</button>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== LEAD CAPTURE ==================== */}
      <section className="section" style={{ padding: "6rem 0" }}>
        <div className="container-sm">
          <div className="card-elevated" style={{ padding: "4rem 2rem", background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)", textAlign: "center", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}><Gift size={48} color="var(--primary)" strokeWidth={1.5} /></div>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Free IELTS/TOEFL Vocabulary Guide</h2>
            <p style={{ fontSize: "1.125rem", color: "var(--foreground-muted)", marginBottom: "2.5rem", maxWidth: "500px", margin: "0 auto 2.5rem", lineHeight: 1.6 }}>
              Join 15,000+ students. Enter your email to instantly download our PDF with the 500 most frequent Academic words.
            </p>
            <form style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", maxWidth: "450px", margin: "0 auto" }} onSubmit={(e) => { e.preventDefault(); alert("PDF Sent! Check your inbox."); }}>
              <input type="email" placeholder="Enter your email address" required className="input-base" style={{ flex: 1, minWidth: "200px", padding: "1rem 1.5rem", borderRadius: "9999px" }} />
              <button type="submit" className="btn-primary" style={{ padding: "1rem 2rem", borderRadius: "9999px", flexShrink: 0 }}>Get Free PDF</button>
            </form>
            <p style={{ fontSize: "0.75rem", color: "var(--foreground-faint)", marginTop: "1rem" }}>We respect your privacy. No spam.</p>
          </div>
        </div>
      </section>

      {/* ==================== DISCLAIMER ==================== */}
      <section className="section-sm" style={{ background: "var(--surface-2)" }}>
        <div className="container-sm">
          <div
            style={{
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              background: "var(--surface)",
              color: "var(--foreground-muted)",
              textAlign: "center"
            }}
          >
            <p style={{ margin: 0, fontSize: "0.8125rem", lineHeight: 1.7 }}>
              PracticeForge is an independent AI study tool, created to help you succeed. It is not affiliated with, endorsed by, or associated with IELTS, TOEFL iBT, or any official examination organisation. Estimated practice scores are AI-generated for self-study guidance.
            </p>
          </div>
        </div>
      </section>

      {/* JSON-LD Schemas for AI Agents & SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "name": "PracticeForge",
                "url": "https://practiceforge.com",
                "description": "AI-Powered IELTS & TOEFL Practice generator."
              },
              {
                "@type": "SoftwareApplication",
                "name": "PracticeForge",
                "operatingSystem": "All",
                "applicationCategory": "EducationalApplication",
                "description": "An AI-powered application that generates personalized IELTS and TOEFL practice sessions.",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              },
              {
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "How does PracticeForge generate IELTS and TOEFL practice?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "PracticeForge uses advanced AI to analyze any text you provide and instantly generates reading questions, vocabulary lists, and writing prompts tailored to your target exam score."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is there a free version of PracticeForge?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! Guest users can try one generation completely free. By creating a free account, you unlock a daily practice generation to help you study consistently."
                    }
                  }
                ]
              }
            ]
          })
        }}
      />
    </div>
  );
}
