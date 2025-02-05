<template>
  <SectionParent>
    <template v-if="showExplanation">
      <div
        class="flex flex-1 flex-col justify-between p-4 md:justify-center 2xl:p-9"
      >
        <div class="space-y-4 md:space-y-12">
          <h3 class="mt-3 text-center text-xl font-bold md:text-4xl">
            {{ $t("Penjelasan") }}
          </h3>

          <p class="text-sm md:text-lg md:font-medium 2xl:text-2xl">
            {{ analysis }}
          </p>
        </div>

        <div class="flex justify-end md:mt-12">
          <button
            @click="
              showExplanation = false;
              showThankYou = true;
            "
            class="h-9 w-14 transform rounded-md border-[0.5px] border-black bg-primary-100 text-[15px] font-bold text-white hover:bg-amber-500 md:static md:translate-x-0 2xl:h-[49px] 2xl:w-[82px] 2xl:text-[20px]"
          >
            {{ $t("OK") }}
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="showThankYou">
      <div
        class="flex flex-1 flex-col justify-around px-2 py-4 md:justify-center md:px-6"
      >
        <div>
          <h3 class="mt-3 text-center text-xl font-bold md:text-4xl">
            {{ $t("Terima kasih telah bermain!") }}
          </h3>

          <p
            class="mt-4 px-4 text-center md:mt-6 md:p-0 md:text-xl md:font-medium"
          >
            {{
              $t(
                " Jangan lupa untuk kembali besok dan coba game penghasil uang termudah ini lagi.",
              )
            }}
          </p>
        </div>

        <div class="flex justify-center md:mt-10">
          <button
            class="mx-auto w-[167px] rounded-lg border-[0.5px] border-black bg-black px-2.5 py-1.5 text-center text-sm font-bold text-white hover:bg-slate-500 md:w-[265px] md:py-2.5 md:text-2xl"
          >
            <NuxtLink href="/">
              {{ $t("Kembali ke Beranda") }}
            </NuxtLink>
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="!showExplanation && !showThankYou">
      <div v-if="loading" class="flex h-full items-center justify-center">
        <LoadingCircle />
      </div>

      <template v-else-if="!loading">
        <template v-if="showWinMessage">
          <NuxtImg
            class="mx-auto mt-8 w-12 md:my-0 md:w-20"
            src="https://www.hsb.co.id/price-guess/coin-spin.gif"
          />

          <div
            class="mt-8 text-center text-xl font-semibold md:px-3 md:text-4xl md:font-bold"
          >
            <div>
              {{ $t("Selamat! ") }} <br class="hidden md:block" />
              {{ $t("Jawabanmu benar.") }}
            </div>
            <div>{{ $t("Kamu mendapatkan 5000 poin.") }}</div>
          </div>
        </template>

        <template v-else-if="!showWinMessage">
          <h2
            class="mt-5 max-w-[320px] text-center text-xl font-semibold md:max-w-full md:text-4xl md:font-bold"
          >
            {{ $t("Tebak nominal harga emas terhadap USD di ") }}
            <span class="italic">{{ $t("candle ") }}</span>
            {{ $t("selanjutnya") }}
          </h2>

          <div class="mx-auto mt-4 flex flex-col space-y-2 md:mt-5">
            <div
              v-for="(_, answerSection) in answer"
              class="flex space-x-1 md:space-x-1.5"
            >
              <input
                v-for="(_, idx) in q2Answer"
                @input="handleInput(answerSection, idx)"
                @keyup.enter="handleAnswer"
                @keydown.backspace.prevent="handleBackspace(answerSection, idx)"
                :type="idx === 4 ? 'text' : 'number'"
                v-model="answer[answerSection][idx]"
                :class="[
                  'number-box text-center md:font-bold lg:text-xl',
                  `row-${answerSection}`,
                  `box-${answerSection}-${idx}`,
                  answerBgColors[answerSection][idx],
                ]"
                :disabled="
                  idx < 2 ||
                  idx === q2Answer.length - 2 ||
                  (answerSection < currentSection ? true : false) ||
                  currentSection < answerSection
                "
              />
              <button
                v-if="currentSection === answerSection && !finished"
                @click="handleAnswer"
                :class="[
                  'absolute h-[32px] w-12 translate-x-[480%] transform rounded-md border-[0.5px] border-black bg-primary-100 text-[15px] font-bold text-white hover:bg-primary-200 md:static md:translate-x-0 md:text-[20px] 2xl:h-[49px] 2xl:w-[82px]',
                  { 'bg-slate-300 hover:bg-slate-300': finished },
                ]"
              >
                {{ $t("OK") }}
              </button>
            </div>

            <div
              v-if="error"
              class="mt-4 text-center text-xs font-bold text-red-600 md:text-xl"
            >
              {{ error }}
            </div>
          </div>
        </template>

        <button
          v-if="finished"
          @click="showExplanation = true"
          class="m-auto w-[141px] rounded-lg border-[0.5px] border-black bg-black px-2.5 py-1.5 text-center text-sm font-bold text-white hover:bg-slate-500 md:my-0 md:mt-2 md:w-[224px] md:text-2xl"
        >
          {{ $t("Lihat Penjelasan") }}
        </button>
      </template>
    </template>
  </SectionParent>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import type { UserProfileUpdate } from "~/types/userProfile";

