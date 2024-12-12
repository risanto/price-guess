<template>
  <div class="lg:mx-auto lg:max-w-[1620px]">
    <Header />

    <ClientOnly>
      <div
        class="flex h-[80vh] w-full items-center justify-center"
        v-if="loading"
      >
        <LoadingCircle />
      </div>

      <main
        v-else-if="!loading"
        class="flex flex-col overflow-hidden px-[9px] py-[39px] lg:space-y-6 lg:py-[26px]"
      >
        <p v-if="!content" class="mt-48 text-center text-red-500 lg:col-span-3">
          {{ $t("Error dari database, coba refresh kembali") }}
        </p>

        <template v-else-if="content">
          <div
            class="flex min-h-[510px] flex-col rounded-lg border-[0.5px] border-black p-[11px] lg:col-span-3 lg:grid lg:h-[574px] lg:grid-cols-3 lg:space-x-6 lg:border-0 lg:p-0"
          >
            <div class="lg:col-span-2">
              <div class="relative">
                <transition name="enlarge" mode="out-in">
                  <div v-if="!finished">
                    <NuxtImg
                      class="hidden h-[574px] w-full rounded-2xl border border-black lg:block"
                      :src="content?.initial_img_url as string"
                    />

                    <ZoomableImg
                      :src="content?.initial_img_url as string"
                      :className="'lg:hidden'"
                    />
                  </div>

                  <div v-else>
                    <NuxtImg
                      class="hidden h-[574px] w-full rounded-2xl border border-black lg:block"
                      :src="content?.answer_img_url as string"
                    />

                    <ZoomableImg
                      :src="content?.answer_img_url as string"
                      :className="'lg:hidden'"
                    />
                  </div>
                </transition>

                <div
                  class="absolute left-1 top-1 flex space-x-1 lg:left-4 lg:top-4 lg:space-x-4"
                >
                  <div
                    class="flex items-center justify-center rounded-md border-[0.3px] border-black bg-white p-[5px] lg:rounded-xl"
                  >
                    <NuxtImg
                      src="https://www.hsb.co.id/price-guess/gold-icon.png"
                      alt="gold icon"
                      class="h-2 w-2 lg:h-7 lg:w-7"
                    />
                    <span class="ml-[1px] text-[9px] font-bold lg:text-[27px]">
                      XAUUSD
                    </span>
                  </div>

                  <div
                    class="flex items-center justify-center rounded-md border-[0.3px] border-black bg-white p-[5px] lg:rounded-xl"
                  >
                    <span class="text-[9px] font-bold lg:text-[27px]">
                      30m
                    </span>
                  </div>
                </div>

                <div
                  class="absolute bottom-1.5 left-1 flex flex-col justify-center rounded-md border-[0.3px] border-black bg-white px-[5px] pb-[4px] pt-[3px] lg:bottom-4 lg:left-4 lg:rounded-xl lg:px-[14px] lg:py-[12px]"
                >
                  <span class="text-[4px] italic lg:text-[11px]">
                    Source:
                  </span>

                  <NuxtImg
                    src="https://www.hsb.co.id/price-guess/trading-view-logo.png"
                    alt="tradingview icon"
                    class="w-[75px] lg:w-[221px]"
                  />
                </div>
              </div>

              <div class="mt-2 text-center text-xs text-gray-500 lg:hidden">
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
                :finished="finished"
                :analysis="content?.analysis"
              />
            </transition>
          </div>

          <section
            class="mt-4 space-y-2 rounded-lg border-[0.5px] border-black p-4 lg:col-span-3"
          >
            <h3 class="text-xl font-bold lg:text-4xl">
              {{ $t("Berita Relevan") }}
            </h3>

            <ul v-for="(news, idx) in content?.info.news_items" :key="idx">
              <a :href="news.link" target="_blank">
                <li
                  class="relative w-full rounded-lg border-[0.5px] border-black bg-primary-500 p-2 text-white lg:inline-block lg:w-auto lg:rounded-xl lg:border lg:px-3 lg:py-1"
                >
                  <div class="lg:flex lg:items-center lg:space-x-4">
                    <span
                      class="inline-block w-[calc(100%-60px)] lg:w-auto lg:text-2xl"
                      >{{ news.title }}</span
                    >
                    <div
                      class="absolute bottom-1.5 right-1.5 flex h-[13px] items-center justify-center space-x-1 rounded bg-white px-1 py-0.5 text-[7px] text-black lg:static lg:h-auto lg:rounded-md lg:px-1.5 lg:py-1 lg:text-[12px] lg:font-medium"
                    >
                      <div>
                        {{ $t("Baca berita") }}
                      </div>

                      <NuxtImg
                        class="h-1.5 w-1.5 lg:h-2.5 lg:w-2.5"
                        src="https://www.hsb.co.id/price-guess/link-logo.png"
                      />
                    </div>
                  </div>
                </li>
              </a>
            </ul>
          </section>
        </template>
      </main>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import type { Content } from "~/types/content";
import type { ApiResponse } from "~/types/api";

import Question1 from "./components/Question1.vue";
import Question1Result from "./components/Question1Result.vue";
import Question2 from "./components/Question2.vue";
import LoadingCircle from "~/components/LoadingCircle.vue";

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
