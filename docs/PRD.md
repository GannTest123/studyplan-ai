# PRD — StudyPlan AI

**One-liner:** Paste your course syllabus, get a structured week-by-week study plan you can save and revisit.

## Problem
Students receive dense syllabi at the start of each term but rarely convert them into an actionable study schedule. Manual planning is tedious; generic AI chat produces unstructured text that doesn't get used.

## Target user
Graduate students and part-time learners managing multiple courses alongside work.

## Goals
1. Turn a pasted syllabus into a structured week-by-week study plan in under 60 seconds.
2. Let users save plans to their account and revisit them.
3. Ship a live, secure, tested web app (no exposed secrets, validated inputs).

## Non-goals (out of scope for v1)
- PDF/file upload parsing (v1 accepts pasted text).
- Calendar sync (Google Calendar export is a v2 candidate).
- Collaboration/sharing between users.
- Payments of any kind.

## Core feature (the AI capability)
`Syllabus text → OpenAI (structured JSON output) → rendered plan`
The plan contains: course title, term length, and for each week — topics, deliverables/readings due, recommended study hours, and milestone warnings (e.g., "Midterm in 2 weeks — start reviewing").

## User flow
1. User lands on the app, signs in (Supabase Auth — email magic link or password).
2. Pastes syllabus text into a textarea, optionally sets start date and weekly study-hour budget.
3. Clicks **Generate plan** → server calls OpenAI (via a Vocareum proxy) with a structured-output prompt.
4. Plan renders as week-by-week cards; user clicks **Save** to persist it.
5. Saved plans appear on the user's dashboard for later viewing.

## Success metrics
- Time-to-plan < 60s end-to-end.
- ≥ 90% of syllabus deliverables appear in the generated plan.
- Save rate: majority of generated plans get saved.

## Constraints
- OpenAI (Vocareum proxy) API key lives only in server-side environment variables.
- Input validated and length-capped (max ~20k characters) before any LLM call.
- Free-tier infrastructure only (Vercel, Supabase, Vocareum-metered OpenAI access).
