<template>
  <SectionParent>
    <h2 class="mt-4 text-center">
      {{ $t("Tebak apakah harga akan naik atau turun di bar selanjutnya?") }}
    </h2>

    <div class="mt-4 flex place-content-center">
      <button
        @click="doesPriceGoUp(true)"
        type="button"
        class="mb-2 me-4 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
      >
        {{ $t("Naik") }}
      </button>

      <button
        @click="doesPriceGoUp(false)"
        type="button"
        class="mb-2 me-4 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
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
