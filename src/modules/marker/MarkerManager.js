/**
 * 点位管理器
 * 封装 DC-SDK Billboard/Label/Point 相关 API
 */
export class MarkerManager {
  constructor(viewer) {
    this._viewer = viewer
    this._layer = null
  }

  /**
   * 确保图层已初始化（懒加载）
   */
  _ensureLayer() {
    if (!this._layer) {
      this._layer = new DC.VectorLayer('marker-layer')
      this._viewer.addLayer(this._layer)
    }
    return this._layer
  }

  /**
   * 添加 Billboard（图标点位）
   * @param {object} options - 配置项
   * @param {number} options.lng - 经度
   * @param {number} options.lat - 纬度
   * @param {number} [options.alt=0] - 高度
   * @param {string} [options.icon] - 图标 URL
   * @param {number} [options.scale=1] - 缩放
   * @param {string} [options.label] - 标签文本
   * @returns {DC.Billboard} Billboard 实例
   */
  addBillboard(options) {
    const { lng, lat, alt = 0, icon, scale = 1, label } = options
    const position = new DC.Position(lng, lat, alt)
    const billboard = new DC.Billboard(position, icon)

    billboard.setStyle({
      scale,
    })

    // 如果有标签，添加 Label
    if (label) {
      billboard.setLabel(label, {
        font: '14px sans-serif',
        fillColor: DC.Color.WHITE,
        outlineColor: DC.Color.BLACK,
        outlineWidth: 2,
      })
    }

    this._ensureLayer().addOverlay(billboard)
    return billboard
  }

  /**
   * 添加 Point（点）
   * @param {object} options - 配置项
   * @param {number} options.lng - 经度
   * @param {number} options.lat - 纬度
   * @param {number} [options.alt=0] - 高度
   * @param {number} [options.pixelSize=10] - 像素大小
   * @param {string} [options.color='#409eff'] - 颜色
   * @param {string} [options.label] - 标签文本
   * @returns {DC.Point} Point 实例
   */
  addPoint(options) {
    const {
      lng,
      lat,
      alt = 0,
      pixelSize = 10,
      color = '#409eff',
      label,
    } = options
    const position = new DC.Position(lng, lat, alt)
    const point = new DC.Point(position)

    point.setStyle({
      pixelSize,
      color: DC.Color.fromCssColorString(color),
      outlineColor: DC.Color.WHITE,
      outlineWidth: 2,
    })

    if (label) {
      point.setLabel(label, {
        font: '14px sans-serif',
        fillColor: DC.Color.WHITE,
        outlineColor: DC.Color.BLACK,
        outlineWidth: 2,
      })
    }

    this._ensureLayer().addOverlay(point)
    return point
  }

  /**
   * 批量添加点位
   * @param {Array} items - 点位数据数组
   * @param {string} [type='billboard'] - 类型：billboard 或 point
   * @returns {Array} 添加的点位实例数组
   */
  addMarkers(items, type = 'billboard') {
    const markers = []
    for (const item of items) {
      if (type === 'billboard') {
        markers.push(this.addBillboard(item))
      } else {
        markers.push(this.addPoint(item))
      }
    }
    return markers
  }

  /**
   * 清除所有点位
   */
  clear() {
    if (this._layer) {
      this._layer.clear()
    }
  }

  /**
   * 飞行定位到所有点位范围
   * @param {number} [duration=2] - 飞行时间（秒）
   */
  flyToExtent(duration = 2) {
    if (!this._layer || this._layer.getOverlays().length === 0) return
    this._viewer.flyTo(this._layer, duration)
  }

  /**
   * 获取点位数量
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
