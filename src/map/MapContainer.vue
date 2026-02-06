<script setup>
import { onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewerStore } from '../stores/viewer.js'
import { MAP_CONFIG } from '../config/map.js'

const viewerStore = useViewerStore()
const { isReady } = storeToRefs(viewerStore)

onMounted(async () => {
  await viewerStore.init('viewer-container', MAP_CONFIG)
})

onUnmounted(() => {
  viewerStore.destroy()
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
