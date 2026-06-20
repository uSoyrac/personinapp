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

### Phase 0 — Foundation & deploy
- [ ] Env config + `.env.example`
- [ ] Supabase browser/server clients + `proxy.ts` session refresh
- [ ] Deploy current site to Vercel on the real domain
- [ ] SEO: env-based domain, generate `og-image`, per-page metadata

### Phase 1 — Real authentication
- [ ] Supabase email/password + Google OAuth
- [ ] Replace the mock `SignupModal` with real sign up / sign in / sign out
- [ ] Auth callback route + session-aware `Nav`
- [ ] Protect gated routes via `proxy.ts`

### Phase 2 — Database (replace localStorage)
- [ ] Schema: `profiles`, `subscriptions`, `folders`, `saved_words`, `saved_questions`, `xp_events`
- [ ] Row Level Security policies (per-user)
- [ ] Migrate vocabulary / question-bank / library / gamification to the DB

### Phase 3 — Stripe subscriptions
- [ ] Checkout Session route (subscription mode)
- [ ] Webhook handler → write subscription status to DB
- [ ] Customer Portal route (manage/cancel)
- [ ] **Server-side** premium gating (replace the spoofable `localStorage` tier)

### Phase 4 — Hardening for launch
- [ ] Legal pages: Terms & Privacy (required by Stripe)
- [ ] Transactional email (welcome / receipts) via Supabase or Resend
- [ ] Rate limiting on API routes, error monitoring, analytics
- [ ] Final audit + load check

---

## Security guardrails
- Premium access is **never** trusted from the client. The server reads subscription status from the DB on every gated request.
- `service_role` key is server-only (never shipped to the browser / `NEXT_PUBLIC_*`).
- Stripe webhook signatures are always verified.
