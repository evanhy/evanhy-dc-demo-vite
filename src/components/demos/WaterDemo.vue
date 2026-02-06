<script setup>
import { watch } from 'vue'
import { useWater } from '../../modules/effect/useWater.js'

const {
  count,
  isLoading,
  waterParams,
  loadRiver,
  loadLake,
  loadAllWaters,
  updateRiverParams,
  clearWaters,
  flyToWaters,
} = useWater()

// 监听参数变化，实时更新河流效果
watch(
  () => ({ ...waterParams }),
  () => {
    updateRiverParams()
  },
  { deep: true },
)
</script>

<template>
  <div class="water-demo">
    <!-- 水面加载 -->
    <div class="demo-section">
      <div class="section-label">水面类型</div>
      <div class="btn-group">
        <button class="btn" :disabled="isLoading" @click="loadRiver()">
          河流
        </button>
        <button class="btn" :disabled="isLoading" @click="loadLake()">
          湖面
        </button>
        <button
          class="btn primary"
          :disabled="isLoading"
          @click="loadAllWaters()"
        >
          全部加载
        </button>
      </div>
    </div>

    <!-- 参数调节 -->
    <div class="demo-section">
      <div class="section-label">参数调节（河流）</div>

      <div class="param-row">
        <label>颜色</label>
        <input
          v-model="waterParams.baseWaterColor"
          type="color"
          class="color-input"
        />
      </div>

      <div class="param-row">
        <label>透明度 {{ waterParams.alpha.toFixed(2) }}</label>
        <input
          v-model.number="waterParams.alpha"
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          class="slider"
        />
      </div>

      <div class="param-row">
        <label>频率 {{ waterParams.frequency }}</label>
        <input
          v-model.number="waterParams.frequency"
          type="range"
          min="100"
          max="3000"
          step="100"
          class="slider"
        />
      </div>

      <div class="param-row">
        <label>动画速度 {{ waterParams.animationSpeed.toFixed(3) }}</label>
        <input
          v-model.number="waterParams.animationSpeed"
          type="range"
          min="0.001"
          max="0.1"
          step="0.002"
          class="slider"
        />
      </div>

      <div class="param-row">
        <label>振幅 {{ waterParams.amplitude }}</label>
        <input
          v-model.number="waterParams.amplitude"
          type="range"
          min="1"
          max="50"
          step="1"
          class="slider"
        />
      </div>

      <div class="param-row">
        <label>镜面反射 {{ waterParams.specularIntensity }}</label>
        <input
          v-model.number="waterParams.specularIntensity"
          type="range"
          min="1"
          max="30"
          step="1"
          class="slider"
        />
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="demo-section">
      <div class="section-label">操作</div>
      <div class="btn-group">
        <button class="btn" :disabled="count === 0" @click="flyToWaters">
          定位
        </button>
        <button class="btn" :disabled="count === 0" @click="clearWaters">
          清除
        </button>
      </div>
    </div>

    <!-- 状态信息 -->
    <div class="info-text">水面数量: {{ count }}</div>
  </div>
</template>

<style scoped>
.water-demo {
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

.param-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.param-row label {
  flex: 0 0 120px;
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
</style>
