/** 시드 실행 시 사용하는 환경 변수 (packages/database/.env) */
export const seedConfig = {
  adminUserId: process.env.SEED_ADMIN_USER_ID ?? "a0000000-0000-4000-8000-000000000001",
  adminEmail: process.env.SEED_ADMIN_EMAIL ?? "admin@storyecho.app",
  adminPassword: process.env.SEED_ADMIN_PASSWORD,
  adminNickname: process.env.SEED_ADMIN_NICKNAME ?? "관리자",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const;
