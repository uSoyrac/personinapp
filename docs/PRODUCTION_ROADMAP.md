# PracticeForge — Production / SaaS Roadmap

**Goal:** Turn the current frontend demo into a real subscription SaaS.
**Stack:** Next.js 16 (App Router) · Supabase (Auth + Postgres) · Stripe (subscriptions) · Vercel (hosting).

> ⚠️ Next.js 16 note: the `middleware` file convention is **renamed to `proxy`** (`proxy.ts`, exports a `proxy` function). `cookies()` from `next/headers` is **async** (`await cookies()`). All Supabase SSR wiring follows these.

---

## What you (the owner) must do — accounts & money

These cannot be automated; they need your accounts / payment / approval:

1. **Supabase** (free) — create a project at supabase.com → copy `Project URL`, `anon` key, and `service_role` key.
2. **Stripe** (you have it) — create a **Product + recurring Price** for "Pro Study" and "Elite Mastery" → copy the Price IDs, the **Secret key**, and (after deploy) the **Webhook signing secret**.
3. **Vercel** (free) — connect the GitHub repo, add env vars, deploy.
4. **Domain** (~$10/yr) — buy from Cloudflare/Namecheap → point it at Vercel.

All keys go into environment variables (never committed). See `.env.example`.

---

## Phases (each phase is a working vertical slice)

> **Status (code):** Phases 0, 1 and 3 are **built and merge-ready** behind config
> guards — the app still runs as the demo until you add Supabase/Stripe keys.
> Phase 2 (data migration) and the account-dependent steps remain.

### Phase 0 — Foundation & deploy
- [x] Env config + `.env.example`
- [x] Supabase browser/server clients + `proxy.ts` session refresh
- [ ] Deploy current site to Vercel on the real domain — **needs your Vercel + domain**
- [x] SEO: env-based domain (`lib/siteUrl.ts`), dynamic `og-image` (`app/opengraph-image.tsx`), per-page metadata layouts

### Phase 1 — Real authentication  *(built; activate with Supabase keys)*
- [x] Supabase email/password + Google OAuth (in `SignupModal`)
- [x] Real sign up / sign in / sign out (`lib/authClient.ts`, `Nav`)
- [x] Auth callback route (`app/auth/callback`)
- [ ] Protect gated routes server-side via `proxy.ts` (after Phase 2)

### Phase 2 — Database (replace localStorage)  *(pending — best built against live Supabase)*
- [x] Schema + RLS + new-user trigger (`supabase/migrations/0001_init.sql`)
- [ ] Migrate vocabulary / question-bank / library / gamification to the DB

### Phase 3 — Stripe subscriptions  *(built; activate with Stripe keys)*
- [x] Checkout Session route (`app/api/stripe/checkout`)
- [x] Webhook handler → writes subscription status to DB (`app/api/stripe/webhook`)
- [x] Customer Portal route (`app/api/stripe/portal`)
- [x] Server-side gating helper (`lib/subscription.ts`) — wired into pages in Phase 2

### Phase 4 — Hardening for launch
- [x] Legal pages: Terms, Privacy & Contact (`app/terms`, `app/privacy`, `app/contact`) — templates, review with a lawyer
- [ ] Transactional email (welcome / receipts) via Supabase or Resend
- [ ] Rate limiting on API routes, error monitoring, analytics
- [ ] Final audit + load check

---

## Security guardrails
- Premium access is **never** trusted from the client. The server reads subscription status from the DB on every gated request.
- `service_role` key is server-only (never shipped to the browser / `NEXT_PUBLIC_*`).
- Stripe webhook signatures are always verified.
