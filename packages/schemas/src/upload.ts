import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const PresignContentTypeSchema = z
  .enum(["image/jpeg", "image/png", "image/webp"])
  .openapi("PresignContentType");

export type PresignContentType = z.infer<typeof PresignContentTypeSchema>;

export const PresignUploadRequestSchema = z
  .object({
    contentType: PresignContentTypeSchema,
    fileName: z.string().min(1).max(255),
    fileSize: z
      .number()
      .int()
      .positive()
      .max(50 * 1024 * 1024),
  })
  .openapi("PresignUploadRequest");

export type PresignUploadRequest = z.infer<typeof PresignUploadRequestSchema>;

export const PresignUploadResponseSchema = z
  .object({
    data: z.object({
      uploadUrl: z.string().url(),
      publicUrl: z.string().url(),
      key: z.string(),
    }),
  })
  .openapi("PresignUploadResponse");

export type PresignUploadResponse = z.infer<typeof PresignUploadResponseSchema>;
