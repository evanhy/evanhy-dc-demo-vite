import { ref, shallowRef, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewerStore } from '../../stores/viewer.js'
import { MarkerManager } from './MarkerManager.js'

/**
 * 点位管理 Composable
 * 提供响应式的点位操作
 */
export function useMarker() {
  const viewerStore = useViewerStore()
  const { viewer, isReady } = storeToRefs(viewerStore)

  const manager = shallowRef(null)
  const count = ref(0)
  const isLoading = ref(false)
  const message = ref(null) // { type: 'success' | 'error', text: string }

  // 当 viewer 就绪时初始化 manager
  watch(
    isReady,
    (ready) => {
      if (ready && viewer.value && !manager.value) {
        manager.value = new MarkerManager(viewer.value)
      }
    },
    { immediate: true },
  )

  /**
   * 生成随机点位数据
   * @param {number} num - 点位数量
   * @param {object} center - 中心点 { lng, lat }
   * @param {number} [range=0.5] - 随机范围（度）
   * @returns {Array} 点位数据数组
   */
  function generateRandomMarkers(num, center, range = 0.5) {
    const markers = []
    for (let i = 0; i < num; i++) {
      markers.push({
        lng: center.lng + (Math.random() - 0.5) * range * 2,
        lat: center.lat + (Math.random() - 0.5) * range * 2,
        alt: 0,
        label: `点位 ${i + 1}`,
      })
    }
    return markers
  }

  /**
   * 加载随机 Billboard 点位
   * @param {number} num - 数量
   * @param {object} [center] - 中心点
   */
  function loadRandomBillboards(num, center = { lng: 120.62, lat: 31.3 }) {
    if (!manager.value) {
      message.value = {
        type: 'error',
        text: 'Viewer 未就绪，无法加载 Billboard 点位',
      }

      console.log('🚀 ~ ', message.value)
      return
    }

    isLoading.value = true
    message.value = null
    try {
      const data = generateRandomMarkers(num, center)

      // 使用默认图标
      const markersWithIcon = data.map((item) => ({
        ...item,
        icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        scale: 0.8,
      }))

      manager.value.addMarkers(markersWithIcon, 'billboard')
      count.value = manager.value.getCount()
      message.value = {
        type: 'success',
        text: `成功加载 ${num} 个 Billboard 点位`,
      }
      console.log('🚀 ~ ', message.value)
    } catch (e) {
      message.value = {
        type: 'error',
        text: `加载 Billboard 点位失败: ${e.message}`,
      }
      console.log('🚀 ~ ', message.value)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 加载随机 Point 点位
   * @param {number} num - 数量
   * @param {object} [center] - 中心点
   */
  function loadRandomPoints(num, center = { lng: 120.62, lat: 31.3 }) {
    if (!manager.value) {
      message.value = {
        type: 'error',
        text: 'Viewer 未就绪，无法加载 Point 点位',
      }
      console.log('🚀 ~ ', message.value)
      return
    }

    isLoading.value = true
    message.value = null
    try {
      const data = generateRandomMarkers(num, center)

      // 随机颜色
      const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399']
      const markersWithColor = data.map((item, index) => ({
        ...item,
        color: colors[index % colors.length],
        pixelSize: 12,
      }))

      manager.value.addMarkers(markersWithColor, 'point')
      count.value = manager.value.getCount()
      message.value = {
        type: 'success',
        text: `成功加载 ${num} 个 Point 点位`,
      }
      console.log('🚀 ~ ', message.value)
    } catch (e) {
      message.value = {
        type: 'error',
        text: `加载 Point 点位失败: ${e.message}`,
      }
      console.log('🚀 ~ ', message.value)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 清除所有点位
   */
  function clearMarkers() {
    if (!manager.value) return
    manager.value.clear()
    count.value = 0
  }

  /**
   * 飞行定位到点位范围
   */
  function flyToMarkers() {
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
    loadRandomBillboards,
    loadRandomPoints,
    clearMarkers,
    flyToMarkers,
  }
}
