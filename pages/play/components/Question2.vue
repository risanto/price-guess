<template>
  <SectionParent>
    <template v-if="showExplanation">
      <div class="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 class="mt-3 text-center text-xl font-bold">
            {{ $t("Penjelasan") }}
          </h3>

          <p class="mt-4 px-4">{{ analysis }}</p>
        </div>

        <div class="flex justify-end">
          <button
            @click="
              showExplanation = false;
              showThankYou = true;
            "
            :class="[
              'h-9 w-14 transform rounded-md border-[0.5px] border-black bg-primary-100 text-[15px] font-bold text-white hover:bg-primary-200',
            ]"
          >
            {{ $t("OK") }}
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="showThankYou">
      <div class="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 class="mt-3 text-center text-xl font-bold">
            {{ $t("Terima kasih telah bermain!") }}
          </h3>

          <p class="mt-4 px-4 text-center">
            Jangan lupa untuk kembali besok dan coba game penghasil uang
            termudah ini lagi.
          </p>
        </div>

        <div class="flex justify-center">
          <button
            class="m-auto mb-[73px] w-[167px] rounded-lg border-[0.5px] border-black bg-black px-2.5 py-1.5 text-center text-sm font-bold text-white hover:bg-slate-500"
          >
            <NuxtLink href="/">
              {{ $t("Kembali ke Beranda") }}
            </NuxtLink>
          </button>
        </div>
      </div>
    </template>

    <template v-else-if="!showExplanation && !showThankYou">
      <div v-if="loading" class="flex items-center justify-center">
        <LoadingCircle />
      </div>

      <template v-else-if="!loading">
        <template v-if="showWinMessage">
          <NuxtImg
            class="m-auto w-12"
            src="https://www.hsb.co.id/price-guess/coin-spin.gif"
          />

          <div class="text-center text-xl font-semibold">
            <div>{{ $t("Selamat! Jawabanmu benar.") }}</div>
            <div>{{ $t("Kamu mendapatkan 1000 poin.") }}</div>
          </div>
        </template>

        <template v-else-if="!showWinMessage">
          <h2 class="mt-5 max-w-[320px] text-center text-xl font-semibold">
            {{ $t("Tebak nominal harga emas terhadap USD di ") }}
            <span class="italic">{{ $t("candle ") }}</span>
            {{ $t("selanjutnya") }}
          </h2>

          <div class="mx-auto mt-4 flex flex-col space-y-2">
            <div v-for="(_, answerSection) in answer" class="flex space-x-1">
              <input
                v-for="(_, idx) in q2Answer"
                @keyup.enter="handleAnswer"
                type="text"
                v-model="answer[answerSection][idx]"
                :class="[
                  'number-box text-center',
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
                @input="handleInput(answerSection, idx)"
                maxlength="1"
              />
              <button
                v-if="currentSection === answerSection && !finished"
                @click="handleAnswer"
                :class="[
                  'absolute h-[32px] w-12 translate-x-[480%] transform rounded-md border-[0.5px] border-black bg-primary-100 text-[15px] font-bold text-white hover:bg-primary-200',
                  { 'bg-slate-300 hover:bg-slate-300': finished },
                ]"
              >
                {{ $t("OK") }}
              </button>
            </div>

            <div
              v-if="error"
              class="mt-4 text-center text-xs font-bold text-red-600"
            >
              {{ error }}
            </div>
          </div>
        </template>

        <button
          v-if="finished"
          @click="showExplanation = true"
          class="m-auto w-[141px] rounded-lg border-[0.5px] border-black bg-black px-2.5 py-1.5 text-center text-sm font-bold text-white hover:bg-slate-500"
        >
          {{ $t("Lihat Penjelasan") }}
        </button>
      </template>
    </template>
  </SectionParent>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import SectionParent from "./SectionParent.vue";
import type { UserProfileUpdate } from "~/types/userProfile";

const { t } = useI18n();
const { isAuthenticated, user, fetchUser } = useAuthStore();

const loading = ref(false);
const showExplanation = ref(false);
const showThankYou = ref(false);
const showWinMessage = ref(false);

const { q2Answer, changeToFinished } = defineProps({
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
const success = ref("");
const currentSection = ref(0);

const answer = ref([
  [q2Answer[0], q2Answer[1], "", "", ".", ""],
  [q2Answer[0], q2Answer[1], "", "", ".", ""],
  [q2Answer[0], q2Answer[1], "", "", ".", ""],
]);
const answerBgColors = ref([
  ["bg-slate-100", "bg-slate-100", "", "", "bg-slate-100", ""],
  ["bg-slate-100", "bg-slate-100", "", "", "bg-slate-100", ""],
  ["bg-slate-100", "bg-slate-100", "", "", "bg-slate-100", ""],
]);

watch(currentSection, async () => {
  // Wait for DOM updates after the reactive value changes
  await nextTick();

  const currentInput = document.querySelector(
    `.box-${currentSection.value}-2`,
  ) as HTMLElement;
  currentInput.focus();
});

const handleAnswer = () => {
  const currentAnswer = answer.value[currentSection.value];

  if (currentAnswer.includes("")) {
    error.value = t("Semua kolom harus diisi");
    return;
  }

  const correctNumbers = [q2Answer[2], q2Answer[3], q2Answer[5]];

  let correctNumbersAmount: { [key: string]: number } = {};
  let correctAnswers: { [key: string]: number } = {};

  correctNumbers.forEach((n: string) => {
    if (n in correctNumbersAmount === false) {
      correctNumbersAmount[n] = 0;
      correctAnswers[n] = 0;
    }
    correctNumbersAmount[n]++;
  });

  const anyCorrect: { [key: string]: boolean } = {
    [currentAnswer[2]]: currentAnswer[2] === correctNumbers[0],
    [currentAnswer[3]]: currentAnswer[3] === correctNumbers[1],
    [currentAnswer[5]]: currentAnswer[5] === correctNumbers[2],
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

    if (currentAnswer[i] === q2Answer[i]) {
      // correct
      correctAnswers[currentAnswer[i]]++;
      answerBgColors.value[currentSection.value][i] = "bg-[#B9FFB8]";
    } else if (
      currentAnswer[i] in correctAnswers &&
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
const handleInput = (answerSection: number, idx: number) => {
  error.value = "";
  answer.value[answerSection][idx] = answer.value[answerSection][idx].replace(
    /[^0-9.]/g,
    "",
  );

  let nextInput = document.querySelector(
    `.box-${answerSection}-${idx + 1}`,
  ) as HTMLElement;

  if (nextInput) {
    if (nextInput.classList.contains("bg-slate-100")) {
      nextInput = document.querySelector(
        `.box-${answerSection}-${idx + 2}`,
      ) as HTMLElement;
    }
    nextInput.focus();
  }
};

async function handleWin() {
  showWinMessage.value = true;
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
  }

  loading.value = false;

  let winMessage = t("Hebat! Jawabanmu benar! ");

  if (isAuthenticated) {
    winMessage += t("<br/>Poinmu bertambah 5000");
  }
  success.value = winMessage;
  triggerWinningAnimation(currentSection.value);
  changeToFinished();
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
