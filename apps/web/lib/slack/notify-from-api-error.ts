import { isIntentionalErrorCode } from "./intentional-error-codes";
import { formatErrorText, sendSlackWebhook } from "./send-slack";

type ApiErrorNotifyInput = {
  status: number;
  code?: string;
  message?: string;
  path?: string;
  method?: string;
};

export function notifyFromApiError(input: ApiErrorNotifyInput) {
  const { status, code, message, path, method } = input;
  const intentional = isIntentionalErrorCode(code, status);

  const webhookUrl = intentional
    ? process.env.SLACK_WEBHOOK_URL_INTENTIONAL_ERRORS
    : process.env.SLACK_WEBHOOK_URL_UNINTENTIONAL_ERRORS;

  const title = intentional ? "Expected API error" : "Unexpected API error";

  void sendSlackWebhook(webhookUrl, {
    text: formatErrorText(title, {
      status,
      code,
      message,
      method,
      path,
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    }),
  });
}
