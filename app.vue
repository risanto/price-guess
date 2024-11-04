<template>
  <div id="toast-container" class="fixed right-5 top-5 space-y-2" />
  <NuxtPage v-if="isMounted" />
</template>

<script setup lang="ts">
import { useAuthStore } from "./stores/auth";
const { isAuthenticated, fetchUser } = useAuthStore();
const isMounted = ref(false);

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
    isMounted.value = true;
  });
}
</script>
