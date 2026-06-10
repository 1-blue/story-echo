import { describe, expect, it } from "vitest";
import { validateStoryCreate } from "@/lib/story-write-policy";

describe("validateStoryCreate", () => {
  const todayId = "10000000-0000-4000-8000-000000000001";
  const otherId = "10000000-0000-4000-8000-000000000002";

  it("allows capsule without today question", () => {
    expect(
      validateStoryCreate({
        isCapsule: true,
        questionId: otherId,
        todayQuestionId: todayId,
        existingTodayStoryId: null,
      }),
    ).toEqual({ ok: true });
  });

  it("rejects non-capsule when questionId is not today", () => {
    const result = validateStoryCreate({
      isCapsule: false,
      questionId: otherId,
      todayQuestionId: todayId,
      existingTodayStoryId: null,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("QUESTION_NOT_TODAY");
    }
  });

  it("rejects non-capsule when questionId is null", () => {
    const result = validateStoryCreate({
      isCapsule: false,
      questionId: null,
      todayQuestionId: todayId,
      existingTodayStoryId: null,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("QUESTION_NOT_TODAY");
    }
  });

  it("returns TODAY_STORY_EXISTS when today story already written", () => {
    const result = validateStoryCreate({
      isCapsule: false,
      questionId: todayId,
      todayQuestionId: todayId,
      existingTodayStoryId: "story-uuid",
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TODAY_STORY_EXISTS");
      if (result.error.code === "TODAY_STORY_EXISTS") {
        expect(result.error.storyId).toBe("story-uuid");
      }
    }
  });

  it("allows today's first story", () => {
    expect(
      validateStoryCreate({
        isCapsule: false,
        questionId: todayId,
        todayQuestionId: todayId,
        existingTodayStoryId: null,
      }),
    ).toEqual({ ok: true });
  });
});
