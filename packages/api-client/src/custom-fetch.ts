import { ApiClientError } from "./api-client-error";
import { generateUuid } from "./generate-uuid";

export type OrvalRequestConfig = {
  url: string;
  method: string;
  params?: Record<string, string | number | boolean | undefined>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

const DEVICE_ID_KEY = "storyecho_device_id";
const DEVICE_ID_COOKIE = "storyecho_device_id";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  if (typeof process !== "undefined" && process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function readDeviceIdFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${DEVICE_ID_COOKIE}=([^;]*)`));
  return match?.[1] ? decodeURIComponent(match[1]) : null;
}

function getDeviceIdHeader(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  let deviceId = window.localStorage.getItem(DEVICE_ID_KEY) ?? readDeviceIdFromCookie();
  if (!deviceId) {
    deviceId = generateUuid();
    window.localStorage.setItem(DEVICE_ID_KEY, deviceId);
    document.cookie = `${DEVICE_ID_COOKIE}=${encodeURIComponent(deviceId)}; path=/; max-age=31536000; SameSite=Lax`;
  }

  return { "X-Device-Id": deviceId };
}

function buildUrl(path: string, params?: OrvalRequestConfig["params"]): string {
  const base = getBaseUrl().replace(/\/$/, "");
  const url = new URL(`${base}${path.startsWith("/") ? path : `/${path}`}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/** orval mutator — config object signature (tags-split + react-query) */
export async function customFetch<T>(config: OrvalRequestConfig): Promise<T> {
  const { url, method, params, data, headers, signal } = config;
  const resolvedUrl = url.startsWith("http") ? url : buildUrl(url, params);

  const response = await fetch(resolvedUrl, {
    method,
    signal,
    credentials: "same-origin",
    body: data !== undefined ? JSON.stringify(data) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...getDeviceIdHeader(),
      ...headers,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as {
      message?: string;
      code?: string;
    };
    throw new ApiClientError(response.status, errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export default customFetch;
