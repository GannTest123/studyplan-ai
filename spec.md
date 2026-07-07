# spec.md — StudyPlan AI

## Pages / routes

| Route | Auth | Purpose |
|---|---|---|
| `/` | public | Landing + sign-in/sign-up (Supabase Auth email+password) |
| `/app` | required | Main tool: syllabus input form + generated plan view |
| `/app/plans` | required | Dashboard of saved plans |
| `/app/plans/[id]` | required | View a single saved plan |

## API endpoints

### POST `/api/generate`
Generates a study plan from syllabus text. Requires an authenticated session.

Request body (zod-validated):
```json
{
  "syllabus": "string, 100–20000 chars, required",
  "startDate": "YYYY-MM-DD string, optional (default: today)",
  "hoursPerWeek": "number 1–60, optional (default 8)"
}
```

Response `200`:
```json
{
  "plan": {
    "courseTitle": "string",
    "totalWeeks": 12,
    "weeks": [
      {
        "week": 1,
        "dateRange": "Jan 6 – Jan 12",
        "topics": ["..."],
        "deliverables": ["..."],
        "studyHours": 6,
        "milestone": "string | null"
      }
    ],
    "tips": ["..."]
  }
}
```

Errors: `400` invalid input (zod details), `401` not signed in, `502` OpenAI failure (message: "AI service unavailable, try again"), `429` if OpenAI rate-limits.

### Saved plans — via Supabase client (no custom endpoint)
Insert/select/delete on `plans` table happens through the Supabase JS client with RLS enforcing ownership.

## AI prompt strategy
- Model: `gpt-4o-mini`, `response_format: { type: "json_object" }`, temperature 0.4.
- System prompt: "You are an academic planning assistant. Extract structure from the syllabus and produce a realistic week-by-week study plan as JSON matching this schema… Rules: cover every graded deliverable, place review milestones 2 weeks before exams, respect the user's weekly hour budget, never invent deliverables not in the syllabus."
- The server re-validates the model's JSON against a zod schema (`PlanSchema`) before returning; on parse failure retry once, then `502`.

## Validation & edge cases
- Syllabus < 100 chars → 400 "That doesn't look like a full syllabus."
- Syllabus > 20,000 chars → 400 with instruction to trim.
- `hoursPerWeek` outside 1–60 → 400.
- Model returns malformed JSON → one retry → 502.
- Unauthenticated call to `/api/generate` → 401.
- Save without session → blocked by RLS (and UI hides Save).

## Unit tests (Vitest, minimum 3)
1. `validation.test.ts` — request schema: rejects short/huge syllabus, bad hoursPerWeek; accepts valid input with defaults.
2. `plan-schema.test.ts` — PlanSchema: accepts valid plan JSON; rejects missing weeks/malformed week entries.
3. `prompt.test.ts` — prompt builder includes syllabus text, start date, and hour budget; caps syllabus length.
4. `date-range.test.ts` — week date-range calculator produces correct ranges from a start date.

## Environment variables
| Var | Scope | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | server only | OpenAI calls |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase anon key (safe with RLS) |

`.env.example` documents names only, never values. `.env*` is gitignored.

## CI/CD
- GitHub Actions on push/PR: `npm ci` → `npm run lint` → `npm test` → `npm run build`.
- Vercel Git integration deploys `main` after checks; env vars set in Vercel project settings.

## Spec review revisions (v1.1)
After review, the following changes were made to the original spec:
- Added server-side re-validation of the model's JSON output (was: trust model output).
- Added one automatic retry on malformed model JSON before failing.
- Capped syllabus at 20k chars (was: unlimited) to control token cost and abuse.
- Moved saved-plan CRUD from custom API routes to direct Supabase client + RLS (less code, same security).
