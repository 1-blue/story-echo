import { describe, expect, it } from "vitest";
import { getKstDayRangeUtc } from "@/lib/notifications/kst";

describe("getKstDayRangeUtc", () => {
  it("KST midnight boundary: 2026-06-03 15:00 UTC is still KST June 4", () => {
    const now = new Date("2026-06-03T15:00:00.000Z");
    const { start, end } = getKstDayRangeUtc(now);
    expect(start.toISOString()).toBe("2026-06-03T15:00:00.000Z");
    expect(end.toISOString()).toBe("2026-06-04T15:00:00.000Z");
  });

  it("story at range start is included, at end is excluded", () => {
    const now = new Date("2026-06-04T10:00:00.000Z");
    const { start, end } = getKstDayRangeUtc(now);
    const atStart = new Date(start);
    const atEnd = new Date(end);
    expect(atStart >= start && atStart < end).toBe(true);
    expect(atEnd >= start && atEnd < end).toBe(false);
  });
});
