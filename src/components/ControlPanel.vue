<script setup>
import { ref } from 'vue'

const isCollapsed = ref(false)

function togglePanel() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="control-panel" :class="{ collapsed: isCollapsed }">
    <!-- 折叠切换按钮 -->
    <button class="toggle-btn" @click="togglePanel">
      {{ isCollapsed ? '▶' : '◀' }}
    </button>

    <!-- 面板内容 -->
    <div class="panel-content">
      <div class="panel-header">
        <h2>功能演示</h2>
      </div>
      <div class="panel-body">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.control-panel {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 300px;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  z-index: 100;
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.control-panel.collapsed {
  transform: translateX(-300px);
}

.toggle-btn {
  position: absolute;
  right: -32px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 64px;
  background: rgba(0, 0, 0, 0.85);
  border: none;
  color: #fff;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  font-size: 14px;
}

.toggle-btn:hover {
  background: rgba(50, 50, 50, 0.9);
}

.panel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

/* 自定义滚动条 */
.panel-body::-webkit-scrollbar {
  width: 6px;
}

.panel-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.panel-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.panel-body::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
