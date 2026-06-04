import type { StoryComment as DbStoryComment, Story as DbStory, User } from "@storyecho/database";
import type { CommunityComment, PublicStoryFeedItem, ReactionCount } from "@storyecho/schemas";
import {
  aggregateReactions,
  toCommunityAuthor,
} from "@/lib/community-mapper";

type StoryWithUser = DbStory & {
  user: Pick<User, "id" | "nickname">;
  question: { text: string } | null;
};

type StoryCommentWithUser = DbStoryComment & {
  user: Pick<User, "id" | "nickname">;
  replies?: StoryCommentWithUser[];
};

export function toPublicStoryFeedItem(
  story: StoryWithUser,
  reactionCounts: ReactionCount[],
  commentCount: number,
): PublicStoryFeedItem {
  return {
    id: story.id,
    author: toCommunityAuthor(story.user),
    questionText: story.question?.text ?? null,
    bodyText: story.bodyText,
    photoUrls: Array.isArray(story.photoUrls) ? (story.photoUrls as string[]) : [],
    createdAt: story.createdAt.toISOString(),
    reactionCounts,
    commentCount,
  };
}

export function toStoryCommentTree(comments: StoryCommentWithUser[]): CommunityComment[] {
  return comments.map((comment) => ({
    id: comment.id,
    author: toCommunityAuthor(comment.user),
    bodyText: comment.bodyText,
    parentId: comment.parentId,
    createdAt: comment.createdAt.toISOString(),
    replies: (comment.replies ?? []).map((reply) => ({
      id: reply.id,
      author: toCommunityAuthor(reply.user),
      bodyText: reply.bodyText,
      parentId: reply.parentId!,
      createdAt: reply.createdAt.toISOString(),
    })),
  }));
}

export function toStoryCommentItem(comment: StoryCommentWithUser) {
  return {
    id: comment.id,
    author: toCommunityAuthor(comment.user),
    bodyText: comment.bodyText,
    parentId: comment.parentId,
    createdAt: comment.createdAt.toISOString(),
  };
}

export { aggregateReactions };
