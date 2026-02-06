import { ref, reactive, shallowRef, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewerStore } from '../../stores/viewer.js'
import { TerrainManager } from './TerrainManager.js'

/**
 * 地形 Composable
 * 提供地形相关功能的响应式封装
 */
export function useTerrain() {
  const viewerStore = useViewerStore()
  const { viewer, isReady } = storeToRefs(viewerStore)

  const manager = shallowRef(null)
  const isLoading = ref(false)
  const message = ref(null)
  const currentType = ref('ellipsoid')

  // 地形设置
  const terrainSettings = reactive({
    exaggeration: 1,
    depthTest: true,
    lighting: false,
  })

  // 自定义地形 URL
  const customTerrainUrl = ref('')

  // 监听 viewer 就绪
  watch(
    isReady,
    (ready) => {
      if (ready && viewer.value && !manager.value) {
        manager.value = new TerrainManager(viewer.value)
      }
    },
    { immediate: true },
  )

  // 监听地形设置变化
  watch(
    () => terrainSettings.exaggeration,
    (val) => {
      if (manager.value) {
        manager.value.setTerrainExaggeration(val)
      }
    },
  )

  watch(
    () => terrainSettings.depthTest,
    (val) => {
      if (manager.value) {
        manager.value.setDepthTest(val)
      }
    },
  )

  watch(
    () => terrainSettings.lighting,
    (val) => {
      if (manager.value) {
        manager.value.setTerrainLighting(val)
      }
    },
  )

  /**
   * 设置椭球地形
   */
  function setEllipsoid() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }
    const success = manager.value.setEllipsoid()
    if (success) {
      currentType.value = 'ellipsoid'
      message.value = { type: 'success', text: '已切换到椭球地形' }
    }
  }

  /**
   * 设置 Cesium World Terrain
   */
  async function setCesiumTerrain() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }
    isLoading.value = true
    message.value = null
    try {
      const success = await manager.value.setCesiumTerrain()
      if (success) {
        currentType.value = 'cesium'
        message.value = { type: 'success', text: '已加载 Cesium 全球地形' }
      } else {
        message.value = { type: 'error', text: '加载 Cesium 地形失败' }
      }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 设置自定义 URL 地形
   */
  async function setUrlTerrain() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }
    if (!customTerrainUrl.value) {
      message.value = { type: 'error', text: '请输入地形服务 URL' }
      return
    }
    isLoading.value = true
    message.value = null
    try {
      const success = await manager.value.setUrlTerrain(customTerrainUrl.value)
      if (success) {
        currentType.value = 'url'
        message.value = { type: 'success', text: '已加载自定义地形' }
      } else {
        message.value = { type: 'error', text: '加载自定义地形失败' }
      }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 设置 ArcGIS 地形
   */
  async function setArcGISTerrain() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }
    isLoading.value = true
    message.value = null
    try {
      const success = await manager.value.setArcGISTerrain()
      if (success) {
        currentType.value = 'arcgis'
        message.value = { type: 'success', text: '已加载 ArcGIS 全球地形' }
      } else {
        message.value = { type: 'error', text: '加载 ArcGIS 地形失败' }
      }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 飞行到山区查看地形效果
   */
  function flyToMountain() {
    if (!manager.value) return
    // 飞到珠穆朗玛峰附近
    manager.value.flyTo({
      lng: 86.925,
      lat: 27.988,
      alt: 15000,
      heading: 0,
      pitch: -30,
    })
    message.value = { type: 'info', text: '正在飞往珠穆朗玛峰...' }
  }

  /**
   * 飞行到大峡谷
   */
  function flyToGrandCanyon() {
    if (!manager.value) return
    manager.value.flyTo({
      lng: -112.1129,
      lat: 36.0544,
      alt: 8000,
      heading: 0,
      pitch: -45,
    })
    message.value = { type: 'info', text: '正在飞往大峡谷...' }
  }

  // 组件卸载时销毁
  onUnmounted(() => {
    if (manager.value) {
      manager.value.destroy()
      manager.value = null
    }
  })

  return {
    manager,
    isLoading,
    message,
    currentType,
    terrainSettings,
    customTerrainUrl,
    setEllipsoid,
    setCesiumTerrain,
    setUrlTerrain,
    setArcGISTerrain,
    flyToMountain,
    flyToGrandCanyon,
  }
}
