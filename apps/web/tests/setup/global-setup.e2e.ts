import { getTestBaseUrl, hasIntegrationEnv } from "./env";

export default async function globalSetup() {
  if (!hasIntegrationEnv()) {
    console.warn("E2E: DATABASE_URL or Supabase env missing — some tests may fail");
    return;
  }

  const baseUrl = getTestBaseUrl();
  process.env.PLAYWRIGHT_BASE_URL = baseUrl;
  process.env.NEXT_PUBLIC_APP_URL = baseUrl;
}
