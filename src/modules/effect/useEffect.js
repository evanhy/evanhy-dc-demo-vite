import { ref, reactive, shallowRef, onUnmounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewerStore } from '../../stores/viewer.js'
import { EffectManager } from './EffectManager.js'

/**
 * 特效管理 Composable
 * 提供响应式的天气、后处理、扫描效果操作
 */
export function useEffect() {
  const viewerStore = useViewerStore()
  const { viewer, isReady } = storeToRefs(viewerStore)

  const manager = shallowRef(null)
  const message = ref(null)

  // ==================== 天气效果状态 ====================
  const weatherState = reactive({
    rain: false,
    snow: false,
    fog: false,
    cloud: false,
  })

  const rainParams = reactive({
    speed: 10,
  })

  const snowParams = reactive({
    speed: 10,
  })

  // ==================== 后处理效果状态 ====================
  const postProcessState = reactive({
    bloom: false,
    nightVision: false,
    brightness: false,
  })

  const bloomParams = reactive({
    brightness: 0.3,
    contrast: 128,
    delta: 1,
    sigma: 3.8,
    stepSize: 5,
  })

  const brightnessParams = reactive({
    intensity: 0.5,
  })

  // ==================== 扫描效果状态 ====================
  const scanState = reactive({
    circleScan: false,
    radarScan: false,
  })

  const scanParams = reactive({
    radius: 5000,
    color: '#00FF00',
    speed: 10,
  })

  // 扫描中心点（默认苏州）
  const scanCenter = reactive({
    lng: 120.62,
    lat: 31.32,
    alt: 0,
  })

  // ==================== 计算属性 ====================
  const hasWeatherEffect = computed(() => {
    return (
      weatherState.rain ||
      weatherState.snow ||
      weatherState.fog ||
      weatherState.cloud
    )
  })

  const hasPostProcessEffect = computed(() => {
    return (
      postProcessState.bloom ||
      postProcessState.nightVision ||
      postProcessState.brightness
    )
  })

  const hasScanEffect = computed(() => {
    return scanState.circleScan || scanState.radarScan
  })

  // ==================== 初始化 ====================
  watch(
    isReady,
    (ready) => {
      if (ready && viewer.value && !manager.value) {
        manager.value = new EffectManager(viewer.value)
      }
    },
    { immediate: true },
  )

  // ==================== 天气效果控制 ====================

  /**
   * 切换雨效果
   */
  function toggleRain() {
    if (!manager.value) return

    weatherState.rain = !weatherState.rain
    manager.value.setRain(weatherState.rain, rainParams)
    message.value = {
      type: 'info',
      text: weatherState.rain ? '已开启雨效果' : '已关闭雨效果',
    }
  }

  /**
   * 切换雪效果
   */
  function toggleSnow() {
    if (!manager.value) return

    weatherState.snow = !weatherState.snow
    manager.value.setSnow(weatherState.snow, snowParams)
    message.value = {
      type: 'info',
      text: weatherState.snow ? '已开启雪效果' : '已关闭雪效果',
    }
  }

  /**
   * 切换雾效果
   */
  function toggleFog() {
    if (!manager.value) return

    weatherState.fog = !weatherState.fog
    manager.value.setFog(weatherState.fog)
    message.value = {
      type: 'info',
      text: weatherState.fog ? '已开启雾效果' : '已关闭雾效果',
    }
  }

  /**
   * 切换云效果
   */
  function toggleCloud() {
    if (!manager.value) return

    weatherState.cloud = !weatherState.cloud
    manager.value.setCloud(weatherState.cloud)
    message.value = {
      type: 'info',
      text: weatherState.cloud ? '已开启云效果' : '已关闭云效果',
    }
  }

  /**
   * 清除所有天气效果
   */
  function clearWeather() {
    if (!manager.value) return

    manager.value.clearWeather()
    weatherState.rain = false
    weatherState.snow = false
    weatherState.fog = false
    weatherState.cloud = false
    message.value = { type: 'info', text: '已清除所有天气效果' }
  }

  // 监听雨参数变化
  watch(
    () => ({ ...rainParams }),
    () => {
      if (weatherState.rain && manager.value) {
        manager.value.updateRain(rainParams)
      }
    },
    { deep: true },
  )

  // 监听雪参数变化
  watch(
    () => ({ ...snowParams }),
    () => {
      if (weatherState.snow && manager.value) {
        manager.value.updateSnow(snowParams)
      }
    },
    { deep: true },
  )

  // ==================== 后处理效果控制 ====================

  /**
   * 切换 Bloom 效果
   */
  function toggleBloom() {
    if (!manager.value) return

    postProcessState.bloom = !postProcessState.bloom
    manager.value.setBloom(postProcessState.bloom, bloomParams)
    message.value = {
      type: 'info',
      text: postProcessState.bloom ? '已开启 Bloom 效果' : '已关闭 Bloom 效果',
    }
  }

  /**
   * 切换夜视效果
   */
  function toggleNightVision() {
    if (!manager.value) return

    postProcessState.nightVision = !postProcessState.nightVision
    manager.value.setNightVision(postProcessState.nightVision)
    message.value = {
      type: 'info',
      text: postProcessState.nightVision ? '已开启夜视效果' : '已关闭夜视效果',
    }
  }

  /**
   * 切换亮度调节
   */
  function toggleBrightness() {
    if (!manager.value) return

    postProcessState.brightness = !postProcessState.brightness
    manager.value.setBrightness(postProcessState.brightness, brightnessParams)
    message.value = {
      type: 'info',
      text: postProcessState.brightness ? '已开启亮度调节' : '已关闭亮度调节',
    }
  }

  /**
   * 清除所有后处理效果
   */
  function clearPostProcess() {
    if (!manager.value) return

    manager.value.clearPostProcess()
    postProcessState.bloom = false
    postProcessState.nightVision = false
    postProcessState.brightness = false
    message.value = { type: 'info', text: '已清除所有后处理效果' }
  }

  // 监听 Bloom 参数变化
  watch(
    () => ({ ...bloomParams }),
    () => {
      if (postProcessState.bloom && manager.value) {
        manager.value.updateBloom(bloomParams)
      }
    },
    { deep: true },
  )

  // 监听亮度参数变化
  watch(
    () => ({ ...brightnessParams }),
    () => {
      if (postProcessState.brightness && manager.value) {
        manager.value.updateBrightness(brightnessParams)
      }
    },
    { deep: true },
  )

  // ==================== 扫描效果控制 ====================

  /**
   * 切换圆形扫描
   */
  function toggleCircleScan() {
    if (!manager.value) return

    scanState.circleScan = !scanState.circleScan

    if (scanState.circleScan) {
      manager.value.addCircleScan({
        id: 'circle-scan-demo',
        position: scanCenter,
        radius: scanParams.radius,
        color: scanParams.color,
        speed: scanParams.speed,
      })
      message.value = { type: 'info', text: '已开启圆形扫描' }
    } else {
      manager.value.removeScan('circle-scan-demo')
      message.value = { type: 'info', text: '已关闭圆形扫描' }
    }
  }

  /**
   * 切换雷达扫描
   */
  function toggleRadarScan() {
    if (!manager.value) return

    scanState.radarScan = !scanState.radarScan

    if (scanState.radarScan) {
      manager.value.addRadarScan({
        id: 'radar-scan-demo',
        position: scanCenter,
        radius: scanParams.radius,
        color: scanParams.color,
        speed: scanParams.speed,
      })
      message.value = { type: 'info', text: '已开启雷达扫描' }
    } else {
      manager.value.removeScan('radar-scan-demo')
      message.value = { type: 'info', text: '已关闭雷达扫描' }
    }
  }

  /**
   * 清除所有扫描效果
   */
  function clearScans() {
    if (!manager.value) return

    manager.value.clearScans()
    scanState.circleScan = false
    scanState.radarScan = false
    message.value = { type: 'info', text: '已清除所有扫描效果' }
  }

  // ==================== 清理 ====================

  /**
   * 清除所有效果
   */
  function clearAll() {
    if (!manager.value) return

    manager.value.clearAll()
    weatherState.rain = false
    weatherState.snow = false
    weatherState.fog = false
    weatherState.cloud = false
    postProcessState.bloom = false
    postProcessState.nightVision = false
    postProcessState.brightness = false
    scanState.circleScan = false
    scanState.radarScan = false
    message.value = { type: 'info', text: '已清除所有效果' }
  }

  // 组件卸载时销毁 manager
  onUnmounted(() => {
    if (manager.value) {
      manager.value.destroy()
      manager.value = null
    }
  })

  return {
    // 管理器
    manager,
    message,

    // 天气效果
    weatherState,
    rainParams,
    snowParams,
    hasWeatherEffect,
    toggleRain,
    toggleSnow,
    toggleFog,
    toggleCloud,
    clearWeather,

    // 后处理效果
    postProcessState,
    bloomParams,
    brightnessParams,
    hasPostProcessEffect,
    toggleBloom,
    toggleNightVision,
    toggleBrightness,
    clearPostProcess,

    // 扫描效果
    scanState,
    scanParams,
    scanCenter,
    hasScanEffect,
    toggleCircleScan,
    toggleRadarScan,
    clearScans,

    // 全局清理
    clearAll,
  }
}
