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
            {{ $t("Daftar Akun") }}
          </h1>

          <form class="space-y-2 md:space-y-4" @submit.prevent="register">
            <div>
              <input
                type="email"
                name="email"
                id="email"
                v-model="email"
                class="input"
                :placeholder="label.email"
                required="true"
              />
            </div>

            <!-- <div>
              <label
                for="phone"
                class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                >{{ $t("Nomor handphone") }}</label
              >
              <input
                type="phone"
                name="phone"
                id="phone"
                v-model="phone"
                class="block w-full rounded-lg border border-black bg-gray-50 p-2.5 text-gray-900 focus:border-primary-600 focus:ring-primary-600 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="08121333"
                required="true"
              />
            </div> -->

            <div>
              <input
                type="password"
                name="password"
                id="password"
                :placeholder="label.password"
                v-model="password"
                class="input"
                required="true"
              />
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                :placeholder="label.confirmPassword"
                v-model="confirmPassword"
                class="input"
                required="true"
              />
            </div>

            <div v-if="error" class="text-red-500">{{ $t(`${error}`) }}</div>

            <button type="submit" class="main-btn">
              <template v-if="!loading">
                {{ $t("Daftar") }}
              </template>

              <div v-else role="status">
                <LoadingCircle />
              </div>
            </button>
          </form>

          <p class="text-center text-sm">
            {{ $t("Jika sudah punya akun, ") }}

            <NuxtLink
              :to="{ path: '/login', query: { from } }"
              class="text-primary-600 underline"
              >{{ $t("Login di sini") }}</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import type { Database } from "~/types/supabase";

const { userPoints } = useAuthStore();
const supabase = useSupabaseClient<Database>();
const route = useRoute();
const { from } = route.query;

const { showToast } = useToast();
const { t } = useI18n();
const loading = ref(false);

const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const phone = ref("");
const error = ref("");

const label = {
  password: t("Kata Sandi"),
  confirmPassword: t("Konfirmasi Kata Sandi"),
  email: t("Alamat Email"),
};

const register = async () => {
  if (confirmPassword.value !== password.value) {
    error.value = t("Konfirmasi kata sandi harus sama");
    return;
  }
  error.value = "";
  loading.value = true;

  const { data: existingUser, error: checkError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.value);

  if (checkError) {
    error.value = t(checkError.message);
    loading.value = false;
    return;
  }
  if (existingUser!.length > 0) {
    error.value = t("Email sudah terdaftar");
    loading.value = false;
    return;
  }

  const { error: registerError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    options: {
      emailRedirectTo: window.location.origin + "/login",
    },
  });
  if (registerError) {
    error.value = t(registerError.message);
    loading.value = false;
    return;
  }

  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email.value, points: userPoints }),
  });
  const { error: insertError } = await response.json();

  if (insertError) {
    error.value = t(insertError.message);
    loading.value = false;
    return;
  }

  showToast(t("Registrasi berhasil!<br/> Silakan verifikasi email"));
  navigateTo("/");
};

watch(email, () => {
  if (error.value) error.value = "";
});
watch(phone, () => {
  if (error.value) error.value = "";
});
watch(password, () => {
  if (error.value) error.value = "";
});
watch(confirmPassword, () => {
  if (error.value) error.value = "";
});
</script>
