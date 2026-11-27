import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatDate } from "./utils";

describe("formatDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-25T12:00:00Z"));
    process.env.TZ = "UTC";
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns empty string when no date is given", () => {
    expect(formatDate()).toBe("");
    expect(formatDate("")).toBe("");
  });

  it("treats a date-only string as midnight", () => {
    // Same day as "now" → "Today" only triggers when the y/m/d deltas are all 0,
    // which requires the date-only form to be parsed as midnight UTC.
    expect(formatDate("2026-06-25", true)).toBe("June 25, 2026 (Today)");
  });

  it("returns full date only when includeRelative is false", () => {
    expect(formatDate("2024-01-05")).toBe("January 5, 2024");
  });

  it("appends relative suffix when includeRelative is true", () => {
    // 2-year-old date: yearsAgo branch is taken (deterministic, not affected
    // by the y/m/d-independent-delta bug).
    expect(formatDate("2024-01-05", true)).toBe("January 5, 2024 (2y ago)");
  });

  it("uses 'Today' for same-day dates", () => {
    expect(formatDate("2026-06-25", true)).toBe("June 25, 2026 (Today)");
  });

  it("uses day resolution for sub-month differences", () => {
    expect(formatDate("2026-06-20", true)).toBe("June 20, 2026 (5d ago)");
  });

  it("computes correct days for cross-month boundary without premature month increment", () => {
    // targetDate = 2026-05-30, systemTime = 2026-06-25T12:00:00Z
    expect(formatDate("2026-05-30", true)).toBe("May 30, 2026 (26d ago)");
  });

  it("computes correct months for cross-year boundary without premature year increment", () => {
    // targetDate = 2025-12-15, systemTime = 2026-06-25T12:00:00Z
    expect(formatDate("2025-12-15", true)).toBe("December 15, 2025 (6mo ago)");
  });
});
