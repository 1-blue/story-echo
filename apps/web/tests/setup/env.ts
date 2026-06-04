export function getTestBaseUrl(): string {
  return process.env.TEST_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:3000";
}

export function hasDatabaseEnv(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export function hasIntegrationEnv(): boolean {
  return hasDatabaseEnv() && hasSupabaseEnv();
}

export function hasAwsEnv(): boolean {
  return Boolean(
    process.env.AWS_REGION &&
      process.env.AWS_ACCESS_KEY &&
      process.env.AWS_ACCESS_SECRET_KEY &&
      process.env.AWS_S3_BUCKET,
  );
}

export function getE2EAdminCredentials() {
  return {
    email:
      process.env.E2E_ADMIN_EMAIL ??
      process.env.SEED_ADMIN_EMAIL ??
      "admin@storyecho.app",
    password:
      process.env.E2E_ADMIN_PASSWORD ??
      process.env.SEED_ADMIN_PASSWORD ??
      "",
  };
}

export const TEST_DEVICE_ID_PREFIX = "e2e-test-";

export function createTestDeviceId(suffix: string): string {
  const hex = suffix.replace(/[^a-f0-9]/gi, "").padEnd(12, "0").slice(0, 12);
  return `00000000-0000-4000-8000-${hex.padEnd(12, "0").slice(0, 12)}`;
}
