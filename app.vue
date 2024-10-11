<template>
  <NuxtPage />
</template>

<script lang="ts">
export default {
  setup() {
    if (import.meta.client) {
      onMounted(() => {
        useFlowbite(async () => {
          const { initFlowbite } = await import("flowbite");
          initFlowbite();
        });
      });
    }
  },
};
</script>
