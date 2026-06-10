import { formatErrorText, sendSlackWebhook } from "./send-slack";

type ContentEventInput = {
  kind: "today_story" | "community_post";
  nickname?: string | null;
  resourceId: string;
  preview?: string;
};

export function notifyContentEvent(input: ContentEventInput) {
  const title =
    input.kind === "today_story" ? "📝 오늘의 이야기 작성" : "💬 커뮤니티 글 작성";

  void sendSlackWebhook(process.env.SLACK_WEBHOOK_URL_CONTENT_EVENTS, {
    text: formatErrorText(title, {
      nickname: input.nickname ?? "—",
      id: input.resourceId,
      preview: input.preview?.slice(0, 80),
      env: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    }),
  });
}
