import path from "node:path";
import { config } from "dotenv";
import { beforeAll } from "vitest";
import { getTestBaseUrl, hasIntegrationEnv } from "./env";

config({ path: path.resolve(__dirname, "../../.env.local") });
config({ path: path.resolve(__dirname, "../../../packages/database/.env") });

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
