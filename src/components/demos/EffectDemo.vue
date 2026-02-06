<script setup>
import { useEffect } from '../../modules/effect/useEffect.js'

const {
  // 天气效果
  weatherState,
  rainParams,
  snowParams,
  toggleRain,
  toggleSnow,
  toggleFog,
  toggleCloud,
  clearWeather,

  // 后处理效果
  postProcessState,
  bloomParams,
  brightnessParams,
  toggleBloom,
  toggleNightVision,
  toggleBrightness,
  clearPostProcess,

  // 扫描效果
  scanState,
  scanParams,
  toggleCircleScan,
  toggleRadarScan,
  clearScans,
} = useEffect()
</script>

<template>
  <div class="effect-demo">
    <!-- 天气效果 -->
    <div class="demo-section">
      <div class="section-label">天气效果</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: weatherState.rain }"
          @click="toggleRain"
        >
          🌧️ 雨
        </button>
        <button
          class="toggle-btn"
          :class="{ active: weatherState.snow }"
          @click="toggleSnow"
        >
          ❄️ 雪
        </button>
        <button
          class="toggle-btn"
          :class="{ active: weatherState.fog }"
          @click="toggleFog"
        >
          🌫️ 雾
        </button>
        <button
          class="toggle-btn"
          :class="{ active: weatherState.cloud }"
          @click="toggleCloud"
        >
          ☁️ 云
        </button>
      </div>

      <!-- 雨参数 -->
      <div v-if="weatherState.rain" class="params-box">
        <div class="param-row">
          <label>速度 {{ rainParams.speed }}</label>
          <input
            v-model.number="rainParams.speed"
            type="range"
            min="1"
            max="20"
            step="1"
            class="slider"
          />
        </div>
      </div>

      <!-- 雪参数 -->
      <div v-if="weatherState.snow" class="params-box">
        <div class="param-row">
          <label>速度 {{ snowParams.speed }}</label>
          <input
            v-model.number="snowParams.speed"
            type="range"
            min="1"
            max="20"
            step="1"
            class="slider"
          />
        </div>
      </div>

      <button class="btn clear-btn" @click="clearWeather">清除天气</button>
    </div>

    <!-- 后处理效果 -->
    <div class="demo-section">
      <div class="section-label">后处理效果</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: postProcessState.bloom }"
          @click="toggleBloom"
        >
          ✨ Bloom
        </button>
        <button
          class="toggle-btn"
          :class="{ active: postProcessState.nightVision }"
          @click="toggleNightVision"
        >
          👁️ 夜视
        </button>
        <button
          class="toggle-btn"
          :class="{ active: postProcessState.brightness }"
          @click="toggleBrightness"
        >
          🔆 亮度
        </button>
      </div>

      <!-- Bloom 参数 -->
      <div v-if="postProcessState.bloom" class="params-box">
        <div class="param-row">
          <label>亮度 {{ bloomParams.brightness.toFixed(1) }}</label>
          <input
            v-model.number="bloomParams.brightness"
            type="range"
            min="0"
            max="3"
            step="0.1"
            class="slider"
          />
        </div>
        <div class="param-row">
          <label>对比度 {{ bloomParams.contrast }}</label>
          <input
            v-model.number="bloomParams.contrast"
            type="range"
            min="0"
            max="255"
            step="1"
            class="slider"
          />
        </div>
        <div class="param-row">
          <label>Sigma {{ bloomParams.sigma.toFixed(1) }}</label>
          <input
            v-model.number="bloomParams.sigma"
            type="range"
            min="1"
            max="10"
            step="0.1"
            class="slider"
          />
        </div>
      </div>

      <!-- 亮度参数 -->
      <div v-if="postProcessState.brightness" class="params-box">
        <div class="param-row">
          <label>强度 {{ brightnessParams.intensity.toFixed(1) }}</label>
          <input
            v-model.number="brightnessParams.intensity"
            type="range"
            min="0"
            max="3"
            step="0.1"
            class="slider"
          />
        </div>
      </div>

      <button class="btn clear-btn" @click="clearPostProcess">
        清除后处理
      </button>
    </div>

    <!-- 扫描效果 -->
    <div class="demo-section">
      <div class="section-label">扫描效果</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: scanState.circleScan }"
          @click="toggleCircleScan"
        >
          ⭕ 圆形扫描
        </button>
        <button
          class="toggle-btn"
          :class="{ active: scanState.radarScan }"
          @click="toggleRadarScan"
        >
          📡 雷达扫描
        </button>
      </div>

      <!-- 扫描参数 -->
      <div
        v-if="scanState.circleScan || scanState.radarScan"
        class="params-box"
      >
        <div class="param-row">
          <label>颜色</label>
          <input v-model="scanParams.color" type="color" class="color-input" />
        </div>
        <div class="param-row">
          <label>半径 {{ scanParams.radius }}m</label>
          <input
            v-model.number="scanParams.radius"
            type="range"
            min="1000"
            max="20000"
            step="500"
            class="slider"
          />
        </div>
        <div class="param-row">
          <label>速度 {{ scanParams.speed }}</label>
          <input
            v-model.number="scanParams.speed"
            type="range"
            min="1"
            max="30"
            step="1"
            class="slider"
          />
        </div>
      </div>

      <button class="btn clear-btn" @click="clearScans">清除扫描</button>
    </div>
  </div>
</template>

<style scoped>
.effect-demo {
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

.clear-btn {
  margin-top: 4px;
  padding: 6px 12px;
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
