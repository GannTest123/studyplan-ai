# Reflection — StudyPlan AI (1 page)

## What I built and why
StudyPlan AI turns a pasted course syllabus into a structured week-by-week study plan. I chose it after the idea-validation exercise showed classmates already paste syllabi into ChatGPT but abandon the unstructured output — the gap wasn't "access to AI", it was **structure and persistence**, which shaped the whole design (structured-output generation, schema validation, saved plans).

## What went well
- **Spec-first development paid off.** Writing spec.md with exact request/response shapes before coding meant the API route, UI, and tests all agreed on one contract, and the zod schemas became shared source of truth for the server, client, and test suite.
- **AI-assisted coding was fastest on pure logic.** The prompt builder, date helpers, and schemas were generated almost correctly on the first pass because they are pure functions with clear specs. The AI-assistant config files (CLAUDE.md, .cursorrules) noticeably reduced back-and-forth by pinning conventions like "never call OpenAI from the client."
- **Free-tier stack held up.** Next.js + Supabase + Vercel needed zero infrastructure work; Supabase RLS gave per-user data isolation with four lines of SQL instead of custom backend authorization code.

## What was hard
- **LLM output reliability.** Even with schema-constrained structured output, the model occasionally dropped fields or mis-typed `milestone`. The fix — re-validate with a zod schema server-side and retry once before failing — turned intermittent UI crashes into a clean error path.
- **Secrets discipline across environments.** The same variables live in three places (.env.local, GitHub Actions, Vercel). The CI build initially failed because `next build` wanted Supabase env vars; the fix was dummy public values in the workflow while real values stay only in Vercel.
- **I locked in an AI provider before checking what credentials I actually had.** I designed around a personal API key I assumed I'd have, only to discover at deploy time I didn't — I only had a Vocareum-issued, OpenAI-compatible proxy key for the course. That forced a real mid-build provider swap (briefly Anthropic Claude, then back to OpenAI once the Vocareum key's shape was clear) plus an `OPENAI_BASE_URL` override the original design never anticipated. Keeping the AI call isolated behind one thin server route is what made that swap cheap instead of a rewrite.
- **The library moved faster than the docs I'd been following.** The Vercel AI SDK function the spec was written around, `generateObject`, turned out to be deprecated in the installed version in favor of `generateText` with a structured `output` option — caught from a TypeScript hint, not a runtime failure.
- **Not everything is scriptable from the CLI.** Vercel's GitHub App auto-connect failed twice from the command line with a vague access error; it needed the OAuth flow in the dashboard instead, so I shipped with manual `vercel deploy --prod` rather than block on it.

## What I'd do differently
- Confirm which AI credentials I'd actually have access to *before* locking the architecture doc to a specific provider.
- Start with one end-to-end "walking skeleton" (auth → dummy generate → render) before polishing any single layer; building the API route to spec before the UI could exercise it delayed integration feedback.
- Add an integration test with a mocked AI client — a live smoke-test call against the real endpoint caught nothing, but that's luck, not coverage.

## Key takeaway
The difference between an AI demo and an AI product is everything around the model call: validation, retries, persistence, auth, CI, and deployment. The model call was ~30 lines; making it shippable was the other ~95% of the work.
