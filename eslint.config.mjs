import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/generated/**",
      "**/coverage/**",
      "**/.stryker-tmp/**",
      "**/reports/**",
      "**/.turbo/**",
      "**/.pnpm-store/**",
    ],
  },
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      parser: tsparser,
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: { ...tseslint.configs.recommended.rules },
  },
  prettier,
];