import SectionParent from "./SectionParent.vue";

const { t } = useI18n();
const { user, fetchUser, userPointsFn } = useAuthStore();

const loading = ref(false);
const showExplanation = ref(false);
const showThankYou = ref(false);
const showWinMessage = ref(false);

const { q2Answer, changeToFinished, finished, analysis } = defineProps({
  q2Answer: {
    type: String,
    required: true,
  },
  changeToFinished: {
    type: Function,
    required: true,
  },
  finished: {
    type: Boolean,
    required: true,
  },
  analysis: {
    type: String,
    required: true,
  },
});
const error = ref("");
const currentSection = ref(0);

const answer = ref([
  [+q2Answer[0], +q2Answer[1], "", "", ".", ""],
  [+q2Answer[0], +q2Answer[1], "", "", ".", ""],
  [+q2Answer[0], +q2Answer[1], "", "", ".", ""],
]);
const answerBgColors = ref([
  ["bg-slate-100", "bg-slate-100", "", "", "bg-slate-100", ""],
  ["bg-slate-100", "bg-slate-100", "", "", "bg-slate-100", ""],
  ["bg-slate-100", "bg-slate-100", "", "", "bg-slate-100", ""],
]);

watch(currentSection, async () => {
  // Wait for DOM updates after the reactive value changes
  await nextTick();

  // go to first empty box
  const currentInput = document.querySelector(
    `.box-${currentSection.value}-2`,
  ) as HTMLElement;
  currentInput.focus();
});
watch(
  () => finished,
  async () => {
    if (finished) {
      await nextTick();

      // Get the currently focused element
      const focusedElement = document.activeElement as HTMLElement;

      // If there's an element that's currently focused
      if (focusedElement) {
        focusedElement.blur(); // Remove focus from the element
      }
    }
  },
);

