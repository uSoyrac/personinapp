import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About PracticeForge",
  description:
    "PracticeForge turns any text into personalised IELTS and TOEFL practice with AI. Learn about our mission to make exam prep faster, cheaper and more effective.",
  alternates: { canonical: "/about" },
};

const VALUES = [
  { icon: "🎯", title: "Personalised", text: "Practice is generated from text you care about, at your exact level — not generic question banks." },
  { icon: "⚡", title: "Instant feedback", text: "Reading, vocabulary and speaking feedback in seconds, so you learn from every attempt." },
  { icon: "💸", title: "Affordable", text: "A fraction of the cost of private tutoring, available 24/7 whenever you study." },
  { icon: "🔒", title: "Honest", text: "We are an independent study tool. Scores are AI estimates for practice — never a substitute for the official exam." },
];

export default function AboutPage() {
  return (
    <div className="section" style={{ paddingTop: "4rem" }}>
      <div className="container" style={{ maxWidth: "860px" }}>
        <span className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-block" }}>About us</span>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "1rem" }}>
          Exam prep that adapts to <span className="gradient-text">you</span>
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--foreground-muted)", lineHeight: 1.7, marginBottom: "3rem" }}>
          PracticeForge was built on a simple idea: the fastest way to improve at IELTS and TOEFL is to
          practise with material that matters to you and get feedback instantly. We use AI to turn any
          article, transcript, or passage into exam-style reading, vocabulary and speaking practice — in
          seconds.
        </p>

        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Our mission</h2>
        <p style={{ color: "var(--foreground-muted)", lineHeight: 1.8, marginBottom: "3rem" }}>
          Quality exam preparation has long been expensive and one-size-fits-all. We want to make it
          personalised, affordable, and available to every learner — whether you are aiming for Band 8 in
          IELTS or 100+ in TOEFL. Our tools meet you where you are and grow with you.
        </p>

        <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>What we stand for</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          {VALUES.map((v) => (
            <div key={v.title} className="card" style={{ padding: "1.5rem" }}>
              <div style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>{v.icon}</div>
              <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>{v.title}</h3>
              <p style={{ margin: 0, color: "var(--foreground-muted)", lineHeight: 1.6, fontSize: "0.9375rem" }}>{v.text}</p>
            </div>
          ))}
        </div>

        <div className="card-elevated" style={{ padding: "2.5rem", textAlign: "center" }}>
          <h2 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Ready to start?</h2>
          <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>
            Generate your first practice session free — no credit card required.
          </p>
          <Link href="/practice" className="btn-primary" style={{ display: "inline-block" }}>
            Try PracticeForge free →
          </Link>
        </div>

        <p style={{ marginTop: "2rem", fontSize: "0.8125rem", color: "var(--foreground-faint)", lineHeight: 1.7 }}>
          PracticeForge is an independent study tool and is not affiliated with IELTS (IDP Education, the
          British Council, or Cambridge Assessment English) or TOEFL (ETS). All content is AI-generated for
          self-study purposes.
        </p>
      </div>
    </div>
  );
}
