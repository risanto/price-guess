<template>
  <Header />

  <main class="flex flex-col px-4 py-2 md:grid md:grid-cols-3 md:px-6 md:py-4">
    <section class="h-48 w-full bg-slate-500 md:col-span-2 md:h-80"></section>

    <section
      v-if="currentQuestion === 1"
      class="flex flex-col place-content-center md:col-span-1 md:p-4"
    >
      <h2 class="mt-4 text-center">
        {{ $t("Tebak apakah harga akan naik atau turun setelah ini?") }}
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
          type="button"
          class="mb-2 me-4 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
        >
          {{ $t("Turun") }}
        </button>
      </div>
    </section>

    <section class="mt-4 bg-primary-100 p-4 md:col-span-3">
      <h3>{{ $t("Berita Relevan") }}</h3>

      <ul class="mt-4 list-inside list-disc">
        <li><a href="">Berita 1</a></li>
        <li><a href="">Berita 2</a></li>
        <li><a href="">Berita 3</a></li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
const { showToast } = useToast();

const q1Answer = ref("naik");
const q2Answer = ref(2665.7);

const currentQuestion = ref(1);

const answerQ1 = (answer: "naik" | "turun") => {
  console.log("called ===>");
  if (q1Answer.value === answer) {
    showToast("Benar!");
  }
};
</script>
