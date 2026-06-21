import { createTestDeviceId } from "../setup/env";
import { apiFetch } from "./api";
import { createGuestUser } from "./db";

/** CI integration 실패 원인 추적용 — 비밀번호·키 값은 출력하지 않음 */
function logLoginDebugContext(status: number, data: unknown) {
  if (!process.env.CI) return;

  const hasE2eEmail = Boolean(process.env.E2E_ADMIN_EMAIL);
  const hasE2ePassword = Boolean(process.env.E2E_ADMIN_PASSWORD);
  const email = process.env.E2E_ADMIN_EMAIL ?? process.env.SEED_ADMIN_EMAIL ?? "";
  const password = process.env.E2E_ADMIN_PASSWORD ?? process.env.SEED_ADMIN_PASSWORD ?? "";

  console.error("[integration/auth] login diagnostic", {
    status,
    response: data,
    credentialSource:
      hasE2eEmail && hasE2ePassword
        ? "E2E_ADMIN_*"
        : hasE2eEmail || hasE2ePassword
          ? "E2E_ADMIN_* (partial — missing email or password)"
          : "SEED_ADMIN_*",
    email,
    emailLength: email.length,
    passwordLength: password.length,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "(unset)",
    anonKeyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length ?? 0,
    databaseUrlHasDevelopmentSchema: process.env.DATABASE_URL?.includes("schema=development") ?? false,
  });
}

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
  const baseUrl =
    process.env.TEST_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
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

  if (response.status !== 200) {
    logLoginDebugContext(response.status, data);
  }

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
