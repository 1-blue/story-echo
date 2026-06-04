import { Prisma, type NotificationType } from "@storyecho/database";
import { prisma } from "@/lib/prisma";

export type CreateNotificationInput = {
  recipientUserId: string;
  actorUserId?: string | null;
  type: NotificationType;
  postId?: string | null;
  storyId?: string | null;
  commentId?: string | null;
};

export async function createNotification(input: CreateNotificationInput) {
  if (input.actorUserId && input.recipientUserId === input.actorUserId) {
    return;
  }

  try {
    await prisma.notification.create({
      data: {
        recipientUserId: input.recipientUserId,
        actorUserId: input.actorUserId ?? null,
        type: input.type,
        postId: input.postId ?? null,
        storyId: input.storyId ?? null,
        commentId: input.commentId ?? null,
      },
    });
  } catch (error) {
    if (
      input.type === "capsule_unlocked" &&
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return;
    }
    throw error;
  }
}

export async function createMentionNotifications(
  mentionedUserIds: string[],
  actorUserId: string,
  postId: string,
  commentId: string,
) {
  for (const recipientUserId of mentionedUserIds) {
    await createNotification({
      recipientUserId,
      actorUserId,
      type: "mention",
      postId,
      commentId,
    });
  }
}

export async function createStoryMentionNotifications(
  mentionedUserIds: string[],
  actorUserId: string,
  storyId: string,
  commentId: string,
) {
  for (const recipientUserId of mentionedUserIds) {
    await createNotification({
      recipientUserId,
      actorUserId,
      type: "mention",
      storyId,
      commentId,
    });
  }
}

/** @deprecated Use createNotification */
export const createCommunityNotification = createNotification;

/** @deprecated Use createMentionNotifications */
export { createMentionNotifications as createCommunityMentionNotifications };
