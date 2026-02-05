<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  defaultExpanded: {
    type: Boolean,
    default: false,
  },
})

const isExpanded = ref(props.defaultExpanded)

function toggle() {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="panel-section" :class="{ expanded: isExpanded }">
    <div class="section-header" @click="toggle">
      <span v-if="icon" class="section-icon">{{ icon }}</span>
      <span class="section-title">{{ title }}</span>
      <span class="section-arrow">{{ isExpanded ? '▼' : '▶' }}</span>
    </div>
    <div v-show="isExpanded" class="section-content">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.panel-section {
  margin-bottom: 4px;
  border-radius: 4px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.section-header:hover {
  background: rgba(255, 255, 255, 0.1);
}

.section-icon {
  margin-right: 8px;
  font-size: 16px;
}

.section-title {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
}

.section-arrow {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
  transition: transform 0.2s;
}

.section-content {
  padding: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
