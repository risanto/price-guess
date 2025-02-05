<template>
  <SectionParent>
    <h2
      class="mt-11 max-w-[292px] text-center text-xl font-semibold md:m-0 md:max-w-full md:text-4xl md:font-bold"
    >
      {{ $t("Tebak apakah harga akan naik atau turun di ") }}
      <span class="italic">{{ $t("candle ") }}</span>
      {{ $t("selanjutnya?") }}
    </h2>

    <div
      class="mt-9 flex flex-col space-y-2 md:mt-12 md:w-[372px] md:space-y-3.5 md:px-4"
    >
      <button
        class="base-btn w-[193px] bg-[#089981] hover:bg-green-400 md:w-full md:p-4 md:text-2xl"
        @click="doesPriceGoUp(true)"
        type="button"
      >
        {{ $t("Naik") }}
      </button>

      <button
        class="base-btn w-[193px] bg-[#F23645] hover:bg-red-400 md:w-full md:p-4 md:text-2xl"
        @click="doesPriceGoUp(false)"
        type="button"
      >
        {{ $t("Turun") }}
      </button>
    </div>
  </SectionParent>
</template>

<script setup lang="ts">
import SectionParent from "./SectionParent.vue";

const { doesPriceGoUp } = defineProps<{
  doesPriceGoUp: (answer: boolean) => void;
}>();
</script>
