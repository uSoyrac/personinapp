import { NextResponse } from "next/server";
import { getArticleMarkdown } from "@/lib/academy";
import { SITE_URL } from "@/lib/siteUrl";

// Clean Markdown version of an Academy article for AI crawlers / LLMs.
// Mirrors the on-page content exactly (single source of truth: the .md file).
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleMarkdown(slug);

  if (!article) {
    return new NextResponse("Article not found.", { status: 404 });
  }

  const markdown = `${article.markdown}\n\n---\nSource: ${SITE_URL}/academy/${slug}\n`;

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
