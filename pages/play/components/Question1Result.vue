<template>
  <SectionParent>
    <div v-if="q1Correct" class="flex flex-col items-center justify-center">
      <div
        class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200"
      >
        <svg
          class="h-10 w-10"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
          />
        </svg>
        <span class="sr-only">Check icon</span>
      </div>

      <div class="mt-2">
        {{ $t("Benar! Harga emas akan") }}
        {{ priceGoesUp ? $t("naik") : $t("turun") }}
        {{ $t("setelah ini.") }}
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center">
      <div
        class="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200"
      >
        <svg
          class="h-10 w-10"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
          />
        </svg>
        <span class="sr-only">Error icon</span>
      </div>

      <div class="mt-2">
        {{ $t("Salah! Harga emas akan") }}
        {{ priceGoesUp ? $t("naik") : $t("turun") }}
        {{ $t("setelah ini.") }}
      </div>
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
