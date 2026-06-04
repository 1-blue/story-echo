import type { Story as DbStory } from "@storyecho/database";
import type { CapsuleStoryDetail, CapsuleStorySummary } from "@storyecho/schemas";
import { computeDaysUntilUnlock } from "@/lib/capsule-utils";

type StoryWithQuestion = DbStory & {
  question: { text: string } | null;
};

export function toCapsuleStorySummary(story: StoryWithQuestion): CapsuleStorySummary {
  const unlockAt = story.unlockAt!.toISOString();
  const isSealed = story.isCapsuleActive;
  const photoUrls = Array.isArray(story.photoUrls) ? (story.photoUrls as string[]) : [];

  return {
    id: story.id,
    questionText: story.question?.text ?? null,
    bodyPreview: isSealed ? null : story.bodyText.slice(0, 120),
    createdAt: story.createdAt.toISOString(),
    unlockAt,
    isCapsuleActive: story.isCapsuleActive,
    daysUntilUnlock: computeDaysUntilUnlock(unlockAt),
    recipientLabel: "나에게",
  };
}

export function toCapsuleStoryDetail(story: StoryWithQuestion): CapsuleStoryDetail {
  const unlockAt = story.unlockAt!.toISOString();
  const isSealed = story.isCapsuleActive;
  const photoUrls = Array.isArray(story.photoUrls) ? (story.photoUrls as string[]) : [];

  return {
    id: story.id,
    questionText: story.question?.text ?? null,
    bodyText: isSealed ? null : story.bodyText,
    photoUrls: isSealed ? null : photoUrls,
    createdAt: story.createdAt.toISOString(),
    unlockAt,
    isCapsuleActive: story.isCapsuleActive,
    daysUntilUnlock: computeDaysUntilUnlock(unlockAt),
    recipientLabel: "나에게",
  };
}
