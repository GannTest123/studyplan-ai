# Idea Validation — StudyPlan AI

## The 7 Validation Steps

### 1. Target user (specific, not "everyone")
Graduate students and working professionals in part-time programs (e.g., AIM MBA/MSc students) who juggle multiple courses alongside jobs and need to plan study time deliberately rather than cram.

### 2. Problem statement (one sentence)
At the start of every term, students receive dense course syllabi as PDFs/documents and must manually translate them into a realistic week-by-week study schedule — a tedious, error-prone process most students skip, leading to last-minute cramming.

### 3. Market evidence
- **Existing tools:** Notion templates for study planning (manual setup), My Study Life (manual entry), Todoist (generic tasks). None parse a syllabus automatically.
- **Search demand:** "study schedule generator", "study planner app" show consistent search volume; r/GradSchool and r/college regularly feature "how do you plan your semester" threads.
- **Willingness to adopt:** Students already paste syllabi into ChatGPT ad hoc — evidence the behavior exists but lacks a purpose-built, structured tool.

### 4. User discovery (informal interviews)
Asked 4 classmates in the program:
- 4/4 said they never build a semester study plan because "it takes too long".
- 3/4 said they had tried asking ChatGPT but got unstructured walls of text they never used.
- All 4 said a one-click structured plan they could revisit would be useful.

### 5. Differentiating angle
Not a chatbot. The user pastes a syllabus once and gets a **structured, week-by-week plan** (weeks, topics, deliverables, estimated hours, milestone warnings) rendered as a proper UI — savable to their account and revisitable. Purpose-built prompt engineering + structured JSON output + persistence is the moat over a raw ChatGPT window.

### 6. Feasibility check
- Core loop = one LLM call with structured output → renderable JSON. Buildable in < 1 week.
- Stack (Next.js + OpenAI + Supabase + Vercel) is all free-tier.
- Risk: syllabus formats vary → mitigated by accepting pasted text (user controls input) and robust prompt design.

### 7. Success metrics
- A user gets a usable week-by-week plan in **under 60 seconds** from pasting a syllabus.
- Plan quality: covers ≥ 90% of syllabus topics/deliverables in the correct weeks.
- Users save the plan (signal that output is worth keeping).
