# Architecture Notes — StudyPlan AI

## Overview

```
Browser (Next.js 14 App Router + Tailwind CSS)
  │
  ├─ Supabase Auth (email/password) ── @supabase/ssr, session in cookies
  │
  ├─ POST /api/generate  ── server route
  │     ├─ zod validation (length caps, required fields)
  │     ├─ auth check (must be signed in)
  │     └─ OpenAI via Vercel AI SDK (structured output, Vocareum proxy) ← OPENAI_API_KEY (server env only)
  │
  └─ Supabase Postgres
        └─ table: plans (id, user_id, title, plan_json, created_at)
             Row Level Security: users can only read/write their own rows
  │
GitHub (public repo)
  └─ GitHub Actions: lint → test → build on every push/PR
        └─ Vercel: auto-deploys main after CI (Git integration)
```

## Key decisions

| Decision | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) | Runs on Node.js, first-class Vercel deploy, API routes keep the OpenAI key server-side |
| AI | OpenAI `gpt-4o-mini` via Vercel AI SDK (Vocareum proxy) | Cheap, fast, reliable structured output for plan JSON; Vocareum gives metered access without personal billing |
| DB + Auth | Supabase (Postgres + Auth) | One free-tier service for both; RLS gives per-user data isolation |
| Styling | Tailwind CSS | Fast to build a clean UI |
| Tests | Vitest | Fast, zero-config for TS unit tests |
| CI | GitHub Actions | Required by brief: lint + test + build gate on main |
| Hosting | Vercel | Free tier, env-var secrets, preview deploys |

## Security
- `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` (if ever needed) exist only in server env (Vercel project settings / `.env.local`, gitignored).
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are public by design (anon key is safe when RLS is on).
- All user input validated with zod; syllabus text capped at 20,000 chars.
- Supabase RLS policies restrict `plans` to `auth.uid() = user_id`.

## Data model

```sql
create table plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  title text not null,
  plan_json jsonb not null,
  created_at timestamptz default now()
);
alter table plans enable row level security;
create policy "own plans select" on plans for select using (auth.uid() = user_id);
create policy "own plans insert" on plans for insert with check (auth.uid() = user_id);
create policy "own plans delete" on plans for delete using (auth.uid() = user_id);
```
