export type OrvalRequestConfig = {
  url: string;
  method: string;
  params?: Record<string, string | number | boolean | undefined>;
  data?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

function getBaseUrl(): string {
  if (typeof process !== "undefined" && process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL ?? "";
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
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
    body: data !== undefined ? JSON.stringify(data) : undefined,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => ({}))) as {
      message?: string;
    };
    throw new Error(errorBody.message ?? `HTTP ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export default customFetch;
