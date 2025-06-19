import globals from "globals";

import pluginJS from "@eslint/js";
import pluginTS from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginJest from "eslint-plugin-jest";
import pluginNext from "@next/eslint-plugin-next";

import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

const recommendedConfigs = [
  pluginJS.configs.recommended,
  ...pluginTS.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReactHooks.configs["recommended-latest"],
  pluginJsxA11y.flatConfigs.recommended,
  pluginJest.configs["flat/recommended"],

  // Custom config until packages support flat configs
  {
    files: ["src/**/*.{js,ts,jsx,tsx}"],
    plugins: {
      "@next/next": pluginNext,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs["core-web-vitals"].rules,
    },
  },
];

const customConfigs = [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    ignores: [".next/", "coverage/"],
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

export default [...recommendedConfigs, ...customConfigs, eslintPluginPrettierRecommended];
