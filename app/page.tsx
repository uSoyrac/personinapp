import type { Metadata } from "next";
import Link from "next/link";
import FeatureGrid from "@/components/FeatureGrid";

export const metadata: Metadata = {
  title: "PracticeForge — Turn Any Text Into IELTS & TOEFL Practice",
  description:
    "Paste any article, lesson note, or transcript. PracticeForge instantly generates exam-style reading questions, vocabulary lists, writing prompts, and a personalised 7-day study plan.",
};

const HOW_IT_WORKS = [
  { step: "01", icon: "📋", title: "Paste your text", desc: "Paste any academic article, lesson notes, podcast transcript, or study material." },
  { step: "02", icon: "⚙️", title: "Choose your profile", desc: "Select IELTS or TOEFL, your skill focus, current level, and target score." },
  { step: "03", icon: "✨", title: "Get practice content", desc: "Receive reading questions, vocabulary, writing & speaking prompts, and a study plan — instantly." },
];



const WHO_ITS_FOR = [
  { icon: "🎓", title: "University applicants", desc: "Preparing IELTS Academic for postgraduate admissions in the UK, Australia, or Canada." },
  { icon: "💼", title: "Working professionals", desc: "Targeting TOEFL iBT for US university programs or visa requirements while managing a busy schedule." },
  { icon: "🌍", title: "Self-study learners", desc: "B1–C1 students who want structured, personalised practice without expensive tutoring." },
  { icon: "📚", title: "Content-first studiers", desc: "Students who already read academic content and want to turn it into productive exam practice." },
];

const SAMPLE_TEXT = `Urbanisation has profoundly transformed ecosystems across the globe. As cities expand, natural habitats are increasingly fragmented, reducing biodiversity and disrupting ecological corridors that wildlife depends on for migration and genetic exchange. However, a growing body of research suggests that thoughtfully designed urban environments — incorporating green roofs, tree-lined streets, and wetland restoration — can serve as meaningful refuges for urban-adapted species...`;

