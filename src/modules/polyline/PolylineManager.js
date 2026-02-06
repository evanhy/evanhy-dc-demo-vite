/**
 * 折线管理器
 * 封装 DC-SDK Polyline 相关 API
 */
export class PolylineManager {
  constructor(viewer) {
    this._viewer = viewer
    this._layer = null
  }

  /**
   * 确保图层已初始化（懒加载）
   */
  _ensureLayer() {
    if (!this._layer) {
      this._layer = new DC.VectorLayer('polyline-layer')
      this._viewer.addLayer(this._layer)
    }
    return this._layer
  }

  /**
   * 添加普通折线（实线）
   * @param {object} options - 配置项
   * @param {Array} options.positions - 坐标数组 [[lng, lat, alt], ...]
   * @param {string} [options.color='#409eff'] - 颜色
   * @param {number} [options.width=3] - 宽度
   * @returns {DC.Polyline} Polyline 实例
   */
  addPolyline(options) {
    const { positions, color = '#409eff', width = 3 } = options

    const coords = positions.map(
      ([lng, lat, alt = 0]) => new DC.Position(lng, lat, alt),
    )
    const polyline = new DC.Polyline(coords)

    polyline.setStyle({
      material: DC.Color.fromCssColorString(color),
      width,
    })

    this._ensureLayer().addOverlay(polyline)
    return polyline
  }

  /**
   * 添加发光折线
   * @param {object} options - 配置项
   * @param {Array} options.positions - 坐标数组 [[lng, lat, alt], ...]
   * @param {string} [options.color='#67c23a'] - 颜色
   * @param {number} [options.width=8] - 宽度
   * @param {number} [options.glowPower=0.25] - 发光强度
   * @returns {DC.Polyline} Polyline 实例
   */
  addGlowPolyline(options) {
    const {
      positions,
      color = '#67c23a',
      width = 8,
      glowPower = 0.25,
    } = options

    const coords = positions.map(
      ([lng, lat, alt = 0]) => new DC.Position(lng, lat, alt),
    )
    const polyline = new DC.Polyline(coords)

    polyline.setStyle({
      material: new DC.PolylineGlowMaterialProperty({
        color: DC.Color.fromCssColorString(color),
        glowPower,
      }),
      width,
    })

    this._ensureLayer().addOverlay(polyline)
    return polyline
  }

  /**
   * 添加箭头折线
   * @param {object} options - 配置项
   * @param {Array} options.positions - 坐标数组 [[lng, lat, alt], ...]
   * @param {string} [options.color='#e6a23c'] - 颜色
   * @param {number} [options.width=10] - 宽度
   * @returns {DC.Polyline} Polyline 实例
   */
  addArrowPolyline(options) {
    const { positions, color = '#e6a23c', width = 10 } = options

    const coords = positions.map(
      ([lng, lat, alt = 0]) => new DC.Position(lng, lat, alt),
    )
    const polyline = new DC.Polyline(coords)

    polyline.setStyle({
      material: new DC.PolylineArrowMaterialProperty(
        DC.Color.fromCssColorString(color),
      ),
      width,
    })

    this._ensureLayer().addOverlay(polyline)
    return polyline
  }

  /**
   * 添加虚线折线
   * @param {object} options - 配置项
   * @param {Array} options.positions - 坐标数组 [[lng, lat, alt], ...]
   * @param {string} [options.color='#f56c6c'] - 颜色
   * @param {string} [options.gapColor='transparent'] - 间隙颜色
   * @param {number} [options.width=3] - 宽度
   * @param {number} [options.dashLength=16] - 虚线长度
   * @returns {DC.Polyline} Polyline 实例
   */
  addDashPolyline(options) {
    const {
      positions,
      color = '#f56c6c',
      gapColor = 'transparent',
      width = 3,
      dashLength = 16,
    } = options

    const coords = positions.map(
      ([lng, lat, alt = 0]) => new DC.Position(lng, lat, alt),
    )
    const polyline = new DC.Polyline(coords)

    polyline.setStyle({
      material: new DC.PolylineDashMaterialProperty({
        color: DC.Color.fromCssColorString(color),
        gapColor: DC.Color.fromCssColorString(gapColor),
        dashLength,
      }),
      width,
    })

    this._ensureLayer().addOverlay(polyline)
    return polyline
  }

  /**
   * 添加流动折线（动画效果）
   * @param {object} options - 配置项
   * @param {Array} options.positions - 坐标数组 [[lng, lat, alt], ...]
   * @param {string} [options.color='#409eff'] - 颜色
   * @param {number} [options.width=5] - 宽度
   * @param {number} [options.speed=5] - 流动速度
   * @returns {DC.Polyline} Polyline 实例
   */
  addFlowPolyline(options) {
    const { positions, color = '#409eff', width = 5, speed = 5 } = options

    const coords = positions.map(
      ([lng, lat, alt = 0]) => new DC.Position(lng, lat, alt),
    )
    const polyline = new DC.Polyline(coords)

    polyline.setStyle({
      material: new DC.PolylineFlowMaterialProperty({
        color: DC.Color.fromCssColorString(color),
        speed,
      }),
      width,
    })

    this._ensureLayer().addOverlay(polyline)
    return polyline
  }

  /**
   * 清除所有折线
   */
  clear() {
    if (this._layer) {
      this._layer.clear()
    }
  }

  /**
   * 飞行定位到所有折线范围
   * @param {number} [duration=2] - 飞行时间（秒）
   */
  flyToExtent(duration = 2) {
    if (!this._layer || this._layer.getOverlays().length === 0) return
    this._viewer.flyTo(this._layer, duration)
  }

  /**
   * 获取折线数量
   * @returns {number}
   */
  getCount() {
    return this._layer ? this._layer.getOverlays().length : 0
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
    this._viewer = null
  }
}
