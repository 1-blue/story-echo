import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { CommunityAuthorSchema } from "./community";
import { PaginationMetaSchema } from "./pagination";

extendZodWithOpenApi(z);

export const NotificationTypeSchema = z
  .enum([
    "comment_on_post",
    "reply_to_comment",
    "mention",
    "comment_on_public_story",
    "reply_to_story_comment",
    "daily_question_reminder",
    "capsule_unlocked",
  ])
  .openapi("NotificationType");

export type NotificationType = z.infer<typeof NotificationTypeSchema>;

export const NotificationSchema = z
  .object({
    id: z.string().uuid(),
    type: NotificationTypeSchema,
    postId: z.string().uuid().nullable(),
    storyId: z.string().uuid().nullable(),
    commentId: z.string().uuid().nullable(),
    actor: CommunityAuthorSchema.nullable(),
    readAt: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
  })
  .openapi("Notification");

export type Notification = z.infer<typeof NotificationSchema>;

export const NotificationListResponseSchema = z
  .object({
    data: z.array(NotificationSchema),
    meta: z.object({
      unreadCount: z.number().int().nonnegative(),
      pagination: PaginationMetaSchema,
    }),
  })
  .openapi("NotificationListResponse");

export type NotificationListResponse = z.infer<typeof NotificationListResponseSchema>;

export const MarkNotificationsReadRequestSchema = z
  .object({
    ids: z.array(z.string().uuid()).optional(),
    markAll: z.boolean().optional(),
  })
  .openapi("MarkNotificationsReadRequest");

export type MarkNotificationsReadRequest = z.infer<typeof MarkNotificationsReadRequestSchema>;

export const DeleteNotificationsRequestSchema = z
  .object({
    ids: z.array(z.string().uuid()).optional(),
    deleteRead: z.boolean().optional(),
  })
  .openapi("DeleteNotificationsRequest");

export type DeleteNotificationsRequest = z.infer<typeof DeleteNotificationsRequestSchema>;

/** @deprecated Use NotificationTypeSchema */
export const CommunityNotificationTypeSchema = NotificationTypeSchema;
/** @deprecated Use NotificationSchema */
export const CommunityNotificationSchema = NotificationSchema;
/** @deprecated Use NotificationListResponseSchema */
export const CommunityNotificationListResponseSchema = NotificationListResponseSchema;
