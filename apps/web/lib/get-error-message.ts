import { ApiClientError } from "@storyecho/api-client/api-client-error";
import { DEFAULT_ERROR_MESSAGE, toUserFacingMessage } from "@storyecho/api-client/error-messages";

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiClientError) {
    return error.userMessage;
  }
  if (error instanceof Error) {
    return toUserFacingMessage({ message: error.message });
  }
  return DEFAULT_ERROR_MESSAGE;
}

export function isNotFoundError(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    return error.isNotFound;
  }
  if (error instanceof Error) {
    return /not found/i.test(error.message) || error.message.includes("찾을 수 없");
  }
  return false;
}
