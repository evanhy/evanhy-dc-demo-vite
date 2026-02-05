/**
 * 地图配置
 */
export const MAP_CONFIG = {
  // 初始视角 - 苏州区域
  defaultView: {
    lng: 120.62,
    lat: 31.3,
    alt: 80000,
    heading: 0,
    pitch: -90,
  },
  // 底图配置
  baseLayer: {
    type: 'AMAP',
    options: {
      style: 'img', // img: 影像, vec: 矢量, road: 路网
      crs: 'WGS84',
    },
  },
  // Viewer 配置
  viewerOptions: {
    shadows: false,
    showAtmosphere: true,
    showSun: true,
    showMoon: true,
    enableFxaa: true,
    showCredit: false,
    cameraController: {
      enableRotate: true,
      enableTilt: true,
      enableTranslate: true,
      enableZoom: true,
      enableCollisionDetection: true,
      minimumZoomDistance: 1,
      maximumZoomDistance: 40489014,
    },
    globe: {
      show: true,
      showGroundAtmosphere: true,
      enableLighting: false,
      depthTestAgainstTerrain: false,
      tileCacheSize: 100,
    },
  },
}
