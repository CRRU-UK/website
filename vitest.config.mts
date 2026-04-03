import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    watch: false,
    environment: "jsdom",
    coverage: {
      enabled: true,
      cleanOnRerun: true,
      provider: "v8",
      reporter: ["lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.gen.ts", "src/instrumentation*.ts"],
    },
    setupFiles: "vitest.setup.mts",
  },
});
