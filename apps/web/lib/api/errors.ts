import { getMessageForCode } from "@storyecho/api-client/error-messages";
import { notifyFromApiError } from "@/lib/slack/notify-from-api-error";

export { DEFAULT_ERROR_MESSAGE, getMessageForCode } from "@storyecho/api-client/error-messages";

export function apiErrorBody(code: string, overrideMessage?: string) {
  return {
    message: overrideMessage ?? getMessageForCode(code),
    code,
  };
}

type ApiErrorResponseOptions = {
  path?: string;
  method?: string;
};

export function apiErrorResponse(
  status: number,
  code: string,
  overrideMessage?: string,
  options?: ApiErrorResponseOptions,
) {
  void notifyFromApiError({
    status,
    code,
    message: overrideMessage ?? getMessageForCode(code),
    path: options?.path,
    method: options?.method,
  });

  return Response.json(apiErrorBody(code, overrideMessage), { status });
}
