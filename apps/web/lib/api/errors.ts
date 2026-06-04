import { getMessageForCode } from "@storyecho/api-client/error-messages";

export { DEFAULT_ERROR_MESSAGE, getMessageForCode } from "@storyecho/api-client/error-messages";

export function apiErrorBody(code: string, overrideMessage?: string) {
  return {
    message: overrideMessage ?? getMessageForCode(code),
    code,
  };
}

export function apiErrorResponse(status: number, code: string, overrideMessage?: string) {
  return Response.json(apiErrorBody(code, overrideMessage), { status });
}
