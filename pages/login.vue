<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="mx-auto flex h-screen flex-col items-center justify-center px-6 py-8 lg:py-0"
    >
      <div
        class="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0"
      >
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl"
          >
            {{ $t("Masuk") }}
          </h1>
          <form class="space-y-4 md:space-y-6" @submit.prevent="login">
            <div>
              <label
                for="email"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >{{ $t("Email") }}</label
              >
              <input
                type="email"
                name="email"
                id="email"
                v-model="email"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="mail@gmail.com"
                required="true"
              />
            </div>
            <div>
              <label
                for="password"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >{{ $t("Kata sandi") }}</label
              >
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                v-model="password"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required="true"
              />
            </div>
            <div v-if="error" class="text-red-500">{{ $t(`${error}`) }}</div>
            <div class="flex items-center justify-end">
              <a
                href="#"
                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >{{ $t("Lupa kata sandi?") }}</a
              >
            </div>
            <button
              type="submit"
              class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              {{ $t("Masuk") }}
            </button>

            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              {{ $t("Belum punya akun?") }}
              <NuxtLink
                to="/register"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >{{ $t("Daftar") }}</NuxtLink
              >
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

const supabase = useSupabaseClient();
const { saveUser } = useAuth();

const email = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  error.value = ""; // Reset the error

  const { data, error: loginError } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });

  if (loginError) {
    error.value = loginError.message; // Show the error message
  } else {
    saveUser({
      email: data.user.email as string,
      phone: data.user.user_metadata.phone,
      points: data.user.user_metadata.points,
    });
    navigateTo("/");
  }
};

watch(email, () => {
  if (error.value) error.value = "";
});
watch(password, () => {
  if (error.value) error.value = "";
});
</script>
