import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "web-integration",
    environment: "node",
    include: ["tests/integration/**/*.test.ts"],
    setupFiles: ["tests/setup/vitest.setup.integration.ts"],
    globalSetup: ["tests/setup/global-setup.integration.ts"],
    // 실 HTTP + 원격 DB: 케이스당 수 초는 정상. fileParallelism은 DB 격리를 위해 직렬 유지.
    testTimeout: 90_000,
    hookTimeout: 120_000,
    passWithNoTests: false,
    fileParallelism: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
