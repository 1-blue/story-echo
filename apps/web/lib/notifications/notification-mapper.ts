import type { Notification as PrismaNotification, User } from "@storyecho/database";
import type { Notification } from "@storyecho/schemas";
import { toCommunityAuthor } from "@/lib/community-mapper";

type NotificationWithActor = PrismaNotification & {
  actor: Pick<User, "id" | "nickname"> | null;
};

export function toNotificationDto(notification: NotificationWithActor): Notification {
  return {
    id: notification.id,
    type: notification.type,
    postId: notification.postId,
    storyId: notification.storyId,
    commentId: notification.commentId,
    actor: notification.actor ? toCommunityAuthor(notification.actor) : null,
    readAt: notification.readAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
  };
}

export function getNotificationHref(notification: Notification): string {
  switch (notification.type) {
    case "comment_on_post":
    case "reply_to_comment":
      return notification.postId ? `/app/community/${notification.postId}` : "/app/community";
    case "mention":
      if (notification.postId) return `/app/community/${notification.postId}`;
      if (notification.storyId) return `/app/public/${notification.storyId}`;
      return "/app/community";
    case "comment_on_public_story":
    case "reply_to_story_comment":
      return notification.storyId ? `/app/public/${notification.storyId}` : "/app";
    case "daily_question_reminder":
      return "/app";
    case "capsule_unlocked":
      return notification.storyId ? `/app/capsule/${notification.storyId}` : "/app/capsule";
    default:
      return "/app";
  }
}
