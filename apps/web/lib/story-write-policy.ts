export type StoryCreateValidationInput = {
  isCapsule: boolean;
  questionId: string | null | undefined;
  todayQuestionId: string | null;
  existingTodayStoryId: string | null;
};

export type StoryCreateValidationError =
  | { code: "QUESTION_NOT_TODAY"; message: string }
  | { code: "TODAY_STORY_EXISTS"; message: string; storyId: string };

export type StoryCreateValidationResult =
  | { ok: true }
  | { ok: false; error: StoryCreateValidationError };

export function validateStoryCreate(
  input: StoryCreateValidationInput,
): StoryCreateValidationResult {
  const { isCapsule, questionId, todayQuestionId, existingTodayStoryId } = input;

  if (isCapsule) {
    return { ok: true };
  }

  if (!todayQuestionId) {
    return {
      ok: false,
      error: {
        code: "QUESTION_NOT_TODAY",
        message: "오늘의 질문에만 이야기를 남길 수 있어요",
      },
    };
  }

  if (!questionId || questionId !== todayQuestionId) {
    return {
      ok: false,
      error: {
        code: "QUESTION_NOT_TODAY",
        message: "오늘의 질문에만 이야기를 남길 수 있어요",
      },
    };
  }

  if (existingTodayStoryId) {
    return {
      ok: false,
      error: {
        code: "TODAY_STORY_EXISTS",
        message: "오늘의 질문에는 이미 이야기를 남겼어요",
        storyId: existingTodayStoryId,
      },
    };
  }

  return { ok: true };
}
