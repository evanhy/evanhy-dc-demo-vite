<script setup>
import { useBaseApi } from '../../modules/baseApi/useBaseApi.js'

const {
  // 状态
  sceneMode,
  widgetState,
  navControlState,
  renderSettings,
  flyParams,
  viewerInfo,

  // 场景模式
  changeSceneMode,

  // 小部件
  togglePopup,
  toggleTooltip,
  toggleContextMenu,
  toggleLoadingMask,

  // 导航控件
  toggleCompass,
  toggleZoomController,
  toggleLocationBar,
  toggleDistanceLegend,

  // 分割功能
  splitState,
  toggleMapSplit,

  // 天空盒
  skyBoxState,
  groundSkyBoxParams,
  toggleSkyBox,
  toggleGroundSkyBox,

  // 飞行
  flyToPosition,
  flyToPreset,
} = useBaseApi()
</script>

<template>
  <div class="base-api-demo">
    <!-- 场景模式 -->
    <div class="demo-section">
      <div class="section-label">场景模式</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: sceneMode === '3D' }"
          @click="changeSceneMode('3D')"
        >
          3D
        </button>
        <button
          class="toggle-btn"
          :class="{ active: sceneMode === '2.5D' }"
          @click="changeSceneMode('2.5D')"
        >
          2.5D
        </button>
        <button
          class="toggle-btn"
          :class="{ active: sceneMode === '2D' }"
          @click="changeSceneMode('2D')"
        >
          2D
        </button>
      </div>
    </div>

    <!-- 小部件控制 -->
    <div class="demo-section">
      <div class="section-label">小部件</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: widgetState.popup }"
          @click="togglePopup"
        >
          Popup
        </button>
        <button
          class="toggle-btn"
          :class="{ active: widgetState.tooltip }"
          @click="toggleTooltip"
        >
          Tooltip
        </button>
        <button
          class="toggle-btn"
          :class="{ active: widgetState.contextMenu }"
          @click="toggleContextMenu"
        >
          右键菜单
        </button>
        <button
          class="toggle-btn"
          :class="{ active: widgetState.loadingMask }"
          @click="toggleLoadingMask"
        >
          加载蒙层
        </button>
      </div>
    </div>

    <!-- 导航控件 -->
    <div class="demo-section">
      <div class="section-label">导航控件</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: navControlState.compass }"
          @click="toggleCompass"
        >
          罗盘
        </button>
        <button
          class="toggle-btn"
          :class="{ active: navControlState.zoomController }"
          @click="toggleZoomController"
        >
          缩放
        </button>
        <button
          class="toggle-btn"
          :class="{ active: navControlState.locationBar }"
          @click="toggleLocationBar"
        >
          坐标栏
        </button>
        <button
          class="toggle-btn"
          :class="{ active: navControlState.distanceLegend }"
          @click="toggleDistanceLegend"
        >
          比例尺
        </button>
      </div>
    </div>

    <!-- 地图分割 -->
    <div class="demo-section">
      <div class="section-label">地图分割</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: splitState.mapSplit }"
          @click="toggleMapSplit"
        >
          卷帘对比
        </button>
      </div>
    </div>

    <!-- 天空盒 -->
    <div class="demo-section">
      <div class="section-label">天空盒</div>
      <div class="toggle-group">
        <button
          class="toggle-btn"
          :class="{ active: skyBoxState.skyBox }"
          @click="toggleSkyBox"
        >
          标准天空盒
        </button>
        <button
          class="toggle-btn"
          :class="{ active: skyBoxState.groundSkyBox }"
          @click="toggleGroundSkyBox"
        >
          近地天空盒
        </button>
      </div>

      <!-- 近地天空盒参数 -->
      <div v-if="skyBoxState.groundSkyBox" class="params-box">
        <div class="param-row">
          <label>旋转角度 {{ groundSkyBoxParams.offsetAngle }}°</label>
          <input
            v-model.number="groundSkyBoxParams.offsetAngle"
            type="range"
            min="0"
            max="360"
            step="5"
            class="slider"
          />
        </div>
      </div>
    </div>

    <!-- 渲染设置 -->
    <div class="demo-section">
      <div class="section-label">渲染设置</div>
      <div class="params-box">
        <div class="param-row checkbox-row">
          <label>
            <input v-model="renderSettings.shadows" type="checkbox" />
            阴影
          </label>
        </div>
        <div class="param-row checkbox-row">
          <label>
            <input v-model="renderSettings.fxaa" type="checkbox" />
            抗锯齿 (FXAA)
          </label>
        </div>
        <div class="param-row checkbox-row">
          <label>
            <input v-model="renderSettings.depthTest" type="checkbox" />
            深度检测
          </label>
        </div>
        <div class="param-row">
          <label
            >地形夸大 {{ renderSettings.terrainExaggeration.toFixed(1) }}</label
          >
          <input
            v-model.number="renderSettings.terrainExaggeration"
            type="range"
            min="1"
            max="10"
            step="0.5"
            class="slider"
          />
        </div>
      </div>
    </div>

    <!-- 快速定位 -->
    <div class="demo-section">
      <div class="section-label">快速定位</div>
      <div class="toggle-group">
        <button class="fly-btn" @click="flyToPreset('suzhou')">苏州</button>
        <button class="fly-btn" @click="flyToPreset('beijing')">北京</button>
        <button class="fly-btn" @click="flyToPreset('shanghai')">上海</button>
        <button class="fly-btn" @click="flyToPreset('guangzhou')">广州</button>
      </div>

      <div class="params-box" style="margin-top: 8px">
        <div class="param-row">
          <label>经度</label>
          <input
            v-model.number="flyParams.lng"
            type="number"
            step="0.01"
            class="coord-input"
          />
        </div>
        <div class="param-row">
          <label>纬度</label>
          <input
            v-model.number="flyParams.lat"
            type="number"
            step="0.01"
            class="coord-input"
          />
        </div>
        <div class="param-row">
          <label>高度 {{ flyParams.alt.toLocaleString() }}m</label>
          <input
            v-model.number="flyParams.alt"
            type="range"
            min="1000"
            max="500000"
            step="1000"
            class="slider"
          />
        </div>
        <button class="btn primary" @click="flyToPosition">飞行到该位置</button>
      </div>
    </div>

    <!-- Viewer 信息 -->
    <div class="demo-section">
      <div class="section-label">Viewer 信息</div>
      <div class="info-box">
        <div class="info-row">
          <span class="info-label">相机位置:</span>
          <span class="info-value">
            {{ viewerInfo.cameraPosition.lng }},
            {{ viewerInfo.cameraPosition.lat }},
            {{ viewerInfo.cameraPosition.alt }}m
          </span>
        </div>
        <div class="info-row">
          <span class="info-label">分辨率:</span>
          <span class="info-value">{{ viewerInfo.resolution }} m/px</span>
        </div>
        <div class="info-row">
          <span class="info-label">缩放级别:</span>
          <span class="info-value">{{ viewerInfo.zoom }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.base-api-demo {
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
  background: rgba(64, 158, 255, 0.2);
  border-color: rgba(64, 158, 255, 0.4);
  color: #409eff;
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

.coord-input {
  flex: 1;
  padding: 4px 8px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: white;
  outline: none;
}

.coord-input:focus {
  border-color: #00ced1;
}

.btn.primary {
  margin-top: 8px;
  width: 100%;
  padding: 8px 12px;
  font-size: 12px;
  background: rgba(0, 206, 209, 0.3);
  border: 1px solid #00ced1;
  border-radius: 4px;
  color: #00ced1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.primary:hover {
  background: rgba(0, 206, 209, 0.5);
}

.info-box {
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-family: 'Monaco', 'Consolas', monospace;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 11px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-label {
  flex: 0 0 70px;
  color: rgba(255, 255, 255, 0.5);
}

.info-value {
  color: #00ced1;
}
</style>
