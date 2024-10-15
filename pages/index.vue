<template>
  <div class="flex h-screen w-full flex-col items-center justify-center">
    <h1
      class="mb-4 text-4xl font-extrabold leading-none tracking-tight dark:text-white md:max-w-2xl md:text-5xl xl:text-6xl"
    >
      {{ $t("Tebak Harga Emas") }}
    </h1>

    <div class="mt-8">
      <NuxtLink
        v-if="!isAuthenticated"
        href="/login"
        class="mr-10 inline-block rounded-lg border-2 px-12 py-3.5 text-center font-medium hover:bg-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >{{ $t("Masuk") }}</NuxtLink
      >
      <NuxtLink
        v-if="!isAuthenticated"
        href="/register"
        class="mr-10 inline-block rounded-lg border-2 px-12 py-3.5 text-center font-medium hover:bg-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >{{ $t("Daftar") }}</NuxtLink
      >

      <NuxtLink
        href="/play"
        class="mr-10 inline-block rounded-lg bg-primary-700 px-14 py-3.5 text-center font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
        >{{ $t("Main") }}</NuxtLink
      >

      <div
        v-if="isAuthenticated"
        @click="handleLogout()"
        class="mr-10 inline-block cursor-pointer rounded-lg border-2 px-12 py-3.5 text-center font-medium hover:bg-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
      >
        {{ $t("Keluar") }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isAuthenticated, logout } = useAuth();
const supabase = useSupabaseClient();

const handleLogout = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    } else {
      logout();
    }
  } catch (err) {
    console.error("Error during logout:", err);
  }
};
</script>
