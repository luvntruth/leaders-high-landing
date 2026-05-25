import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".next/**", "node_modules/**", "next-env.d.ts"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: false,
      },
      globals: {
        React: "readonly",
        window: "readonly",
        document: "readonly",
        process: "readonly",
        CustomEvent: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
      },
    },
  },
];
