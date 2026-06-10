export const DEFAULT_ERROR_MESSAGE = "잠시 후 다시 시도해 주세요.";

export const API_ERROR_MESSAGES: Record<string, string> = {
  DB_UNAVAILABLE: "서비스를 일시적으로 이용할 수 없어요. 잠시 후 다시 시도해 주세요.",
  DB_ERROR: "일시적인 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
  VALIDATION_ERROR: "입력 내용을 확인해 주세요.",
  NOT_FOUND: "요청한 내용을 찾을 수 없어요.",
  UNAUTHORIZED: "접근 권한이 없어요.",
  FORBIDDEN: "이 작업을 수행할 수 없어요.",
  DEVICE_ID_REQUIRED: "앱을 다시 시작해 주세요.",
  EMAIL_NOT_VERIFIED: "이메일 인증 후 이용할 수 있어요.",
  AUTH_UNAVAILABLE: "로그인 서비스를 이용할 수 없어요.",
  AUTH_FAILED: "로그인에 실패했어요. 이메일과 비밀번호를 확인해 주세요.",
  AUTH_ERROR: "로그인 처리 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.",
  NICKNAME_TAKEN: "이미 사용 중인 닉네임이에요.",
  TODAY_STORY_EXISTS: "오늘의 질문에는 이미 이야기를 남겼어요.",
  QUESTION_NOT_TODAY: "오늘의 질문에만 이야기를 남길 수 있어요.",
  REPLY_DEPTH_EXCEEDED: "답글은 한 단계까지만 남길 수 있어요.",
  AWS_UNAVAILABLE: "파일 업로드를 이용할 수 없어요.",
  AWS_ERROR: "파일 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.",
  UPLOAD_ERROR: "파일 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.",
  CRON_ERROR: "알림 처리 중 오류가 발생했어요.",
  REPORT_ERROR: "신고 처리에 실패했어요. 잠시 후 다시 시도해 주세요.",
};

const ENGLISH_MESSAGE_PATTERN = /^(failed|error|not found|unauthorized|invalid|required|http \d+)/i;

export function getMessageForCode(code?: string, fallbackMessage?: string): string {
  if (code && API_ERROR_MESSAGES[code]) {
    return API_ERROR_MESSAGES[code];
  }
  if (fallbackMessage && !ENGLISH_MESSAGE_PATTERN.test(fallbackMessage.trim())) {
    return fallbackMessage;
  }
  return DEFAULT_ERROR_MESSAGE;
}

export function isEnglishOrTechnicalMessage(message: string): boolean {
  const trimmed = message.trim();
  if (!trimmed) return true;
  if (ENGLISH_MESSAGE_PATTERN.test(trimmed)) return true;
  if (/^[A-Za-z_][\w\s.:,\-{}[\]()'"]+$/.test(trimmed) && !/[가-힣]/.test(trimmed)) {
    return true;
  }
  return false;
}

export function toUserFacingMessage(
  input: { code?: string; message?: string } | undefined,
  status?: number,
): string {
  if (input?.code) {
    const byCode = getMessageForCode(input.code, input.message);
    if (byCode !== DEFAULT_ERROR_MESSAGE || !input.message) {
      return byCode;
    }
  }
  if (input?.message && !isEnglishOrTechnicalMessage(input.message)) {
    return input.message;
  }
  if (status === 404) return API_ERROR_MESSAGES.NOT_FOUND ?? DEFAULT_ERROR_MESSAGE;
  if (status === 401) return API_ERROR_MESSAGES.UNAUTHORIZED ?? DEFAULT_ERROR_MESSAGE;
  if (status === 403) return API_ERROR_MESSAGES.FORBIDDEN ?? DEFAULT_ERROR_MESSAGE;
  return DEFAULT_ERROR_MESSAGE;
}
