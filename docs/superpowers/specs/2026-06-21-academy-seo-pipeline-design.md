# Academy programmatic-SEO content pipeline — design

**Date:** 2026-06-21
**Status:** Approved (build optimal defaults)

## Goal
Feed a pool of English keywords, generate SEO-optimized articles on demand (in
chat), and publish them automatically via git push → Vercel. Content powers a
rebuilt, real `/academy` (static, crawlable) instead of the current placeholder.

## Decisions
- **Trigger:** on-demand in chat — Claude generates files, commits, pushes.
- **Storage:** markdown files in the repo (content-as-code).
- **Language:** English (global).
- **Section:** rebuild Academy into real SSG pages.
- **Libraries:** `gray-matter` (frontmatter) + `marked` (markdown → HTML).

## Architecture

```
content/
  keywords.json          # the "pool": [{ keyword, status, slug? }]
  academy/<slug>.md      # one article per file (frontmatter + body)
lib/academy.ts           # loader: getAllArticles / getArticleBySlug / getAllSlugs
app/academy/page.tsx     # server component: article list (rebuilt)
app/academy/[slug]/page.tsx  # SSG: generateStaticParams + generateMetadata + JSON-LD
app/sitemap.ts           # includes /academy/<slug> dynamically
app/api/academy/[slug]/llm/route.ts  # serve the real markdown for AI crawlers
```

### Article file format
```md
---
title: "How to Score Band 8 in IELTS Writing Task 2"
description: "Meta description ≤ 160 chars including the primary keyword."
keywords: ["ielts writing band 8", "ielts task 2"]
category: "IELTS Tips"
date: "2026-06-21"
author: "PracticeForge Team"
---
# H1 with primary keyword
... body ...
```

### Keyword pool format
```json
[
  { "keyword": "ielts writing band 8 tips", "status": "published", "slug": "how-to-score-band-8-ielts-writing" },
  { "keyword": "toefl speaking templates", "status": "pending" }
]
```
The user appends keywords (file or chat); Claude processes `pending` ones, writes
articles, flips them to `published`.

### Loader (`lib/academy.ts`)
- `getAllArticles()` → parsed list sorted by date desc (frontmatter + excerpt).
- `getArticleBySlug(slug)` → article + rendered HTML (marked).
- `getAllSlugs()` → for `generateStaticParams` and sitemap.
- Reads `content/academy/*.md` with `fs` at build time (server only).

### Routes
- `/academy` — server component listing cards (category, title, excerpt) → links.
- `/academy/[slug]` — `generateStaticParams` (one static page per file),
  `generateMetadata` (title/description/canonical/OG per article), Article +
  FAQPage JSON-LD, breadcrumbs, rendered HTML, internal links + signup CTA.
- `params` is a Promise (`await params`) per Next 16.

### SEO template each article follows
H1 (primary keyword) · ~120-word intro · 5–7 H2 sections · FAQ · internal links
to `/practice`, `/vocabulary`, related articles · signup CTA · ~1000–1500 words ·
Article + FAQPage structured data · breadcrumbs.

## Out of scope
- `lib/blog.ts` (legacy Turkish posts) — left as-is.
- DB-backed content / scheduled autopilot — possible later.

## Testing / verification
- `npm run build` statically generates every article page.
- lint + typecheck + existing 39 e2e stay green.
- Add an e2e check: `/academy` lists articles and an article page renders.
- Visually verify one article page in the browser.

## Workflow (steady state)
1. User adds keywords to `content/keywords.json` (or pastes in chat).
2. Claude writes `content/academy/<slug>.md` for each, updates the pool.
3. Build + lint verify; commit + push → Vercel deploys → live.
