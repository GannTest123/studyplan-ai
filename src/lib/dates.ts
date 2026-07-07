/** Pure date helpers for week ranges — unit-tested, no external deps. */

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Human-readable date range for a 1-indexed week number.
 * weekDateRange(new Date("2026-01-05"), 1) => "Jan 5 – Jan 11"
 */
export function weekDateRange(start: Date, week: number): string {
  const weekStart = addDays(start, (week - 1) * 7);
  const weekEnd = addDays(weekStart, 6);
  return `${formatShort(weekStart)} – ${formatShort(weekEnd)}`;
}

/** Format a date as YYYY-MM-DD using local components (toISOString shifts to UTC). */
export function formatYMD(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Parse a YYYY-MM-DD string as a local date; falls back to today if absent. */
export function parseStartDate(startDate?: string): Date {
  if (!startDate) return new Date();
  const [y, m, d] = startDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}
