/**
 * 分析管理器
 * 管理各种空间分析功能：可视域、通视、日照阴影、裁剪等
 * 基于 DC.Analysis API
 */
export class AnalysisManager {
  constructor(viewer) {
    this._viewer = viewer
    this._analysis = null // DC.Analysis 实例
    this._shadowAnalysis = false // 日照阴影状态
    this._globeClip = null // 地球裁剪
    this._terrainClip = null // 地形裁剪
    this._analysisLayer = null // 分析图层
  }

  /**
   * 获取或创建 Analysis 实例
   */
  _getAnalysis() {
    if (!this._analysis) {
      this._analysis = new DC.Analysis(this._viewer)
    }
    return this._analysis
  }

  /**
   * 确保分析图层存在
   */
  _ensureLayer() {
    if (!this._analysisLayer) {
      this._analysisLayer = new DC.VectorLayer('analysis-layer')
      this._viewer.addLayer(this._analysisLayer)
    }
    return this._analysisLayer
  }

  // ==================== 可视域分析 ====================

  /**
   * 创建可视域分析
   * @param {Object} options - 配置项
   * @param {DC.Position} options.position - 观察点位置
   * @param {number} options.radius - 可视距离
   * @param {number} options.fov - 视场角
   * @param {number} options.aspectRatio - 宽高比
   */
  addViewshed(options) {
    if (!this._viewer) return null
    const {
      position,
      radius = 1000,
      fov = 60,
      aspectRatio = 1.5,
      visibleColor = '#00ff00',
      invisibleColor = '#ff0000',
      showHelp = false,
    } = options || {}

    if (!position) {
      console.error('可视域分析需要观察点位置')
      return null
    }

    try {
      const analysis = this._getAnalysis()
      analysis.viewshed(position, radius, fov, aspectRatio, {
        mixNum: 1,
        visibleColor: DC.Color.fromCssColorString(visibleColor),
        disVisibleColor: DC.Color.fromCssColorString(invisibleColor),
        showHelp: showHelp,
      })
      return analysis
    } catch (e) {
      console.error('创建可视域分析失败:', e)
      return null
    }
  }

  /**
   * 移除可视域分析
   */
  removeViewshed() {
    if (this._analysis) {
      this._analysis.deactivate('viewshed')
    }
  }

  // ==================== 通视线分析 ====================

  /**
   * 添加通视线分析
   * @param {Object} options
   * @param {DC.Position} options.start - 起点
   * @param {DC.Position} options.end - 终点
   * @param {Array} options.excludes - 排除的覆盖物
   * @param {number} options.lerpNum - 插值数量，默认10，越大越精确
   */
  addSightline(options) {
    if (!this._viewer) return null
    const { start, end, excludes = [], lerpNum = 10 } = options || {}

    if (!start || !end) {
      console.error('通视线分析需要起点和终点')
      return null
    }

    try {
      const analysis = this._getAnalysis()
      analysis.sightLine(start, end, excludes, lerpNum)
      return analysis
    } catch (e) {
      console.error('创建通视线分析失败:', e)
      return null
    }
  }

  /**
   * 清除通视线分析
   */
  clearSightlines() {
    if (this._analysis) {
      this._analysis.deactivate('sightLine')
    }
  }

  // ==================== 通视圆分析 ====================

  /**
   * 添加通视圆分析
   * @param {Object} options
   * @param {DC.Position} options.center - 中心点
   * @param {number} options.radius - 半径（米）
   * @param {Array} options.excludes - 排除的覆盖物
   * @param {number} options.lerpNum - 插值数量
   */
  addSightCircle(options) {
    if (!this._viewer) return null
    const { center, radius = 1000, excludes = [], lerpNum = 10 } = options || {}

    if (!center) {
      console.error('通视圆分析需要中心点')
      return null
    }

    try {
      const analysis = this._getAnalysis()
      analysis.sightCircle(center, radius, excludes, lerpNum)
      return analysis
    } catch (e) {
      console.error('创建通视圆分析失败:', e)
      return null
    }
  }

  /**
   * 移除通视圆分析
   */
  removeSightCircle() {
    if (this._analysis) {
      this._analysis.deactivate('sightCircle')
    }
  }

  // ==================== 日照阴影分析 ====================

  /**
   * 开启日照阴影分析
   * @param {Object} options
   * @param {Date} options.startTime - 开始时间
   * @param {number} options.multiplier - 时间倍率
   */
  enableShadowAnalysis(options = {}) {
    if (!this._viewer) return false
    const { startTime = new Date(), multiplier = 1600 } = options

    try {
      const analysis = this._getAnalysis()
      analysis.shadows(startTime, multiplier)
      this._shadowAnalysis = true
      return true
    } catch (e) {
      console.error('开启阴影分析失败:', e)
      return false
    }
  }

