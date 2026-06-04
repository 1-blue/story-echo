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
      return notification.postId ? `/community/${notification.postId}` : "/community";
    case "mention":
      if (notification.postId) return `/community/${notification.postId}`;
      if (notification.storyId) return `/public/${notification.storyId}`;
      return "/community";
    case "comment_on_public_story":
    case "reply_to_story_comment":
      return notification.storyId ? `/public/${notification.storyId}` : "/";
    case "daily_question_reminder":
      return "/";
    case "capsule_unlocked":
      return notification.storyId ? `/capsule/${notification.storyId}` : "/capsule";
    default:
      return "/";
  }
}
