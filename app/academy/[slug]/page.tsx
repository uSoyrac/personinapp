import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Mock post data
  const post = {
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    date: "2026-05-15",
    author: "PracticeForge Team",
    readTime: "PT5M",
    readTimeText: "5 min read",
    category: "Exam Strategies",
    content: "This is a comprehensive guide to mastering your English exams. Artificial Intelligence has revolutionized the way we prepare for IELTS and TOEFL..."
  };

  if (!post) return notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "author": {
      "@type": "Organization",
      "name": post.author
    },
    "datePublished": post.date,
    "timeRequired": post.readTime,
    "articleSection": post.category
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://practiceforge.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Academy",
        "item": "https://practiceforge.com/academy"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://practiceforge.com/academy/${slug}`
      }
    ]
  };

  return (
    <div className="section" style={{ paddingTop: "3rem" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="container" style={{ maxWidth: "800px" }}>
        
        {/* Breadcrumb UI */}
        <nav style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "var(--foreground-muted)", marginBottom: "2rem" }}>
          <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          <Link href="/academy" style={{ color: "inherit", textDecoration: "none" }}>Academy</Link>
          <span>/</span>
          <span style={{ color: "var(--foreground)", fontWeight: 500 }}>{post.title}</span>
        </nav>

        <div className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-block" }}>{post.category}</div>
        <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem", lineHeight: 1.2 }}>{post.title}</h1>
        
        <div style={{ display: "flex", gap: "1rem", color: "var(--foreground-muted)", fontSize: "0.9375rem", marginBottom: "3rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
          <span><strong>Author:</strong> {post.author}</span>
          <span>•</span>
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTimeText}</span>
        </div>

        <div style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "var(--foreground)" }}>
          <p>{post.content}</p>
          <p>Practice consistently with our AI tutor to identify your weak spots and improve your band score efficiently.</p>
        </div>

        {/* CTA Hook for Blog Readers */}
        <div className="card-elevated" style={{ marginTop: "4rem", padding: "2rem", textAlign: "center", background: "linear-gradient(135deg, var(--surface), var(--primary-glow))" }}>
          <h3 style={{ marginBottom: "1rem" }}>Ready to apply these strategies?</h3>
          <p style={{ color: "var(--foreground-muted)", marginBottom: "1.5rem" }}>Try our AI Language Coach completely free.</p>
          <Link href="/practice" className="btn-primary">Start Free Practice</Link>
        </div>
      </div>
    </div>
  );
}