  /**
   * 关闭日照阴影分析
   */
  disableShadowAnalysis() {
    if (this._analysis) {
      this._analysis.deactivate('shadows')
    }
    this._shadowAnalysis = false
  }

  /**
   * 设置分析时间
   * @param {Date} time
   */
  setShadowTime(time) {
    if (!this._viewer || !time) return
    const Cesium = DC.getLib('Cesium')
    this._viewer.clock.currentTime = Cesium.JulianDate.fromDate(time)
  }

  /**
   * 检查阴影分析是否开启
   */
  hasShadowAnalysis() {
    return this._shadowAnalysis === true
  }

  // ==================== 等高线分析 ====================

  /**
   * 添加等高线分析
   * @param {Object} options
   * @param {string} options.lineColor - 线颜色
   * @param {number} options.lineWidth - 线宽
   * @param {number} options.lineSpacing - 线间距
   */
  addContourLine(options = {}) {
    const { lineColor = '#ff0000', lineWidth = 2, lineSpacing = 100 } = options

    try {
      const analysis = this._getAnalysis()
      analysis.contourLine(
        DC.Color.fromCssColorString(lineColor),
        lineWidth,
        lineSpacing,
      )
      return analysis
    } catch (e) {
      console.error('创建等高线分析失败:', e)
      return null
    }
  }

  /**
   * 移除等高线分析
   */
  removeContourLine() {
    if (this._analysis) {
      this._analysis.deactivate('contourLine')
    }
  }

  // ==================== 地球裁剪 ====================

  /**
   * 添加地球裁剪
   * @param {Array} positions - 裁剪区域坐标数组
   * @param {Object} options - 配置项
   */
  addGlobeClip(positions, options = {}) {
    if (!this._viewer || !positions?.length) return null

    // 移除旧的裁剪
    this.removeGlobeClip()

    const { edgeColor = '#00ff00', edgeWidth = 2 } = options

    try {
      this._globeClip = new DC.GlobeClipping(this._viewer, {
        edgeWidth: edgeWidth,
        edgeColor: DC.Color.fromCssColorString(edgeColor),
      })
      this._globeClip.positions = positions
      this._globeClip.enable = true
      return this._globeClip
    } catch (e) {
      console.error('创建地球裁剪失败:', e)
      return null
    }
  }

  /**
   * 移除地球裁剪
   */
  removeGlobeClip() {
    if (this._globeClip) {
      this._globeClip.enable = false
      this._globeClip = null
    }
  }

  /**
   * 检查地球裁剪是否存在
   */
  hasGlobeClip() {
    return this._globeClip !== null
  }

  // ==================== 地形裁剪 ====================

  /**
   * 添加地形裁剪
   * @param {Array} positions - 裁剪区域坐标数组
   * @param {Object} options - 配置项
   */
  addTerrainClip(positions, options = {}) {
    if (!this._viewer || !positions?.length) return null

    // 移除旧的裁剪
    this.removeTerrainClip()

    const {
      depth = 100,
      height, // 兼容 height 参数名
      edgeColor = '#ff0000',
      edgeWidth = 2,
      lerpInterval = 50,
      bottomImage = '',
      sideImage = '',
    } = options

    // 优先使用 depth，兼容 height
    const clipHeight = depth ?? height ?? 100

    try {
      this._terrainClip = new DC.TerrainClipping(this._viewer, {
        edgeWidth: edgeWidth,
        edgeColor: DC.Color.fromCssColorString(edgeColor),
        lerpInterval: lerpInterval,
        bottomImage: bottomImage,
        sideImage: sideImage,
      })
      this._terrainClip.positions = positions
      this._terrainClip.height = clipHeight
      this._terrainClip.enable = true
      return this._terrainClip
    } catch (e) {
      console.error('创建地形裁剪失败:', e)
      return null
    }
  }

  /**
   * 移除地形裁剪
   */
  removeTerrainClip() {
    if (this._terrainClip) {
      this._terrainClip.enable = false
      this._terrainClip = null
    }
  }

  /**
   * 检查地形裁剪是否存在
   */
  hasTerrainClip() {
    return this._terrainClip !== null
  }

  // ==================== 清除和销毁 ====================

  /**
   * 清除所有分析
   */
  clearAll() {
    if (this._analysis) {
      this._analysis.deactivate()
    }
    this._shadowAnalysis = false
    this.removeGlobeClip()
    this.removeTerrainClip()
    if (this._analysisLayer) {
      this._analysisLayer.clear()
    }
  }

  /**
   * 销毁
   */
  destroy() {
    this.clearAll()
    if (this._analysisLayer) {
      this._viewer?.removeLayer(this._analysisLayer)
      this._analysisLayer = null
    }
    this._analysis = null
    this._viewer = null
  }
}
