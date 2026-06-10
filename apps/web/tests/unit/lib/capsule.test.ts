import { describe, expect, it } from "vitest";
import { toCapsuleStoryDetail, toCapsuleStorySummary } from "@/lib/capsule-mapper";
import {
  addMonths,
  computeDaysUntilUnlock,
  formatUnlockDateKo,
  formatUnlockPreview,
} from "@/lib/capsule-utils";

describe("capsule-utils", () => {
  it("addMonths advances calendar month", () => {
    const base = new Date("2026-01-15T00:00:00.000Z");
    const result = addMonths(base, 1);
    expect(result.getMonth()).toBe(1);
  });

  it("computeDaysUntilUnlock is 0 for past dates", () => {
    const past = new Date(Date.now() - 86_400_000).toISOString();
    expect(computeDaysUntilUnlock(past)).toBe(0);
  });

  it("formatUnlockDateKo formats korean date", () => {
    expect(formatUnlockDateKo("2026-06-04T00:00:00.000Z")).toContain("2026년");
  });

  it("formatUnlockPreview includes 열립니다", () => {
    expect(formatUnlockPreview("2026-06-04T00:00:00.000Z")).toContain("열립니다");
  });
});

describe("capsule-mapper", () => {
  const baseStory = {
    id: "s1",
    bodyText: "secret letter content here",
    photoUrls: ["https://example.com/p.jpg"],
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    unlockAt: new Date(Date.now() + 86_400_000 * 10),
    isCapsuleActive: true,
    question: null,
  };

  it("toCapsuleStorySummary hides body when sealed", () => {
    const summary = toCapsuleStorySummary(baseStory as never);
    expect(summary.bodyPreview).toBeNull();
    expect(summary.isCapsuleActive).toBe(true);
  });

  it("toCapsuleStoryDetail exposes body when unsealed", () => {
    const detail = toCapsuleStoryDetail({
      ...baseStory,
      isCapsuleActive: false,
    } as never);
    expect(detail.bodyText).toBe("secret letter content here");
    expect(detail.photoUrls).toHaveLength(1);
  });
});
