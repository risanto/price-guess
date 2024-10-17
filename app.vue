<template>
  <div id="toast-container" class="fixed right-5 top-5 space-y-2" />
  <NuxtPage />
</template>

<script setup lang="ts">
const router = useRouter();
const supabase = useSupabaseClient();
const { user, saveUser } = useAuth();

if (!user.value) {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      console.error("Error", error);
    } else if (!data.session) {
      user.value = null;
    } else {
      saveUser({
        email: data.session?.user.email as string,
        phone: data.session?.user.user_metadata.phone,
        points: data.session?.user.user_metadata.points,
      });
    }
  } catch (error) {
    console.error("Error", error);
  }
}

if (import.meta.client) {
  onMounted(() => {
    useFlowbite(async () => {
      const { initFlowbite } = await import("flowbite");
      initFlowbite();
    });
  });
}
watch(
  () => router.currentRoute.value,
  () => {
    useFlowbite(async () => {
      const { initFlowbite } = await import("flowbite");
      initFlowbite();
    });
  },
);
</script>
