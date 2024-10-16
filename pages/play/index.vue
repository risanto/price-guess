<template>
  <Header />

  <main class="flex flex-col px-4 py-2 md:grid md:grid-cols-3 md:px-6 md:py-4">
    <section class="h-48 w-full bg-slate-500 md:col-span-2 md:h-80"></section>

    <transition name="slide" mode="out-in">
      <component
        :is="currentQuestion"
        :key="currentQuestionKey"
        :answerQ1="answerQ1"
        :correct="correct"
      />
    </transition>

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
import Question1 from "./components/Question1.vue";
import Question1Result from "./components/Question1Result.vue";
import Question2 from "./components/Question2.vue";

const q1Answer = ref("naik");
const q2Answer = ref(2665.7);

const currentQuestion = shallowRef<any>(Question1);
const currentQuestionKey = ref("q1");
const correct = ref(false);

const answerQ1 = (answer: "naik" | "turun") => {
  if (q1Answer.value === answer) {
    correct.value = true;
  }
  currentQuestion.value = Question1Result;
  currentQuestionKey.value = "q1R";

  delay(3000).then(() => {
    currentQuestion.value = Question2;
    currentQuestionKey.value = "q2";
  });
};
</script>

<style scoped>
/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease;
}
.slide-enter-from {
  transform: translateX(100%);
  z-index: -1;
}
.slide-leave-to {
  transform: translateX(-100%);
  z-index: -1;
}
</style>
