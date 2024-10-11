// eslint.config.js
import vuePlugin from "eslint-plugin-vue";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import vueParser from "vue-eslint-parser";

export default [
  {
    // Configuration for .vue files
    files: ["*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      "vue/multi-word-component-names": [
        "error",
        {
          ignores: ["error", "Error"],
        },
      ],
      // Add other Vue-specific rules here
    },
    ignores: ["dist", "node_modules", "build", "coverage", "docs", "test"],
  },
  // {
  //   files: ["components/**/**/*.vue"],
  //   rules: {
  //     "vue/multi-word-component-names": "off",
  //   },
  // },
  {
    // Configuration for .ts and .js files
    files: ["*.ts", "*.js"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-trailing-spaces": "warn",
      "prefer-promise-reject-errors": "off",
      // Add other TypeScript-specific rules here
    },
    ignores: ["dist", "node_modules", "build", "coverage", "docs", "test"],
  },
];
