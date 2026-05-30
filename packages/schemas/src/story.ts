import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

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
  })
  .openapi("CreateStoryRequest");

export type CreateStoryRequest = z.infer<typeof CreateStoryRequestSchema>;

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
