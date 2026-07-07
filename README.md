# StudyPlan AI 📚

**Paste your course syllabus → get a structured week-by-week study plan you can save and revisit.**

> Graded Assignment 4.2 — AI-Powered Web Application (AIM, Week 4)

🔗 **Live app:** _[add Vercel URL after deploy]_
🎬 **Demo video (2 min):** _[add recording link]_
📄 Docs: [PRD](docs/PRD.md) · [Idea validation](docs/validation.md) · [Architecture](docs/architecture.md) · [Spec](spec.md) · [Reflection](docs/reflection.md)

## The problem

Students receive dense syllabi at the start of every term but rarely turn them into an actionable schedule — manual planning is tedious, and generic AI chat produces walls of text nobody reuses. StudyPlan AI is purpose-built: one paste, one click, and you get a structured plan with topics, deliverables, study-hour budgets, and exam-review milestones — saved to your account.

## Features

- 🧠 **AI plan generation** — OpenAI (`gpt-4o-mini`, JSON mode) converts a pasted syllabus into a validated, structured week-by-week plan
- 🔐 **Accounts** — Supabase Auth (email/password); plans are private per user via Postgres Row Level Security
- 💾 **Saved plans** — dashboard to revisit, view, and delete plans
- 🛡️ **Hardened** — zod validation on every input, model output re-validated server-side, API key never leaves the server

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14 (App Router, TypeScript) + Tailwind CSS — runs on Node.js |
| AI | OpenAI `gpt-4o-mini` via server-side API route |
| Database + Auth | Supabase (Postgres + RLS, Supabase Auth) |
| CI/CD | GitHub Actions (lint → test → build) → Vercel |

## Architecture

```
Browser (Next.js + Tailwind)
  ├─ Supabase Auth (email/password)
  ├─ POST /api/generate ── zod validation ── OpenAI (key in server env only)
  └─ Supabase Postgres: plans table (RLS: owner-only)
GitHub → Actions CI → Vercel deploy
```

## Run locally

```bash
git clone <this-repo>
cd studyplan-ai
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev                  # http://localhost:3000
```

Environment variables (`.env.local` — never committed):

| Variable | Where to get it |
|---|---|
| `OPENAI_API_KEY` | platform.openai.com → API keys |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API |

Database setup: run [supabase/schema.sql](supabase/schema.sql) in the Supabase SQL editor (creates the `plans` table + RLS policies).

## Tests & CI

```bash
npm run lint   # ESLint
npm test       # Vitest — 18 unit tests across validation, schemas, prompt, dates
npm run build  # production build
```

The same three gates run in [GitHub Actions](.github/workflows/ci.yml) on every push and PR. Vercel deploys `main` automatically.

## Security notes

- No secrets in the repo — verified against code and git history; `.env*` is gitignored, `.env.example` documents names only.
- The OpenAI call happens exclusively in a server route; the browser never sees the key.
- The Supabase anon key is public by design; Row Level Security restricts every row of `plans` to its owner.
- All request bodies are zod-validated (syllabus capped at 20k chars); the model's JSON is re-validated against a schema before it reaches the client.

## v2 roadmap

See the open GitHub issue: **PDF syllabus upload + Google Calendar export**.
