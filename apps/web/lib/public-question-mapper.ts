type StoryWithQuestion = {
  id: string;
  questionId: string;
  bodyText: string;
  createdAt: Date;
  question: { text: string };
};

const PREVIEW_LENGTH = 80;

function truncateBodyPreview(bodyText: string): string {
  const trimmed = bodyText.trim();
  if (trimmed.length <= PREVIEW_LENGTH) return trimmed;
  return `${trimmed.slice(0, PREVIEW_LENGTH)}…`;
}

export function toPublicQuestionAnswerDto(story: StoryWithQuestion) {
  return {
    questionId: story.questionId,
    questionText: story.question.text,
    storyId: story.id,
    answeredAt: story.createdAt.toISOString(),
    bodyPreview: truncateBodyPreview(story.bodyText),
  };
}

/** Stories must be ordered by createdAt desc. Keeps the latest story per questionId. */
export function dedupePublicQuestionAnswers(stories: StoryWithQuestion[]) {
  const seen = new Set<string>();
  const result: ReturnType<typeof toPublicQuestionAnswerDto>[] = [];

  for (const story of stories) {
    if (seen.has(story.questionId)) continue;
    seen.add(story.questionId);
    result.push(toPublicQuestionAnswerDto(story));
  }

  return result;
}
