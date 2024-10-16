<template>
  <section class="flex flex-col place-content-center md:col-span-1 md:p-4">
    <h2 class="mt-4 text-center">
      {{ $t("Tebak nominal harga emas terhadap USD berdasarkan chart ini") }}
    </h2>

    <div class="mt-4 flex place-content-center">
      <button
        @click="answerQ1('naik')"
        type="button"
        class="mb-2 me-4 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
      >
        {{ $t("Naik") }}
      </button>

      <button
        @click="answerQ1('turun')"
        type="button"
        class="mb-2 me-4 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
      >
        {{ $t("Turun") }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const { answerQ1 } = defineProps<{
  answerQ1: (answer: "naik" | "turun") => void;
}>();
</script>
