import { describe, expect, it } from "vitest";
import { buildPrompt } from "@/lib/prompt";
import { SYLLABUS_MAX_CHARS } from "@/lib/schemas";

const syllabus = "Week 1: Regression. Week 2: Classification. Final exam in week 12. ".repeat(3);

describe("buildPrompt", () => {
  it("includes the syllabus text in the user message", () => {
    const { user } = buildPrompt({ syllabus, hoursPerWeek: 8 });
    expect(user).toContain("Week 1: Regression");
  });

  it("includes the weekly hour budget", () => {
    const { user } = buildPrompt({ syllabus, hoursPerWeek: 12 });
    expect(user).toContain("12 hours");
  });

  it("includes the start date in the system message", () => {
    const { system } = buildPrompt({ syllabus, startDate: "2026-08-03", hoursPerWeek: 8 });
    expect(system).toContain("2026-08-03");
  });

  it("caps oversized syllabus input at the max length", () => {
    const huge = "a".repeat(SYLLABUS_MAX_CHARS + 5000);
    const { user } = buildPrompt({ syllabus: huge, hoursPerWeek: 8 });
    // user message = boilerplate + capped syllabus; must not contain the full oversized text
    expect(user.length).toBeLessThan(SYLLABUS_MAX_CHARS + 1000);
  });
});
