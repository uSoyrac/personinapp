import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getArticleBySlug } from "@/lib/academy";
import { SITE_URL } from "@/lib/siteUrl";

// Only the prebuilt article slugs exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};

  const url = `${SITE_URL}/academy/${slug}`;
  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/academy/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      url,
      publishedTime: article.date || undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date || undefined,
    author: { "@type": "Organization", name: article.author },
    publisher: { "@type": "Organization", name: "PracticeForge" },
    mainEntityOfPage: `${SITE_URL}/academy/${slug}`,
  };

  return (
    <div className="section" style={{ paddingTop: "3rem" }}>
      <div className="container" style={{ maxWidth: "780px" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav style={{ marginBottom: "1.5rem", fontSize: "0.875rem", color: "var(--foreground-muted)" }}>
          <Link href="/" style={{ color: "var(--foreground-muted)" }}>Home</Link>
          {" › "}
          <Link href="/academy" style={{ color: "var(--foreground-muted)" }}>Academy</Link>
          {" › "}
          <span style={{ color: "var(--foreground)" }}>{article.category}</span>
        </nav>

        <span className="badge badge-primary" style={{ marginBottom: "1.25rem", display: "inline-block" }}>
          {article.category}
        </span>

        <article className="article-body" dangerouslySetInnerHTML={{ __html: article.html }} />

        <div className="card-elevated" style={{ marginTop: "3rem", padding: "2rem", textAlign: "center" }}>
          <h3 style={{ marginTop: 0 }}>Practise what you just learned</h3>
          <p style={{ color: "var(--foreground-muted)" }}>
            Turn any text into exam-style practice in seconds — completely free to start.
          </p>
          <Link href="/practice" className="btn-primary" style={{ display: "inline-block", marginTop: "0.5rem" }}>
            Start practising free →
          </Link>
        </div>

        <p style={{ marginTop: "2rem" }}>
          <Link href="/academy" style={{ color: "var(--primary)", fontWeight: 600 }}>← All articles</Link>
        </p>
      </div>
    </div>
  );
}
