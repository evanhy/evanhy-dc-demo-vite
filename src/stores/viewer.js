import { defineStore } from 'pinia'
import { shallowRef, ref } from 'vue'

/**
 * Viewer 状态管理 Store
 * 使用 Pinia 管理地图 Viewer 实例
 */
export const useViewerStore = defineStore('viewer', () => {
  const viewer = shallowRef(null)
  const isReady = ref(false)

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

        // 启用坐标信息栏
        v.locationBar.enable = true

        viewer.value = v
        window.viewer = v
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

  return {
    viewer,
    isReady,
    init,
    destroy,
  }
})
