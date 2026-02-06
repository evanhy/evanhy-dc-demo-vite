<script setup>
import { useAnalysis } from '../../modules/analysis/useAnalysis.js'

const {
  analysisState,
  viewshedParams,
  shadowParams,
  clipParams,
  hasAnyAnalysis,
  toggleViewshed,
  toggleSightline,
  toggleSightCircle,
  toggleShadow,
  toggleGlobeClip,
  toggleTerrainClip,
  clearAll,
} = useAnalysis()

// 格式化时间显示
function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// 更新阴影时间
function onTimeChange(e) {
  const [hours, minutes] = e.target.value.split(':')
  const newDate = new Date(shadowParams.time)
  newDate.setHours(parseInt(hours), parseInt(minutes))
  shadowParams.time = newDate
}
</script>

<template>
  <div class="analysis-demo">
    <!-- 可视域分析 -->
    <div class="demo-section">
      <div class="section-label">可视域分析</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: analysisState.viewshed }"
          @click="toggleViewshed"
        >
          👁️ 可视域
        </button>
      </div>

      <!-- 可视域参数 -->
      <div v-if="analysisState.viewshed" class="params-box">
        <div class="param-row">
          <label>可视距离 {{ viewshedParams.radius }}m</label>
          <input
            v-model.number="viewshedParams.radius"
            type="range"
            min="100"
            max="2000"
            step="50"
            class="slider"
          />
        </div>
        <div class="param-row">
          <label>视场角 {{ viewshedParams.fov }}°</label>
          <input
            v-model.number="viewshedParams.fov"
            type="range"
            min="10"
            max="120"
            step="5"
            class="slider"
          />
        </div>
        <div class="param-row">
          <label>宽高比 {{ viewshedParams.aspectRatio.toFixed(1) }}</label>
          <input
            v-model.number="viewshedParams.aspectRatio"
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            class="slider"
          />
        </div>
        <div class="param-row">
          <label>可见色</label>
          <input
            v-model="viewshedParams.visibleColor"
            type="color"
            class="color-input"
          />
        </div>
        <div class="param-row">
          <label>不可见色</label>
          <input
            v-model="viewshedParams.invisibleColor"
            type="color"
            class="color-input"
          />
        </div>
      </div>
    </div>

    <!-- 通视分析 -->
    <div class="demo-section">
      <div class="section-label">通视分析</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: analysisState.sightline }"
          @click="toggleSightline"
        >
          📍 通视线
        </button>
        <button
          class="toggle-btn"
          :class="{ active: analysisState.sightCircle }"
          @click="toggleSightCircle"
        >
          ⭕ 通视圆
        </button>
      </div>
    </div>

    <!-- 日照阴影分析 -->
    <div class="demo-section">
      <div class="section-label">日照阴影</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: analysisState.shadow }"
          @click="toggleShadow"
        >
          ☀️ 日照阴影
        </button>
      </div>

      <!-- 阴影参数 -->
      <div v-if="analysisState.shadow" class="params-box">
        <div class="param-row">
          <label>时间 {{ formatTime(shadowParams.time) }}</label>
          <input
            type="time"
            :value="shadowParams.time.toTimeString().slice(0, 5)"
            class="time-input"
            @change="onTimeChange"
          />
        </div>
        <div class="param-row">
          <label>时间倍率 {{ shadowParams.multiplier }}</label>
          <input
            v-model.number="shadowParams.multiplier"
            type="range"
            min="100"
            max="5000"
            step="100"
            class="slider"
          />
        </div>
      </div>
    </div>

    <!-- 裁剪分析 -->
    <div class="demo-section">
      <div class="section-label">裁剪分析</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: analysisState.globeClip }"
          @click="toggleGlobeClip"
        >
          🌍 地球裁剪
        </button>
        <button
          class="toggle-btn"
          :class="{ active: analysisState.terrainClip }"
          @click="toggleTerrainClip"
        >
          ⛰️ 地形裁剪
        </button>
      </div>

      <!-- 地形裁剪参数 -->
      <div v-if="analysisState.terrainClip" class="params-box">
        <div class="param-row">
          <label>裁剪深度 {{ clipParams.depth }}m</label>
          <input
            v-model.number="clipParams.depth"
            type="range"
            min="10"
            max="500"
            step="10"
            class="slider"
          />
        </div>
        <div class="param-row">
          <label>边缘颜色</label>
          <input
            v-model="clipParams.edgeColor"
            type="color"
            class="color-input"
          />
        </div>
      </div>
    </div>

    <!-- 清除按钮 -->
    <button v-if="hasAnyAnalysis" class="btn clear-btn" @click="clearAll">
      清除所有分析
    </button>
  </div>
</template>

<style scoped>
.analysis-demo {
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

.toggle-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.toggle-btn {
  padding: 6px 10px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.toggle-btn.active {
  background: rgba(0, 206, 209, 0.3);
  border-color: #00ced1;
  color: #00ced1;
}

.params-box {
  margin-top: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.param-row:last-child {
  margin-bottom: 0;
}

.param-row label {
  flex: 0 0 100px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

.checkbox-row label {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.checkbox-row input[type='checkbox'] {
  width: 14px;
  height: 14px;
  accent-color: #00ced1;
}

.slider {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: #00ced1;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #00ced1;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.color-input {
  width: 40px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: transparent;
  padding: 0;
}

.color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-input::-webkit-color-swatch {
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.time-input {
  padding: 4px 8px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  outline: none;
}

.time-input:focus {
  border-color: #00ced1;
}

.time-input::-webkit-calendar-picker-indicator {
  filter: invert(1);
}

.clear-btn {
  margin-top: 4px;
  padding: 8px 12px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(255, 100, 100, 0.2);
  border-color: rgba(255, 100, 100, 0.4);
  color: #ff6b6b;
}
</style>
