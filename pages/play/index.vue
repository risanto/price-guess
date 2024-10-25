<template>
  <Header />

  <main
    class="flex flex-col overflow-hidden px-4 py-2 md:grid md:grid-cols-3 md:px-6 md:py-4"
  >
    <NuxtImg :src="content?.initial_img_url" class="col-span-2" />

    <transition name="slide" mode="out-in">
      <component
        :is="currentQuestion"
        :key="currentQuestionKey"
        :doesPriceGoesUp="doesPriceGoesUp"
        :q1Correct="q1Correct"
        :q2Answer="content?.answer.toFixed(1) + ''"
        :priceGoesUp="content?.price_goes_up"
      />
    </transition>

    <section class="mt-4 bg-primary-100 p-4 md:col-span-3">
      <h3>{{ $t("Berita Relevan") }}</h3>

      <ul
        class="mt-4 list-inside list-disc"
        v-for="(news, idx) in content?.info.news_items"
        :key="idx"
      >
        <li>
          <a :href="news.link">{{ news.title }}</a>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { Content } from "~/types/content";

import Question1 from "./components/Question1.vue";
import Question1Result from "./components/Question1Result.vue";
import Question2 from "./components/Question2.vue";

const { showToast } = useToast();
const { t } = useI18n();

const content = ref<Content>();
const currentQuestion = shallowRef<any>(Question1);
const currentQuestionKey = ref("q1");
const q1Correct = ref(false);

const doesPriceGoesUp = (answer: boolean) => {
  if (content.value?.price_goes_up === answer) {
    q1Correct.value = true;
  }
  currentQuestion.value = Question1Result;
  currentQuestionKey.value = "q1R";

  delay(3000).then(() => {
    currentQuestion.value = Question2;
    currentQuestionKey.value = "q2";
  });
};

const fetchContent = async () => {
  const { data, error } = await useFetch("/api/content");

  if (error.value) {
    console.error("/api/content:", error.value);
    showToast(t("Error dari database, coba refresh"), "danger");
  }

  const contentData = data.value?.data;

  content.value = contentData?.[0];
};
fetchContent();
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
