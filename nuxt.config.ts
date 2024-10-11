import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-10-10",
  devtools: { enabled: false },
  modules: ["@nuxtjs/eslint-module", "@nuxtjs/tailwindcss", "@nuxtjs/i18n"],

  // add postcss support for tailwindcss
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  eslint: {
    lintOnStart: false, // Disable linting on startup
    // lintOnSave: true, // Enable linting on file save
    fix: true, // Automatically fix linting errors when possible
  },
});
