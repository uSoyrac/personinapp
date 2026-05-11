import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>
}

// Generate Dynamic SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  return {
    title: `${title} | PracticeForge Academy`,
    description: `A comprehensive guide to mastering ${title}. Discover expert tips, strategies, and AI-driven practice routines.`,
    alternates: {
      types: {
        'text/markdown': `/api/academy/${slug}/llm`
      }
    },
    openGraph: {
      title,
      description: `A comprehensive guide to mastering ${title}.`,
      type: "article",
      authors: ["PracticeForge Team"],
      images: ["/images/blog-cover.png"]
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;

  // Mock post data (in a real app, this comes from a CMS or database)
  const post = {
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    date: "2026-05-15",
    author: "PracticeForge Team",
    readTime: "PT7M",
    readTimeText: "7 min read",
    category: "Exam Strategies",
    coverImage: "/images/blog-cover.png",
    content: "This is a comprehensive guide to mastering your English exams. Artificial Intelligence has revolutionized the way we prepare for IELTS and TOEFL. By utilizing advanced analytics and natural language processing, you can target specific weak points in your academic vocabulary and essay structures."
  };

  if (!post) return notFound();

  // Enhanced JSON-LD Article Schema (Google Top Stories compliant)
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": [
      `https://practiceforge.com${post.coverImage}`
    ],
    "datePublished": `${post.date}T08:00:00+08:00`,
    "dateModified": `${post.date}T08:00:00+08:00`,
    "author": {
      "@type": "Organization",
      "name": post.author,
      "url": "https://practiceforge.com/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "PracticeForge",
      "logo": {
        "@type": "ImageObject",
        "url": "https://practiceforge.com/logo.png"
      }
    },
    "timeRequired": post.readTime,
    "articleSection": post.category,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://practiceforge.com/academy/${slug}`
    }
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      
      {/* Note: AI-Crawler Alternate Link is handled by generateMetadata */}

      <main className="section" style={{ paddingTop: "3rem" }}>
        <article className="container" style={{ maxWidth: "800px" }}>
          
          <header>
            {/* Breadcrumb UI */}
            <nav aria-label="Breadcrumb" style={{ display: "flex", gap: "0.5rem", fontSize: "0.875rem", color: "var(--foreground-muted)", marginBottom: "2rem" }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
              <span>/</span>
              <Link href="/academy" style={{ color: "inherit", textDecoration: "none" }}>Academy</Link>
              <span>/</span>
              <span style={{ color: "var(--foreground)", fontWeight: 500 }} aria-current="page">{post.title}</span>
            </nav>

            <div className="badge badge-primary" style={{ marginBottom: "1rem", display: "inline-block" }}>{post.category}</div>
            <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem", lineHeight: 1.2 }}>{post.title}</h1>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", color: "var(--foreground-muted)", fontSize: "0.9375rem", marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
              <span><strong>Author:</strong> {post.author}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={post.date}>{post.date}</time>
              <span aria-hidden="true">•</span>
              <span>{post.readTimeText}</span>
            </div>

            {/* Top of Funnel: Hero Image */}
            {/* Using standard img for simplicity in dynamic mock, Next/Image normally preferred */}
            <img 
              src={post.coverImage} 
              alt={`Cover image for ${post.title}`} 
              className="article-image" 
              fetchPriority="high"
            />
          </header>

          <section className="article-content">
            <p className="lead" style={{ fontSize: "1.25rem", color: "var(--foreground)", fontWeight: 500 }}>{post.content}</p>

            {/* Table of Contents */}
            <div className="toc">
              <h3>Table of Contents</h3>
              <ul>
                <li><a href="#why-ai">1. Why AI Tutors Work</a></li>
                <li><a href="#comparison">2. AI vs Traditional Tutoring</a></li>
                <li><a href="#success-tips">3. Tips for Success</a></li>
              </ul>
            </div>

            <h2 id="why-ai">Why AI Tutors Work</h2>
            <p>Practice consistently with our AI tutor to identify your weak spots and improve your band score efficiently. Unlike traditional methods, real-time feedback allows you to instantly correct mistakes. To master the fundamentals, you might want to review our <Link href="/general-english" className="article-link">General English Lab</Link> before tackling the heavy exams.</p>
            
            {/* Soft Hook (Mid-Funnel CTA) */}
            <div className="alert-hook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <div>
                <p><strong>Stuck at Band 6.0?</strong> Join 15,000+ students who unlocked their dream score.</p>
                <Link href="/practice" className="article-link" style={{ fontSize: "0.9375rem" }}>Try the AI Simulator now →</Link>
              </div>
            </div>

            <h2 id="comparison">AI vs Traditional Tutoring</h2>
            <p>According to research from leading linguistic authorities like <a href="https://www.cambridgeenglish.org/" target="_blank" rel="noopener noreferrer" className="article-link">Cambridge Assessment</a>, instant error correction accelerates language acquisition by up to 40%.</p>

            {/* Rich Media: Comparison Table */}
            <table className="article-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Traditional Tutor</th>
                  <th>PracticeForge AI</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Availability</strong></td>
                  <td>1-2 hours/week</td>
                  <td>24/7 Unlimited</td>
                </tr>
                <tr>
                  <td><strong>Feedback Speed</strong></td>
                  <td>Next day</td>
                  <td>Instant (Seconds)</td>
                </tr>
                <tr>
                  <td><strong>Cost</strong></td>
                  <td>$40-$80 / hour</td>
                  <td>From $15 / month</td>
                </tr>
                <tr>
                  <td><strong>Analytics</strong></td>
                  <td>Subjective notes</td>
                  <td>Data-driven progress tracking</td>
                </tr>
              </tbody>
            </table>
            
            <h2 id="success-tips">3 Tips for Success</h2>
            <ul>
              <li><strong>Consistency:</strong> Practice every single day, even if it's just 15 minutes.</li>
              <li><strong>Targeted Review:</strong> Don't just do tests; review your mistakes thoroughly.</li>
              <li><strong>Vocab Context:</strong> Learn words in collocations rather than isolated lists.</li>
            </ul>
          </section>

          <footer>
            {/* Bottom of Funnel: High Conversion CTA */}
            <aside className="card-elevated" style={{ marginTop: "4rem", padding: "3rem 2rem", textAlign: "center", background: "linear-gradient(135deg, var(--surface), var(--primary-glow))", border: "1px solid var(--primary-light)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚀</div>
              <h3 style={{ marginBottom: "1rem", fontSize: "1.75rem" }}>Ready to apply these strategies?</h3>
              <p style={{ color: "var(--foreground-muted)", marginBottom: "2rem", fontSize: "1.125rem", maxWidth: "500px", margin: "0 auto 2rem" }}>
                Stop guessing your score. Get instant feedback on your essays, speaking, and reading comprehension.
              </p>
              <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/practice" className="btn-primary" style={{ fontSize: "1.125rem", padding: "1rem 2rem" }}>Start Free Practice</Link>
                <Link href="/pricing" className="btn-secondary" style={{ fontSize: "1.125rem", padding: "1rem 2rem" }}>View Elite Plans</Link>
              </div>
            </aside>
          </footer>

        </article>
      </main>
    </>
  );
}
