import type {
  CommunityComment as DbComment,
  CommunityPost as DbPost,
  CommunityReaction,
  CommunityReactionEmoji,
  CommunityReactionTargetType,
  User,
} from "@storyecho/database";
import type {
  CommunityAuthor,
  CommunityComment,
  CommunityPostSummary,
  ReactionCount,
} from "@storyecho/schemas";

export const EMOJI_DISPLAY: Record<CommunityReactionEmoji, string> = {
  heart: "❤️",
  sad: "😢",
  angry: "😠",
  fire: "🔥",
  clap: "👏",
};

export const ALL_REACTION_EMOJIS: CommunityReactionEmoji[] = [
  "heart",
  "sad",
  "angry",
  "fire",
  "clap",
];

export function toCommunityAuthor(user: Pick<User, "id" | "nickname">): CommunityAuthor {
  return {
    id: user.id,
    nickname: user.nickname?.trim() || "익명",
  };
}

export function getInitial(nickname: string): string {
  const trimmed = nickname.trim();
  return trimmed.charAt(0) || "?";
}

type PostWithRelations = DbPost & {
  user: Pick<User, "id" | "nickname">;
  question: { text: string } | null;
};

export function aggregateReactions(
  reactions: CommunityReaction[],
  currentUserId: string,
): ReactionCount[] {
  const counts = new Map<CommunityReactionEmoji, { count: number; reactedByMe: boolean }>();

  for (const emoji of ALL_REACTION_EMOJIS) {
    counts.set(emoji, { count: 0, reactedByMe: false });
  }

  for (const reaction of reactions) {
    const entry = counts.get(reaction.emoji)!;
    entry.count += 1;
    if (reaction.userId === currentUserId) {
      entry.reactedByMe = true;
    }
  }

  return ALL_REACTION_EMOJIS.map((emoji) => ({
    emoji,
    count: counts.get(emoji)!.count,
    reactedByMe: counts.get(emoji)!.reactedByMe,
  })).filter((item) => item.count > 0 || item.reactedByMe);
}

export function toCommunityPostSummary(
  post: PostWithRelations,
  reactionCounts: ReactionCount[],
  commentCount: number,
): CommunityPostSummary {
  return {
    id: post.id,
    author: toCommunityAuthor(post.user),
    questionText: post.question?.text ?? null,
    bodyText: post.bodyText,
    photoUrls: Array.isArray(post.photoUrls) ? (post.photoUrls as string[]) : [],
    createdAt: post.createdAt.toISOString(),
    reactionCounts,
    commentCount,
  };
}

type CommentWithUser = DbComment & {
  user: Pick<User, "id" | "nickname">;
  replies?: CommentWithUser[];
};

export function toCommunityCommentTree(comments: CommentWithUser[]): CommunityComment[] {
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

export function toCommunityCommentItem(comment: CommentWithUser) {
  return {
    id: comment.id,
    author: toCommunityAuthor(comment.user),
    bodyText: comment.bodyText,
    parentId: comment.parentId,
    createdAt: comment.createdAt.toISOString(),
  };
}

const MENTION_REGEX = /@([\w가-힣]{1,20})/g;

export function parseMentionNicknames(bodyText: string): string[] {
  const matches = bodyText.matchAll(MENTION_REGEX);
  const nicknames = new Set<string>();
  for (const match of matches) {
    if (match[1]) nicknames.add(match[1]);
  }
  return Array.from(nicknames);
}

export async function resolveMentionedUserIds(
  bodyText: string,
  prisma: {
    user: {
      findMany: (args: {
        where: { nickname: { in: string[]; mode: "insensitive" } };
        select: { id: true };
      }) => Promise<Array<{ id: string }>>;
    };
  },
): Promise<string[]> {
  const nicknames = parseMentionNicknames(bodyText);
  if (nicknames.length === 0) return [];

  const users = await prisma.user.findMany({
    where: { nickname: { in: nicknames, mode: "insensitive" } },
    select: { id: true },
  });

  return users.map((u) => u.id);
}

export async function fetchReactionCountsForTargets(
  targetType: CommunityReactionTargetType,
  targetIds: string[],
  currentUserId: string,
  prisma: {
    communityReaction: {
      findMany: (args: {
        where: { targetType: CommunityReactionTargetType; targetId: { in: string[] } };
      }) => Promise<CommunityReaction[]>;
    };
  },
): Promise<Map<string, ReactionCount[]>> {
  if (targetIds.length === 0) return new Map();

  const reactions = await prisma.communityReaction.findMany({
    where: { targetType, targetId: { in: targetIds } },
  });

  const byTarget = new Map<string, CommunityReaction[]>();
  for (const id of targetIds) {
    byTarget.set(id, []);
  }
  for (const reaction of reactions) {
    byTarget.get(reaction.targetId)?.push(reaction);
  }

  const result = new Map<string, ReactionCount[]>();
  for (const [targetId, targetReactions] of byTarget) {
    result.set(targetId, aggregateReactions(targetReactions, currentUserId));
  }
  return result;
}

export function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHour = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "방금 전";
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay === 1) return "어제";
  if (diffDay < 7) return `${diffDay}일 전`;

  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}
