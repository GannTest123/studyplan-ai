import { describe, expect, it } from "vitest";
import { GenerateRequestSchema, SYLLABUS_MAX_CHARS } from "@/lib/schemas";

const validSyllabus = "Week 1: Introduction to Statistics. ".repeat(10); // > 100 chars

describe("GenerateRequestSchema", () => {
  it("accepts a valid request and applies the default hour budget", () => {
    const result = GenerateRequestSchema.safeParse({ syllabus: validSyllabus });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hoursPerWeek).toBe(8);
    }
  });

  it("rejects a syllabus that is too short", () => {
    const result = GenerateRequestSchema.safeParse({ syllabus: "too short" });
    expect(result.success).toBe(false);
  });

  it("rejects a syllabus over the max length", () => {
    const huge = "a".repeat(SYLLABUS_MAX_CHARS + 1);
    const result = GenerateRequestSchema.safeParse({ syllabus: huge });
    expect(result.success).toBe(false);
  });

  it("rejects an out-of-range weekly hour budget", () => {
    expect(
      GenerateRequestSchema.safeParse({ syllabus: validSyllabus, hoursPerWeek: 0 }).success
    ).toBe(false);
    expect(
      GenerateRequestSchema.safeParse({ syllabus: validSyllabus, hoursPerWeek: 61 }).success
    ).toBe(false);
  });

  it("rejects a malformed start date", () => {
    const result = GenerateRequestSchema.safeParse({
      syllabus: validSyllabus,
      startDate: "06/01/2026",
    });
    expect(result.success).toBe(false);
  });
});
