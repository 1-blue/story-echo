import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { PaginationMetaSchema } from "./pagination";
import {
  CommunityAuthorSchema,
  CommunityCommentSchema,
  ReactionCountSchema,
} from "./community";

extendZodWithOpenApi(z);

export const VisibilitySchema = z.enum(["private", "community"]).openapi("Visibility");

export const StorySchema = z
  .object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    questionId: z.string().uuid().nullable(),
    bodyText: z.string().max(5000),
    photoUrls: z.array(z.string().url()).max(8),
    visibility: VisibilitySchema,
    isCapsule: z.boolean(),
    unlockAt: z.string().datetime().nullable(),
    isCapsuleActive: z.boolean(),
    createdAt: z.string().datetime(),
  })
  .openapi("Story");

export type Story = z.infer<typeof StorySchema>;

export const CreateStoryRequestSchema = z
  .object({
    bodyText: z.string().min(1).max(5000),
    photoUrls: z.array(z.string().url()).max(8).default([]),
    visibility: VisibilitySchema.default("private"),
    isCapsule: z.boolean().default(false),
    unlockAt: z.string().datetime().nullable().optional(),
    questionId: z.string().uuid().nullable().optional(),
  })
  .openapi("CreateStoryRequest");

export type CreateStoryRequest = z.infer<typeof CreateStoryRequestSchema>;

export const TodayStoryExistsErrorSchema = z
  .object({
    message: z.string(),
    code: z.literal("TODAY_STORY_EXISTS"),
    storyId: z.string().uuid(),
  })
  .openapi("TodayStoryExistsError");

export type TodayStoryExistsError = z.infer<typeof TodayStoryExistsErrorSchema>;

