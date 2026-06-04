import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "web-components",
    environment: "happy-dom",
    include: ["tests/components/**/*.test.tsx"],
    setupFiles: ["tests/setup/vitest.setup.dom.ts"],
    passWithNoTests: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
