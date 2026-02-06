/**
 * 多边形管理器
 * 封装 DC-SDK Polygon 相关 API
 */
export class PolygonManager {
  constructor(viewer) {
    this._viewer = viewer
    this._layer = null
  }

  /**
   * 确保图层已初始化（懒加载）
   */
  _ensureLayer() {
    if (!this._layer) {
      this._layer = new DC.VectorLayer('polygon-layer')
      this._viewer.addLayer(this._layer)
    }
    return this._layer
  }

  /**
   * 添加普通多边形
   * @param {object} options - 配置项
   * @param {Array} options.positions - 坐标数组 [[lng, lat], ...]
   * @param {string} [options.color='#409eff'] - 填充颜色
   * @param {number} [options.alpha=0.6] - 透明度
   * @param {string} [options.outlineColor='#ffffff'] - 描边颜色
   * @param {number} [options.outlineWidth=2] - 描边宽度
   * @returns {DC.Polygon} Polygon 实例
   */
  addPolygon(options) {
    const {
      positions,
      color = '#409eff',
      alpha = 0.6,
      outlineColor = '#ffffff',
      outlineWidth = 2,
    } = options

    const coords = positions.map(([lng, lat]) => new DC.Position(lng, lat))
    const polygon = new DC.Polygon(coords)

    polygon.setStyle({
      material: DC.Color.fromCssColorString(color).withAlpha(alpha),
      outline: true,
      outlineColor: DC.Color.fromCssColorString(outlineColor),
      outlineWidth,
    })

    this._ensureLayer().addOverlay(polygon)
    return polygon
  }

  /**
   * 添加拉伸多边形（有高度）
   * @param {object} options - 配置项
   * @param {Array} options.positions - 坐标数组 [[lng, lat], ...]
   * @param {number} [options.height=100] - 拉伸高度
   * @param {string} [options.color='#67c23a'] - 填充颜色
   * @param {number} [options.alpha=0.8] - 透明度
   * @param {string} [options.outlineColor='#ffffff'] - 描边颜色
   * @param {number} [options.outlineWidth=2] - 描边宽度
   * @returns {DC.Polygon} Polygon 实例
   */
  addExtrudedPolygon(options) {
    const {
      positions,
      height = 100,
      color = '#67c23a',
      alpha = 0.8,
      outlineColor = '#ffffff',
      outlineWidth = 2,
    } = options

    const coords = positions.map(([lng, lat]) => new DC.Position(lng, lat))
    const polygon = new DC.Polygon(coords)

    polygon.setStyle({
      material: DC.Color.fromCssColorString(color).withAlpha(alpha),
      extrudedHeight: height,
      outline: true,
      outlineColor: DC.Color.fromCssColorString(outlineColor),
      outlineWidth,
    })

    this._ensureLayer().addOverlay(polygon)
    return polygon
  }

  /**
   * 添加圆形多边形
   * @param {object} options - 配置项
   * @param {number} options.lng - 中心经度
   * @param {number} options.lat - 中心纬度
   * @param {number} [options.radius=1000] - 半径（米）
   * @param {string} [options.color='#e6a23c'] - 填充颜色
   * @param {number} [options.alpha=0.6] - 透明度
   * @returns {DC.Circle} Circle 实例
   */
  addCircle(options) {
    const { lng, lat, radius = 1000, color = '#e6a23c', alpha = 0.6 } = options

    const position = new DC.Position(lng, lat)
    const circle = new DC.Circle(position, radius)

    circle.setStyle({
      material: DC.Color.fromCssColorString(color).withAlpha(alpha),
      outline: true,
      outlineColor: DC.Color.WHITE,
      outlineWidth: 2,
    })

    this._ensureLayer().addOverlay(circle)
    return circle
  }

  /**
   * 添加矩形
   * @param {object} options - 配置项
   * @param {number} options.west - 西边界
   * @param {number} options.south - 南边界
   * @param {number} options.east - 东边界
   * @param {number} options.north - 北边界
   * @param {string} [options.color='#f56c6c'] - 填充颜色
   * @param {number} [options.alpha=0.6] - 透明度
   * @returns {DC.Rectangle} Rectangle 实例
   */
  addRectangle(options) {
    const { west, south, east, north, color = '#f56c6c', alpha = 0.6 } = options

    const rectangle = new DC.Rectangle(
      new DC.Position(west, south),
      new DC.Position(east, north),
    )

    rectangle.setStyle({
      material: DC.Color.fromCssColorString(color).withAlpha(alpha),
      outline: true,
      outlineColor: DC.Color.WHITE,
      outlineWidth: 2,
    })

    this._ensureLayer().addOverlay(rectangle)
    return rectangle
  }

  /**
   * 清除所有多边形
   */
  clear() {
    if (this._layer) {
      this._layer.clear()
    }
  }

  /**
   * 飞行定位到所有多边形范围
   * @param {number} [duration=2] - 飞行时间（秒）
   */
  flyToExtent(duration = 2) {
    if (!this._layer || this._layer.getOverlays().length === 0) return
    this._viewer.flyTo(this._layer, duration)
  }

  /**
   * 获取多边形数量
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
