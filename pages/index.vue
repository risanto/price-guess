<template>
  <div
    class="mx-auto flex w-full max-w-[1620px] flex-col items-center justify-center"
  >
    <div
      class="flex w-full items-center justify-center border-b-[0.5px] border-black py-3 lg:py-6"
    >
      <NuxtImg
        src="https://www.hsb.co.id/price-guess/logo.png"
        alt="logo"
        class="w-[87px] lg:w-[186px]"
      />
    </div>

    <div
      class="mx-[9px] mt-[39px] flex flex-col items-center justify-center rounded-lg border-[0.5px] border-black p-[11px] pb-[50px] lg:mx-5 lg:flex-row lg:justify-around lg:space-x-[29px] lg:p-[29px]"
    >
      <div
        class="relative overflow-hidden rounded-lg border-[0.5px] border-black"
      >
        <video autoplay playsinline muted class="h-full w-full lg:w-[861px]">
          <source
            src="https://www.hsb.co.id/price-guess/initial-example.mp4"
            type="video/mp4"
          />
        </video>

        <div
          class="absolute left-1 top-1 flex items-center justify-center rounded-md border-[0.3px] border-black bg-white p-[5px]"
        >
          <NuxtImg
            src="https://www.hsb.co.id/price-guess/gold-icon.png"
            alt="gold icon"
            class="h-2 w-2"
          />
          <span class="ml-[1px] text-[9px] font-bold"> XAUUSD </span>
        </div>

        <div
          class="absolute left-16 top-1 flex items-center justify-center rounded-md border-[0.3px] border-black bg-white p-[5px]"
        >
          <span class="text-[9px] font-bold"> 30m </span>
        </div>

        <div
          class="absolute bottom-1.5 left-1 flex flex-col justify-center rounded-md border-[0.3px] border-black bg-white p-[5px]"
        >
          <span class="text-[4px] italic"> Source: </span>

          <NuxtImg
            src="https://www.hsb.co.id/price-guess/trading-view-logo.png"
            alt="tradingview icon"
            class="w-[75px]"
          />
        </div>
      </div>

      <div class="lg:flex lg:max-w-[600px] lg:flex-col lg:items-center">
        <div class="mt-8 text-center text-3xl font-bold lg:mt-0 lg:text-4xl">
          {{ $t("Tebak Harga Emas dan Dapatkan Hadiah Uang Tunai!") }}

          <NuxtImg
            class="relative -top-1 left-1 inline-block w-7"
            src="https://www.hsb.co.id/price-guess/coin-spin.gif"
          />
        </div>

        <div
          class="mt-5 flex items-center justify-center lg:mt-16 lg:w-[500px] lg:justify-between"
        >
          <button
            class="base-btn w-[126px] bg-black hover:bg-slate-700 lg:w-[200px] lg:text-2xl"
          >
            <NuxtLink href="/play">
              {{ $t("Mulai Main") }}
            </NuxtLink>
          </button>

          <button
            class="hover:animate-bounceOnce"
            data-modal-target="hint-modal"
            data-modal-toggle="hint-modal"
          >
            <NuxtImg
              class="mx-3 h-[26px] w-[26px] lg:h-[42px] lg:w-[42px]"
              src="https://www.hsb.co.id/price-guess/how-to-btn.png"
              alt="petunjuk"
            />
          </button>

          <button
            v-if="!isAuthenticated"
            class="base-btn w-[126px] bg-primary-500 hover:bg-amber-500 lg:w-[200px] lg:text-2xl"
          >
            <NuxtLink href="/login">
              {{ $t("Login/Register") }}
            </NuxtLink>
          </button>
        </div>
      </div>
    </div>

    <div class="mb-8 mt-16 px-5 text-sm lg:mt-24 lg:text-2xl">
      <div
        class="relative w-full rounded-lg border-[0.5px] border-black bg-primary-500 px-[13px] pb-[10px] pt-[23px] text-white lg:h-[60px]"
      >
        <div
          class="absolute -left-[1px] -top-[20px] rounded-lg border-[0.5px] border-black bg-black px-4 py-2 lg:top-0 lg:flex lg:h-[60px] lg:items-center"
        >
          {{ $t("Berita Harga Emas Terkini:") }}
        </div>

        <div
          class="min-h-[41px] lg:absolute lg:left-[320px] lg:top-1/2 lg:flex lg:-translate-y-1/2 lg:transform lg:items-center"
        >
          {{ $t("Harga Emas Hari Ini") }}
        </div>

        <div
          class="absolute bottom-1.5 right-1.5 flex h-[13px] items-center justify-center space-x-1 rounded bg-white px-1 py-0.5 text-[7px] text-black lg:right-[21px] lg:top-[12px] lg:h-[32px] lg:w-[128px] lg:text-xl"
        >
          <div>
            {{ $t("Baca berita") }}
          </div>

          <NuxtImg
            class="h-1.5 w-1.5 lg:h-[15px] lg:w-[15px]"
            src="https://www.hsb.co.id/price-guess/link-logo.png"
          />
        </div>
      </div>

      <section class="mt-10 space-y-5 lg:mt-20">
        <p class="text-justify">
          <span class="font-bold">Tebak Harga Emas.com</span> adalah game
          penghasil uang yang seru dan mudah, di mana kamu bisa menebak harga
          emas untuk mendapatkan hadiah uang tunai. Nikmati pengalaman bermain
          game yang menghasilkan uang tanpa iklan. Jadi, siapkan tebakanmu dan
          raih kesempatan untuk memenangkan hadiah setiap harinya!
        </p>

        <p class="text-justify">
          Di <span class="font-bold">Tebak Harga Emas.com</span>, kamu bisa
          menghasilkan uang dari HP hanya dengan menebak harga emas. Setiap
          tebakan yang tepat berpeluang untuk membawa pulang uang tunai. Dengan
          sedikit keberuntungan, kamu bisa menghasilkan uang secara online
          setiap hari. Bergabunglah sekarang dan buktikan kemampuanmu dalam
          menebak!
        </p>
      </section>

      <Faq />

      <div class="mx-auto py-4 text-center lg:py-12">
        ©2024 Tebak Harga Emas
      </div>
    </div>
  </div>

  <HintModal :location="'Home'" />
</template>

<script setup lang="ts">
import Faq from "~/components/Faq.vue";
import HintModal from "~/components/Modals/HintModal.vue";
import { useAuthStore } from "~/stores/auth";

const { isAuthenticated } = useAuthStore();
</script>
