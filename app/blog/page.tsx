import { BLOG_POSTS } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — PracticeForge",
  description: "Improve your English with our IELTS, TOEFL, and General English tips and tricks.",
};

export default function BlogIndex() {
  return (
    <div className="section" style={{ paddingTop: "3rem" }}>
      <div className="container">
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          
          <div style={{ marginBottom: "3rem" }}>
            <div className="badge badge-primary" style={{ marginBottom: "0.75rem", display: "inline-flex" }}>
              Our Blog
            </div>
            <h1 style={{ margin: "0 0 0.5rem", color: "var(--foreground)", fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              English Mastery Hub
            </h1>
            <p style={{ margin: 0, fontSize: "1.125rem", color: "var(--foreground-muted)" }}>
              Tips, strategies, and secrets for acing your exams and mastering the English language.
            </p>
          </div>

          <div style={{ display: "grid", gap: "2rem", gridTemplateColumns: "1fr" }}>
            {BLOG_POSTS.map(post => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post.slug}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card" style={{ padding: "0", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ height: "200px", background: `url(${post.coverImage}) center/cover` }} />
                  <div style={{ padding: "2rem" }}>
                    <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: "var(--foreground-muted)", fontWeight: 700 }}>
                      {post.date} • {post.author}
                    </p>
                    <h2 style={{ margin: "0 0 1rem", fontSize: "1.75rem", color: "var(--foreground)", fontFamily: "var(--font-display)" }}>
                      {post.title}
                    </h2>
                    <p style={{ margin: "0 0 1.5rem", fontSize: "1rem", lineHeight: 1.6 }}>
                      {post.excerpt}
                    </p>
                    <span className="btn-primary" style={{ display: "inline-block" }}>
                      Read Article ➔
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
