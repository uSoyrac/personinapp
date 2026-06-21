import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const ACADEMY_DIR = path.join(process.cwd(), "content", "academy");

export type ArticleMeta = {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string;
  author: string;
  excerpt: string;
};

export type Article = ArticleMeta & { html: string };

type Frontmatter = Partial<Omit<ArticleMeta, "slug" | "excerpt">> & {
  excerpt?: string;
};

function metaFromFrontmatter(slug: string, data: Frontmatter, body: string): ArticleMeta {
  return {
    slug,
    title: data.title ?? slug,
    description: data.description ?? "",
    keywords: Array.isArray(data.keywords) ? data.keywords : [],
    category: data.category ?? "Insights",
    date: data.date ?? "",
    author: data.author ?? "PracticeForge Team",
    excerpt: data.excerpt ?? data.description ?? body.trim().slice(0, 160),
  };
}

/** All article slugs (= filenames without .md). Build-time, server only. */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(ACADEMY_DIR)) return [];
  return fs
    .readdirSync(ACADEMY_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** All articles (metadata only), newest first. */
export function getAllArticles(): ArticleMeta[] {
  return getAllSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(ACADEMY_DIR, `${slug}.md`), "utf8");
      const { data, content } = matter(raw);
      return metaFromFrontmatter(slug, data as Frontmatter, content);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** A single article with its rendered HTML body, or null if missing. */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const file = path.join(ACADEMY_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const html = await marked.parse(content);
  return { ...metaFromFrontmatter(slug, data as Frontmatter, content), html };
}

/** Raw markdown body for a slug (used by the LLM/AI-crawler endpoint). */
export function getArticleMarkdown(slug: string): { meta: ArticleMeta; markdown: string } | null {
  const file = path.join(ACADEMY_DIR, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { meta: metaFromFrontmatter(slug, data as Frontmatter, content), markdown: content.trim() };
}
