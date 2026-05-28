import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import globals from "globals";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  {
    files: ["src/**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.json"],
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      "import/resolver": { typescript: {} },
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "object", "type", "index"],
          pathGroups: [
            { pattern: "react", group: "external", position: "before" },
            { pattern: "react-dom", group: "external", position: "before" },
            { pattern: "next", group: "external", position: "before" },
            { pattern: "next/**", group: "external", position: "before" },
            { pattern: "@/**", group: "internal", position: "after" },
            { pattern: "**/*.{css,scss,sass}", group: "index", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["react", "next"],
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      "no-restricted-imports": [
        "error",
        {
          patterns: [{ group: ["../*"], message: "Usage of relative parent imports is not allowed." }],
        },
      ],

      "no-console": ["warn", { allow: ["warn", "error"] }],

      "import/extensions": "off",
      "import/no-unresolved": "off",
      "import/prefer-default-export": "off",
    },
  },
]);

export default eslintConfig;
