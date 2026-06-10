import { describe, expect, it } from "vitest";
import { buildQuestionEchoCounts, isEchoStoryFromCounts, toStoryDto } from "@/lib/story-mapper";

describe("story-mapper", () => {
  it("buildQuestionEchoCounts counts duplicate question ids", () => {
    const counts = buildQuestionEchoCounts([
      { questionId: "q1" },
      { questionId: "q1" },
      { questionId: "q2" },
      { questionId: null },
    ]);
    expect(counts.get("q1")).toBe(2);
    expect(counts.get("q2")).toBe(1);
  });

  it("isEchoStoryFromCounts is true when count >= 2", () => {
    const counts = new Map([["q1", 2]]);
    expect(isEchoStoryFromCounts("q1", counts)).toBe(true);
    expect(isEchoStoryFromCounts("q2", counts)).toBe(false);
    expect(isEchoStoryFromCounts(null, counts)).toBe(false);
  });

  it("toStoryDto maps prisma story fields", () => {
    const createdAt = new Date("2026-01-01T00:00:00.000Z");
    const dto = toStoryDto({
      id: "550e8400-e29b-41d4-a716-446655440000",
      userId: "550e8400-e29b-41d4-a716-446655440001",
      questionId: null,
      bodyText: "hello",
      photoUrls: ["https://example.com/a.jpg"],
      visibility: "private",
      isCapsule: false,
      unlockAt: null,
      isCapsuleActive: false,
      hiddenFromFeed: false,
      isBookmarked: false,
      createdAt,
    });
    expect(dto.bodyText).toBe("hello");
    expect(dto.createdAt).toBe(createdAt.toISOString());
    expect(dto.photoUrls).toHaveLength(1);
  });
});
