import { shallowRef, provide, inject, readonly } from 'vue'

const VIEWER_KEY = Symbol('dc-viewer')

/**
 * 创建 Viewer 实例（在 MapContainer 中调用）
 * 使用 provide 共享给子组件
 */
export function createViewer() {
  const viewer = shallowRef(null)
  const isReady = shallowRef(false)

  /**
   * 初始化 Viewer
   * @param {string} containerId - 容器 DOM ID
   * @param {object} config - 地图配置
   */
  async function init(containerId, config = {}) {
    return new Promise((resolve) => {
      DC.ready({}).then(() => {
        const v = new DC.Viewer(containerId)

        // 添加底图
        if (config.baseLayer) {
          const baseLayer = DC.ImageryLayerFactory.createImageryLayer(
            DC.ImageryType[config.baseLayer.type],
            config.baseLayer.options,
          )
          v.addBaseLayer(baseLayer)
        }

        // 应用 Viewer 配置
        if (config.viewerOptions) {
          v.setOptions(config.viewerOptions)
        }

        // 飞行到初始视角
        if (config.defaultView) {
          const { lng, lat, alt, heading, pitch } = config.defaultView
          v.flyToPosition(
            new DC.Position(lng, lat, alt, heading, pitch),
            () => {},
            0, // 0 表示立即到达
          )
        }

        viewer.value = v
        isReady.value = true
        resolve(v)
      })
    })
  }

  /**
   * 销毁 Viewer
   */
  function destroy() {
    if (viewer.value) {
      viewer.value.destroy()
      viewer.value = null
      isReady.value = false
    }
  }

  // Provide viewer 给子组件使用
  provide(VIEWER_KEY, {
    viewer,
    isReady: readonly(isReady),
  })

  return { viewer, isReady, init, destroy }
}

/**
 * 获取 Viewer 实例（在子组件/composable 中调用）
 */
export function useViewer() {
  const ctx = inject(VIEWER_KEY)
  if (!ctx) {
    throw new Error('useViewer must be used within MapContainer')
  }
  return ctx
}
