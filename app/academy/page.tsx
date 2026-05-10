import Link from "next/link";

export default function BlogIndex() {
  const posts = [
    { slug: "how-to-score-band-8-ielts-writing", title: "How to Score Band 8 in IELTS Writing Task 2", category: "IELTS Tips" },
    { slug: "toefl-speaking-templates", title: "The Ultimate TOEFL Speaking Templates (2026)", category: "TOEFL Strategies" },
    { slug: "mastering-academic-vocabulary", title: "Mastering Academic Vocabulary for Beginners", category: "General English" }
  ];

  return (
    <div className="section" style={{ paddingTop: "4rem" }}>
      <div className="container">
        <h1 style={{ marginBottom: "1rem" }}>PracticeForge <span className="gradient-text">Insights</span></h1>
        <p style={{ fontSize: "1.25rem", color: "var(--foreground-muted)", marginBottom: "3rem" }}>Expert strategies and AI-driven tips to ace your exams.</p>
        
        <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {posts.map(post => (
            <Link key={post.slug} href={`/academy/${post.slug}`} className="card" style={{ display: "block", textDecoration: "none", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-block" }}>{post.category}</div>
              <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{post.title}</h3>
              <p style={{ color: "var(--primary)", fontWeight: 600 }}>Read Article →</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
