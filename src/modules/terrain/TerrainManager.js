/**
 * 地形管理器
 * 管理地形数据的加载和切换
 */

const Cesium = DC.getLib('Cesium')

export class TerrainManager {
  constructor(viewer) {
    this._viewer = viewer
    this._currentType = 'ellipsoid' // 当前地形类型
  }

  /**
   * 获取当前地形类型
   * @returns {string}
   */
  getCurrentType() {
    return this._currentType
  }

  /**
   * 设置椭球地形（无地形）
   */
  setEllipsoid() {
    if (!this._viewer) return false
    this._viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider()
    this._currentType = 'ellipsoid'
    return true
  }

  /**
   * 设置 Cesium World Terrain
   */
  async setCesiumTerrain() {
    if (!this._viewer) return false
    try {
      const terrainProvider = await Cesium.createWorldTerrainAsync({
        requestWaterMask: true,
        requestVertexNormals: true,
      })
      this._viewer.terrainProvider = terrainProvider
      this._currentType = 'cesium'
      return true
    } catch (e) {
      console.error('加载 Cesium 地形失败:', e)
      return false
    }
  }

  /**
   * 设置自定义 URL 地形服务
   * @param {string} url - 地形服务 URL
   */
  async setUrlTerrain(url) {
    if (!this._viewer || !url) return false
    try {
      const terrainProvider = await Cesium.CesiumTerrainProvider.fromUrl(url, {
        requestWaterMask: true,
        requestVertexNormals: true,
      })
      this._viewer.terrainProvider = terrainProvider
      this._currentType = 'url'
      return true
    } catch (e) {
      console.error('加载 URL 地形失败:', e)
      return false
    }
  }

  /**
   * 设置 ArcGIS 地形服务
   */
  async setArcGISTerrain() {
    if (!this._viewer) return false
    try {
      const terrainProvider =
        await Cesium.ArcGISTiledElevationTerrainProvider.fromUrl(
          'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
        )
      this._viewer.terrainProvider = terrainProvider
      this._currentType = 'arcgis'
      return true
    } catch (e) {
      console.error('加载 ArcGIS 地形失败:', e)
      return false
    }
  }

  /**
   * 设置地形夸张系数
   * @param {number} exaggeration - 夸张系数
   */
  setTerrainExaggeration(exaggeration) {
    if (!this._viewer) return
    // Cesium 1.109+ 使用新的地形夸张 API
    if (
      this._viewer.scene &&
      this._viewer.scene.verticalExaggeration !== undefined
    ) {
      this._viewer.scene.verticalExaggeration = exaggeration
    }
  }

  /**
   * 开启/关闭深度测试
   * @param {boolean} enable
   */
  setDepthTest(enable) {
    if (!this._viewer) return
    this._viewer.scene.globe.depthTestAgainstTerrain = enable
  }

  /**
   * 开启/关闭地形光照
   * @param {boolean} enable
   */
  setTerrainLighting(enable) {
    if (!this._viewer) return
    this._viewer.scene.globe.enableLighting = enable
  }

  /**
   * 飞行到指定位置查看地形效果
   * @param {Object} options - 飞行选项 { lng, lat, alt, heading, pitch }
   * @param {number} duration - 飞行时间（秒）
   */
  flyTo(options, duration = 2) {
    if (!this._viewer) return
    const {
      lng = 116.4,
      lat = 39.9,
      alt = 50000,
      heading = 0,
      pitch = -45,
    } = options || {}
    const position = new DC.Position(lng, lat, alt, heading, pitch)
    this._viewer.flyToPosition(position, () => {}, duration)
  }

  /**
   * 销毁
   */
  destroy() {
    this._viewer = null
    this._currentType = 'ellipsoid'
  }
}
