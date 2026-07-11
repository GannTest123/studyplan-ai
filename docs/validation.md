# Idea Validation — StudyPlan AI

## The 7 Validation Steps

### 1. Target user (specific, not "everyone")
Graduate students and working professionals in part-time programs (e.g., AIM MBA/MSc students) who juggle multiple courses alongside jobs and need to plan study time deliberately rather than cram.

### 2. Problem statement (one sentence)
At the start of every term, students receive dense course syllabi as PDFs/documents and must manually translate them into a realistic week-by-week study schedule — a tedious, error-prone process most students skip, leading to last-minute cramming.

### 2b. Why now
- **Structured LLM output just became reliable enough.** Schema-constrained generation (JSON mode / structured `output` from providers like OpenAI) is now mature and cheap enough (`gpt-4o-mini`-class models) to parse a messy pasted syllabus into a validated weekly plan in one call — a year or two ago this would have needed custom NLP or an expensive, slower model to get comparable reliability.
- **Free-tier infra removed the old cost barrier.** Vercel + Supabase now make it possible to ship a real multi-user product (auth, per-user database, RLS, CI/CD) at zero infrastructure cost, so the choice isn't "build a proper app" vs. "just wrap ChatGPT" anymore — a proper app is now the cheap option too.
- **Timing matches peak user need.** Students receive syllabi at the very start of term, which is exactly when the manual-planning pain (and the temptation to skip it) is highest — building and testing this now, rather than mid-term, means the problem is freshest and easiest to validate with classmates.

### 3. Market evidence
- **Existing tools:** Notion templates for study planning (manual setup), My Study Life (manual entry), Todoist (generic tasks). None parse a syllabus automatically.
- **Search demand:** "study schedule generator", "study planner app" show consistent search volume; r/GradSchool and r/college regularly feature "how do you plan your semester" threads.
- **Willingness to adopt:** Students already paste syllabi into ChatGPT ad hoc — evidence the behavior exists but lacks a purpose-built, structured tool.

### 4. User discovery
Not yet conducted. This step should be direct interviews or a short survey with target users (grad students / part-time-program peers) validating that the manual-planning pain and the desire for a structured, revisitable plan are real and not just assumed from market evidence (step 3). Flagged as a limitation and a pre-v2 priority — see [reflection.md](reflection.md).

### 5. Differentiating angle
Not a chatbot. The user pastes a syllabus once and gets a **structured, week-by-week plan** (weeks, topics, deliverables, estimated hours, milestone warnings) rendered as a proper UI — savable to their account and revisitable. Purpose-built prompt engineering + structured JSON output + persistence is the moat over a raw ChatGPT window.

### 6. Feasibility check
- Core loop = one LLM call with structured output → renderable JSON. Buildable in < 1 week.
- Stack (Next.js + OpenAI/Vercel AI SDK (Vocareum proxy) + Supabase + Vercel) is all free-tier.
- Risk: syllabus formats vary → mitigated by accepting pasted text (user controls input) and robust prompt design.

### 7. Success metrics
- A user gets a usable week-by-week plan in **under 60 seconds** from pasting a syllabus.
- Plan quality: covers ≥ 90% of syllabus topics/deliverables in the correct weeks.
- Users save the plan (signal that output is worth keeping).
