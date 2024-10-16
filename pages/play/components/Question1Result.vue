<template>
  <section class="flex place-content-center p-4 md:col-span-1">
    <div v-if="correct" class="flex flex-col place-content-center">
      <div>
        {{ $t("Benar!") }}
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
        {{ $t("Salah :(") }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { correct } = defineProps({
  correct: {
    type: Boolean,
    required: true,
  },
});
</script>
