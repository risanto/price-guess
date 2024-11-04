<template>
  <div id="toast-container" class="fixed right-5 top-5 space-y-2" />
  <NuxtPage />
</template>

<script setup lang="ts">
import { useAuthStore } from "./stores/auth";
const { isAuthenticated, fetchUser } = useAuthStore();

if (import.meta.client) {
  onMounted(async () => {
    // Fetch user data if it's not already loaded
    if (!isAuthenticated) {
      await fetchUser();
    }

    useFlowbite(async () => {
      const { initFlowbite } = await import("flowbite");
      initFlowbite();
    });
  });
}
</script>
