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
      class="flex flex-col overflow-hidden px-[9px] py-[39px] md:grid md:grid-cols-3 md:px-6 md:py-4"
    >
      <p v-if="!content" class="mt-48 text-center text-red-500 md:col-span-3">
        {{ $t("Error dari database, coba refresh kembali") }}
      </p>

      <template v-else>
        <div
          class="flex h-[510px] flex-col rounded-lg border-[0.5px] border-black p-[11px]"
        >
          <div class="relative col-span-2">
            <transition name="enlarge" mode="out-in">
              <ZoomableImg
                v-if="!finished"
                :src="content?.initial_img_url as string"
              />
              <ZoomableImg v-else :src="content?.answer_img_url as string" />
            </transition>

            <div
              class="absolute left-1 top-1 flex items-center justify-center rounded-md border-[0.3px] border-black bg-white p-[5px]"
            >
              <NuxtImg
                src="https://www.hsb.co.id/price-guess/gold-icon.png"
                alt="gold icon"
                class="h-2 w-2"
              />
              <span class="ml-[1px] text-[9px] font-bold"> XAUUSD </span>
            </div>

            <div
              class="absolute left-16 top-1 flex items-center justify-center rounded-md border-[0.3px] border-black bg-white p-[5px]"
            >
              <span class="text-[9px] font-bold"> 30m </span>
            </div>

            <div
              class="absolute bottom-1.5 left-1 flex flex-col justify-center rounded-md border-[0.3px] border-black bg-white px-[5px] pb-[4px] pt-[3px]"
            >
              <span class="text-[4px] italic"> Source: </span>

              <NuxtImg
                src="https://www.hsb.co.id/price-guess/trading-view-logo.png"
                alt="tradingview icon"
                class="w-[75px]"
              />
            </div>
          </div>

          <div class="mt-2 text-center text-xs text-gray-500">
            {{ $t("*Gambar bisa digeser & diperbesar") }}
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
              :finished="finished"
              :analysis="content?.analysis"
            />
          </transition>
        </div>

        <section
          class="mt-4 space-y-2 rounded-lg border-[0.5px] border-black p-4 md:col-span-2"
        >
          <h3 class="text-xl font-bold">{{ $t("Berita Relevan") }}</h3>

          <ul v-for="(news, idx) in content?.info.news_items" :key="idx">
            <li
              class="relative w-full rounded-lg border-[0.5px] border-black bg-primary-500 p-2 text-white"
            >
              <a
                :href="news.link"
                target="_blank"
                class="inline-block w-[calc(100%-60px)]"
                >{{ news.title }}</a
              >

              <div
                class="absolute bottom-1.5 right-1.5 flex h-[13px] items-center justify-center space-x-1 rounded bg-white px-1 py-0.5 text-[7px] text-black"
              >
                <div>
                  {{ $t("Baca berita") }}
                </div>

                <NuxtImg
                  class="h-1.5 w-1.5"
                  src="https://www.hsb.co.id/price-guess/link-logo.png"
                />
              </div>
            </li>
          </ul>
        </section>
      </template>
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

  delay(5000).then(() => {
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
      showToast(
        t(errorCurrentContent.message ?? "Error dari database, coba refresh"),
        "danger",
      );
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
      showToast(
        t(errorContent.message ?? "Error dari database, coba refresh"),
        "danger",
      );
      return;
    }
    if (!contentVal) {
      console.error("error !contentVal");
      showToast(t("Error dari database, coba refresh"), "danger");
      return;
    }

    const contentData = contentVal as Content;
    content.value = contentData;
  } catch (error: any) {
    if (error) {
      console.error("/api/content:", error);
      showToast(
        t(error.message ?? "Error dari database, coba refresh"),
        "danger",
      );
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
