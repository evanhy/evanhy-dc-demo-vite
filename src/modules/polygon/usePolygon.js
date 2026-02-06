import { ref, shallowRef, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewerStore } from '../../stores/viewer.js'
import { PolygonManager } from './PolygonManager.js'

/**
 * 多边形管理 Composable
 * 提供响应式的多边形操作
 */
export function usePolygon() {
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
        manager.value = new PolygonManager(viewer.value)
      }
    },
    { immediate: true },
  )

  /**
   * 生成示例多边形坐标（六边形）
   * @param {object} center - 中心点 { lng, lat }
   * @param {number} [radius=0.02] - 半径（度）
   * @returns {Array} 坐标数组
   */
  function generateHexagon(center, radius = 0.02) {
    const coords = []
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i
      coords.push([
        center.lng + radius * Math.cos(angle),
        center.lat + radius * Math.sin(angle),
      ])
    }
    return coords
  }

  /**
   * 生成示例多边形坐标（矩形）
   * @param {object} center - 中心点 { lng, lat }
   * @param {number} [width=0.03] - 宽度（度）
   * @param {number} [height=0.02] - 高度（度）
   * @returns {Array} 坐标数组
   */
  function generateRectangle(center, width = 0.03, height = 0.02) {
    const halfW = width / 2
    const halfH = height / 2
    return [
      [center.lng - halfW, center.lat - halfH],
      [center.lng + halfW, center.lat - halfH],
      [center.lng + halfW, center.lat + halfH],
      [center.lng - halfW, center.lat + halfH],
    ]
  }

  /**
   * 加载普通多边形示例
   * @param {object} [center] - 中心点
   */
  function loadNormalPolygon(center = { lng: 120.62, lat: 31.3 }) {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addPolygon({
        positions: generateHexagon(center),
        color: '#409eff',
        alpha: 0.6,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载普通多边形' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载拉伸多边形示例
   * @param {object} [center] - 中心点
   */
  function loadExtrudedPolygon(center = { lng: 120.65, lat: 31.3 }) {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addExtrudedPolygon({
        positions: generateRectangle(center),
        height: 500,
        color: '#67c23a',
        alpha: 0.8,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载拉伸多边形' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载圆形示例
   * @param {object} [center] - 中心点
   */
  function loadCircle(center = { lng: 120.59, lat: 31.3 }) {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      manager.value.addCircle({
        lng: center.lng,
        lat: center.lat,
        radius: 1500,
        color: '#e6a23c',
        alpha: 0.6,
      })
      count.value = manager.value.getCount()
      message.value = { type: 'success', text: '成功加载圆形' }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载所有示例多边形
   */
  function loadAllPolygons() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    isLoading.value = true
    message.value = null
    try {
      // 普通多边形
      manager.value.addPolygon({
        positions: generateHexagon({ lng: 120.6, lat: 31.32 }),
        color: '#409eff',
        alpha: 0.6,
      })

      // 拉伸多边形
      manager.value.addExtrudedPolygon({
        positions: generateRectangle({ lng: 120.64, lat: 31.32 }),
        height: 500,
        color: '#67c23a',
        alpha: 0.8,
      })

      // 圆形
      manager.value.addCircle({
        lng: 120.62,
        lat: 31.28,
        radius: 1200,
        color: '#e6a23c',
        alpha: 0.6,
      })

      // 半透明多边形
      manager.value.addPolygon({
        positions: generateHexagon({ lng: 120.58, lat: 31.28 }, 0.025),
        color: '#f56c6c',
        alpha: 0.3,
      })

      count.value = manager.value.getCount()
      message.value = {
        type: 'success',
        text: `成功加载 ${count.value} 个多边形`,
      }
    } catch (e) {
      message.value = { type: 'error', text: `加载失败: ${e.message}` }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 清除所有多边形
   */
  function clearPolygons() {
    if (!manager.value) return
    manager.value.clear()
    count.value = 0
  }

  /**
   * 飞行定位到多边形范围
   */
  function flyToPolygons() {
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
    loadNormalPolygon,
    loadExtrudedPolygon,
    loadCircle,
    loadAllPolygons,
    clearPolygons,
    flyToPolygons,
  }
}
