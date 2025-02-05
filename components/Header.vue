<template>
  <header
    class="flex w-full items-center justify-between border-b-[0.5px] border-black px-5 py-3 md:p-6"
  >
    <NuxtLink to="/">
      <NuxtImg
        src="https://www.hsb.co.id/price-guess/logo.png"
        alt="logo"
        class="w-[87px] md:w-[186px]"
      />
    </NuxtLink>

    <button
      class="hover:animate-bounceOnce"
      data-modal-target="hint-modal"
      data-modal-toggle="hint-modal"
    >
      <NuxtImg
        class="h-[26px] w-[26px] md:h-[42px] md:w-[42px]"
        src="https://www.hsb.co.id/price-guess/how-to-btn.png"
        alt="petunjuk"
      />
    </button>

    <div class="flex items-center space-x-2 md:space-x-4">
      <div
        class="flex h-[19px] w-[85px] items-center justify-between rounded-2xl border border-black p-0.5 md:h-[41px] md:w-[188px] md:rounded-[28px] md:p-1.5"
      >
        <NuxtImg
          class="h-[15px] w-[15px] md:h-[28px] md:w-[28px]"
          src="https://www.hsb.co.id/price-guess/coin-score.png"
          alt="coin"
        />

        <span class="text-xs font-bold md:text-2xl">
          {{ formatNumber(userPoints) }}
        </span>

        <button
          data-tooltip-target="tooltip-bottom"
          data-tooltip-placement="bottom"
          :data-tooltip-trigger="isMobile ? 'click' : 'hover'"
        >
          <NuxtImg
            class="h-3 w-3 md:h-4 md:w-4"
            src="https://www.hsb.co.id/price-guess/tooltip-score.png"
            alt="coin tooltip"
          />
        </button>
      </div>

      <button
        v-if="!isAuthenticated"
        class="h-[31px] w-[92px] rounded-lg border-[0.5px] border-black bg-primary-500 text-center text-xs font-semibold text-white hover:bg-amber-500 md:h-[68px] md:w-[205px] md:rounded-xl md:text-[27px]"
      >
        <NuxtLink href="/login?from=play">
          {{ $t("Login/Register") }}
        </NuxtLink>
      </button>

      <div
        v-if="isAuthenticated"
        class="relative flex h-[31px] w-[92px] items-center rounded-[6px] border-[0.5px] border-black px-1 md:h-[68px] md:w-[205px] md:rounded-xl md:px-2"
      >
        <div class="flex flex-col space-y-[1.5px] md:space-y-1">
          <div
            class="flex w-[67px] items-center rounded-[3px] border-[0.5px] border-black bg-black px-1 text-[8px] font-bold text-white md:w-[148px] md:rounded-md md:px-2 md:py-0.5 md:text-base"
          >
            {{ user?.email.split("@")[0] }}
          </div>

          <button
            class="flex w-[42px] items-center rounded-[3px] border-[0.5px] border-black bg-primary-500 px-1 text-left text-[5.5px] font-bold text-white md:w-[93px] md:rounded-md md:px-2 md:py-0.5 md:text-xs"
            data-modal-target="redeem-modal"
            data-modal-toggle="redeem-modal"
          >
            {{ $t("Redeem Poin") }}
          </button>
        </div>

        <NuxtImg
          class="absolute bottom-0 right-0.5 h-[44px] w-[33px] md:h-[97px] md:w-[73px]"
          src="https://www.hsb.co.id/price-guess/profile-icon.png"
        />

        <button
          class="absolute -bottom-[13px] right-0 flex w-[42px] items-center justify-center rounded-[3px] border-[0.5px] border-black px-1 text-[6px] font-bold md:-bottom-[28px] md:w-[97px] md:text-base"
          @click="logout()"
        >
          {{ $t("Log out") }}
        </button>
      </div>
    </div>
  </header>

  <div
    id="tooltip-bottom"
    role="tooltip"
    class="tooltip invisible absolute z-10 inline-block max-w-[300px] rounded-lg border border-black bg-white px-3 py-2 text-sm font-medium text-gray-900 opacity-0 shadow-sm"
  >
    {{
      $t(
        "Kamu harus login untuk mendapatkan poin yang dapat ditukar menjadi uang",
      )
    }}
  </div>

  <HintModal />
  <RedeemModal v-if="isAuthenticated" />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useAuthStore } from "~/stores/auth";

import HintModal from "./Modals/HintModal.vue";
import RedeemModal from "./Modals/RedeemModal.vue";

const authStore = useAuthStore();

const { isAuthenticated, user, userPoints } = storeToRefs(authStore);
const { logout, userPointsFn } = authStore;

const isMobile = ref(false);

const detectMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

if (import.meta.client) {
  onMounted(() => {
    detectMobile();
    window.addEventListener("resize", detectMobile);

    userPointsFn.load();
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", detectMobile);
  });
}
</script>
