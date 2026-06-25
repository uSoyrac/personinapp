-- ============================================================
-- PracticeForge — self-hosted PostgreSQL schema (no Supabase).
-- Run once:  psql "$DATABASE_URL" -f db/schema.sql
-- Passwords are stored as bcrypt hashes (never plaintext, never MD5).
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists users (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  password_hash text not null,
  display_name  text,
  created_at    timestamptz not null default now()
);

create table if not exists subscriptions (
  user_id                uuid primary key references users (id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text,
  plan                   text not null default 'free',     -- free | pro | elite
  status                 text not null default 'inactive', -- active | trialing | past_due | canceled | inactive
  current_period_end     timestamptz,
  updated_at             timestamptz not null default now()
);

create table if not exists folders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users (id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

create table if not exists saved_words (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references users (id) on delete cascade,
  term       text not null,
  definition text,
  set_name   text default 'Set 1',
  difficulty text default 'normal',
  created_at timestamptz not null default now()
);

create table if not exists saved_questions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users (id) on delete cascade,
  question      text not null,
  options       jsonb not null default '[]'::jsonb,
  correct_index integer not null default 0,
  explanation   text,
  created_at    timestamptz not null default now()
);

create index if not exists saved_words_user_idx     on saved_words (user_id);
create index if not exists saved_questions_user_idx on saved_questions (user_id);
