"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HOW_IT_WORKS = [
  { step: "1", icon: "📄", title: "Bring Your Content", desc: "Paste any text—an article, transcript, or lecture notes. You choose what interests you." },
  { step: "2", icon: "🎯", title: "Set Your Goal", desc: "Select IELTS or TOEFL, your current level, and your dream score. We handle the rest." },
  { step: "3", icon: "🚀", title: "Accelerate", desc: "Instantly receive a complete, exam-style practice session tailored to push you to the next band." },
];

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
      {/* ==================== PANGRAM-STYLE HERO ==================== */}
      <section
        style={{
          padding: "6rem 1.5rem 6rem",
          position: "relative",
          overflow: "hidden",
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        {/* Soft Background Gradients */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "-10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "1000px",
            height: "600px",
            background: "radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />

        <div className="container-sm animate-fadeIn" style={{ position: "relative", maxWidth: "800px" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h1 style={{ marginBottom: "1rem", color: "var(--foreground)", fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}>
              Master <span className="gradient-text">IELTS & TOEFL</span> instantly.
            </h1>
            <p style={{ fontSize: "1.25rem", maxWidth: "600px", margin: "0 auto", color: "var(--foreground-muted)" }}>
              Paste any text or link below to generate a highly accurate, exam-style practice session tailored to your target score.
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
                  style={{ 
                    flex: 1, padding: "0.75rem", borderRadius: "6px", 
                    background: mode === t.id ? "var(--surface)" : "transparent", 
                    color: mode === t.id ? "var(--primary)" : "var(--foreground-muted)", 
                    fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s", 
                    boxShadow: mode === t.id ? "var(--shadow-sm)" : "none",
                    fontSize: "0.9375rem"
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleGenerate}>
              <textarea 
                className="input-base" 
                placeholder={
                  mode === "ielts" ? "Paste an article, essay, or transcript here to generate IELTS Reading, Vocabulary, and Writing practice..." :
                  mode === "toefl" ? "Paste a lecture transcript or reading passage here to generate TOEFL iBT style questions..." :
                  "Paste any English text here to open the Personal Language Lab..."
                }
                rows={8}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ resize: "none", fontSize: "1.125rem", padding: "1.5rem", lineHeight: 1.6, marginBottom: "1.5rem", background: "var(--bg)", border: "1px solid var(--border)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ fontSize: "0.875rem", color: "var(--foreground-faint)" }}>
                  {inputText.length} characters
                </div>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ padding: "1rem 2.5rem", fontSize: "1.125rem", borderRadius: "9999px", minWidth: "200px" }}
                  disabled={isGenerating || !inputText.trim()}
                >
                  {isGenerating ? "Analyzing text..." : "Generate Practice →"}
                </button>
              </div>
            </form>
          </div>
          
          <div style={{ textAlign: "center", marginTop: "2rem", color: "var(--foreground-faint)", fontSize: "0.875rem" }}>
            Trusted by 15,000+ ambitious students targeting Band 7.0+ and 100+ scores.
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="section" style={{ background: "var(--surface-2)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ color: "var(--foreground)", marginBottom: "1rem" }}>A proven method for rapid score increases</h2>
            <p style={{ fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto" }}>
              We've stripped away the noise. Just bring your content, and let our AI create the perfect, high-yield study session.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem",
            }}
          >
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="card"
                style={{ position: "relative", overflow: "hidden", padding: "2rem" }}
              >
                <div style={{ width: "3rem", height: "3rem", borderRadius: "50%", background: "var(--primary-glow)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: "bold", marginBottom: "1.5rem" }}>
                  {step.step}
                </div>
                <h3 style={{ margin: "0 0 0.75rem", color: "var(--foreground)", fontSize: "1.25rem" }}>
                  {step.title}
                </h3>
                <p style={{ margin: 0, fontSize: "1rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {[
              { name: "Sarah L.", score: "IELTS Band 6.0 → 7.5", text: "I was stuck at 6.0 in Writing for months. The line-by-line grammar breakdown and vocabulary suggestions here finally pushed me to a 7.5. Absolutely game-changing." },
              { name: "Ahmed K.", score: "TOEFL iBT 85 → 102", text: "The speaking agent is terrifyingly accurate. It caught my pronunciation errors that my human tutor missed. Got my target score in 3 weeks!" },
              { name: "Elena V.", score: "IELTS Band 5.5 → 7.0", text: "I used the text analysis feature in the General English lab every day. Learning from articles I actually liked made studying effortless." },
            ].map((review, i) => (
              <div key={i} className="card" style={{ padding: "2rem", background: "var(--surface)", position: "relative" }}>
                <div style={{ position: "absolute", top: "2rem", right: "2rem", color: "var(--gold)", opacity: 0.2 }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                </div>
                <div style={{ display: "flex", gap: "0.25rem", color: "var(--gold)", marginBottom: "1rem" }}>
                  {"★★★★★".split("").map((star, idx) => <span key={idx}>{star}</span>)}
                </div>
                <p style={{ fontSize: "1.0625rem", lineHeight: 1.6, color: "var(--foreground)", marginBottom: "1.5rem", fontStyle: "italic", position: "relative", zIndex: 1, paddingRight: "2rem" }}>"{review.text}"</p>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: "var(--foreground)" }}>{review.name}</p>
                  <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--mint-dark)", fontWeight: 600 }}>{review.score}</p>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", alignItems: "start" }}>
            
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
            <div className="card" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", height: "100%", border: "2px solid var(--primary-light)", position: "relative" }}>
              <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)" }}>
                <span className="badge" style={{ background: "var(--primary)", color: "#fff", padding: "0.25rem 1rem", border: "none", fontWeight: 700 }}>Most Popular</span>
              </div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--primary)" }}>Pro Study</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--foreground)", marginBottom: "0.5rem" }}>$15<span style={{ fontSize: "1rem", color: "var(--foreground-muted)", fontWeight: 500 }}>/mo</span></p>
              <p style={{ fontSize: "0.9375rem", marginBottom: "2rem", color: "var(--foreground-muted)" }}>For core students needing comprehensive writing support.</p>
              
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  "Unlimited Reading & Writing generation",
                  "Advanced General English Lab",
                  "Line-by-line AI Writing feedback",
                  "Unlimited Personal Dictionary"
                ].map(feature => (
                  <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.9375rem", fontWeight: 500 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}><polyline points="20 6 9 17 4 12"/></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => window.dispatchEvent(new Event("open-signup"))}>Upgrade to Pro</button>
            </div>

            {/* Elite Plan */}
            <div className="card-elevated" style={{ padding: "2.5rem 2rem", display: "flex", flexDirection: "column", height: "100%", background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)", borderColor: "var(--gold)" }}>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: "var(--gold)" }}>Elite Mastery</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-display)", color: "var(--foreground)", marginBottom: "0.5rem" }}>$29<span style={{ fontSize: "1rem", color: "var(--foreground-muted)", fontWeight: 500 }}>/mo</span></p>
              <p style={{ fontSize: "0.9375rem", marginBottom: "2rem", color: "var(--foreground-muted)" }}>For students urgently needing Band 7.0+ or 100+.</p>
              
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  "Everything in Pro Study",
                  "AI Speaking Evaluations (Daily Token Limit)",
                  "Unlimited Mock Tests",
                  "Guaranteed Score Acceleration Path"
                ].map(feature => (
                  <li key={feature} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.9375rem", fontWeight: 600 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}><polyline points="20 6 9 17 4 12"/></svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", background: "linear-gradient(135deg, #F59E0B, #D97706)", boxShadow: "0 4px 14px 0 rgba(245, 158, 11, 0.39)" }} onClick={() => window.dispatchEvent(new Event("open-signup"))}>Get Elite Mastery</button>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== LEAD CAPTURE ==================== */}
      <section className="section" style={{ padding: "6rem 0" }}>
        <div className="container-sm">
          <div className="card-elevated" style={{ padding: "4rem 2rem", background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)", textAlign: "center", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎁</div>
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
