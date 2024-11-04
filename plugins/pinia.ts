// plugins/pinia.ts
import { defineNuxtPlugin } from "#app";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = createPinia();

  if (import.meta.client) {
    pinia.use(piniaPluginPersistedstate);
  }
  nuxtApp.vueApp.use(pinia);
});
