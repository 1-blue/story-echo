import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { getOrCreateGuestUser } from "./guest-user";
import { generateUniqueGuestNickname } from "./generate-guest-nickname";

const DEVICE_ID_HEADER = "x-device-id";

export function getDeviceIdFromRequest(request: Request): string | null {
  return request.headers.get(DEVICE_ID_HEADER) ?? request.headers.get("X-Device-Id");
}

/** Supabase SSR 세션 쿠키 — 없으면 getUser() 원격 호출 생략 (integration·게스트 API) */
function hasSupabaseAuthCookie(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  return /sb-[a-z0-9-]+-auth-token/i.test(cookie);
}

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function ensureMemberUser(authUserId: string, email: string, nickname?: string) {
  const existing = await prisma.user.findUnique({ where: { id: authUserId } });
  if (existing) {
    if (existing.role === "member" || existing.role === "admin") {
      // 이메일 인증 도입 전: 회원은 입력 이메일만으로 인증된 것으로 처리
      if (!existing.emailVerified && email) {
        return prisma.user.update({
          where: { id: authUserId },
          data: { email, emailVerified: true },
        });
      }
      return existing;
    }

    return prisma.user.update({
      where: { id: authUserId },
      data: {
        email,
        role: "member",
        emailVerified: true,
        upgradedAt: existing.upgradedAt ?? new Date(),
      },
    });
  }

  const resolvedNickname =
    nickname ??
    (await generateUniqueGuestNickname(async (value) =>
      prisma.user.findUnique({ where: { nickname: value } }),
    ));

  return prisma.user.create({
    data: {
      id: authUserId,
      email,
      role: "member",
      emailVerified: true,
      nickname: resolvedNickname,
      upgradedAt: new Date(),
    },
  });
}

export async function resolveCurrentUser(request: Request) {
  const deviceId = getDeviceIdFromRequest(request);

  // 게스트·통합 테스트: Device-Id만 있을 때 Supabase getUser() 생략 (CI 타임아웃 방지)
  if (deviceId && !hasSupabaseAuthCookie(request)) {
    return getOrCreateGuestUser(deviceId);
  }

  if (isSupabaseConfigured() && hasSupabaseAuthCookie(request)) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (authUser?.id) {
      let member = await prisma.user.findUnique({ where: { id: authUser.id } });
      if (!member) {
        member = await ensureMemberUser(authUser.id, authUser.email ?? "");
      }
      return member;
    }
  }

  if (deviceId) {
    return getOrCreateGuestUser(deviceId);
  }

  throw new Error("DEVICE_ID_REQUIRED");
}

export async function resolveCurrentUserFromHeaders() {
  const headerStore = await headers();
  const deviceId = headerStore.get(DEVICE_ID_HEADER) ?? headerStore.get("X-Device-Id");
  const request = new Request("http://local", {
    headers: deviceId ? { "X-Device-Id": deviceId } : undefined,
  });
  return resolveCurrentUser(request);
}

export async function deleteAuthUser(authUserId: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_ADMIN_UNAVAILABLE");
  }
  const admin = createSupabaseAdminClient();
  const { error } = await admin.auth.admin.deleteUser(authUserId);
  if (error) throw new Error(error.message);
}

export { isSupabaseConfigured, createSupabaseAdminClient };
