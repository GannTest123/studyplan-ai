import { describe, expect, it } from "vitest";
import { PlanSchema } from "@/lib/schemas";

const validPlan = {
  courseTitle: "Applied Statistics",
  totalWeeks: 2,
  weeks: [
    {
      week: 1,
      dateRange: "Jan 5 – Jan 11",
      topics: ["Descriptive statistics"],
      deliverables: [],
      studyHours: 6,
      milestone: null,
    },
    {
      week: 2,
      dateRange: "Jan 12 – Jan 18",
      topics: ["Probability"],
      deliverables: ["Problem Set 1"],
      studyHours: 8,
      milestone: "Quiz next week — review PS1",
    },
  ],
  tips: ["Do problem sets before lectures"],
};

describe("PlanSchema (model output re-validation)", () => {
  it("accepts a well-formed plan", () => {
    expect(PlanSchema.safeParse(validPlan).success).toBe(true);
  });

  it("rejects a plan with no weeks", () => {
    expect(PlanSchema.safeParse({ ...validPlan, weeks: [] }).success).toBe(false);
  });

  it("rejects a week missing required fields", () => {
    const broken = {
      ...validPlan,
      weeks: [{ week: 1, topics: ["x"] }],
    };
    expect(PlanSchema.safeParse(broken).success).toBe(false);
  });

  it("rejects a plan missing the course title", () => {
    const { courseTitle: _omitted, ...rest } = validPlan;
    expect(PlanSchema.safeParse(rest).success).toBe(false);
  });
});
