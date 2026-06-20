-- ============================================================
-- PracticeForge — initial schema
-- Run this in the Supabase dashboard → SQL Editor (or via the CLI).
-- Every table is per-user and protected by Row Level Security.
-- ============================================================

-- 1:1 with auth.users -----------------------------------------
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  display_name  text,
  country       text,
  flag          text        not null default '🌍',
  target_score  text        not null default 'IELTS 7.0',
  points        integer     not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Stripe subscription state (one row per user) ----------------
create table if not exists public.subscriptions (
  user_id                uuid primary key references auth.users (id) on delete cascade,
  stripe_customer_id     text,
  stripe_subscription_id text,
  plan                   text        not null default 'free',     -- free | pro | elite
  status                 text        not null default 'inactive', -- active | trialing | past_due | canceled | inactive
  current_period_end     timestamptz,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- Library folders ---------------------------------------------
create table if not exists public.folders (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  name       text not null,
  created_at timestamptz not null default now()
);

-- Vocabulary words --------------------------------------------
create table if not exists public.saved_words (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  folder_id  uuid references public.folders (id) on delete set null,
  term       text not null,
  definition text,
  set_name   text default 'Set 1',
  difficulty text default 'normal',
  created_at timestamptz not null default now()
);

-- Saved reading questions (question bank) ---------------------
create table if not exists public.saved_questions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  folder_id     uuid references public.folders (id) on delete set null,
  question      text not null,
  options       jsonb not null default '[]'::jsonb,
  correct_index integer not null default 0,
  explanation   text,
  question_type text default 'multiple_choice',
  created_at    timestamptz not null default now()
);

-- XP ledger (gamification + leaderboard source) ---------------
create table if not exists public.xp_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  amount     integer not null,
  reason     text,
  created_at timestamptz not null default now()
);

create index if not exists saved_words_user_idx     on public.saved_words (user_id);
create index if not exists saved_questions_user_idx on public.saved_questions (user_id);
create index if not exists xp_events_user_idx       on public.xp_events (user_id);

-- ============================================================
-- Row Level Security: a user may only touch their own rows
-- ============================================================
alter table public.profiles       enable row level security;
alter table public.subscriptions  enable row level security;
alter table public.folders        enable row level security;
alter table public.saved_words    enable row level security;
alter table public.saved_questions enable row level security;
alter table public.xp_events      enable row level security;

-- profiles keyed by id = auth.uid()
create policy "own profile - select" on public.profiles for select using (auth.uid() = id);
create policy "own profile - update" on public.profiles for update using (auth.uid() = id);

-- subscriptions are read-only to the user; only the service role (webhook) writes
create policy "own subscription - select" on public.subscriptions for select using (auth.uid() = user_id);

-- generic owner policies for the content tables
create policy "own folders"          on public.folders          for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own words"            on public.saved_words      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own questions"        on public.saved_questions  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own xp - select"      on public.xp_events        for select using (auth.uid() = user_id);
create policy "own xp - insert"      on public.xp_events        for insert with check (auth.uid() = user_id);

-- ============================================================
-- On signup: create a profile + a free subscription row
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));

  insert into public.subscriptions (user_id, plan, status)
  values (new.id, 'free', 'inactive');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
