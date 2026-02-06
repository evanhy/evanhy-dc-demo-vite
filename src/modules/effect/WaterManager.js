/**
 * 水面效果管理器
 * 封装 DC-SDK WaterPrimitive 相关 API
 */
export class WaterManager {
  constructor(viewer) {
    this._viewer = viewer
    this._layer = null
    this._waters = new Map()
  }

  /**
   * 确保图层已初始化（懒加载）
   */
  _ensureLayer() {
    if (!this._layer) {
      this._layer = new DC.PrimitiveLayer('water-layer')
      this._viewer.addLayer(this._layer)
    }
    return this._layer
  }

  /**
   * 添加水面
   * @param {object} options - 配置项
   * @param {string} options.id - 唯一标识
   * @param {Array|string} options.positions - 坐标数组或字符串
   * @param {string} [options.baseWaterColor='#00FFFF'] - 水面颜色
   * @param {number} [options.alpha=0.3] - 透明度
   * @param {string} [options.normalMap] - 法线贴图路径
   * @param {number} [options.frequency=1000] - 波纹频率
   * @param {number} [options.animationSpeed=0.01] - 动画速度
   * @param {number} [options.amplitude=10] - 振幅
   * @param {number} [options.specularIntensity=10] - 镜面反射强度
   * @returns {DC.WaterPrimitive} WaterPrimitive 实例
   */
  addWater(options) {
    const {
      id,
      positions,
      baseWaterColor = '#00FFFF',
      alpha = 0.3,
      normalMap,
      frequency = 1000,
      animationSpeed = 0.01,
      amplitude = 10,
      specularIntensity = 10,
    } = options

    // 转换坐标格式
    let coords
    if (typeof positions === 'string') {
      coords = positions
    } else if (Array.isArray(positions)) {
      // 支持 [[lng, lat], ...] 或 [DC.Position, ...] 格式
      if (positions[0] instanceof DC.Position) {
        coords = positions
      } else {
        coords = positions.map(([lng, lat]) => new DC.Position(lng, lat))
      }
    }

    const water = new DC.WaterPrimitive(coords)

    const style = {
      baseWaterColor:
        DC.Color.fromCssColorString(baseWaterColor).withAlpha(alpha),
      frequency,
      animationSpeed,
      amplitude,
      specularIntensity,
    }

    if (normalMap) {
      style.normalMap = normalMap
    }

    water.setStyle(style)

    this._ensureLayer().addOverlay(water)

    if (id) {
      this._waters.set(id, water)
    }

    return water
  }

  /**
   * 更新水面样式
   * @param {string} id - 水面标识
   * @param {object} style - 样式参数
   */
  updateWaterStyle(id, style) {
    const water = this._waters.get(id)
    if (!water) return

    const newStyle = {}

    if (style.baseWaterColor !== undefined) {
      const alpha = style.alpha !== undefined ? style.alpha : 0.3
      newStyle.baseWaterColor = DC.Color.fromCssColorString(
        style.baseWaterColor,
      ).withAlpha(alpha)
    }

    if (style.frequency !== undefined) {
      newStyle.frequency = style.frequency
    }

    if (style.animationSpeed !== undefined) {
      newStyle.animationSpeed = style.animationSpeed
    }

    if (style.amplitude !== undefined) {
      newStyle.amplitude = style.amplitude
    }

    if (style.specularIntensity !== undefined) {
      newStyle.specularIntensity = style.specularIntensity
    }

    if (style.normalMap !== undefined) {
      newStyle.normalMap = style.normalMap
    }

    water.setStyle(newStyle)
  }

  /**
   * 移除指定水面
   * @param {string} id - 水面标识
   */
  removeWater(id) {
    const water = this._waters.get(id)
    if (water && this._layer) {
      this._layer.removeOverlay(water)
      this._waters.delete(id)
    }
  }

  /**
   * 清除所有水面
   */
  clear() {
    if (this._layer) {
      this._layer.clear()
    }
    this._waters.clear()
  }

  /**
   * 飞行定位到水面范围
   * @param {number} [duration=2] - 飞行时间（秒）
   */
  flyToExtent(duration = 2) {
    if (!this._layer || this._layer.getOverlays().length === 0) return
    this._viewer.flyTo(this._layer, duration)
  }

  /**
   * 获取水面数量
   * @returns {number}
   */
  getCount() {
    return this._waters.size
  }

  /**
   * 获取水面实例
   * @param {string} id - 水面标识
   * @returns {DC.WaterPrimitive|undefined}
   */
  getWater(id) {
    return this._waters.get(id)
  }

  /**
   * 销毁管理器
   */
  destroy() {
    if (this._layer) {
      this._layer.clear()
      this._viewer.removeLayer(this._layer)
      this._layer = null
    }
    this._waters.clear()
    this._viewer = null
  }
}
