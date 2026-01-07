import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["dist", "node_modules", "**/*.config.js"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
