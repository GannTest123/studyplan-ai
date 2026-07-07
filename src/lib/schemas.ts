import { z } from "zod";

export const SYLLABUS_MIN_CHARS = 100;
export const SYLLABUS_MAX_CHARS = 20000;

/** Request body for POST /api/generate */
export const GenerateRequestSchema = z.object({
  syllabus: z
    .string()
    .trim()
    .min(SYLLABUS_MIN_CHARS, "That doesn't look like a full syllabus — paste more of it.")
    .max(SYLLABUS_MAX_CHARS, "Syllabus is too long — trim it to the essentials (max 20,000 characters)."),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "startDate must be YYYY-MM-DD")
    .optional(),
  hoursPerWeek: z.number().int().min(1).max(60).default(8),
});

export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;

/** One week of the generated study plan */
export const WeekSchema = z.object({
  week: z.number().int().min(1),
  dateRange: z.string(),
  topics: z.array(z.string()),
  deliverables: z.array(z.string()),
  studyHours: z.number().min(0),
  milestone: z.string().nullable(),
});

/** The full plan the model must return (re-validated server-side) */
export const PlanSchema = z.object({
  courseTitle: z.string().min(1),
  totalWeeks: z.number().int().min(1),
  weeks: z.array(WeekSchema).min(1),
  tips: z.array(z.string()),
});

export type Plan = z.infer<typeof PlanSchema>;
export type PlanWeek = z.infer<typeof WeekSchema>;
