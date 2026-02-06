<script setup>
import { computed } from 'vue'
import { usePolygon } from '../../modules/polygon/usePolygon.js'
import { usePolyline } from '../../modules/polyline/usePolyline.js'

const {
  count: polygonCount,
  isLoading: polygonLoading,
  loadNormalPolygon,
  loadExtrudedPolygon,
  loadCircle,
  loadAllPolygons,
  clearPolygons,
  flyToPolygons,
} = usePolygon()

const {
  count: polylineCount,
  isLoading: polylineLoading,
  loadNormalPolyline,
  loadGlowPolyline,
  loadArrowPolyline,
  loadDashPolyline,
  loadAllPolylines,
  clearPolylines,
  flyToPolylines,
} = usePolyline()

const isLoading = computed(() => polygonLoading.value || polylineLoading.value)
const totalCount = computed(() => polygonCount.value + polylineCount.value)

function clearAll() {
  clearPolygons()
  clearPolylines()
}
</script>

<template>
  <div class="polygon-demo">
    <!-- 多边形操作 -->
    <div class="demo-section">
      <div class="section-label">多边形 (Polygon)</div>
      <div class="btn-group">
        <button class="btn" :disabled="isLoading" @click="loadNormalPolygon()">
          普通
        </button>
        <button
          class="btn"
          :disabled="isLoading"
          @click="loadExtrudedPolygon()"
        >
          拉伸
        </button>
        <button class="btn" :disabled="isLoading" @click="loadCircle()">
          圆形
        </button>
        <button
          class="btn primary"
          :disabled="isLoading"
          @click="loadAllPolygons()"
        >
          全部
        </button>
      </div>
    </div>

    <!-- 折线操作 -->
    <div class="demo-section">
      <div class="section-label">折线 (Polyline)</div>
      <div class="btn-group">
        <button class="btn" :disabled="isLoading" @click="loadNormalPolyline()">
          实线
        </button>
        <button class="btn" :disabled="isLoading" @click="loadGlowPolyline()">
          发光
        </button>
        <button class="btn" :disabled="isLoading" @click="loadArrowPolyline()">
          箭头
        </button>
        <button class="btn" :disabled="isLoading" @click="loadDashPolyline()">
          虚线
        </button>
      </div>
      <div class="btn-group">
        <button
          class="btn primary"
          :disabled="isLoading"
          @click="loadAllPolylines()"
        >
          加载全部折线
        </button>
      </div>
    </div>

    <!-- 通用操作 -->
    <div class="demo-section">
      <div class="section-label">操作</div>
      <div class="btn-group">
        <button
          class="btn"
          :disabled="polygonCount === 0"
          @click="flyToPolygons"
        >
          定位多边形
        </button>
        <button
          class="btn"
          :disabled="polylineCount === 0"
          @click="flyToPolylines"
        >
          定位折线
        </button>
        <button class="btn" :disabled="totalCount === 0" @click="clearAll">
          清除全部
        </button>
      </div>
    </div>

    <!-- 状态信息 -->
    <div class="info-text">
      多边形: {{ polygonCount }} | 折线: {{ polylineCount }}
    </div>
  </div>
</template>

<style scoped>
.polygon-demo {
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
