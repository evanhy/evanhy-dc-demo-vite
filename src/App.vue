<script setup>
import MapContainer from './map/MapContainer.vue'
import ControlPanel from './components/ControlPanel.vue'
import PanelSection from './components/PanelSection.vue'
import MarkerDemo from './components/demos/MarkerDemo.vue'
</script>

<template>
  <div class="app">
    <MapContainer>
      <ControlPanel>
        <PanelSection title="点位加载" icon="📍" :default-expanded="true">
          <MarkerDemo />
        </PanelSection>

        <PanelSection title="面加载" icon="⬡">
          <p class="placeholder-text">即将实现...</p>
        </PanelSection>

        <PanelSection title="水动力效果" icon="💧">
          <p class="placeholder-text">即将实现...</p>
        </PanelSection>

        <PanelSection title="天气特效" icon="🌦️">
          <p class="placeholder-text">即将实现...</p>
        </PanelSection>

        <PanelSection title="空间分析" icon="📊">
          <p class="placeholder-text">即将实现...</p>
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

.placeholder-text {
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
  margin: 0;
}
</style>
