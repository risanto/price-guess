<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0"
    >
      <div
        class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
      >
        <div class="relative space-y-6 p-6 sm:p-8 md:space-y-8">
          <NuxtLink
            :to="from ? (from as string) : '/'"
            class="absolute right-2.5 top-2.5"
          >
            <NuxtImg
              class="h-4 w-4"
              src="https://www.hsb.co.id/price-guess/close-btn.png"
            />
          </NuxtLink>

          <h1 class="main-header">
            {{ $t("Login") }}
          </h1>

          <form class="space-y-2 md:space-y-4" @submit.prevent="login">
            <input
              type="email"
              name="email"
              id="email"
              v-model="email"
              class="input"
              :placeholder="label.email"
              required="true"
            />

            <input
              type="password"
              name="password"
              id="password"
              :placeholder="label.password"
              v-model="password"
              class="input"
              required="true"
            />

            <div v-if="error" class="text-red-500">{{ $t(`${error}`) }}</div>
            <div class="flex items-center justify-end">
              <NuxtLink
                to="/forgot-password"
                class="text-sm text-primary-600 underline"
                >{{ $t("Lupa kata sandi?") }}</NuxtLink
              >
            </div>
            <button type="submit" class="main-btn">
              <template v-if="!loading">
                {{ $t("Masuk") }}
              </template>

              <div v-else role="status">
                <LoadingCircle />
              </div>
            </button>
          </form>

          <p class="text-center text-sm">
            {{ $t("Jika belum punya akun, ") }}
            <NuxtLink
              :to="{ path: '/register', query: { from } }"
              class="text-primary-500 underline"
              >{{ $t("Daftar di sini") }}</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";

const { t } = useI18n();
const loading = ref(false);

const email = ref("");
const password = ref("");
const error = ref("");

const { fetchUser, userPointsFn } = useAuthStore();
const route = useRoute();
const { from } = route.query;

const label = {
  email: t("Email"),
  password: t("Kata Sandi"),
};

const login = async () => {
  error.value = "";
  loading.value = true;

  const pointsNoLogin = userPointsFn.load();

  const { error: errorAuthLogin } = await $fetch("/api/auth/login", {
    method: "POST",
    body: {
      email: email.value,
      password: password.value,
      addPoints: pointsNoLogin,
    },
  });

  if (errorAuthLogin) {
    console.error("errorAuthLogin:", errorAuthLogin);

    error.value = t(errorAuthLogin.message);
    loading.value = false;
    return;
  }
  await fetchUser();
  navigateTo("/");
};

watch(email, () => {
  if (error.value) error.value = "";
});
watch(password, () => {
  if (error.value) error.value = "";
});
</script>
