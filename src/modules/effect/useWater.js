import { ref, reactive, shallowRef, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewerStore } from '../../stores/viewer.js'
import { WaterManager } from './WaterManager.js'

/**
 * 水面效果管理 Composable
 * 提供响应式的水面操作
 */
export function useWater() {
  const viewerStore = useViewerStore()
  const { viewer, isReady } = storeToRefs(viewerStore)

  const manager = shallowRef(null)
  const count = ref(0)
  const isLoading = ref(false)
  const message = ref(null)

  // 水面参数（响应式）
  const waterParams = reactive({
    baseWaterColor: '#00CED1',
    alpha: 0.4,
    frequency: 1000,
    animationSpeed: 0.02,
    amplitude: 10,
    specularIntensity: 8,
  })

  // 当 viewer 就绪时初始化 manager
  watch(
    isReady,
    (ready) => {
      if (ready && viewer.value && !manager.value) {
        manager.value = new WaterManager(viewer.value)
      }
    },
    { immediate: true },
  )

  /**
   * 生成河流型水面坐标
   * @param {object} center - 中心点 { lng, lat }
   * @returns {Array} 坐标数组
   */
  function generateRiverCoords(center) {
    const { lng, lat } = center
    // 生成一条弯曲的河流形状
    return [
      [lng - 0.03, lat - 0.01],
      [lng - 0.02, lat - 0.012],
      [lng - 0.01, lat - 0.008],
      [lng, lat - 0.01],
      [lng + 0.01, lat - 0.005],
      [lng + 0.02, lat - 0.008],
      [lng + 0.03, lat - 0.01],
      [lng + 0.03, lat + 0.005],
      [lng + 0.02, lat + 0.003],
      [lng + 0.01, lat + 0.008],
      [lng, lat + 0.005],
      [lng - 0.01, lat + 0.01],
      [lng - 0.02, lat + 0.005],
      [lng - 0.03, lat + 0.008],
    ]
  }

  /**
   * 生成湖面型水面坐标
   * @param {object} center - 中心点 { lng, lat }
   * @param {number} [radius=0.02] - 半径（度）
   * @returns {Array} 坐标数组
   */
  function generateLakeCoords(center, radius = 0.02) {
    const { lng, lat } = center
    const coords = []
    const segments = 32

    for (let i = 0; i < segments; i++) {
      const angle = (Math.PI * 2 * i) / segments
      // 添加一些随机扰动使湖面更自然
      const r = radius * (0.9 + Math.random() * 0.2)
      coords.push([lng + r * Math.cos(angle), lat + r * Math.sin(angle) * 0.7])
    }

    return coords
  }

  /**
   * 加载河流示例
   * @param {object} [center] - 中心点
   */
  function loadRiver(center = { lng: 120.62, lat: 31.32 }) {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addWater({
        id: 'river-demo',
        positions: generateRiverCoords(center),
        baseWaterColor: waterParams.baseWaterColor,
        alpha: waterParams.alpha,
        frequency: waterParams.frequency,
        animationSpeed: waterParams.animationSpeed,
        amplitude: waterParams.amplitude,
        specularIntensity: waterParams.specularIntensity,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载河流水面' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载湖面示例
   * @param {object} [center] - 中心点
   */
  function loadLake(center = { lng: 120.58, lat: 31.28 }) {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addWater({
        id: 'lake-demo',
        positions: generateLakeCoords(center, 0.025),
        baseWaterColor: '#1E90FF',
        alpha: 0.5,
        frequency: 800,
        animationSpeed: 0.008,
        amplitude: 5,
        specularIntensity: 12,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载湖面水面' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载所有水面示例
   */
  function loadAllWaters() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      // 河流
      manager.value.addWater({
        id: 'river-1',
        positions: generateRiverCoords({ lng: 120.62, lat: 31.32 }),
        baseWaterColor: '#00CED1',
        alpha: 0.4,
        frequency: 1000,
        animationSpeed: 0.02,
        amplitude: 10,
        specularIntensity: 8,
      })

      // 湖面
      manager.value.addWater({
        id: 'lake-1',
        positions: generateLakeCoords({ lng: 120.58, lat: 31.28 }, 0.025),
        baseWaterColor: '#1E90FF',
        alpha: 0.5,
        frequency: 800,
        animationSpeed: 0.008,
        amplitude: 5,
        specularIntensity: 12,
      })

      // 小池塘
      manager.value.addWater({
        id: 'pond-1',
        positions: generateLakeCoords({ lng: 120.65, lat: 31.3 }, 0.012),
        baseWaterColor: '#40E0D0',
        alpha: 0.6,
        frequency: 1200,
        animationSpeed: 0.015,
        amplitude: 3,
        specularIntensity: 6,
      })

      count.value = manager.value.getCount()
      message.value = {
        type: 'success',
        text: `成功加载 ${count.value} 个水面`,
      }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新河流水面参数
   */
  function updateRiverParams() {
    if (!manager.value) return

    manager.value.updateWaterStyle('river-demo', {
      baseWaterColor: waterParams.baseWaterColor,
      alpha: waterParams.alpha,
      frequency: waterParams.frequency,
      animationSpeed: waterParams.animationSpeed,
      amplitude: waterParams.amplitude,
      specularIntensity: waterParams.specularIntensity,
    })
  }

  /**
   * 清除所有水面
   */
  function clearWaters() {
    if (!manager.value) return
    manager.value.clear()
    count.value = 0
  }

  /**
   * 飞行定位到水面范围
   */
  function flyToWaters() {
    if (!manager.value) return
    manager.value.flyToExtent()
  }

  // 组件卸载时销毁 manager
  onUnmounted(() => {
    if (manager.value) {
      manager.value.destroy()
      manager.value = null
    }
  })

  return {
    manager,
    count,
    isLoading,
    message,
    waterParams,
    loadRiver,
    loadLake,
    loadAllWaters,
    updateRiverParams,
    clearWaters,
    flyToWaters,
  }
}
