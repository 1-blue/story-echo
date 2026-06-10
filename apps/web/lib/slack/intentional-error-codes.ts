export const INTENTIONAL_ERROR_CODES = new Set([
  "AUTH_FAILED",
  "VALIDATION_ERROR",
  "NICKNAME_TAKEN",
  "EMAIL_NOT_VERIFIED",
  "TODAY_STORY_EXISTS",
  "QUESTION_NOT_TODAY",
  "FORBIDDEN",
  "UNAUTHORIZED",
  "NOT_FOUND",
  "NOT_MEMBER",
  "REPLY_DEPTH_EXCEEDED",
  "DEVICE_ID_REQUIRED",
]);

export function isIntentionalErrorCode(code: string | undefined, status: number): boolean {
  if (status >= 500) return false;
  return Boolean(code && INTENTIONAL_ERROR_CODES.has(code));
}
