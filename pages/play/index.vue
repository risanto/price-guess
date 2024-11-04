<template>
  <Header />

  <ClientOnly>
    <div
      class="flex h-[80vh] w-full items-center justify-center"
      v-if="loading"
    >
      <LoadingCircle />
    </div>

    <main
      v-else
      class="flex flex-col overflow-hidden px-4 py-2 md:grid md:grid-cols-3 md:px-6 md:py-4"
    >
      <div class="col-span-2">
        <transition name="enlarge" mode="out-in">
          <ZoomableImg
            v-if="!finished"
            :src="content?.initial_img_url as string"
          />
          <ZoomableImg v-else :src="content?.answer_img_url as string" />
        </transition>
        <div class="text-center text-xs">
          {{ $t("*Gambar bisa digeser & diperbesar") }}
        </div>
      </div>

      <transition name="slide" mode="out-in">
        <component
          :is="currentQuestion"
          :key="currentQuestionKey"
          :doesPriceGoUp="doesPriceGoUp"
          :q1Correct="q1Correct"
          :q2Answer="content?.answer.toFixed(1) + ''"
          :priceGoesUp="content?.price_goes_up"
          :changeToFinished="changeToFinished"
        />
      </transition>

      <section class="mt-2 bg-primary-50 p-4 md:col-span-2">
        <h3 class="font-medium">{{ $t("Berita Relevan") }}</h3>

        <ul
          v-for="(news, idx) in content?.info.news_items"
          :key="idx"
          class="mt-2 list-inside list-disc"
        >
          <li class="hover:text-primary-600">
            <a :href="news.link" target="_blank">{{ news.title }}</a>
          </li>
        </ul>
      </section>

      <section class="mt-2 bg-primary-50 p-4 md:col-span-1">
        <template v-if="finished">
          <h3 class="font-medium">{{ $t("Penjelasan") }}</h3>

          <p class="mt-2">{{ content?.analysis }}</p>
        </template>
      </section>
    </main>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Content } from "~/types/content";

import Question1 from "./components/Question1.vue";
import Question1Result from "./components/Question1Result.vue";
import Question2 from "./components/Question2.vue";
import LoadingCircle from "~/components/LoadingCircle.vue";
import type { ApiResponse } from "~/types/api";

const { showToast } = useToast();
const { t } = useI18n();

const loading = ref(true);
const content = ref<Content>();
const currentQuestion = shallowRef<any>(Question1);
const currentQuestionKey = ref("q1");
const q1Correct = ref(false);
const finished = ref(false);

const changeToFinished = () => {
  finished.value = true;
};

const doesPriceGoUp = (answer: boolean) => {
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
  try {
    const { data: currentContentVal, error: errorCurrentContent } =
      await $fetch("/api/config/current-content");

    if (errorCurrentContent) {
      console.error("errorCurrentContent:", errorCurrentContent);
      showToast(t("Error dari database, coba refresh"), "danger");
      return;
    }
    if (!currentContentVal) {
      console.error("error !currentContentVal");
      showToast(t("Error dari database, coba refresh"), "danger");
      return;
    }

    const { data: contentVal, error: errorContent } = await $fetch<ApiResponse>(
      "/api/content/" + currentContentVal.id,
    );
    if (errorContent) {
      console.error("errorContent:", errorContent);
      showToast(t("Error dari database, coba refresh"), "danger");
      return;
    }
    if (!contentVal) {
      console.error("error !contentVal");
      showToast(t("Error dari database, coba refresh"), "danger");
      return;
    }

    const contentData = contentVal as Content;
    content.value = contentData;
  } catch (error) {
    if (error) {
      console.error("/api/content:", error);
      showToast(t("Error dari database, coba refresh"), "danger");
    }
  } finally {
    loading.value = false;
  }
};
fetchContent();

if (import.meta.client) {
  onMounted(async () => {
    useFlowbite(async () => {
      const { initFlowbite } = await import("flowbite");
      initFlowbite();
    });
  });
}
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

.enlarge-enter-active,
.enlarge-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.enlarge-enter, .enlarge-leave-to /* .enlarge-leave-active in <=Vue 2.5.19 */ {
  transform: scale(0.8);
  opacity: 0;
}
</style>
