import { createClient } from "@supabase/supabase-js";
import { seedConfig } from "./config";
import type { SeedFn } from "./types";

async function ensureSupabaseAuthUser() {
  const {
    supabaseUrl,
    supabaseServiceRoleKey,
    adminEmail,
    adminPassword,
    adminUserId,
    adminNickname,
  } = seedConfig;

  if (!supabaseUrl || !supabaseServiceRoleKey || !adminPassword) {
    console.log(
      "[users] Supabase Auth 스킵 — NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEED_ADMIN_PASSWORD 설정 시 auth.users 동기화",
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: existing } = await supabase.auth.admin.getUserById(adminUserId);

  if (existing.user) {
    const { error } = await supabase.auth.admin.updateUserById(adminUserId, {
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { nickname: adminNickname },
    });
    if (error) throw new Error(`Supabase admin update failed: ${error.message}`);
    console.log(`[users] Supabase Auth 관리자 갱신: ${adminEmail}`);
    return;
  }

  const { error } = await supabase.auth.admin.createUser({
    id: adminUserId,
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    user_metadata: { nickname: adminNickname },
  });
  if (error) throw new Error(`Supabase admin create failed: ${error.message}`);
  console.log(`[users] Supabase Auth 관리자 생성: ${adminEmail}`);
}

export const seedUsers: SeedFn = async ({ prisma }) => {
  await ensureSupabaseAuthUser();

  const user = await prisma.user.upsert({
    where: { id: seedConfig.adminUserId },
    create: {
      id: seedConfig.adminUserId,
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

  console.log(`[users] 관리자 upsert: ${user.email} (${user.id})`);
};
