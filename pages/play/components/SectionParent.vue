<!-- so all play/components have a uniform parent -->
<template>
  <section
    class="flex h-[300px] flex-col items-center md:h-full lg:col-span-1 lg:justify-center lg:space-y-16 lg:rounded-2xl lg:border lg:border-black lg:p-4 lg:py-0"
  >
    <slot />
  </section>
</template>
