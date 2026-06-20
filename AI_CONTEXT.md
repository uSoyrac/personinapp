# AI Context: PracticeForge Project State
**Last Updated:** 2026-06-20

This file serves as a comprehensive hand-off document for any AI assistant working on this project. It summarizes the core features, architecture, and recent developments.

## Core Stack
- **Framework:** Next.js 16.2.4 (Turbopack enabled)
- **Styling:** Vanilla CSS (Global styles in `app/globals.css`)
- **State Management:** React Context (`lib/AppContext.tsx`) with LocalStorage persistence.

## Recent Major Developments

### 1. Academy (Insights)
- **Folder:** `app/academy`
- **Page:** `app/academy/page.tsx` — a single client-rendered "Insights" page that lists and displays articles. There is currently **no** `app/academy/[slug]/page.tsx` route; the `[slug]` segment is only used by the LLM API below.
- **LLM Markdown API:** `app/api/academy/[slug]/llm/route.ts` returns pure Markdown derived from a slug, intended for AI crawlers.

### 2. Gamification & Profiles
- **Folder:** `app/leaderboard`
- **Features:**
  - Profile Editor added to the Leaderboard page. Users can set Name, Country (Flag), and Target Score.
  - The leaderboard dynamically inserts the current user based on points stored in `AppContext`.
  - XP points are awarded for answering questions correctly in the vocabulary quiz.

### 3. Advanced Vocabulary Practice
- **Folder:** `app/vocabulary`
- **Features:**
  - Quiz supports Forward/Backward navigation between questions.
  - **Anti-Cheat:** Answered questions are locked; users cannot change a wrong answer by navigating back.
  - "Add to Difficult Words" button on question cards.

### 4. Freemium Architecture & Library
- **Context:** `lib/AppContext.tsx` manages `isPremium` state.
- **Freemium Limits:**
  - Free users are capped at practicing 20 words in the quiz.
  - Free users cannot access the Library or Community pages.
- **Library (`app/library`):**
  - Premium users can manage folders for words and questions.
  - Enforced limits: Max 1000 words and 500 questions.
- **Community (`app/community`):**
  - Premium users can access Discord links and create support/partner matching tickets.

## Mock State & Dev Tools
- Since there is no backend database connected yet, state is managed in `lib/AppContext.tsx` and saved to browser `localStorage`.
- In `/library` and `/community`, there is a **"Simulate Premium (Dev)"** button to toggle the premium state for testing.
- To clear all state, you can visit the site with `?reset=true` in the URL (handled in `Nav.tsx`).

## Quality & Production Readiness
- **Install first:** a clean checkout needs `npm install` before building — `next build` type-checks `playwright.config.ts` / `tests/`, so a missing `@playwright/test` breaks the build.
- **Quality gates (all green):**
  - `npm run lint` — ESLint (0 errors, 0 warnings).
  - `npm run typecheck` — `tsc --noEmit`.
  - `npm run build` — production build.
  - `npm test` — Playwright e2e (`tests/e2e.spec.ts` + `tests/extended.spec.ts`). The Playwright config auto-starts a dev server on port 3050.
- **Hydration pattern:** client-only/`localStorage`-derived values must not be read during render. Use `useHydrated()` (`lib/useHydrated.ts`, built on `useSyncExternalStore`) as the gate instead of the `useState(false)` + `useEffect(setMounted(true))` pattern, which the React Compiler lint rules (`react-hooks/set-state-in-effect`) flag.
- **Security:** pinned to `next@16.2.9` (patches the high-severity advisories present in 16.2.4). Remaining `npm audit` items are Next's build-time bundled `postcss` — do **not** run `npm audit fix --force`, which would downgrade Next.

## File Map for Key Features
- **Global State:** `lib/AppContext.tsx`
- **Global CSS:** `app/globals.css` (Contains `.hover-card`, `.article-table`, `.alert-hook` etc.)
- **Academy Page:** `app/academy/page.tsx`
- **LLM API:** `app/api/academy/[slug]/llm/route.ts`
- **Vocabulary Quiz:** `app/vocabulary/page.tsx`
- **Leaderboard:** `app/leaderboard/page.tsx`
- **Library:** `app/library/page.tsx`
- **Community:** `app/community/page.tsx`
- **Navigation:** `components/Nav.tsx`
