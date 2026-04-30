import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — PracticeForge",
  description: "Simple, transparent pricing for IELTS and TOEFL practice. Free plan available, no credit card required.",
};

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started. No API key needed.",
    badge: null,
    features: [
      "Up to 300 words input",
      "5 reading comprehension questions",
      "5 vocabulary items extracted",
      "Save words to your word list",
      "Vocabulary quiz with spaced repetition",
      "Instant generation — no API cost",
    ],
    limitations: [
      "No writing or speaking prompts",
      "No 7-day study plan",
    ],
    cta: "Get started free",
    ctaHref: "/practice",
    highlighted: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9",
    period: "per month",
    description: "Full power practice with extended limits and all features unlocked.",
    badge: "Best value",
    features: [
      "Up to 2000 words input",
      "15+ reading comprehension questions",
      "15+ vocabulary items extracted",
      "Writing & speaking prompts generated",
      "Personalised 7-day study plan",
      "Save words to your word list",
      "Vocabulary quiz with spaced repetition",
      "Instant generation — no API cost",
    ],
    limitations: [],
    cta: "Upgrade to Premium",
    ctaHref: "/practice",
    highlighted: true,
  },
];

const FAQ = [
  {
    q: "Are these official IELTS or TOEFL scores?",
    a: "No. PracticeForge is not affiliated with IELTS, TOEFL, ETS, British Council, IDP, or Cambridge Assessment English. All content is generated for self-study purposes only.",
  },
  {
    q: "Do I need an API key?",
    a: "No! PracticeForge generates all content using our built-in algorithm — no API key needed, no external API costs.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No long-term contracts. Cancel your subscription at any time, and you retain access until the end of your billing period.",
  },
  {
    q: "How does the quiz engine work?",
    a: "Our system analyses your text using natural language processing to extract key concepts, generate comprehension questions, and identify important vocabulary — all without sending your data to external AI services.",
  },
  {
    q: "What is the word list feature?",
    a: "Every vocabulary item extracted from your texts can be saved to a personal word list. You can then practice these words with multiple-choice quizzes that use spaced repetition for optimal memorisation.",
  },
];

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <section className="section" style={{ textAlign: "center", paddingBottom: "3rem" }}>
        <div className="container-sm">
          <div className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-flex" }}>
             Pricing
          </div>
          <h1 style={{ margin: "0 0 1rem", color: "var(--foreground)" }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: "1.125rem", maxWidth: "500px", margin: "0 auto" }}>
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: "var(--radius-md)",
              padding: "0.625rem 1rem",
              marginTop: "1.5rem",
              fontSize: "0.875rem",
              color: "#fbbf24",
            }}
          >
             Payments not yet implemented — this is a UI preview only
          </div>
        </div>
      </section>

      {/* Pricing cards */}
      <section style={{ padding: "0 1rem 5rem" }}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1.25rem",
              alignItems: "start",
            }}
          >
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                id={`tier-${tier.id}`}
                style={{
                  background: tier.highlighted ? "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(16,185,129,0.06))" : "var(--surface)",
                  border: `${tier.highlighted ? "2px" : "1px"} solid ${tier.highlighted ? "var(--primary)" : "var(--border)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "1.75rem",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  boxShadow: tier.highlighted ? "var(--shadow-glow)" : "none",
                }}
              >
                {tier.badge && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-0.75rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span className={`badge ${tier.id === "teacher" ? "badge-gray" : "badge-primary"}`}>
                      {tier.badge}
                    </span>
                  </div>
                )}

                {/* Name & price */}
                <div>
                  <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: tier.highlighted ? "var(--primary-light)" : "var(--foreground-muted)" }}>
                    {tier.name}
                  </p>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                    <span style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--foreground)", fontFamily: "var(--font-display)", lineHeight: 1 }}>
                      {tier.price}
                    </span>
                    <span style={{ fontSize: "0.9375rem", color: "var(--foreground-muted)" }}>/{tier.period}</span>
                  </div>
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", lineHeight: 1.5 }}>{tier.description}</p>
                </div>

                <hr className="divider" style={{ margin: 0 }} />

                {/* Features */}
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", fontSize: "0.875rem" }}>
                      <span style={{ color: "var(--accent-light)", minWidth: "1rem" }}></span>
                      <span style={{ color: "var(--foreground)" }}>{f}</span>
                    </li>
                  ))}
                  {tier.limitations.map((l) => (
                    <li key={l} style={{ display: "flex", gap: "0.625rem", alignItems: "flex-start", fontSize: "0.875rem" }}>
                      <span style={{ color: "var(--foreground-faint)", minWidth: "1rem" }}>–</span>
                      <span style={{ color: "var(--foreground-faint)" }}>{l}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href={tier.ctaHref}
                  id={`cta-${tier.id}`}
                  className={tier.highlighted ? "btn-primary" : "btn-secondary"}
                  style={{ textAlign: "center", marginTop: "auto", display: "block", padding: "0.875rem" }}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ paddingTop: "1rem", background: "var(--surface)" }}>
        <div className="container-sm">
          <h2 style={{ color: "var(--foreground)", marginBottom: "2rem", textAlign: "center" }}>
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {FAQ.map((item) => (
              <div key={item.q} className="card">
                <h3 style={{ margin: "0 0 0.5rem", fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 700, color: "var(--foreground)" }}>
                  {item.q}
                </h3>
                <p style={{ margin: 0, fontSize: "0.9375rem", lineHeight: 1.6 }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
