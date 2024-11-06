<template>
  <SectionParent>
    <h2 class="mt-4 text-center md:mt-0">
      {{ $t("Tebak nominal harga emas terhadap USD di bar selanjutnya") }}
    </h2>

    <div class="mx-auto mt-4 flex flex-col">
      <div
        v-for="(_, answerSection) in answer"
        :class="['flex', { 'mt-4': currentSection > 0 }]"
      >
        <input
          v-for="(_, idx) in q2Answer"
          @keyup.enter="handleAnswer"
          type="text"
          v-model="answer[answerSection][idx]"
          :class="[
            'mb-4 me-2 h-8 w-8 border border-gray-300 p-0 text-center',
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
          v-if="currentSection === answerSection"
          @click="handleAnswer"
          class="absolute h-[2.1rem] w-12 translate-x-[500%] transform rounded-sm bg-primary-100 hover:bg-primary-200"
        >
          {{ $t("Ok") }}
        </button>
      </div>

      <template v-if="!loading">
        <div v-if="error" class="mt-4 text-center text-red-600">
          {{ error }}
        </div>
        <div
          v-if="success"
          class="mt-4 text-center text-green-500"
          v-html="success"
        />
      </template>

      <div v-else class="flex items-center justify-center">
        <LoadingCircle />
      </div>
    </div>
  </SectionParent>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/stores/auth";
import SectionParent from "./SectionParent.vue";
import type { UserProfileUpdate } from "~/types/userProfile";

const { t } = useI18n();
const { isAuthenticated, user, fetchUser } = useAuthStore();
const loading = ref(false);

const { q2Answer, changeToFinished } = defineProps({
  q2Answer: {
    type: String,
    required: true,
  },
  changeToFinished: {
    type: Function,
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
      answerBgColors.value[currentSection.value][i] = "bg-green-400";
    } else if (
      currentAnswer[i] in correctAnswers &&
      correctNumbersAmount[currentAnswer[i]] >
        correctAnswers[currentAnswer[i]] &&
      !anyCorrect[currentAnswer[i]]
    ) {
      // still wrong placement
      answerBgColors.value[currentSection.value][i] = "bg-amber-400";
    } else {
      // no placement
      answerBgColors.value[currentSection.value][i] = "bg-red-400";
    }
  }

  if (answer.value[currentSection.value].join("") === q2Answer) {
    return handleWin();
  }

  if (currentSection.value === 2) {
    error.value = t("Jawaban masih belum tepat :(");
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
  loading.value = true;
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