const handleBackspace = (answerSection: number, idx: number) => {
  const currentInput = document.querySelector(
    `.box-${answerSection}-${idx}`,
  ) as HTMLInputElement;

  // If the input is not empty, do nothing
  if (currentInput && currentInput.value !== "") {
    answer.value[answerSection][idx] = "";
    return;
  }

  let focusedIdx = idx - 1; // Try to move one step back

  // Ensure we don't go below the minimum index (2 in your case)
  focusedIdx = Math.max(focusedIdx, 2);

  let prevInput = document.querySelector(
    `.box-${answerSection}-${focusedIdx}`,
  ) as HTMLElement;

  if (prevInput) {
    // Skip over inputs with certain classes (like 'bg-slate-100') if needed
    if (prevInput.classList.contains("bg-slate-100")) {
      focusedIdx = Math.max(focusedIdx - 1, 2); // Skip one more if it's non-interactive
      prevInput = document.querySelector(
        `.box-${answerSection}-${focusedIdx}`,
      ) as HTMLElement;
    }

    // Focus the previous input
    prevInput?.focus();
  }
};
const handleInput = (answerSection: number, idx: number) => {
  error.value = "";

  let value = +answer.value[answerSection][idx];

  // Ensure the value is a valid single digit number
  if (value && (value > 9 || value < 0)) {
    answer.value[answerSection][idx] = +value.toString().slice(-1); // Slice it to 1 digit if it's more
  }

  let nextInput = document.querySelector(
    `.box-${answerSection}-${idx + 1}`,
  ) as HTMLElement;

  if (Number.isFinite(value) && nextInput) {
    if (nextInput.classList.contains("bg-slate-100")) {
      nextInput = document.querySelector(
        `.box-${answerSection}-${idx + 2}`,
      ) as HTMLElement;
    }
    nextInput.focus();
  }
};
const handleAnswer = () => {
  const currentAnswer = answer.value[currentSection.value];

  if (currentAnswer.includes("")) {
    error.value = t("Semua kolom harus diisi");
    return;
  }

  const correctNumbers = [+q2Answer[2], +q2Answer[3], +q2Answer[5]];

  let correctNumbersAmount: { [key: string]: number } = {};
  let correctAnswers: { [key: string]: number } = {};

  correctNumbers.forEach((n: number) => {
    if (n in correctNumbersAmount === false) {
      correctNumbersAmount[n] = 0;
      correctAnswers[n] = 0;
    }
    correctNumbersAmount[n]++;
  });

  const anyCorrect: { [key: string]: boolean } = {
    [currentAnswer[2]]: +currentAnswer[2] === correctNumbers[0],
    [currentAnswer[3]]: +currentAnswer[3] === correctNumbers[1],
    [currentAnswer[5]]: +currentAnswer[5] === correctNumbers[2],
  };

  // loop through all boxes except 4 (dot)
  for (let i = 2; i < 6; i++) {
    if (i === 4) continue;

    const box = document.querySelector<HTMLElement>(
      `.box-${currentSection.value}-${i}`,
    );
    if (box) {
      box.style.animation = "flipIn 0.6s ease forwards";
    }

    if (+currentAnswer[i] === +q2Answer[i]) {
      // correct
      correctAnswers[currentAnswer[i]]++;
      answerBgColors.value[currentSection.value][i] = "bg-[#B9FFB8]";
    } else if (
      (+currentAnswer[i]) in correctAnswers &&
      correctNumbersAmount[currentAnswer[i]] >
        correctAnswers[currentAnswer[i]] &&
      !anyCorrect[currentAnswer[i]]
    ) {
      // still wrong placement
      answerBgColors.value[currentSection.value][i] = "bg-[#FFE7AA]";
    } else {
      // no placement
      answerBgColors.value[currentSection.value][i] = "bg-[#FFB8B8]";
    }
  }

  if (answer.value[currentSection.value].join("") === q2Answer) {
    handleWin();
    return;
  }

  if (currentSection.value === 2) {
    error.value = t("Jawaban masih belum tepat!");
    changeToFinished();
    return;
  }

  currentSection.value++;
};

async function handleWin() {
  triggerWinningAnimation(currentSection.value);
  await delay(2000);

  changeToFinished();
  loading.value = true;

  if (user?.id) {
    const response = await fetch("/api/users/" + user?.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        points: user?.points ? user.points + 5000 : 5000,
        points_last_added: new Date().toISOString(),
      } as UserProfileUpdate),
    });
    const { error: insertError } = await response.json();

    if (insertError) {
      error.value = t(insertError.message);
      loading.value = false;
      return;
    }

    await fetchUser();
  } else {
    userPointsFn.save(5000);
  }

  loading.value = false;
  showWinMessage.value = true;
}

function triggerWinningAnimation(idx: number) {
  const letterBoxes = document.querySelectorAll<HTMLElement>(".row-" + idx);

  letterBoxes.forEach((box, index) => {
    setTimeout(() => {
      box.style.animation = `flipIn 0.6s ease forwards, pop 0.3s ${index * 0.1}s ease forwards`;
      box.style.backgroundColor = "rgb(34 197 94)";
    }, index * 200); // Delays each letter's animation for a cascading effect
  });
}
</script>

<style>
/* Hide the spinner in Webkit browsers (Chrome, Safari) */
input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide the spinner in Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

@keyframes flipIn {
  0% {
    transform: rotateX(0);
  }
  50% {
    transform: rotateX(90deg);
  }
  100% {
    transform: rotateX(0);
  }
}

@keyframes pop {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
