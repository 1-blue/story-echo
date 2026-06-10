import { getWebBaseUrl } from "@/lib/get-web-url";

type ApiOptions = {
  deviceId: string;
  method: "PUT" | "DELETE" | "PATCH";
  path: string;
  body?: unknown;
};

async function apiRequest({ deviceId, method, path, body }: ApiOptions): Promise<Response> {
  const baseUrl = getWebBaseUrl();
  if (!baseUrl) {
    throw new Error("EXPO_PUBLIC_WEB_URL is not configured");
  }

  return fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Device-Id": deviceId,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

export async function registerPushToken(
  deviceId: string,
  expoPushToken: string,
  platform: "android" | "ios",
): Promise<void> {
  const response = await apiRequest({
    deviceId,
    method: "PUT",
    path: "/api/v1/users/me/push-token",
    body: { expoPushToken, platform },
  });

  if (!response.ok) {
    throw new Error(`Failed to register push token (${response.status})`);
  }
}

export async function unregisterPushToken(deviceId: string): Promise<void> {
  const response = await apiRequest({
    deviceId,
    method: "DELETE",
    path: "/api/v1/users/me/push-token",
  });

  if (!response.ok) {
    throw new Error(`Failed to unregister push token (${response.status})`);
  }
}

export async function setNotificationsEnabled(
  deviceId: string,
  enabled: boolean,
): Promise<void> {
  const response = await apiRequest({
    deviceId,
    method: "PATCH",
    path: "/api/v1/users/me",
    body: { notificationsEnabled: enabled },
  });

  if (!response.ok) {
    throw new Error(`Failed to update notifications (${response.status})`);
  }
}
