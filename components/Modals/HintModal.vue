<template>
  <div
    id="hint-modal"
    tabindex="-1"
    aria-hidden="true"
    class="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
  >
    <div class="relative max-h-full max-w-2xl p-4">
      <!-- Modal content -->
      <div class="relative rounded-lg bg-white shadow dark:bg-gray-700">
        <button class="absolute right-2.5 top-2.5" data-modal-hide="hint-modal">
          <NuxtImg
            class="h-4 w-4"
            src="https://www.hsb.co.id/price-guess/close-btn.png"
          />
        </button>

        <div
          class="flex flex-col items-center justify-center space-y-4 px-5 py-12"
        >
          <h1 class="main-header">{{ $t("Cara Bermain") }}</h1>

          <ol class="ml-4 list-decimal">
            <li>Lakukan analisa untuk grafik yang tersedia.</li>
            <li>
              Kami menyediakan bantuan berupa berita yang rilis pada hari itu
              sebagai alat analisa. Contoh:

              <div class="mb-4 mt-2 space-y-2">
                <div
                  class="relative w-full rounded-lg border-[0.5px] border-black bg-primary-500 p-2 text-white"
                >
                  <a
                    href="https://www.metrotvnews.com/read/NnjC4YRJ-dolar-as-menguat"
                    target="_blank"
                    class="inline-block w-[calc(100%-60px)]"
                    >Dolar AS Menguat</a
                  >
                  <div
                    class="absolute bottom-1.5 right-1.5 flex h-[13px] items-center justify-center space-x-1 rounded bg-white px-1 py-0.5 text-[7px] text-black"
                  >
                    <div>Baca berita</div>
                    <img
                      data-nuxt-img=""
                      srcset="
                        https://www.hsb.co.id/price-guess/link-logo.png 1x,
                        https://www.hsb.co.id/price-guess/link-logo.png 2x
                      "
                      class="h-1.5 w-1.5"
                      src="https://www.hsb.co.id/price-guess/link-logo.png"
                    />
                  </div>
                </div>

                <div
                  class="relative w-full rounded-lg border-[0.5px] border-black bg-primary-500 p-2 text-white"
                >
                  <a
                    href="https://www.medcom.id/ekonomi/global/8KyPRe3k-tingkat-pengangguran-as-naik-hingga-4-di-mei-2024"
                    target="_blank"
                    class="inline-block w-[calc(100%-60px)]"
                    >Tingkat Pengangguran AS Naik hingga 4% di Mei 2024</a
                  >
                  <div
                    class="absolute bottom-1.5 right-1.5 flex h-[13px] items-center justify-center space-x-1 rounded bg-white px-1 py-0.5 text-[7px] text-black"
                  >
                    <div>Baca berita</div>
                    <img
                      data-nuxt-img=""
                      srcset="
                        https://www.hsb.co.id/price-guess/link-logo.png 1x,
                        https://www.hsb.co.id/price-guess/link-logo.png 2x
                      "
                      class="h-1.5 w-1.5"
                      src="https://www.hsb.co.id/price-guess/link-logo.png"
                    />
                  </div>
                </div>
              </div>
            </li>
            <li>Lakukan tebakan kemana arah grafik selanjutnya.</li>
            <li>
              Setelah menebak arah grafik, kamu harus menebak harga tertinggi
              atau terendah grafik pada grafik selanjutnya.
            </li>
            <li>
              Kamu diberikan 4 kesempatan menebak.

              <div class="mt-2 flex space-x-1">
                <div class="number-box bg-[#F0F0F0]">2</div>
                <div class="number-box bg-[#F0F0F0]">3</div>
                <div class="number-box bg-[#B9FFB8]">3</div>
                <div class="number-box bg-[#FFB8B8]">4</div>
                <div class="number-box bg-[#F0F0F0]">.</div>
                <div class="number-box bg-[#FFE7AA]">5</div>
              </div>

              <div class="mb-4 mt-3">
                <div class="flex items-center">
                  <div class="number-box-sm bg-[#B9FFB8]"></div>

                  <div class="ml-1 text-sm">
                    Menandakan angka dan pada kotak yang tepat.
                  </div>
                </div>

                <div class="flex items-center">
                  <div class="number-box-sm bg-[#FFE7AA]"></div>

                  <div class="ml-1 text-sm">
                    Menandakan angka yang tepat tapi kotak yang salah.
                  </div>
                </div>

                <div class="flex items-center">
                  <div class="number-box-sm bg-[#FFB8B8]"></div>

                  <div class="ml-1 text-sm">
                    Menandakan angka yang tidak sesuai dimanapun.
                  </div>
                </div>
              </div>
            </li>
            <li>
              Jika berhasil menebak maka kamu akan mendapat reward berupa koin
              yang bisa ditukar jadi uang tunai.
            </li>
            <li>Jika gagal menebak maka kamu baru bisa mencoba lagi besok.</li>
          </ol>

          <div v-if="location === 'Home'">
            <button class="base-btn mt-3 w-[126px] bg-black hover:bg-slate-500">
              <NuxtLink href="/play">
                {{ $t("Mulai Main") }}
              </NuxtLink>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  location: {
    type: String,
    validator: (val) => val === "Home" || val === undefined,
  },
});
</script>
