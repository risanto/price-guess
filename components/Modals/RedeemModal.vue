<template>
  <div
    id="redeem-modal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
  >
    <div class="relative max-h-full max-w-2xl p-4">
      <!-- Modal content -->
      <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
        <button
          class="absolute right-2.5 top-2.5"
          data-modal-hide="redeem-modal"
        >
          <NuxtImg
            class="h-4 w-4"
            src="https://www.hsb.co.id/price-guess/close-btn.png"
          />
        </button>

        <div
          class="flex flex-col items-center justify-center space-y-4 px-5 py-12"
        >
          <h1 class="main-header">{{ $t("Redeem Poin") }}</h1>

          <div class="flex items-center space-x-2">
            <div
              class="flex h-[19px] w-[85px] items-center justify-between rounded border border-black p-0.5"
            >
              <NuxtImg
                class="h-[15px] w-[15px]"
                src="https://www.hsb.co.id/price-guess/coin-score.png"
                alt="coin"
              />

              <span class="flex-1 text-center text-xs font-semibold">
                {{ formatNumber(userPoints) }}
              </span>
            </div>

            <div>=</div>

            <div class="font-medium">Rp{{ formatNumber(userPoints) }}</div>
          </div>

          <h2 class="pt-2">{{ $t("Apa Syarat Redeem?") }}</h2>

          <div class="rounded border border-black p-4">
            <ol class="ml-4 list-decimal">
              <li>
                Mendaftarkan nama, nomor telepon dan email di
                <NuxtLink
                  to="https://www.hsb.co.id/"
                  target="_blank"
                  class="text-primary-500 underline"
                  >hsb.co.id</NuxtLink
                >
              </li>
              <li>Selesaikan proses KYC</li>
              <li>
                Hubungi Customer Service untuk redeem hadiah dengan menyebutkan
                email akun tebakhargaemas.com
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

const authStore = useAuthStore();
const { user, userPoints } = storeToRefs(authStore);
</script>
