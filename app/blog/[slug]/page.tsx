import { getPostBySlug, BLOG_POSTS } from "@/lib/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: \`\${post.title} — PracticeForge Blog\`,
    description: post.excerpt,
    openGraph: {
      images: [post.coverImage],
    },
  };
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug);
  if (!post) notFound();

  // Simple Markdown-like renderer for mock content
  const htmlContent = post.content
    .replace(/^# (.*$)/gim, '<h1 style="font-size: 2.5rem; margin-top: 2rem; margin-bottom: 1rem;">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem;">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.25rem; margin-top: 1.5rem; margin-bottom: 0.5rem;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\n\n/gim, '<br/><br/>');

  return (
    <article className="section" style={{ paddingTop: "2rem" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        
        <a href="/blog" style={{ display: "inline-block", marginBottom: "2rem", color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>
          ← Back to Blog
        </a>

        <div style={{ height: "400px", background: \`url(\${post.coverImage}) center/cover\`, border: "4px solid #000", boxShadow: "8px 8px 0px #000", marginBottom: "2rem" }} />

        <div className="card" style={{ padding: "3rem" }}>
          <p style={{ margin: "0 0 1rem", fontSize: "1rem", color: "var(--foreground-muted)", fontWeight: 700 }}>
            Published on {post.date} by {post.author}
          </p>

          <div 
            style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "var(--foreground)" }}
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>

      </div>
    </article>
  );
}
