<script setup>
import { onMounted, onUnmounted } from 'vue'
import { createViewer } from '../composables/useViewer.js'
import { MAP_CONFIG } from '../config/map.js'

const { viewer, isReady, init, destroy } = createViewer()

onMounted(async () => {
  await init('viewer-container', MAP_CONFIG)
})

onUnmounted(() => {
  destroy()
})
</script>

<template>
  <div class="map-wrapper">
    <div id="viewer-container" class="viewer-container"></div>
    <!-- 子组件 slot，用于放置控制面板等 -->
    <slot v-if="isReady"></slot>
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.viewer-container {
  width: 100%;
  height: 100%;
}
</style>
