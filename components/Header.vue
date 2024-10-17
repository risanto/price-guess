<template>
  <header>
    <nav class="border-gray-200 bg-white px-4 py-2.5 dark:bg-gray-800 lg:px-6">
      <div
        class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between"
      >
        <a href="/" class="flex items-center">
          <span
            class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
            >{{ $t("Tebak Harga Emas") }}</span
          >
        </a>
        <div class="flex items-center lg:order-2">
          <!-- Login/Register: Web -->
          <template v-if="!isAuthenticated">
            <NuxtLink
              href="/login"
              class="mr-2 hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 md:block lg:px-5 lg:py-2.5"
              >{{ $t("Masuk") }}</NuxtLink
            >
            <NuxtLink
              href="/register"
              class="mr-2 hidden rounded-lg bg-primary-700 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 md:block lg:px-5 lg:py-2.5"
              >{{ $t("Daftar") }}</NuxtLink
            >
          </template>

          <!-- Logout: Web -->
          <button
            v-if="isAuthenticated"
            @click="handleLogout()"
            class="mr-2 hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-800 md:block lg:px-5 lg:py-2.5"
          >
            {{ $t("Keluar") }}
          </button>

          <!-- Hint: Mobile -->
          <button
            class="mr-6 block md:hidden"
            data-modal-target="hint-modal"
            data-modal-toggle="hint-modal"
          >
            <svg
              class="h-8 w-8 text-gray-700 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </button>

          <!-- Profile: Mobile -->
          <button
            class="mr-2 block md:hidden"
            data-modal-target="profile-modal"
            data-modal-toggle="profile-modal"
          >
            <svg
              class="h-8 w-8 text-gray-700 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                stroke-width="2"
                d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </button>

          <button
            data-collapse-toggle="mobile-menu-2"
            type="button"
            class="ml-1 inline-flex items-center rounded-lg p-2 text-sm text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 lg:hidden"
            aria-controls="mobile-menu-2"
            aria-expanded="false"
          >
            <span class="sr-only">Open main menu</span>
            <svg
              class="h-8 w-8"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <svg
              class="hidden h-8 w-8"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <div
          class="hidden w-full items-center justify-between lg:order-1 lg:flex lg:w-auto"
          id="mobile-menu-2"
        >
          <ul
            class="mt-4 flex flex-col font-medium lg:mt-0 lg:flex-row lg:space-x-8"
          >
            <!-- Hint: Web -->
            <li
              class="hidden cursor-pointer p-2 hover:bg-gray-200 md:block"
              data-modal-target="hint-modal"
              data-modal-toggle="hint-modal"
            >
              <svg
                class="h-8 w-8 text-gray-700 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9.529 9.988a2.502 2.502 0 1 1 5 .191A2.441 2.441 0 0 1 12 12.582V14m-.01 3.008H12M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </li>

            <!-- Profile: Web -->
            <li
              class="hidden cursor-pointer p-2 hover:bg-gray-200 md:block"
              data-modal-target="profile-modal"
              data-modal-toggle="profile-modal"
            >
              <svg
                class="h-8 w-8 cursor-pointer text-gray-700 hover:bg-gray-200 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-width="2"
                  d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            </li>

            <!-- Login/Register: Mobile -->
            <template v-if="!isAuthenticated">
              <li>
                <NuxtLink
                  href="/login"
                  class="inline-block w-full cursor-pointer rounded-lg border-2 px-12 py-3.5 text-center font-medium hover:bg-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 md:hidden"
                  >{{ $t("Masuk") }}</NuxtLink
                >
              </li>
              <li>
                <NuxtLink
                  href="/register"
                  class="mt-2 inline-block w-full cursor-pointer rounded-lg border-2 px-12 py-3.5 text-center font-medium hover:bg-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 md:hidden"
                  >{{ $t("Daftar") }}</NuxtLink
                >
              </li>
            </template>

            <!-- Logout: Mobile -->
            <li
              v-if="isAuthenticated"
              @click="handleLogout()"
              class="inline-block cursor-pointer rounded-lg border-2 px-12 py-3.5 text-center font-medium hover:bg-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 md:hidden"
            >
              {{ $t("Keluar") }}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>

  <ProfileModal />
  <HintModal />
</template>

<script setup lang="ts">
import HintModal from "./Modals/HintModal.vue";
import ProfileModal from "./Modals/ProfileModal.vue";

const { isAuthenticated } = useAuth();
const { handleLogout } = useSupabase();
</script>
