<script setup>
import { useMarker } from '../../modules/marker/useMarker.js'

const {
  count,
  isLoading,
  loadRandomBillboards,
  loadRandomPoints,
  clearMarkers,
  flyToMarkers,
} = useMarker()
</script>

<template>
  <div class="marker-demo">
    <!-- Billboard 操作 -->
    <div class="demo-section">
      <div class="section-label">图标点位 (Billboard)</div>
      <div class="btn-group">
        <button
          class="btn"
          :disabled="isLoading"
          @click="loadRandomBillboards(20)"
        >
          加载 20 个
        </button>
        <button
          class="btn"
          :disabled="isLoading"
          @click="loadRandomBillboards(100)"
        >
          加载 100 个
        </button>
      </div>
    </div>

    <!-- Point 操作 -->
    <div class="demo-section">
      <div class="section-label">圆点点位 (Point)</div>
      <div class="btn-group">
        <button class="btn" :disabled="isLoading" @click="loadRandomPoints(20)">
          加载 20 个
        </button>
        <button
          class="btn"
          :disabled="isLoading"
          @click="loadRandomPoints(100)"
        >
          加载 100 个
        </button>
      </div>
    </div>

    <!-- 通用操作 -->
    <div class="demo-section">
      <div class="section-label">操作</div>
      <div class="btn-group">
        <button
          class="btn primary"
          :disabled="count === 0"
          @click="flyToMarkers"
        >
          飞行定位
        </button>
        <button class="btn" :disabled="count === 0" @click="clearMarkers">
          清除全部
        </button>
      </div>
    </div>

    <!-- 状态信息 -->
    <div class="info-text">当前点位数量：{{ count }}</div>
  </div>
</template>

<style scoped>
.marker-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.demo-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}
</style>
