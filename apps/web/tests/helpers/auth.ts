import { apiFetch } from "./api";
import { createGuestUser } from "./db";
import { createTestDeviceId } from "../setup/env";

export async function registerGuest(deviceId: string) {
  return apiFetch("/api/v1/users/guest", {
    method: "POST",
    json: { deviceId },
  });
}

export async function loginMember(
  email: string,
  password: string,
  deviceId?: string,
): Promise<{ cookie: string; status: number; data: unknown }> {
  const baseUrl = process.env.TEST_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (deviceId) headers["X-Device-Id"] = deviceId;

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/auth/login`, {
    method: "POST",
    headers,
    body: JSON.stringify({ email, password }),
  });

  const responseHeaders = response.headers as Headers & { getSetCookie?: () => string[] };
  const cookieParts =
    responseHeaders.getSetCookie?.() ??
    ([response.headers.get("set-cookie")].filter(Boolean) as string[]);
  const cookie = cookieParts.map((c) => c.split(";")[0]).join("; ");
  const data = await response.json().catch(() => ({}));

  return { cookie, status: response.status, data };
}

export async function loginAsAdmin(deviceId?: string) {
  const email = process.env.E2E_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL;
  const password = process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error("E2E_ADMIN_EMAIL/PASSWORD or SEED_ADMIN_* env required");
  }
  return loginMember(email, password, deviceId);
}

export function randomDeviceId(label: string): string {
  return createTestDeviceId(`${Date.now()}${label}`.replace(/\D/g, "").slice(-12));
}

export async function setupGuestClient(label: string) {
  const deviceId = randomDeviceId(label);
  await registerGuest(deviceId);
  return { deviceId };
}

/** Arrange 전용: Prisma로 게스트 생성 (report 등 HTTP 부하 줄이기). Act/Assert는 apiFetch 유지 */
export async function ensureGuestInDb(label: string) {
  const deviceId = randomDeviceId(label);
  await createGuestUser(deviceId);
  return { deviceId };
}
