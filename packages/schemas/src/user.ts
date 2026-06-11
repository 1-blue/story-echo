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

export const PushPlatformSchema = z.enum(["android", "ios"]).openapi("PushPlatform");

export const UpsertPushTokenRequestSchema = z
  .object({
    expoPushToken: z.string().min(1),
    platform: PushPlatformSchema,
  })
  .openapi("UpsertPushTokenRequest");

export type UpsertPushTokenRequest = z.infer<typeof UpsertPushTokenRequestSchema>;

export const PushTokenOkResponseSchema = z
  .object({
    data: z.object({ ok: z.literal(true) }),
  })
  .openapi("PushTokenOkResponse");

export const CronNotificationsResultSchema = z
  .object({
    dailyReminders: z.number().int(),
    capsuleUnlocked: z.number().int(),
    pushSent: z.number().int(),
    pushFailed: z.number().int(),
    /** push_tokens 없어서 in-app 알림만 생성된 유저 수 */
    pushSkippedNoToken: z.number().int(),
  })
  .openapi("CronNotificationsResult");

export const CronNotificationsResponseSchema = z
  .object({
    data: CronNotificationsResultSchema,
  })
  .openapi("CronNotificationsResponse");
