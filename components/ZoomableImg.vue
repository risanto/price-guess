<template>
  <div :class="['relative overflow-hidden', className]">
    <div ref="container" class="zoom-container">
      <NuxtImg :src="src" class="zoom-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Panzoom from "@panzoom/panzoom";

const { src, className } = defineProps({
  src: {
    type: String,
    required: true,
  },
  className: {
    type: String,
    default: "",
  },
});

const container = ref<HTMLElement>();

if (import.meta.client) {
  onMounted(() => {
    if (!container.value) return;

    const panzoomInstance = Panzoom(container.value, {
      maxScale: 3,
      minScale: 1,
      bounds: true,
      boundsPadding: 0.1,
    });

    container.value.addEventListener("wheel", (event) => {
      event.preventDefault();
      panzoomInstance.zoomWithWheel(event);
    });
  });
}
</script>

<style scoped>
.zoom-container {
  position: relative;
  max-width: 350px;
  max-height: 194px;
}

.zoom-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  cursor: grab;
}
</style>
