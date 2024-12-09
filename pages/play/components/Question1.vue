<template>
  <SectionParent>
    <h2 class="mt-11 max-w-[292px] text-center text-xl font-semibold">
      {{ $t("Tebak apakah harga akan naik atau turun di ") }}
      <span class="italic">{{ $t("candle ") }}</span>
      {{ $t("selanjutnya?") }}
    </h2>

    <div class="mt-9 flex flex-col space-y-2">
      <button
        class="base-btn w-[193px] bg-[#089981] hover:bg-green-400"
        @click="doesPriceGoUp(true)"
        type="button"
      >
        <!-- class="mb-2 me-4 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700" -->
        {{ $t("Naik") }}
      </button>

      <button
        class="base-btn w-[193px] bg-[#F23645] hover:bg-red-400"
        @click="doesPriceGoUp(false)"
        type="button"
      >
        <!-- class="mb-2 me-4 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700" -->
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
