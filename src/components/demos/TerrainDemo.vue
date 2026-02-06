<script setup>
import { useTerrain } from '../../modules/terrain/useTerrain.js'

const {
  isLoading,
  currentType,
  terrainSettings,
  customTerrainUrl,
  setEllipsoid,
  setCesiumTerrain,
  setArcGISTerrain,
  setUrlTerrain,
  flyToMountain,
  flyToGrandCanyon,
} = useTerrain()
</script>

<template>
  <div class="terrain-demo">
    <!-- 地形类型切换 -->
    <div class="demo-section">
      <div class="section-label">地形类型</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: currentType === 'ellipsoid' }"
          :disabled="isLoading"
          @click="setEllipsoid"
        >
          🌐 椭球
        </button>
        <button
          class="toggle-btn"
          :class="{ active: currentType === 'cesium' }"
          :disabled="isLoading"
          @click="setCesiumTerrain"
        >
          🏔️ Cesium
        </button>
        <button
          class="toggle-btn"
          :class="{ active: currentType === 'arcgis' }"
          :disabled="isLoading"
          @click="setArcGISTerrain"
        >
          🗺️ ArcGIS
        </button>
      </div>

      <!-- 自定义地形 URL -->
      <div class="url-input-group">
        <input
          v-model="customTerrainUrl"
          type="text"
          placeholder="输入自定义地形服务 URL..."
          class="url-input"
          :disabled="isLoading"
        />
        <button
          class="btn load-btn"
          :disabled="isLoading || !customTerrainUrl"
          @click="setUrlTerrain"
        >
          加载
        </button>
      </div>

      <div v-if="isLoading" class="loading-text">加载中...</div>
    </div>

    <!-- 地形设置 -->
    <div class="demo-section">
      <div class="section-label">地形设置</div>
      <div class="params-box">
        <div class="param-row">
          <label>夸张系数 {{ terrainSettings.exaggeration.toFixed(1) }}</label>
          <input
            v-model.number="terrainSettings.exaggeration"
            type="range"
            min="1"
            max="10"
            step="0.5"
            class="slider"
          />
        </div>
        <div class="param-row checkbox-row">
          <label>
            <input v-model="terrainSettings.depthTest" type="checkbox" />
            深度测试
          </label>
        </div>
        <div class="param-row checkbox-row">
          <label>
            <input v-model="terrainSettings.lighting" type="checkbox" />
            地形光照
          </label>
        </div>
      </div>
    </div>

    <!-- 快速定位 -->
    <div class="demo-section">
      <div class="section-label">快速定位</div>
      <div class="toggle-group">
        <button class="btn fly-btn" @click="flyToMountain">🏔️ 珠峰</button>
        <button class="btn fly-btn" @click="flyToGrandCanyon">🏜️ 大峡谷</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terrain-demo {
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

.toggle-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.toggle-btn.active {
  background: rgba(0, 206, 209, 0.3);
  border-color: #00ced1;
  color: #00ced1;
}

.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.url-input-group {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}

.url-input {
  flex: 1;
  padding: 6px 10px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  outline: none;
}

.url-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.url-input:focus {
  border-color: #00ced1;
}

.load-btn {
  padding: 6px 12px;
  font-size: 12px;
  background: rgba(0, 206, 209, 0.3);
  border: 1px solid #00ced1;
  border-radius: 4px;
  color: #00ced1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.load-btn:hover:not(:disabled) {
  background: rgba(0, 206, 209, 0.5);
}

.load-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-text {
  font-size: 12px;
  color: #00ced1;
  margin-top: 4px;
}

.params-box {
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
  flex: 0 0 120px;
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

.fly-btn {
  padding: 6px 12px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.2s ease;
}

.fly-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}
</style>
