<template>
  <SectionParent>
    <div class="mt-8 flex flex-col items-center justify-center md:m-0 md:p-4">
      <template v-if="q1Correct">
        <NuxtImg
          src="https://www.hsb.co.id/price-guess/result-right.gif"
          alt="benar"
          class="mx-auto my-0 h-[104px] w-[104px] md:h-[208px] md:w-[208px]"
        />

        <div
          class="mt-2 text-center text-xl font-semibold md:text-4xl md:font-bold"
        >
          {{ $t("Benar!") }} <br />

          {{ $t("Harga emas akan ") }}
          {{ priceGoesUp ? $t("naik") : $t("turun") }}
          {{ $t("setelah ini.") }}
        </div>
      </template>

      <template v-else>
        <NuxtImg
          src="https://www.hsb.co.id/price-guess/result-wrong.gif"
          alt="salah"
          class="mx-auto my-0 h-[104px] w-[104px] md:h-[208px] md:w-[208px]"
        />

        <div
          class="mt-2 text-center text-xl font-semibold md:text-4xl md:font-bold"
        >
          {{ $t("Salah!") }} <br />

          {{ $t("Harga emas akan ") }}
          {{ priceGoesUp ? $t("naik") : $t("turun") }}
          {{ $t("setelah ini.") }}
        </div>
      </template>
    </div>
  </SectionParent>
</template>

<script setup lang="ts">
import SectionParent from "./SectionParent.vue";

const { q1Correct } = defineProps({
  q1Correct: {
    type: Boolean,
    required: true,
  },
  priceGoesUp: {
    type: Boolean,
    required: true,
  },
});
</script>
