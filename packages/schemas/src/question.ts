import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const TodayQuestionSchema = z
  .object({
    id: z.string().uuid().nullable(),
    text: z.string(),
    todayStoryId: z.string().uuid().nullable().optional(),
  })
  .openapi("TodayQuestion");

export type TodayQuestion = z.infer<typeof TodayQuestionSchema>;

export const TodayQuestionResponseSchema = z
  .object({
    data: TodayQuestionSchema,
  })
  .openapi("TodayQuestionResponse");

export type TodayQuestionResponse = z.infer<typeof TodayQuestionResponseSchema>;

export const PublicQuestionAnswerSchema = z
  .object({
    questionId: z.string().uuid(),
    questionText: z.string(),
    storyId: z.string().uuid(),
    answeredAt: z.string().datetime(),
    bodyPreview: z.string().max(200),
  })
  .openapi("PublicQuestionAnswer");

export type PublicQuestionAnswer = z.infer<typeof PublicQuestionAnswerSchema>;

export const PublicQuestionAnswerListResponseSchema = z
  .object({
    data: z.array(PublicQuestionAnswerSchema),
  })
  .openapi("PublicQuestionAnswerListResponse");

export type PublicQuestionAnswerListResponse = z.infer<
  typeof PublicQuestionAnswerListResponseSchema
>;

export const QuestionArchiveItemSchema = z
  .object({
    id: z.string().uuid(),
    text: z.string(),
    month: z.number().int().min(1).max(12),
    day: z.number().int().min(1).max(31),
    publicStoryCount: z.number().int().min(0),
  })
  .openapi("QuestionArchiveItem");

export type QuestionArchiveItem = z.infer<typeof QuestionArchiveItemSchema>;

export const QuestionArchiveListResponseSchema = z
  .object({
    data: z.array(QuestionArchiveItemSchema),
  })
  .openapi("QuestionArchiveListResponse");

export type QuestionArchiveListResponse = z.infer<typeof QuestionArchiveListResponseSchema>;

export const QuestionResponseSchema = z
  .object({
    data: QuestionArchiveItemSchema,
  })
  .openapi("QuestionResponse");

export type QuestionResponse = z.infer<typeof QuestionResponseSchema>;
