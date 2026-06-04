import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UserRoleSchema = z.enum(["guest", "member", "admin"]).openapi("UserRole");

export const FontSizeSchema = z.enum(["sm", "md", "lg"]).openapi("FontSize");

export const UserMeSchema = z
  .object({
    id: z.string().uuid(),
    role: UserRoleSchema,
    email: z.string().email().nullable(),
    nickname: z.string().nullable(),
    fontSize: FontSizeSchema,
    notificationsEnabled: z.boolean(),
    adFree: z.boolean(),
  })
  .openapi("UserMe");

export type UserMe = z.infer<typeof UserMeSchema>;

export const UserMeResponseSchema = z
  .object({
    data: UserMeSchema,
  })
  .openapi("UserMeResponse");

export const CreateGuestRequestSchema = z
  .object({
    deviceId: z.string().uuid(),
  })
  .openapi("CreateGuestRequest");

export const UpdateUserRequestSchema = z
  .object({
    nickname: z.string().min(1).max(30).optional(),
    fontSize: FontSizeSchema.optional(),
    notificationsEnabled: z.boolean().optional(),
  })
  .openapi("UpdateUserRequest");

export const LoginRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .openapi("LoginRequest");

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const SignupRequestSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    nickname: z.string().min(1).max(30).optional(),
  })
  .openapi("SignupRequest");

export type SignupRequest = z.infer<typeof SignupRequestSchema>;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;
