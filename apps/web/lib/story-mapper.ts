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