export default function LandingPage() {
  return (
    <div>
      {/* ==================== HERO ==================== */}
      <section
        style={{
          padding: "6rem 1rem 5rem",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="container-sm" style={{ position: "relative" }}>
          <div className="badge badge-primary" style={{ marginBottom: "1.5rem", display: "inline-flex" }}>
            ⚡ AI-Powered Exam Practice
          </div>

          <h1 style={{ marginBottom: "1.25rem", color: "var(--foreground)" }}>
            Turn any article into{" "}
            <span className="gradient-text">IELTS & TOEFL practice</span>{" "}
            in seconds
          </h1>

          <p style={{ fontSize: "1.125rem", maxWidth: "600px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            Paste any academic text, lesson note, or transcript. PracticeForge generates personalised exam-style reading questions, vocabulary, writing prompts, and a 7-day study plan — tailored to your level and target score.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/practice"
              className="btn-primary"
              id="hero-cta"
              style={{ fontSize: "1.0625rem", padding: "0.9375rem 2rem" }}
            >
              Generate Free Practice →
            </Link>
            <a
              href="#how-it-works"
              className="btn-secondary"
              style={{ fontSize: "1.0625rem", padding: "0.9375rem 2rem" }}
            >
              See how it works
            </a>
          </div>

          <p style={{ marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--foreground-faint)" }}>
            No account required · Works without API key · Demo mode available
          </p>
        </div>
      </section>

      {/* ==================== DEMO PREVIEW ==================== */}
      <section style={{ padding: "0 1rem 5rem" }}>
        <div className="container-sm">
          <div
            className="card-elevated"
            style={{
              border: "1px solid var(--border)",
              overflow: "hidden",
              boxShadow: "var(--shadow-lg), var(--shadow-glow)",
            }}
          >
            {/* Fake browser bar */}
            <div
              style={{
                background: "var(--background)",
                borderBottom: "1px solid var(--border)",
                padding: "0.75rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", background: "#f43f5e" }} />
              <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", background: "#10b981" }} />
              <div
                style={{
                  flex: 1,
                  background: "var(--surface)",
                  borderRadius: "0.375rem",
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.8125rem",
                  color: "var(--foreground-faint)",
                  marginLeft: "0.5rem",
                }}
              >
                practiceforge.app/practice
              </div>
            </div>

            {/* Demo content */}
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <p className="label">Paste your text</p>
                <div
                  style={{
                    background: "var(--background)",
                    border: "1px solid var(--primary)",
                    borderRadius: "var(--radius-md)",
                    padding: "1rem",
                    fontSize: "0.875rem",
                    color: "var(--foreground-muted)",
                    lineHeight: 1.7,
                    boxShadow: "0 0 0 3px var(--primary-glow)",
                  }}
                >
                  {SAMPLE_TEXT}
                  <span
                    style={{
                      display: "inline-block",
                      width: "2px",
                      height: "1em",
                      background: "var(--primary-light)",
                      marginLeft: "2px",
                      animation: "pulse-ring 1s ease infinite",
                    }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                {[
                  { label: "Exam", value: "IELTS Academic" },
                  { label: "Skill", value: "Full Practice" },
                  { label: "Level", value: "B2" },
                  { label: "Target", value: "Band 7.0" },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      background: "var(--background)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "0.5rem 1rem",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span style={{ color: "var(--foreground-faint)" }}>{item.label}:</span>{" "}
                    <span style={{ fontWeight: 600, color: "var(--foreground)" }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.08))",
                  border: "1px solid var(--primary)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>✨</span>
                <div>
                  <p style={{ margin: "0 0 0.125rem", fontWeight: 700, color: "var(--foreground)", fontSize: "0.9375rem" }}>
                    Practice content generated!
                  </p>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>
                    5 reading questions · 8 vocabulary items · Writing + Speaking prompts · 7-day plan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS ==================== */}
      <section id="how-it-works" className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ color: "var(--foreground)", marginBottom: "0.75rem" }}>How it works</h2>
            <p style={{ fontSize: "1.0625rem", maxWidth: "500px", margin: "0 auto" }}>
              Three steps from raw text to a complete, personalised study session.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.step}
                className="card-elevated"
                style={{ position: "relative", overflow: "hidden" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "-0.5rem",
                    right: "-0.5rem",
                    fontSize: "4rem",
                    fontWeight: 900,
                    color: "var(--border)",
                    fontFamily: "var(--font-display)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {step.step}
                </div>
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{step.icon}</div>
                <h3 style={{ margin: "0 0 0.5rem", color: "var(--foreground)", fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: "1.0625rem" }}>
                  {step.title}
                </h3>
                <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== WHAT IT CREATES ==================== */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ color: "var(--foreground)", marginBottom: "0.75rem" }}>What it creates</h2>
            <p style={{ fontSize: "1.0625rem", maxWidth: "500px", margin: "0 auto" }}>
              Every practice session generates a complete set of exam-style study materials.
            </p>
          </div>

          <FeatureGrid />
        </div>
      </section>

      {/* ==================== WHO IT'S FOR ==================== */}
      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ color: "var(--foreground)", marginBottom: "0.75rem" }}>Who it&apos;s for</h2>
            <p style={{ fontSize: "1.0625rem", maxWidth: "500px", margin: "0 auto" }}>
              Designed for serious exam candidates at every stage of preparation.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {WHO_ITS_FOR.map((persona) => (
              <div key={persona.title} className="card-elevated" style={{ display: "flex", gap: "1rem" }}>
                <div
                  style={{
                    fontSize: "2rem",
                    minWidth: "3rem",
                    height: "3rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {persona.icon}
                </div>
                <div>
                  <h3 style={{ margin: "0 0 0.375rem", fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>
                    {persona.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>{persona.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA BANNER ==================== */}
      <section className="section-sm">
        <div className="container-sm" style={{ textAlign: "center" }}>
          <div
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.08))",
              border: "1px solid var(--primary)",
              borderRadius: "var(--radius-xl)",
              padding: "3.5rem 2rem",
            }}
          >
            <h2 style={{ color: "var(--foreground)", marginBottom: "1rem" }}>
              Ready to forge your practice?
            </h2>
            <p style={{ fontSize: "1.0625rem", marginBottom: "2rem", maxWidth: "450px", margin: "0 auto 2rem" }}>
              No sign-up. No credit card. Paste your text and generate a complete study session for free.
            </p>
            <Link
              href="/practice"
              className="btn-primary"
              id="bottom-cta"
              style={{ fontSize: "1.0625rem", padding: "0.9375rem 2rem" }}
            >
              Generate Free Practice →
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== DISCLAIMER ==================== */}
      <section className="section-sm" style={{ background: "var(--surface)" }}>
        <div className="container-sm">
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "1.5rem",
              background: "var(--background)",
            }}
          >
            <h3 style={{ margin: "0 0 0.75rem", fontSize: "0.875rem", fontFamily: "var(--font-sans)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--foreground-muted)" }}>
              ℹ️ Important Disclaimer
            </h3>
            <p style={{ margin: 0, fontSize: "0.875rem", lineHeight: 1.7 }}>
              PracticeForge is an independent AI study tool. It is <strong style={{ color: "var(--foreground)" }}>not affiliated with, endorsed by, or associated with</strong> IELTS (administered by IDP Education, British Council, and Cambridge Assessment English), TOEFL iBT (administered by ETS — Educational Testing Service), or any other official examination organisation. All practice content is AI-generated for self-study purposes only. Estimated practice scores are not official scores and must not be used for visa, university, or professional applications.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
