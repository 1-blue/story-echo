import { describe, expect, it } from "vitest";
import { ApiClientError } from "@storyecho/api-client/api-client-error";
import {
  DEFAULT_ERROR_MESSAGE,
  getMessageForCode,
  toUserFacingMessage,
} from "@storyecho/api-client/error-messages";
import { getErrorMessage, isNotFoundError } from "@/lib/get-error-message";

describe("error-messages", () => {
  it("maps known API codes to Korean", () => {
    expect(getMessageForCode("NOT_FOUND")).toBe("요청한 내용을 찾을 수 없어요.");
    expect(getMessageForCode("VALIDATION_ERROR")).toBe("입력 내용을 확인해 주세요.");
  });

  it("replaces English technical messages with default", () => {
    expect(toUserFacingMessage({ message: "Failed to fetch stories", code: "DB_ERROR" })).toBe(
      getMessageForCode("DB_ERROR"),
    );
    expect(toUserFacingMessage({ message: "HTTP 404" })).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it("getErrorMessage uses ApiClientError userMessage", () => {
    const err = new ApiClientError(404, { code: "NOT_FOUND", message: "Story not found" });
    expect(getErrorMessage(err)).toBe("요청한 내용을 찾을 수 없어요.");
    expect(isNotFoundError(err)).toBe(true);
  });
});
