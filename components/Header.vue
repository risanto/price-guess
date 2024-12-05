<template>
  <header
    class="flex w-full items-center justify-between border-b-[0.5px] border-black px-5 py-3"
  >
    <NuxtImg
      src="https://www.hsb.co.id/price-guess/logo.png"
      alt="logo"
      class="w-[87px]"
    />

    <button class="hover:animate-bounceOnce">
      <NuxtImg
        class="h-[26px] w-[26px]"
        src="https://www.hsb.co.id/price-guess/how-to-btn.png"
        alt="petunjuk"
      />
    </button>

    <div class="flex items-center space-x-2">
      <div
        class="flex h-[19px] w-[85px] items-center justify-between rounded-2xl border border-black p-0.5"
      >
        <NuxtImg
          class="h-[15px] w-[15px]"
          src="https://www.hsb.co.id/price-guess/coin-score.png"
          alt="coin"
        />

        <span class="text-xs font-bold"> 0 </span>

        <NuxtImg
          class="h-3 w-3"
          src="https://www.hsb.co.id/price-guess/tooltip-score.png"
          alt="coin tooltip"
        />
      </div>

      <button
        v-if="!isAuthenticated"
        class="h-[31px] w-[92px] rounded-lg border-[0.5px] border-black bg-primary-500 text-center text-xs font-semibold text-white hover:bg-amber-500"
      >
        <NuxtLink href="/login">
          {{ $t("Login/Register") }}
        </NuxtLink>
      </button>
    </div>
  </header>

  <HintModal />
  <ProfileModal v-if="isAuthenticated" />
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import HintModal from "./Modals/HintModal.vue";
import ProfileModal from "./Modals/ProfileModal.vue";

const { isAuthenticated, logout } = useAuthStore();
</script>
