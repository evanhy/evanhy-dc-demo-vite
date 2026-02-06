import { ref, reactive, shallowRef, computed, onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewerStore } from '../../stores/viewer.js'
import { AnalysisManager } from './AnalysisManager.js'

/**
 * 分析 Composable
 * 提供空间分析功能的响应式封装
 */
export function useAnalysis() {
  const viewerStore = useViewerStore()
  const { viewer, isReady } = storeToRefs(viewerStore)

  const manager = shallowRef(null)
  const isLoading = ref(false)
  const message = ref(null)

  // 分析状态
  const analysisState = reactive({
    viewshed: false,
    sightline: false,
    sightCircle: false,
    shadow: false,
    globeClip: false,
    terrainClip: false,
  })

  // 可视域参数
  const viewshedParams = reactive({
    radius: 500,
    fov: 60,
    aspectRatio: 1.5,
    visibleColor: '#00ff00',
    invisibleColor: '#ff0000',
  })

  // 阴影参数
  const shadowParams = reactive({
    multiplier: 1600,
    time: new Date(),
  })

  // 裁剪参数
  const clipParams = reactive({
    depth: 100,
    edgeColor: '#ff0000',
    edgeWidth: 2,
  })

  // 计算属性
  const hasAnyAnalysis = computed(() => {
    return Object.values(analysisState).some((v) => v)
  })

  // 监听 viewer 就绪
  watch(
    isReady,
    (ready) => {
      if (ready && viewer.value && !manager.value) {
        manager.value = new AnalysisManager(viewer.value)
      }
    },
    { immediate: true },
  )

  // 监听阴影时间变化
  watch(
    () => shadowParams.time,
    (time) => {
      if (analysisState.shadow && manager.value) {
        manager.value.setShadowTime(time)
      }
    },
  )

  // 监听裁剪参数变化
  watch(
    clipParams,
    () => {
      if (analysisState.terrainClip && manager.value) {
        // 重新创建地形裁剪以应用新参数
        const positions = [
          new DC.Position(116.35, 39.85),
          new DC.Position(116.45, 39.85),
          new DC.Position(116.45, 39.95),
          new DC.Position(116.35, 39.95),
        ]
        manager.value.addTerrainClip(positions, clipParams)
      }
    },
    { deep: true },
  )

  // ==================== 可视域分析 ====================

  /**
   * 切换可视域分析（示例位置）
   */
  function toggleViewshed() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    if (analysisState.viewshed) {
      manager.value.removeViewshed()
      analysisState.viewshed = false
      message.value = { type: 'info', text: '已关闭可视域分析' }
    } else {
      // 示例位置：北京
      const position = new DC.Position(116.4, 39.9, 100)

      const result = manager.value.addViewshed({
        position,
        ...viewshedParams,
      })

      if (result) {
        analysisState.viewshed = true
        message.value = { type: 'success', text: '已开启可视域分析' }

        // 飞行到分析位置
        viewer.value.flyToPosition(
          new DC.Position(116.4, 39.9, 2000, 0, -45),
          () => {},
          2,
        )
      } else {
        message.value = {
          type: 'error',
          text: 'DC-SDK 当前版本不支持可视域分析功能',
        }
      }
    }
  }

  /**
   * 更新可视域参数
   */
  function updateViewshed() {
    if (!manager.value || !analysisState.viewshed) return
    // 重新创建可视域以应用新参数
    const position = new DC.Position(116.4, 39.9, 100)
    manager.value.removeViewshed()
    manager.value.addViewshed({
      position,
      ...viewshedParams,
    })
  }

  // ==================== 通视线分析 ====================

  /**
   * 切换通视线分析（示例）
   */
  function toggleSightline() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    if (analysisState.sightline) {
      manager.value.clearSightlines()
      analysisState.sightline = false
      message.value = { type: 'info', text: '已关闭通视线分析' }
    } else {
      // 示例：从一个高点分析到多个目标点
      const start = new DC.Position(116.4, 39.9, 200)
      const targets = [
        new DC.Position(116.41, 39.91, 50),
        new DC.Position(116.39, 39.89, 30),
        new DC.Position(116.42, 39.88, 80),
      ]

      let successCount = 0
      targets.forEach((end, index) => {
        const result = manager.value.addSightline({
          id: `sightline-${index}`,
          start,
          end,
        })
        if (result) successCount++
      })

      if (successCount > 0) {
        analysisState.sightline = true
        message.value = {
          type: 'success',
          text: `已开启通视线分析（${successCount}条射线）`,
        }

        // 飞行到分析位置
        viewer.value.flyToPosition(
          new DC.Position(116.4, 39.9, 2000, 0, -45),
          () => {},
          2,
        )
      } else {
        message.value = {
          type: 'error',
          text: 'DC-SDK 当前版本不支持通视线分析功能',
        }
      }
    }
  }

  // ==================== 通视圆分析 ====================

  /**
   * 切换通视圆分析
   */
  function toggleSightCircle() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    if (analysisState.sightCircle) {
      manager.value.removeSightCircle()
      analysisState.sightCircle = false
      message.value = { type: 'info', text: '已关闭通视圆分析' }
    } else {
      const center = new DC.Position(116.4, 39.9, 100)
      const result = manager.value.addSightCircle({
        center,
        radius: 500,
        count: 36,
      })

      if (result) {
        analysisState.sightCircle = true
        message.value = { type: 'success', text: '已开启通视圆分析' }

        // 飞行到分析位置
        viewer.value.flyToPosition(
          new DC.Position(116.4, 39.9, 2000, 0, -60),
          () => {},
          2,
        )
      } else {
        message.value = {
          type: 'error',
          text: 'DC-SDK 当前版本不支持通视圆分析功能',
        }
      }
    }
  }

  // ==================== 日照阴影分析 ====================

  /**
   * 切换日照阴影分析
   */
  function toggleShadow() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    if (analysisState.shadow) {
      manager.value.disableShadowAnalysis()
      analysisState.shadow = false
      message.value = { type: 'info', text: '已关闭日照阴影分析' }
    } else {
      const success = manager.value.enableShadowAnalysis({
        startTime: shadowParams.time,
        multiplier: shadowParams.multiplier,
      })

      if (success) {
        analysisState.shadow = true
        message.value = { type: 'success', text: '已开启日照阴影分析' }
      } else {
        message.value = { type: 'error', text: '开启阴影分析失败' }
      }
    }
  }

  /**
   * 更新阴影时间
   */
  function updateShadowTime(time) {
    shadowParams.time = time
    if (manager.value && analysisState.shadow) {
      manager.value.setShadowTime(time)
    }
  }

  // ==================== 地球裁剪 ====================

  /**
   * 切换地球裁剪
   */
  function toggleGlobeClip() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    if (analysisState.globeClip) {
      manager.value.removeGlobeClip()
      analysisState.globeClip = false
      message.value = { type: 'info', text: '已关闭地球裁剪' }
    } else {
      // 示例裁剪区域（北京周边矩形）
      const positions = [
        new DC.Position(116.2, 39.7),
        new DC.Position(116.6, 39.7),
        new DC.Position(116.6, 40.1),
        new DC.Position(116.2, 40.1),
      ]

      const result = manager.value.addGlobeClip(positions)

      if (result) {
        analysisState.globeClip = true
        message.value = { type: 'success', text: '已开启地球裁剪' }

        // 飞行到裁剪区域
        viewer.value.flyToPosition(
          new DC.Position(116.4, 39.9, 80000, 0, -60),
          () => {},
          2,
        )
      } else {
        message.value = { type: 'error', text: '地球裁剪创建失败' }
      }
    }
  }

  // ==================== 地形裁剪 ====================

  /**
   * 切换地形裁剪
   */
  function toggleTerrainClip() {
    if (!manager.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    if (analysisState.terrainClip) {
      manager.value.removeTerrainClip()
      analysisState.terrainClip = false
      message.value = { type: 'info', text: '已关闭地形裁剪' }
    } else {
      // 示例裁剪区域
      const positions = [
        new DC.Position(116.35, 39.85),
        new DC.Position(116.45, 39.85),
        new DC.Position(116.45, 39.95),
        new DC.Position(116.35, 39.95),
      ]

      const result = manager.value.addTerrainClip(positions, clipParams)

      if (result) {
        analysisState.terrainClip = true
        message.value = { type: 'success', text: '已开启地形裁剪' }

        // 飞行到裁剪区域
        viewer.value.flyToPosition(
          new DC.Position(116.4, 39.9, 5000, 0, -45),
          () => {},
          2,
        )
      } else {
        message.value = { type: 'error', text: '地形裁剪创建失败' }
      }
    }
  }

  // ==================== 清除 ====================

  /**
   * 清除所有分析
   */
  function clearAll() {
    if (!manager.value) return
    manager.value.clearAll()
    Object.keys(analysisState).forEach((key) => {
      analysisState[key] = false
    })
    message.value = { type: 'info', text: '已清除所有分析' }
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
    analysisState,
    viewshedParams,
    shadowParams,
    clipParams,
    hasAnyAnalysis,
    toggleViewshed,
    updateViewshed,
    toggleSightline,
    toggleSightCircle,
    toggleShadow,
    updateShadowTime,
    toggleGlobeClip,
    toggleTerrainClip,
    clearAll,
  }
}
