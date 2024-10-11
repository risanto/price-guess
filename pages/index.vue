<template>
  <Header />
  <div class="flex flex-col w-full h-screen items-center justify-center">
    <h1>This is a protected page, visible only to logged-in users</h1>
  </div>
</template>

<script setup>
import Header from "~/components/Header.vue";

definePageMeta({
  middleware: "auth",
  requiresAuth: true, // Add this to specify that this page requires authentication
});
</script>
