# AI Context: PracticeForge Project State
**Last Updated:** 2026-05-11

This file serves as a comprehensive hand-off document for any AI assistant working on this project. It summarizes the core features, architecture, and recent developments.

## Core Stack
- **Framework:** Next.js 16.2.4 (Turbopack enabled)
- **Styling:** Vanilla CSS (Global styles in `app/globals.css`)
- **State Management:** React Context (`lib/AppContext.tsx`) with LocalStorage persistence.

## Recent Major Developments

### 1. Academy & SEO Optimization
- **Folder:** `app/academy`
- **Dynamic Routing:** `app/academy/[slug]/page.tsx`
- **Features:**
  - Semantic HTML5 used for all article structures.
  - JSON-LD Schema (Article & Breadcrumbs) injected for Google Rich Results.
  - Dynamic metadata generated via `generateMetadata`.
  - **AI Readability:** Added `<link rel="alternate" type="text/markdown">` in the head pointing to a clean Markdown API.
  - **API Endpoint:** `app/api/academy/[slug]/llm/route.ts` returns the pure Markdown content of the article for AI crawlers, matching the rich content (tables, links) of the page.

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

## File Map for Key Features
- **Global State:** `lib/AppContext.tsx`
- **Global CSS:** `app/globals.css` (Contains `.hover-card`, `.article-table`, `.alert-hook` etc.)
- **Academy Template:** `app/academy/[slug]/page.tsx`
- **LLM API:** `app/api/academy/[slug]/llm/route.ts`
- **Vocabulary Quiz:** `app/vocabulary/page.tsx`
- **Leaderboard:** `app/leaderboard/page.tsx`
- **Library:** `app/library/page.tsx`
- **Community:** `app/community/page.tsx`
- **Navigation:** `components/Nav.tsx`
