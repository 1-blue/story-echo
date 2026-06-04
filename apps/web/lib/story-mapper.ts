import type { Story as DbStory } from "@storyecho/database";
import type { Story } from "@storyecho/schemas";

export function toStoryDto(story: DbStory): Story {
  return {
    id: story.id,
    userId: story.userId,
    questionId: story.questionId,
    bodyText: story.bodyText,
    photoUrls: Array.isArray(story.photoUrls) ? (story.photoUrls as string[]) : [],
    visibility: story.visibility,
    isCapsule: story.isCapsule,
    unlockAt: story.unlockAt?.toISOString() ?? null,
    isCapsuleActive: story.isCapsuleActive,
    createdAt: story.createdAt.toISOString(),
  };
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

type StoryWithQuestion = DbStory & {
  question: { text: string } | null;
};

export function buildQuestionEchoCounts(
  stories: Array<{ questionId: string | null }>,
): Map<string, number> {
  const counts = new Map<string, number>();

  for (const story of stories) {
    if (!story.questionId) continue;
    counts.set(story.questionId, (counts.get(story.questionId) ?? 0) + 1);
  }

  return counts;
}

export function isEchoStoryFromCounts(
  questionId: string | null,
  echoCounts: Map<string, number>,
): boolean {
  if (!questionId) return false;
  return (echoCounts.get(questionId) ?? 0) >= 2;
}

export function toDrawerStoryDto(story: StoryWithQuestion, isEchoStory = false) {
  return {
    id: story.id,
    bodyText: story.bodyText,
    createdAt: story.createdAt.toISOString(),
    questionText: story.question?.text ?? null,
    photoUrls: Array.isArray(story.photoUrls) ? (story.photoUrls as string[]) : [],
    isCapsule: story.isCapsule,
    isCapsuleActive: story.isCapsuleActive,
    isEchoStory,
    isBookmarked: story.isBookmarked,
  };
}

export function toStoryDetailDto(story: StoryWithQuestion, isEchoStory = false) {
  return {
    ...toDrawerStoryDto(story, isEchoStory),
    visibility: story.visibility,
    questionId: story.questionId,
  };
}

export async function fetchEchoCountsForUser(userId: string) {
  const { prisma } = await import("@/lib/prisma");

  const echoSourceStories = await prisma.story.findMany({
    where: {
      userId,
      visibility: "private",
      questionId: { not: null },
    },
    select: { questionId: true },
  });

  return buildQuestionEchoCounts(echoSourceStories);
}
