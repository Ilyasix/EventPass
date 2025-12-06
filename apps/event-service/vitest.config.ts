import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["**/*.test.ts", "**/*.spec.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/generated/**", "**/prisma/migrations/**"],
    environment: "node",
    coverage: {
      provider: "v8",
      exclude: [
        "**/node_modules/**",
        "**/dist/**",
        "**/generated/**",
        "**/prisma/migrations/**",
        "**/*.d.ts",
      ],
    },
  },
});
