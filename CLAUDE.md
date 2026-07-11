# CLAUDE.md — StudyPlan AI

## Project overview
StudyPlan AI turns a pasted course syllabus into a structured week-by-week study plan using OpenAI (via a Vocareum-proxied endpoint), with Supabase for auth and saved plans. Built for a graded AIM Week 4 assignment: must stay deployed on Vercel with green CI.

## Stack
- Next.js 14 (App Router, TypeScript, `src/` dir) + Tailwind CSS
- OpenAI `gpt-4o-mini` via the Vercel AI SDK (`ai` + `@ai-sdk/openai`), pointed at a Vocareum proxy endpoint — **server-side only** (`/api/generate`)
- Supabase: Postgres (`plans` table, RLS on) + Supabase Auth (email/password) via `@supabase/ssr`
- Vitest for unit tests, ESLint for linting
- GitHub Actions CI → Vercel deploy

## Commands
- `npm run dev` — local dev server
- `npm run lint` — ESLint
- `npm test` — Vitest (run once, no watch)
- `npm run build` — production build (CI gate)

## File map
- `src/app/` — routes (`/`, `/app`, `/app/plans`, `/app/plans/[id]`)
- `src/app/api/generate/route.ts` — the only AI endpoint
- `src/lib/schemas.ts` — zod schemas (request + plan), shared by API and tests
- `src/lib/prompt.ts` — prompt builder (pure function, tested)
- `src/lib/dates.ts` — week date-range helpers (pure, tested)
- `src/lib/supabase/` — server/client Supabase helpers
- `tests/` — Vitest unit tests

## Conventions
- TypeScript strict; no `any` unless unavoidable.
- All request bodies validated with zod before use; model JSON output re-validated with `PlanSchema`.
- Keep AI calls, keys, and Supabase service operations in server code only.
- Tailwind utility classes only; no CSS files beyond `globals.css`.
- Pure logic (prompts, dates, schemas) lives in `src/lib/` so it is unit-testable without mocking Next.js.

## Hard rules
- **Never commit secrets.** `OPENAI_API_KEY` (and `OPENAI_BASE_URL`) only in `.env.local` / Vercel env. `.env.example` holds names, not values.
- Never call OpenAI from client components.
- Don't add new dependencies without need — free tier, small bundle.
- All changes must pass `npm run lint && npm test && npm run build` before commit.
