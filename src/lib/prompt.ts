import { GenerateRequest, SYLLABUS_MAX_CHARS } from "./schemas";
import { formatYMD, parseStartDate, weekDateRange } from "./dates";

/** Builds the system + user messages for the plan-generation call. Pure and unit-testable. */
export function buildPrompt(req: GenerateRequest): { system: string; user: string } {
  const syllabus = req.syllabus.slice(0, SYLLABUS_MAX_CHARS);
  const start = parseStartDate(req.startDate);
  const startLabel = formatYMD(start);
  const exampleRange = weekDateRange(start, 1);

  const system = `You are an academic planning assistant. You convert a course syllabus into a realistic week-by-week study plan.

Respond ONLY with a JSON object matching exactly this schema:
{
  "courseTitle": string,
  "totalWeeks": number,
  "weeks": [
    {
      "week": number (1-indexed),
      "dateRange": string (e.g. "${exampleRange}"),
      "topics": string[],
      "deliverables": string[] (assignments/readings/exams due that week, from the syllabus only),
      "studyHours": number,
      "milestone": string or null (e.g. "Midterm in 2 weeks — start reviewing")
    }
  ],
  "tips": string[] (3-5 short, course-specific study tips)
}

Rules:
- Cover every graded deliverable mentioned in the syllabus; never invent deliverables that are not there.
- Place review milestones 2 weeks before each exam.
- Distribute study hours to average about the user's weekly budget, increasing before exams and major deadlines.
- The term starts on ${startLabel}; compute dateRange for each week from that date.
- If the syllabus does not state a number of weeks, infer a sensible length from its content (typically 10-15 weeks).`;

  const user = `Weekly study-hour budget: ${req.hoursPerWeek} hours.

Syllabus:
"""
${syllabus}
"""`;

  return { system, user };
}
