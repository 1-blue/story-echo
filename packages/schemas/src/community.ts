import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { PaginationMetaSchema } from "./pagination";

extendZodWithOpenApi(z);

export const CommunityReactionEmojiSchema = z
  .enum(["heart", "sad", "angry", "fire", "clap"])
  .openapi("CommunityReactionEmoji");

export type CommunityReactionEmoji = z.infer<typeof CommunityReactionEmojiSchema>;

export const CommunityReactionTargetTypeSchema = z
  .enum(["post", "comment", "story", "story_comment"])
  .openapi("CommunityReactionTargetType");

export const ReactionCountSchema = z
  .object({
    emoji: CommunityReactionEmojiSchema,
    count: z.number().int().nonnegative(),
    reactedByMe: z.boolean().default(false),
  })
  .openapi("ReactionCount");

export type ReactionCount = z.infer<typeof ReactionCountSchema>;

export const CommunityAuthorSchema = z
  .object({
    id: z.string().uuid(),
    nickname: z.string(),
  })
  .openapi("CommunityAuthor");

export type CommunityAuthor = z.infer<typeof CommunityAuthorSchema>;

export const CommunityPostSummarySchema = z
  .object({
    id: z.string().uuid(),
    author: CommunityAuthorSchema,
    questionText: z.string().nullable(),
    bodyText: z.string().max(5000),
    photoUrls: z.array(z.string().url()).max(8).default([]),
    createdAt: z.string().datetime(),
    reactionCounts: z.array(ReactionCountSchema),
    commentCount: z.number().int().nonnegative(),
  })
  .openapi("CommunityPostSummary");

export type CommunityPostSummary = z.infer<typeof CommunityPostSummarySchema>;

export const CommunityPostListResponseSchema = z
  .object({
    data: z.array(CommunityPostSummarySchema),
    meta: z.object({
      pagination: PaginationMetaSchema,
    }),
  })
  .openapi("CommunityPostListResponse");

export type CommunityPostListResponse = z.infer<typeof CommunityPostListResponseSchema>;

export const CommunityCommentSchema = z
  .object({
    id: z.string().uuid(),
    author: CommunityAuthorSchema,
    bodyText: z.string().max(2000),
    parentId: z.string().uuid().nullable(),
    createdAt: z.string().datetime(),
    replies: z.array(
      z.object({
        id: z.string().uuid(),
        author: CommunityAuthorSchema,
        bodyText: z.string().max(2000),
        parentId: z.string().uuid(),
        createdAt: z.string().datetime(),
      }),
    ),
  })
  .openapi("CommunityComment");

export type CommunityComment = z.infer<typeof CommunityCommentSchema>;

export const CommunityPostDetailSchema = CommunityPostSummarySchema.extend({
  comments: z.array(CommunityCommentSchema),
}).openapi("CommunityPostDetail");

export type CommunityPostDetail = z.infer<typeof CommunityPostDetailSchema>;

export const CommunityPostDetailResponseSchema = z
  .object({
    data: CommunityPostDetailSchema,
  })
  .openapi("CommunityPostDetailResponse");

export type CommunityPostDetailResponse = z.infer<typeof CommunityPostDetailResponseSchema>;

export const CreateCommunityPostRequestSchema = z
  .object({
    bodyText: z.string().min(1).max(5000),
    photoUrls: z.array(z.string().url()).max(8).default([]),
    questionId: z.string().uuid().nullable().optional(),
  })
  .openapi("CreateCommunityPostRequest");

export type CreateCommunityPostRequest = z.infer<typeof CreateCommunityPostRequestSchema>;

export const UpdateCommunityPostRequestSchema = z
  .object({
    bodyText: z.string().min(1).max(5000).optional(),
    photoUrls: z.array(z.string().url()).max(8).optional(),
    questionId: z.string().uuid().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
  .openapi("UpdateCommunityPostRequest");

export type UpdateCommunityPostRequest = z.infer<typeof UpdateCommunityPostRequestSchema>;

export const CommunityPostResponseSchema = z
  .object({
    data: CommunityPostSummarySchema,
  })
  .openapi("CommunityPostResponse");

export type CommunityPostResponse = z.infer<typeof CommunityPostResponseSchema>;

export const CreateCommunityCommentRequestSchema = z
  .object({
    bodyText: z.string().min(1).max(2000),
    parentId: z.string().uuid().nullable().optional(),
  })
  .openapi("CreateCommunityCommentRequest");

export type CreateCommunityCommentRequest = z.infer<typeof CreateCommunityCommentRequestSchema>;

export const UpdateCommunityCommentRequestSchema = z
  .object({
    bodyText: z.string().min(1).max(2000),
  })
  .openapi("UpdateCommunityCommentRequest");

export type UpdateCommunityCommentRequest = z.infer<typeof UpdateCommunityCommentRequestSchema>;

export const CommunityCommentItemSchema = z
  .object({
    id: z.string().uuid(),
    author: CommunityAuthorSchema,
    bodyText: z.string().max(2000),
    parentId: z.string().uuid().nullable(),
    createdAt: z.string().datetime(),
  })
  .openapi("CommunityCommentItem");

export type CommunityCommentItem = z.infer<typeof CommunityCommentItemSchema>;

export const CommunityCommentItemResponseSchema = z
  .object({
    data: CommunityCommentItemSchema,
  })
  .openapi("CommunityCommentItemResponse");

export type CommunityCommentItemResponse = z.infer<typeof CommunityCommentItemResponseSchema>;

export const CommunityCommentResponseSchema = z
  .object({
    data: CommunityCommentSchema,
  })
  .openapi("CommunityCommentResponse");

export type CommunityCommentResponse = z.infer<typeof CommunityCommentResponseSchema>;

export const ToggleCommunityReactionRequestSchema = z
  .object({
    emoji: CommunityReactionEmojiSchema,
  })
  .openapi("ToggleCommunityReactionRequest");

export type ToggleCommunityReactionRequest = z.infer<typeof ToggleCommunityReactionRequestSchema>;

export const ToggleCommunityReactionResponseSchema = z
  .object({
    data: z.array(ReactionCountSchema),
  })
  .openapi("ToggleCommunityReactionResponse");

export type ToggleCommunityReactionResponse = z.infer<typeof ToggleCommunityReactionResponseSchema>;

export const CommunityUserSearchResultSchema = z
  .object({
    id: z.string().uuid(),
    nickname: z.string(),
  })
  .openapi("CommunityUserSearchResult");

export const CommunityUserSearchResponseSchema = z
  .object({
    data: z.array(CommunityUserSearchResultSchema),
  })
  .openapi("CommunityUserSearchResponse");

export type CommunityUserSearchResponse = z.infer<typeof CommunityUserSearchResponseSchema>;

export const ReportCommunityPostRequestSchema = z
  .object({
    reason: z.string().max(500).optional(),
  })
  .openapi("ReportCommunityPostRequest");
