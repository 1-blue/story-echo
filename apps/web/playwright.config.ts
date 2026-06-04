import { config as loadEnv } from "dotenv";
import path from "node:path";
import { defineConfig, devices } from "@playwright/test";

loadEnv({ path: path.resolve(__dirname, "../../packages/database/.env") });
loadEnv({ path: path.resolve(__dirname, ".env.local") });
loadEnv({ path: path.resolve(__dirname, ".env") });

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "list",
  timeout: 60_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.CI
    ? {
        command: "pnpm build && pnpm start",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
        cwd: __dirname,
        env: {
          ...process.env,
          NEXT_PUBLIC_APP_URL: baseURL,
        },
      }
    : {
        command: "pnpm start",
        url: baseURL,
        reuseExistingServer: true,
        timeout: 120_000,
        cwd: __dirname,
        env: {
          ...process.env,
          NEXT_PUBLIC_APP_URL: baseURL,
        },
      },
  globalSetup: "./tests/setup/global-setup.e2e.ts",
});
