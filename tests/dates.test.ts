import { describe, expect, it } from "vitest";
import { addDays, parseStartDate, weekDateRange } from "@/lib/dates";

describe("date helpers", () => {
  it("addDays adds calendar days across month boundaries", () => {
    const d = addDays(new Date(2026, 0, 30), 5); // Jan 30 + 5 = Feb 4
    expect(d.getMonth()).toBe(1);
    expect(d.getDate()).toBe(4);
  });

  it("weekDateRange computes a 7-day range for week 1", () => {
    const range = weekDateRange(new Date(2026, 0, 5), 1); // Mon Jan 5
    expect(range).toBe("Jan 5 – Jan 11");
  });

  it("weekDateRange offsets later weeks by 7 days each", () => {
    const range = weekDateRange(new Date(2026, 0, 5), 3);
    expect(range).toBe("Jan 19 – Jan 25");
  });

  it("parseStartDate parses YYYY-MM-DD as a local date", () => {
    const d = parseStartDate("2026-08-03");
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(7);
    expect(d.getDate()).toBe(3);
  });

  it("parseStartDate falls back to today when absent", () => {
    const today = new Date();
    const d = parseStartDate(undefined);
    expect(d.toDateString()).toBe(today.toDateString());
  });
});
