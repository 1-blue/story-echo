export type ExpoPushMessage = {
  to: string;
  title: string;
  body: string;
  sound?: "default";
  data?: Record<string, string>;
};

export type SendExpoPushResult = {
  sent: number;
  failed: number;
};

type ExpoPushTicket = {
  status: "ok" | "error";
  message?: string;
  details?: { error?: string };
};

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
const CHUNK_SIZE = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

export async function sendExpoPushNotifications(
  messages: ExpoPushMessage[],
  fetchImpl: typeof fetch = fetch,
): Promise<SendExpoPushResult> {
  if (messages.length === 0) {
    return { sent: 0, failed: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const batch of chunk(messages, CHUNK_SIZE)) {
    const response = await fetchImpl(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
    });

    if (!response.ok) {
      failed += batch.length;
      continue;
    }

    const tickets = (await response.json()) as { data?: ExpoPushTicket[] };
    for (const ticket of tickets.data ?? []) {
      if (ticket.status === "ok") {
        sent += 1;
      } else {
        failed += 1;
      }
    }
  }

  return { sent, failed };
}
