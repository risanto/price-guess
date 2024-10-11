<template>
  <Header />
  <div class="flex flex-col w-full h-screen items-center justify-center">
    <h1 class="text-white text-2xl">Welcome to the App!</h1>
    <p class="text-gray-300">This is a sample app using Tailwind CSS.</p>
  </div>
</template>

<script lang="ts">
import Header from "@/components/Header.vue";

export default {
  components: { Header },
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
