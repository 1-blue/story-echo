import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const HealthResponseSchema = z
  .object({
    status: z.literal("ok").openapi({ example: "ok" }),
    version: z.string().openapi({ example: "0.0.1" }),
    timestamp: z.string().datetime().openapi({ example: "2026-05-30T00:00:00.000Z" }),
  })
  .openapi("HealthResponse");

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const ErrorResponseSchema = z
  .object({
    message: z.string(),
    code: z.string().optional(),
  })
  .openapi("ErrorResponse");

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

export const EmailNotVerifiedErrorSchema = z
  .object({
    message: z.string(),
    code: z.literal("EMAIL_NOT_VERIFIED"),
  })
  .openapi("EmailNotVerifiedError");

export type EmailNotVerifiedError = z.infer<typeof EmailNotVerifiedErrorSchema>;
