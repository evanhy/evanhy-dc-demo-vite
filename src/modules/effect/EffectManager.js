/**
 * 特效管理器
 * 封装 DC-SDK 天气、后处理、扫描效果相关 API
 */
export class EffectManager {
  constructor(viewer) {
    this._viewer = viewer
    this._weather = null
    this._effect = null
    this._effectStates = new Map()
    this._scans = new Map()
    this._scanLayer = null

    this._init()
  }

  /**
   * 初始化天气和后处理效果
   */
  _init() {
    // 初始化天气效果
    this._weather = new DC.Weather(this._viewer)

    // 初始化后处理效果（需要传入 viewer）
    this._effect = new DC.Effect(this._viewer)
  }

  /**
   * 确保扫描图层已初始化
   */
  _ensureScanLayer() {
    if (!this._scanLayer) {
      this._scanLayer = new DC.PrimitiveLayer('scan-layer')
      this._scanLayer.addTo(this._viewer)
    }
    return this._scanLayer
  }

  // ==================== 天气效果 ====================

  /**
   * 开启/关闭雨效果
   * @param {boolean} enable - 是否开启
   * @param {object} [options] - 配置项
   * @param {number} [options.speed=10] - 速度
   */
  setRain(enable, options = {}) {
    const { speed = 10 } = options

    this._weather.rain.enable = enable
    if (enable) {
      this._weather.rain.speed = speed
      this._effectStates.set('rain', { speed })
    } else {
      this._effectStates.delete('rain')
    }
  }

  /**
   * 更新雨效果参数
   * @param {object} options - 配置项
   */
  updateRain(options) {
    if (!this._effectStates.has('rain')) return

    if (options.speed !== undefined) {
      this._weather.rain.speed = options.speed
    }

    const current = this._effectStates.get('rain')
    this._effectStates.set('rain', { ...current, ...options })
  }

  /**
   * 开启/关闭雪效果
   * @param {boolean} enable - 是否开启
   * @param {object} [options] - 配置项
   * @param {number} [options.speed=10] - 速度
   */
  setSnow(enable, options = {}) {
    const { speed = 10 } = options

    this._weather.snow.enable = enable
    if (enable) {
      this._weather.snow.speed = speed
      this._effectStates.set('snow', { speed })
    } else {
      this._effectStates.delete('snow')
    }
  }

  /**
   * 更新雪效果参数
   * @param {object} options - 配置项
   */
  updateSnow(options) {
    if (!this._effectStates.has('snow')) return

    if (options.speed !== undefined) {
      this._weather.snow.speed = options.speed
    }

    const current = this._effectStates.get('snow')
    this._effectStates.set('snow', { ...current, ...options })
  }

  /**
   * 开启/关闭雾效果
   * @param {boolean} enable - 是否开启
   * @param {object} [options] - 配置项
   * @param {string} [options.color='#FFFFFF'] - 雾颜色
   * @param {number} [options.near=10] - 近距离
   * @param {number} [options.far=200000] - 远距离
   */
  setFog(enable, options = {}) {
    const { color = '#FFFFFF', near = 10, far = 200000 } = options

    this._weather.fog.enable = enable
    if (enable) {
      this._weather.fog.color = DC.Color.fromCssColorString(color)
      this._weather.fog.fogByDistance = { near, far }
      this._effectStates.set('fog', { color, near, far })
    } else {
      this._effectStates.delete('fog')
    }
  }

  /**
   * 开启/关闭云效果
   * @param {boolean} enable - 是否开启
   * @param {object} [options] - 配置项
   * @param {number} [options.rotateAmount=0.005] - 旋转量
   */
  setCloud(enable, options = {}) {
    const { rotateAmount = 0.005 } = options

    this._weather.cloud.enable = enable
    if (enable) {
      this._weather.cloud.rotateAmount = rotateAmount
      this._effectStates.set('cloud', { rotateAmount })
    } else {
      this._effectStates.delete('cloud')
    }
  }

  // ==================== 后处理效果 ====================

  /**
   * 开启/关闭 Bloom 效果
   * @param {boolean} enable - 是否开启
   * @param {object} [options] - 配置项
   * @param {number} [options.brightness=0.3] - 亮度
   * @param {number} [options.contrast=128] - 对比度
   * @param {number} [options.delta=1] - 增量
   * @param {number} [options.sigma=3.8] - sigma
   * @param {number} [options.stepSize=5] - 步长
   */
  setBloom(enable, options = {}) {
    const {
      brightness = 0.3,
      contrast = 128,
      delta = 1,
      sigma = 3.8,
      stepSize = 5,
    } = options

    this._effect.bloom.enable = enable
    if (enable) {
      this._effect.bloom.brightness = brightness
      this._effect.bloom.contrast = contrast
      this._effect.bloom.delta = delta
      this._effect.bloom.sigma = sigma
      this._effect.bloom.stepSize = stepSize
      this._effectStates.set('bloom', {
        brightness,
        contrast,
        delta,
        sigma,
        stepSize,
      })
    } else {
      this._effectStates.delete('bloom')
    }
  }

  /**
   * 更新 Bloom 参数
   * @param {object} options - 配置项
   */
  updateBloom(options) {
    if (!this._effectStates.has('bloom')) return

    if (options.brightness !== undefined) {
      this._effect.bloom.brightness = options.brightness
    }
    if (options.contrast !== undefined) {
      this._effect.bloom.contrast = options.contrast
    }
    if (options.delta !== undefined) {
      this._effect.bloom.delta = options.delta
    }
    if (options.sigma !== undefined) {
      this._effect.bloom.sigma = options.sigma
    }
    if (options.stepSize !== undefined) {
      this._effect.bloom.stepSize = options.stepSize
    }

    const current = this._effectStates.get('bloom')
    this._effectStates.set('bloom', { ...current, ...options })
  }

