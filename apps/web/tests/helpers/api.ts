import { getTestBaseUrl } from "../setup/env";

export type ApiJson = Record<string, unknown>;

export type ApiResponse<T = ApiJson> = {
  status: number;
  ok: boolean;
  json: T;
  headers: Headers;
};

export type ApiClientOptions = {
  deviceId?: string;
  cookie?: string;
  baseUrl?: string;
};

function resolveBaseUrl(baseUrl?: string): string {
  return (baseUrl ?? globalThis.__TEST_BASE_URL__ ?? getTestBaseUrl()).replace(/\/$/, "");
}

export async function apiFetch<T = ApiJson>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
  options: ApiClientOptions = {},
): Promise<ApiResponse<T>> {
  const { json, headers: initHeaders, ...rest } = init;
  const headers = new Headers(initHeaders);

  if (json !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (options.deviceId) {
    headers.set("X-Device-Id", options.deviceId);
  }
  if (options.cookie) {
    headers.set("Cookie", options.cookie);
  }

  const url = `${resolveBaseUrl(options.baseUrl)}${path.startsWith("/") ? path : `/${path}`}`;
  const fetchTimeoutMs = Number(process.env.TEST_FETCH_TIMEOUT_MS ?? 25_000);
  const slowMs = Number(process.env.TEST_SLOW_MS ?? 10_000);
  const startedAt = Date.now();
  const response = await fetch(url, {
    ...rest,
    headers,
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    signal: rest.signal ?? AbortSignal.timeout(fetchTimeoutMs),
  });
  const elapsedMs = Date.now() - startedAt;
  if (elapsedMs >= slowMs) {
    console.warn(`[integration] slow apiFetch ${elapsedMs}ms ${path}`);
  }

  let parsed: T;
  if (response.status === 204) {
    parsed = undefined as T;
  } else {
    parsed = (await response.json().catch(() => ({}))) as T;
  }

  return {
    status: response.status,
    ok: response.ok,
    json: parsed,
    headers: response.headers,
  };
}

export function extractCookies(setCookieHeader: string | null): string {
  if (!setCookieHeader) return "";
  return setCookieHeader
    .split(/,(?=\s*[^;]+=[^;]+)/)
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean)
    .join("; ");
}

export async function mergeCookies(existing: string, response: Response): Promise<string> {
  const headers = response.headers as Headers & { getSetCookie?: () => string[] };
  const raw =
    headers.getSetCookie?.() ??
    ([response.headers.get("set-cookie")].filter(Boolean) as string[]);
  const next = raw.map((c) => extractCookies(c)).filter(Boolean).join("; ");
  if (!existing) return next;
  if (!next) return existing;
  return `${existing}; ${next}`;
}
