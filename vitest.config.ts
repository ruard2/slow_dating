import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
    include: ["apps/**/*.test.ts", "packages/**/*.test.ts"],
  },
});
