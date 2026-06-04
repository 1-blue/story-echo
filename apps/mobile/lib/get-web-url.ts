export function getWebBaseUrl(): string | null {
  const url = process.env.EXPO_PUBLIC_WEB_URL?.trim().replace(/\/$/, "");
  return url || null;
}

export function getWebAppUrl(): string | null {
  const base = getWebBaseUrl();
  return base ? `${base.replace(/\/$/, "")}/` : null;
}
