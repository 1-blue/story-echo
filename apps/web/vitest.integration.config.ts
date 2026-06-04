import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "web-integration",
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    setupFiles: ["tests/setup/vitest.setup.integration.ts"],
    globalSetup: ["tests/setup/global-setup.integration.ts"],
    testTimeout: 30_000,
    hookTimeout: 60_000,
    passWithNoTests: false,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
