import { generateUuid } from "@storyecho/api-client/generate-uuid";

const DEVICE_ID_KEY = "storyecho_device_id";
const DEVICE_ID_COOKIE = "storyecho_device_id";

function setDeviceIdCookie(deviceId: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${DEVICE_ID_COOKIE}=${encodeURIComponent(deviceId)}; path=/; max-age=31536000; SameSite=Lax`;
}

export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") {
    return "00000000-0000-4000-8000-000000000000";
  }

  const existing = window.localStorage.getItem(DEVICE_ID_KEY);
  if (existing) {
    setDeviceIdCookie(existing);
    return existing;
  }

  const deviceId = generateUuid();
  window.localStorage.setItem(DEVICE_ID_KEY, deviceId);
  setDeviceIdCookie(deviceId);
  return deviceId;
}

export function getDeviceId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DEVICE_ID_KEY);
}

export { DEVICE_ID_KEY, DEVICE_ID_COOKIE };
