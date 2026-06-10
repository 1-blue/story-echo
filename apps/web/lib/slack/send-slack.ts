type SlackPayload = {
  text: string;
  blocks?: Array<Record<string, unknown>>;
};

function isSlackEnabled(): boolean {
  return process.env.SLACK_NOTIFY_ENABLED === "true";
}

export async function sendSlackWebhook(webhookUrl: string | undefined, payload: SlackPayload) {
  if (!isSlackEnabled() || !webhookUrl) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("[slack] send failed:", error);
  }
}

export function formatErrorText(
  title: string,
  details: Record<string, string | number | boolean | undefined>,
): string {
  const lines = Object.entries(details)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => `• *${key}*: ${String(value)}`);
  return `*${title}*\n${lines.join("\n")}`;
}
