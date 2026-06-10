import { formatErrorText, sendSlackWebhook } from "./send-slack";

type UnexpectedErrorInput = {
  context: string;
  error: unknown;
  extra?: Record<string, string | number | boolean | undefined>;
};

function errorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }
  return String(error);
}

export function notifyUnexpectedError(input: UnexpectedErrorInput) {
  void sendSlackWebhook(process.env.SLACK_WEBHOOK_URL_UNINTENTIONAL_ERRORS, {
    text: formatErrorText("Unexpected server error", {
      context: input.context,
      error: errorMessage(input.error),
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      ...input.extra,
    }),
  });
}