  /**
   * 开启/关闭夜视效果
   * @param {boolean} enable - 是否开启
   */
  setNightVision(enable) {
    this._effect.night.enable = enable
    if (enable) {
      this._effectStates.set('nightVision', true)
    } else {
      this._effectStates.delete('nightVision')
    }
  }

  /**
   * 开启/关闭亮度调节
   * @param {boolean} enable - 是否开启
   * @param {object} [options] - 配置项
   * @param {number} [options.intensity=0.5] - 强度 (0-1)
   */
  setBrightness(enable, options = {}) {
    const { intensity = 0.5 } = options

    this._effect.brightness.enable = enable
    if (enable) {
      this._effect.brightness.brightness = intensity
      this._effectStates.set('brightness', { intensity })
    } else {
      this._effectStates.delete('brightness')
    }
  }

  /**
   * 更新亮度参数
   * @param {object} options - 配置项
   */
  updateBrightness(options) {
    if (!this._effectStates.has('brightness')) return

    if (options.intensity !== undefined) {
      this._effect.brightness.brightness = options.intensity
    }

    const current = this._effectStates.get('brightness')
    this._effectStates.set('brightness', { ...current, ...options })
  }

  // ==================== 扫描效果 ====================

  /**
   * 添加圆形扫描
   * @param {object} options - 配置项
   * @param {string} options.id - 唯一标识
   * @param {object} options.position - 中心位置 { lng, lat, alt }
   * @param {number} [options.radius=5000] - 半径（米）
   * @param {string} [options.color='#00FF00'] - 颜色
   * @param {number} [options.speed=10] - 速度
   * @returns {DC.ScanCirclePrimitive|null}
   */
  addCircleScan(options) {
    const {
      id,
      position,
      radius = 5000,
      color = '#00FF00',
      speed = 10,
    } = options

    if (!position) return null

    const posStr = `${position.lng},${position.lat}`
    const scanCircle = new DC.ScanCirclePrimitive(posStr, radius)
    scanCircle.setStyle({
      speed: speed,
      color: DC.Color.fromCssColorString(color),
    })

    this._ensureScanLayer().addOverlay(scanCircle)
    this._scans.set(id, { type: 'circle', instance: scanCircle })

    return scanCircle
  }

  /**
   * 添加雷达扫描
   * @param {object} options - 配置项
   * @param {string} options.id - 唯一标识
   * @param {object} options.position - 中心位置 { lng, lat, alt }
   * @param {number} [options.radius=5000] - 半径（米）
   * @param {string} [options.color='#00FF00'] - 颜色
   * @param {number} [options.speed=10] - 速度
   * @returns {DC.RadarScan|null}
   */
  addRadarScan(options) {
    const {
      id,
      position,
      radius = 5000,
      color = '#00FF00',
      speed = 10,
    } = options

    if (!position) return null

    const posStr = `${position.lng},${position.lat}`
    const radarScan = new DC.RadarScan(this._viewer, posStr, radius, {
      speed: speed,
      color: DC.Color.fromCssColorString(color),
    })

    radarScan.start()
    this._scans.set(id, { type: 'radar', instance: radarScan })

    return radarScan
  }

  /**
   * 移除扫描效果
   * @param {string} id - 扫描标识
   */
  removeScan(id) {
    const scan = this._scans.get(id)
    if (!scan) return

    if (scan.type === 'radar') {
      // 雷达扫描需要调用 stop()
      scan.instance.stop()
    } else if (scan.type === 'circle' && this._scanLayer) {
      // 圆形扫描从图层移除
      this._scanLayer.removeOverlay(scan.instance)
    }
    this._scans.delete(id)
  }

  /**
   * 清除所有扫描效果
   */
  clearScans() {
    // 停止所有雷达扫描
    for (const scan of this._scans.values()) {
      if (scan.type === 'radar') {
        scan.instance.stop()
      }
    }
    // 清除图层中的圆形扫描
    if (this._scanLayer) {
      this._scanLayer.clear()
    }
    this._scans.clear()
  }

  // ==================== 工具方法 ====================

  /**
   * 检查效果是否已开启
   * @param {string} name - 效果名称
   * @returns {boolean}
   */
  isEffectEnabled(name) {
    return this._effectStates.has(name)
  }

  /**
   * 获取当前开启的效果列表
   * @returns {string[]}
   */
  getEnabledEffects() {
    return Array.from(this._effectStates.keys())
  }

  /**
   * 关闭所有天气效果
   */
  clearWeather() {
    this.setRain(false)
    this.setSnow(false)
    this.setFog(false)
    this.setCloud(false)
  }

  /**
   * 关闭所有后处理效果
   */
  clearPostProcess() {
    this.setBloom(false)
    this.setNightVision(false)
    this.setBrightness(false)
  }

  /**
   * 关闭所有效果
   */
  clearAll() {
    this.clearWeather()
    this.clearPostProcess()
    this.clearScans()
  }

  /**
   * 销毁管理器
   */
  destroy() {
    this.clearAll()
    if (this._scanLayer) {
      this._viewer.removeLayer(this._scanLayer)
      this._scanLayer = null
    }
    this._effectStates.clear()
    this._scans.clear()
    this._weather = null
    this._effect = null
    this._viewer = null
  }
}
