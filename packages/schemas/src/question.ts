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
