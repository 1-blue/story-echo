import { describe, expect, it } from "vitest";
import {
  formatDrawerStats,
  formatStoryDay,
  formatStoryMonthGroup,
  groupStoriesByMonth,
} from "@/lib/format-story-date";

describe("format-story-date", () => {
  it("formatStoryDay formats month and day", () => {
    expect(formatStoryDay("2026-06-04T00:00:00.000Z")).toMatch(/6월/);
  });

  it("formatStoryMonthGroup includes year", () => {
    expect(formatStoryMonthGroup("2026-06-04T00:00:00.000Z")).toContain("2026년");
  });

  it("formatDrawerStats empty state", () => {
    expect(formatDrawerStats(0, null)).toBe("아직 작성한 이야기가 없어요");
  });

  it("formatDrawerStats with oldest date", () => {
    expect(formatDrawerStats(3, "2026-01-01T00:00:00.000Z")).toContain("3개의 이야기");
    expect(formatDrawerStats(3, "2026-01-01T00:00:00.000Z")).toContain("부터");
  });

  it("groupStoriesByMonth groups stories", () => {
    const groups = groupStoriesByMonth([
      { createdAt: "2026-06-01T00:00:00.000Z" },
      { createdAt: "2026-06-15T00:00:00.000Z" },
      { createdAt: "2026-05-01T00:00:00.000Z" },
    ]);
    expect(groups.length).toBeGreaterThanOrEqual(2);
  });
});
