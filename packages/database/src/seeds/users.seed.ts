import type { PrismaClient } from "@prisma/client";
import { createClient, type SupabaseClientOptions, type User } from "@supabase/supabase-js";
import ws from "ws";
import { seedConfig } from "./config";
import type { SeedFn } from "./types";

function createSupabaseAdmin() {
  return createClient(seedConfig.supabaseUrl!, seedConfig.supabaseServiceRoleKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
    // Node.js < 22 (CI 등): Realtime 초기화에 ws transport 필요 (ws ↔ realtime-js 타입 불일치)
    realtime: {
      transport: ws as NonNullable<SupabaseClientOptions<"public">["realtime"]>["transport"],
    },
  });
}

async function findAuthUserByEmail(email: string): Promise<User | null> {
  const supabase = createSupabaseAdmin();
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`Supabase listUsers failed: ${error.message}`);

    const match = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;

    if (data.users.length < 1000) break;
    page += 1;
  }

  return null;
}

/** 이메일 우선으로 Auth 관리자 동기화 후 실제 auth user id 반환 */
async function syncAdminAuthUser(): Promise<string> {
  const { adminEmail, adminPassword, adminUserId, adminNickname } = seedConfig;

  if (!seedConfig.supabaseUrl || !seedConfig.supabaseServiceRoleKey) {
    throw new Error(
      "Supabase Auth 동기화 실패 — NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY를 packages/database/.env에 설정하세요",
    );
  }

  if (!adminPassword) {
    throw new Error(
      "Supabase Auth 동기화 실패 — SEED_ADMIN_PASSWORD를 packages/database/.env에 설정하세요",
    );
  }

  const supabase = createSupabaseAdmin();
  const byEmail = await findAuthUserByEmail(adminEmail);
  const targetId = byEmail?.id ?? adminUserId;

  if (byEmail) {
    const { error } = await supabase.auth.admin.updateUserById(byEmail.id, {
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { nickname: adminNickname },
    });
    if (error) throw new Error(`Supabase admin update failed: ${error.message}`);
    console.log(`[users] Supabase Auth 관리자 갱신: ${adminEmail} (id: ${byEmail.id})`);
    return byEmail.id;
  }

  const { error } = await supabase.auth.admin.createUser({
    id: adminUserId,
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { nickname: adminNickname },
  });
  if (error) throw new Error(`Supabase admin create failed: ${error.message}`);
  console.log(`[users] Supabase Auth 관리자 생성: ${adminEmail} (id: ${adminUserId})`);
  return targetId;
}

async function cleanupStaleAdminRow(prisma: PrismaClient, resolvedAuthId: string) {
  const staleId = seedConfig.adminUserId;
  if (resolvedAuthId === staleId) return;

  const stale = await prisma.user.findUnique({ where: { id: staleId } });
  if (!stale) return;

  await prisma.story.deleteMany({ where: { userId: staleId } });
  await prisma.user.delete({ where: { id: staleId } });
  console.log(`[users] 이전 고정 ID 관리자 row 정리: ${staleId}`);
}

export const seedUsers: SeedFn = async (ctx) => {
  const authUserId = await syncAdminAuthUser();
  ctx.adminUserId = authUserId;

  await cleanupStaleAdminRow(ctx.prisma, authUserId);

  const user = await ctx.prisma.user.upsert({
    where: { id: authUserId },
    create: {
      id: authUserId,
      email: seedConfig.adminEmail,
      role: "admin",
      emailVerified: true,
      nickname: seedConfig.adminNickname,
      adFree: true,
    },
    update: {
      email: seedConfig.adminEmail,
      role: "admin",
      emailVerified: true,
      nickname: seedConfig.adminNickname,
    },
  });

  console.log(`[users] Prisma 관리자 upsert: ${user.email} (${user.id})`);
  console.log(`[users] 로그인: /app/settings/login — ${seedConfig.adminEmail}`);
};
