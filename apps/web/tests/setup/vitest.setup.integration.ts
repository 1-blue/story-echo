import { existsSync } from "node:fs";
import path from "node:path";
import { config } from "dotenv";
import { beforeAll } from "vitest";
import { getTestBaseUrl, hasIntegrationEnv } from "./env";

const webEnvLocal = path.resolve(__dirname, "../../.env.local");
config({ path: path.resolve(__dirname, "../../.env") });
config({ path: path.resolve(__dirname, "../../../packages/database/.env") });
if (existsSync(webEnvLocal)) {
  config({ path: webEnvLocal, override: true });
}

declare global {
  var __TEST_BASE_URL__: string | undefined;
}

beforeAll(() => {
  if (!hasIntegrationEnv()) {
    console.warn("Skipping integration prerequisites: DATABASE_URL or Supabase env missing");
    return;
  }
  globalThis.__TEST_BASE_URL__ = getTestBaseUrl();
});