export const UpdateStoryRequestSchema = z
  .object({
    bodyText: z.string().min(1).max(5000).optional(),
    photoUrls: z.array(z.string().url()).max(8).optional(),
    visibility: VisibilitySchema.optional(),
    isBookmarked: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
  .openapi("UpdateStoryRequest");

export type UpdateStoryRequest = z.infer<typeof UpdateStoryRequestSchema>;

export const StoryListResponseSchema = z
  .object({
    data: z.array(StorySchema),
  })
  .openapi("StoryListResponse");

export type StoryListResponse = z.infer<typeof StoryListResponseSchema>;

export const StoryResponseSchema = z
  .object({
    data: StorySchema,
  })
  .openapi("StoryResponse");

export type StoryResponse = z.infer<typeof StoryResponseSchema>;

export const DrawerStorySchema = z
  .object({
    id: z.string().uuid(),
    bodyText: z.string().max(5000),
    createdAt: z.string().datetime(),
    questionText: z.string().nullable(),
    photoUrls: z.array(z.string().url()).max(8).default([]),
    isCapsule: z.boolean(),
    isCapsuleActive: z.boolean(),
    isEchoStory: z.boolean(),
    isBookmarked: z.boolean(),
  })
  .openapi("DrawerStory");

export type DrawerStory = z.infer<typeof DrawerStorySchema>;

export const DrawerStoryListMetaSchema = z
  .object({
    totalCount: z.number().int().nonnegative(),
    activeCapsuleCount: z.number().int().nonnegative(),
    oldestStoryAt: z.string().datetime().nullable(),
    pagination: PaginationMetaSchema,
  })
  .openapi("DrawerStoryListMeta");

export type DrawerStoryListMeta = z.infer<typeof DrawerStoryListMetaSchema>;

export const DrawerStoryListResponseSchema = z
  .object({
    data: z.array(DrawerStorySchema),
    meta: DrawerStoryListMetaSchema,
  })
  .openapi("DrawerStoryListResponse");

export type DrawerStoryListResponse = z.infer<typeof DrawerStoryListResponseSchema>;

export const StoryDetailSchema = DrawerStorySchema.extend({
  visibility: VisibilitySchema,
  questionId: z.string().uuid().nullable(),
}).openapi("StoryDetail");

export type StoryDetail = z.infer<typeof StoryDetailSchema>;

export const StoryDetailResponseSchema = z
  .object({
    data: StoryDetailSchema,
  })
  .openapi("StoryDetailResponse");

export type StoryDetailResponse = z.infer<typeof StoryDetailResponseSchema>;

export const CapsuleStorySummarySchema = z
  .object({
    id: z.string().uuid(),
    questionText: z.string().nullable(),
    bodyPreview: z.string().nullable(),
    createdAt: z.string().datetime(),
    unlockAt: z.string().datetime(),
    isCapsuleActive: z.boolean(),
    daysUntilUnlock: z.number().int().nonnegative(),
    recipientLabel: z.literal("나에게"),
  })
  .openapi("CapsuleStorySummary");

export type CapsuleStorySummary = z.infer<typeof CapsuleStorySummarySchema>;

export const CapsuleStoryDetailSchema = z
  .object({
    id: z.string().uuid(),
    questionText: z.string().nullable(),
    bodyText: z.string().max(5000).nullable(),
    photoUrls: z.array(z.string().url()).max(8).nullable(),
    createdAt: z.string().datetime(),
    unlockAt: z.string().datetime(),
    isCapsuleActive: z.boolean(),
    daysUntilUnlock: z.number().int().nonnegative(),
    recipientLabel: z.literal("나에게"),
  })
  .openapi("CapsuleStoryDetail");

export type CapsuleStoryDetail = z.infer<typeof CapsuleStoryDetailSchema>;

export const CapsuleStoryListDataSchema = z
  .object({
    sealed: z.array(CapsuleStorySummarySchema),
    opened: z.array(CapsuleStorySummarySchema),
  })
  .openapi("CapsuleStoryListData");

export const CapsuleStoryListMetaSchema = z
  .object({
    activeCapsuleCount: z.number().int().nonnegative(),
    pagination: PaginationMetaSchema,
  })
  .openapi("CapsuleStoryListMeta");

export const CapsuleStoryListResponseSchema = z
  .object({
    data: CapsuleStoryListDataSchema,
    meta: CapsuleStoryListMetaSchema,
  })
  .openapi("CapsuleStoryListResponse");

export type CapsuleStoryListResponse = z.infer<typeof CapsuleStoryListResponseSchema>;

export const CapsuleStoryDetailResponseSchema = z
  .object({
    data: CapsuleStoryDetailSchema,
  })
  .openapi("CapsuleStoryDetailResponse");

export type CapsuleStoryDetailResponse = z.infer<typeof CapsuleStoryDetailResponseSchema>;

export const PublicStoryFeedItemSchema = z
  .object({
    id: z.string().uuid(),
    author: CommunityAuthorSchema,
    questionText: z.string().nullable(),
    bodyText: z.string().max(5000),
    photoUrls: z.array(z.string().url()).max(8),
    createdAt: z.string().datetime(),
    reactionCounts: z.array(ReactionCountSchema),
    commentCount: z.number().int().nonnegative(),
  })
  .openapi("PublicStoryFeedItem");

export type PublicStoryFeedItem = z.infer<typeof PublicStoryFeedItemSchema>;

export const PublicStoryFeedListResponseSchema = z
  .object({
    data: z.array(PublicStoryFeedItemSchema),
    meta: z.object({
      pagination: PaginationMetaSchema,
    }),
  })
  .openapi("PublicStoryFeedListResponse");

export type PublicStoryFeedListResponse = z.infer<typeof PublicStoryFeedListResponseSchema>;

export const PublicStoryDetailSchema = PublicStoryFeedItemSchema.extend({
  comments: z.array(CommunityCommentSchema),
}).openapi("PublicStoryDetail");

export type PublicStoryDetail = z.infer<typeof PublicStoryDetailSchema>;

export const PublicStoryDetailResponseSchema = z
  .object({
    data: PublicStoryDetailSchema,
  })
  .openapi("PublicStoryDetailResponse");

export type PublicStoryDetailResponse = z.infer<typeof PublicStoryDetailResponseSchema>;
