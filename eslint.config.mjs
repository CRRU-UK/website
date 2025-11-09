import eslint from "@eslint/js";
import next from "@next/eslint-plugin-next";
import vitest from "@vitest/eslint-plugin";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

const recommendedConfigs = [
  eslint.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    plugins: {
      tseslint,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.test.ts", "**/*.test.tsx"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.all.rules,
      "vitest/prefer-expect-assertions": ["off"],
      "vitest/consistent-test-it": ["off"],
      "vitest/no-hooks": ["off"],
      "vitest/require-mock-type-parameters": ["off"],
      "vitest/prefer-import-in-mock": ["off"],
      "vitest/require-top-level-describe": ["off"],
      "@typescript-eslint/no-explicit-any": ["warn"], // TODO: Fix later
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
  },
  {
    files: ["src/**/*.{js,ts,jsx,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "@next/next": next,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
    },
  },
];

const customConfigs = [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    ignores: [".next/", "coverage/", "next-env.d.ts"],
  },
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];

export default defineConfig(recommendedConfigs, customConfigs, prettier);
