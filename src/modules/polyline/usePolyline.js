import { ref, shallowRef, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewerStore } from '../../stores/viewer.js'
import { PolylineManager } from './PolylineManager.js'

/**
 * 折线管理 Composable
 * 提供响应式的折线操作
 */
export function usePolyline() {
  const viewerStore = useViewerStore()
  const { viewer, isReady } = storeToRefs(viewerStore)

  const manager = shallowRef(null)
  const count = ref(0)
  const isLoading = ref(false)
  const message = ref(null)

  // 当 viewer 就绪时初始化 manager
  watch(
    isReady,
    (ready) => {
      if (ready && viewer.value && !manager.value) {
        manager.value = new PolylineManager(viewer.value)
      }
    },
    { immediate: true },
  )

  /**
   * 生成示例折线坐标
   * @param {object} start - 起点 { lng, lat }
   * @param {number} [points=5] - 点数
   * @param {number} [step=0.02] - 步长（度）
   * @returns {Array} 坐标数组
   */
  function generatePolylineCoords(start, points = 5, step = 0.02) {
    const coords = []
    for (let i = 0; i < points; i++) {
      coords.push([start.lng + i * step, start.lat + Math.sin(i) * step, 0])
    }
    return coords
  }

  /**
   * 加载普通折线示例
   */
  function loadNormalPolyline() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addPolyline({
        positions: generatePolylineCoords({ lng: 120.55, lat: 31.32 }),
        color: '#409eff',
        width: 4,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载普通折线' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载发光折线示例
   */
  function loadGlowPolyline() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addGlowPolyline({
        positions: generatePolylineCoords({ lng: 120.55, lat: 31.3 }),
        color: '#67c23a',
        width: 10,
        glowPower: 0.3,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载发光折线' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载箭头折线示例
   */
  function loadArrowPolyline() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addArrowPolyline({
        positions: generatePolylineCoords({ lng: 120.55, lat: 31.28 }),
        color: '#e6a23c',
        width: 12,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载箭头折线' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载虚线折线示例
   */
  function loadDashPolyline() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addDashPolyline({
        positions: generatePolylineCoords({ lng: 120.55, lat: 31.26 }),
        color: '#f56c6c',
        width: 4,
        dashLength: 20,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载虚线折线' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载流动折线示例
   */
  function loadFlowPolyline() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addFlowPolyline({
        positions: generatePolylineCoords({ lng: 120.55, lat: 31.24 }),
        color: '#9b59b6',
        width: 6,
        speed: 8,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载流动折线' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载所有示例折线
   */
  function loadAllPolylines() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      // 普通折线
      manager.value.addPolyline({
        positions: generatePolylineCoords({ lng: 120.55, lat: 31.34 }),
        color: '#409eff',
        width: 4,
      })

      // 发光折线
      manager.value.addGlowPolyline({
        positions: generatePolylineCoords({ lng: 120.55, lat: 31.31 }),
        color: '#67c23a',
        width: 10,
      })

      // 箭头折线
      manager.value.addArrowPolyline({
        positions: generatePolylineCoords({ lng: 120.55, lat: 31.28 }),
        color: '#e6a23c',
        width: 12,
      })

      // 虚线折线
      manager.value.addDashPolyline({
        positions: generatePolylineCoords({ lng: 120.55, lat: 31.25 }),
        color: '#f56c6c',
        width: 4,
      })

      count.value = manager.value.getCount()
      message.value = {
        type: 'success',
        text: `成功加载 ${count.value} 条折线`,
      }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 清除所有折线
   */
  function clearPolylines() {
    if (!manager.value) return
    manager.value.clear()
    count.value = 0
  }

  /**
   * 飞行定位到折线范围
   */
  function flyToPolylines() {
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
    loadNormalPolyline,
    loadGlowPolyline,
    loadArrowPolyline,
    loadDashPolyline,
    loadFlowPolyline,
    loadAllPolylines,
    clearPolylines,
    flyToPolylines,
  }
}
