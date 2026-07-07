# 2-Minute Demo Script

**Recording tool:** Loom (free) or OBS. Record the live Vercel URL, not localhost.

| Time | What to show | What to say |
|---|---|---|
| 0:00–0:15 | Landing page (live URL, visible in address bar) | "Every term, students get dense syllabi and never turn them into a plan. StudyPlan AI fixes that — paste a syllabus, get a structured week-by-week study plan." |
| 0:15–0:30 | Sign in (account created beforehand) | "It has real accounts via Supabase Auth — plans are private to each user." |
| 0:30–1:15 | Paste a prepared syllabus, set start date + hours, click Generate; scroll the result | "One click, and OpenAI returns a structured plan — topics, deliverables, study-hour budgets, and exam-review milestones — validated against a schema server-side, not just raw chat text." |
| 1:15–1:35 | Click Save, open My Plans, open the saved plan | "Plans persist to Supabase Postgres with row-level security, so I can revisit them all term." |
| 1:35–2:00 | Quick flash of GitHub repo: Actions tab (green run), README | "It's a public repo with CI on every push — lint, 18 unit tests, build — and auto-deploys to Vercel. No secrets in the code; everything lives in environment variables." |

**Prep before recording:**
1. Create a demo account and confirm the email beforehand.
2. Have a realistic syllabus in a text file ready to paste (e.g., a real AIM course syllabus).
3. Generate once before recording so you know the output looks good.
4. Open the GitHub Actions tab in a second browser tab, showing a green ✓ run.
