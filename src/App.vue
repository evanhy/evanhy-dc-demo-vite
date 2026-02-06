<script setup>
import MapContainer from './map/MapContainer.vue'
import ControlPanel from './components/ControlPanel.vue'
import PanelSection from './components/PanelSection.vue'
import BaseApiDemo from './components/demos/BaseApiDemo.vue'
import MarkerDemo from './components/demos/MarkerDemo.vue'
import PolygonDemo from './components/demos/PolygonDemo.vue'
import WaterDemo from './components/demos/WaterDemo.vue'
import EffectDemo from './components/demos/EffectDemo.vue'
import TerrainDemo from './components/demos/TerrainDemo.vue'
import AnalysisDemo from './components/demos/AnalysisDemo.vue'
</script>

<template>
  <div class="app">
    <MapContainer>
      <ControlPanel>
        <PanelSection title="基础 API" icon="🔧" :default-expanded="true">
          <BaseApiDemo />
        </PanelSection>

        <PanelSection title="点位加载" icon="📍">
          <MarkerDemo />
        </PanelSection>

        <PanelSection title="面加载" icon="⬡">
          <PolygonDemo />
        </PanelSection>

        <PanelSection title="水动力效果" icon="💧">
          <WaterDemo />
        </PanelSection>

        <PanelSection title="天气特效" icon="🌦️">
          <EffectDemo />
        </PanelSection>

        <PanelSection title="地形控制" icon="🏔️">
          <TerrainDemo />
        </PanelSection>

        <PanelSection title="空间分析" icon="📊">
          <AnalysisDemo />
        </PanelSection>
      </ControlPanel>
    </MapContainer>
  </div>
</template>

<style scoped>
.app {
  width: 100%;
  height: 100%;
}
</style>
