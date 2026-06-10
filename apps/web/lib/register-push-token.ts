import { getDeviceId } from "@/lib/device-id";

type PushPlatform = "ios" | "android";

function pushTokenHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const deviceId = getDeviceId();
  if (deviceId) {
    headers["X-Device-Id"] = deviceId;
  }
  return headers;
}

export async function registerPushTokenFromWeb(
  expoPushToken: string,
  platform: PushPlatform,
): Promise<void> {
  const response = await fetch("/api/v1/users/me/push-token", {
    method: "PUT",
    credentials: "same-origin",
    headers: pushTokenHeaders(),
    body: JSON.stringify({ expoPushToken, platform }),
  });

  if (!response.ok) {
    throw new Error(`Failed to register push token (${response.status})`);
  }
}

export async function unregisterPushTokenFromWeb(): Promise<void> {
  const response = await fetch("/api/v1/users/me/push-token", {
    method: "DELETE",
    credentials: "same-origin",
    headers: pushTokenHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to unregister push token (${response.status})`);
  }
}
