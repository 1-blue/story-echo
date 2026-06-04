import type { z } from "zod";
import {
  CapsuleStoryDetailResponseSchema,
  CapsuleStoryListResponseSchema,
  CommunityPostListResponseSchema,
  CommunityPostResponseSchema,
  DrawerStoryListResponseSchema,
  EmailNotVerifiedErrorSchema,
  ErrorResponseSchema,
  NotificationListResponseSchema,
  PublicStoryDetailResponseSchema,
  PublicStoryFeedListResponseSchema,
  StoryResponseSchema,
  TodayQuestionResponseSchema,
  TodayStoryExistsErrorSchema,
  UserMeResponseSchema,
} from "@storyecho/schemas";

/** integration/E2E 공용: Vitest·Playwright 모두에서 import 가능 (vitest expect 사용 금지) */
export function parseApiJson<T extends z.ZodType>(schema: T, json: unknown): z.infer<T> {
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new Error(`API response shape mismatch: ${JSON.stringify(parsed.error.flatten())}`);
  }
  return parsed.data;
}

export const parseStory = (json: unknown) => parseApiJson(StoryResponseSchema, json);
export const parseUserMe = (json: unknown) => parseApiJson(UserMeResponseSchema, json);
export const parseTodayQuestion = (json: unknown) =>
  parseApiJson(TodayQuestionResponseSchema, json);
export const parseDrawerList = (json: unknown) => parseApiJson(DrawerStoryListResponseSchema, json);
export const parseCapsuleList = (json: unknown) =>
  parseApiJson(CapsuleStoryListResponseSchema, json);
export const parseCapsuleDetail = (json: unknown) =>
  parseApiJson(CapsuleStoryDetailResponseSchema, json);
export const parseCommunityPostList = (json: unknown) =>
  parseApiJson(CommunityPostListResponseSchema, json);
export const parseCommunityPost = (json: unknown) =>
  parseApiJson(CommunityPostResponseSchema, json);
export const parseNotificationList = (json: unknown) =>
  parseApiJson(NotificationListResponseSchema, json);
export const parsePublicStoryFeed = (json: unknown) =>
  parseApiJson(PublicStoryFeedListResponseSchema, json);
export const parsePublicStoryDetail = (json: unknown) =>
  parseApiJson(PublicStoryDetailResponseSchema, json);
export const parseTodayStoryExistsError = (json: unknown) =>
  parseApiJson(TodayStoryExistsErrorSchema, json);
export const parseEmailNotVerifiedError = (json: unknown) =>
  parseApiJson(EmailNotVerifiedErrorSchema, json);
export const parseErrorResponse = (json: unknown) => parseApiJson(ErrorResponseSchema, json);
