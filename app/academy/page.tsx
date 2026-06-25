import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/academy";

export const metadata: Metadata = {
  title: "Academy — IELTS & TOEFL Study Guides",
  description:
    "Expert IELTS and TOEFL strategies, writing and speaking guides, and exam tips from the PracticeForge team.",
  alternates: { canonical: "/academy" },
};

export default function AcademyPage() {
  const articles = getAllArticles();

  return (
    <div className="section" style={{ paddingTop: "4rem" }}>
      <div className="container">
        <h1 style={{ marginBottom: "1rem" }}>
          PracticeForge <span className="gradient-text">Academy</span>
        </h1>
        <p style={{ fontSize: "1.25rem", color: "var(--foreground-muted)", marginBottom: "3rem" }}>
          Expert strategies and AI-driven tips to ace your exams.
        </p>

        {articles.length === 0 ? (
          <p style={{ color: "var(--foreground-muted)" }}>New articles are on the way — check back soon.</p>
        ) : (
          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))" }}>
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/academy/${a.slug}`}
                className="card hover-card"
                style={{ cursor: "pointer", textDecoration: "none", display: "flex", flexDirection: "column" }}
              >
                <span className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-block", alignSelf: "flex-start" }}>
                  {a.category}
                </span>
                <h2 style={{ fontSize: "1.5rem", marginBottom: "0.75rem", color: "var(--foreground)" }}>{a.title}</h2>
                <p style={{ color: "var(--foreground-muted)", marginBottom: "1.25rem", lineHeight: 1.6, flex: 1 }}>{a.excerpt}</p>
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>Read Article →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
