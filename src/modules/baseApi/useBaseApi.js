import { ref, reactive, watch, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useViewerStore } from '../../stores/viewer.js'

/**
 * DC-SDK 基础 API Composable
 *
 * 提供 DC-SDK Viewer 核心功能的响应式封装，包括：
 * - 场景模式切换（2D/2.5D/3D）
 * - 小部件控制（Popup、Tooltip、ContextMenu、LoadingMask）
 * - 导航控件（罗盘、缩放控制、坐标栏、比例尺）
 * - 地图分割（卷帘对比）
 * - 渲染设置（阴影、抗锯齿、深度检测、地形夸大）
 * - 飞行定位（自定义坐标、预设城市）
 * - Viewer 信息实时显示（相机位置、分辨率、缩放级别）
 *
 * @see https://resource.dvgis.cn/dc-docs/zh/api/base
 * @returns {Object} 响应式状态和控制方法
 */
export function useBaseApi() {
  // ==================== Store 引用 ====================

  /**
   * 获取 Viewer Store
   * viewer: DC.Viewer 实例（shallowRef）
   * isReady: Viewer 是否已初始化完成
   */
  const viewerStore = useViewerStore()
  const { viewer, isReady } = storeToRefs(viewerStore)

  /**
   * 操作消息提示
   * @type {Ref<{type: 'info'|'success'|'error', text: string}|null>}
   */
  const message = ref(null)

  // ==================== 场景模式状态 ====================

  /**
   * 当前场景模式
   * - '3D': 三维球面模式 (SceneMode.SCENE3D = 3)
   * - '2.5D': 哥伦布视图模式 (SceneMode.COLUMBUS_VIEW = 1)
   * - '2D': 二维平面模式 (SceneMode.SCENE2D = 2)
   */
  const sceneMode = ref('3D')

  // ==================== 小部件状态 ====================

  /**
   * 小部件开关状态
   * 这些小部件是 DC.Viewer 内置的 UI 组件
   */
  const widgetState = reactive({
    /** Popup 气泡窗口 - 用于在地图上显示信息弹窗 */
    popup: false,
    /** Tooltip 提示框 - 用于显示鼠标悬停提示 */
    tooltip: false,
    /** ContextMenu 右键菜单 - 用于显示右键操作菜单 */
    contextMenu: false,
    /** LoadingMask 加载蒙层 - 用于显示加载状态 */
    loadingMask: false,
  })

  // ==================== 导航控件状态 ====================

  /**
   * 导航控件开关状态
   * 这些是 DC.Viewer 内置的导航辅助控件
   */
  const navControlState = reactive({
    /** Compass 罗盘 - 显示当前朝向，可点击重置北向 */
    compass: false,
    /** ZoomController 缩放控制 - 显示缩放按钮 */
    zoomController: false,
    /** LocationBar 坐标栏 - 显示鼠标位置的经纬度坐标 */
    locationBar: false,
    /** DistanceLegend 比例尺 - 显示当前缩放级别对应的距离 */
    distanceLegend: false,
  })

  // ==================== 分割功能状态 ====================

  /**
   * 地图分割功能状态
   */
  const splitState = reactive({
    /** MapSplit 地图分割（卷帘对比）- 用于对比两个不同的底图 */
    mapSplit: false,
  })

  /**
   * 分割功能使用的底图图层引用
   * 用于在关闭分割时清理资源
   */
  let splitBaseLayer = null

  // ==================== 天空盒状态 ====================

  /**
   * 天空盒功能状态
   * - skyBox: 标准天空盒 (DC.SkyBox)
   * - groundSkyBox: 近地天空盒 (DC.GroundSkyBox)，相机靠近地面时也能看到天空
   */
  const skyBoxState = reactive({
    /** 标准天空盒 */
    skyBox: false,
    /** 近地天空盒 */
    groundSkyBox: false,
  })

  /**
   * 天空盒贴图资源路径
   * 使用立方体贴图（6个面）
   */
  const skyBoxSources = {
    positiveX: '/images/sky-box/px.png',
    negativeX: '/images/sky-box/nx.png',
    positiveY: '/images/sky-box/py.png',
    negativeY: '/images/sky-box/ny.png',
    positiveZ: '/images/sky-box/pz.png',
    negativeZ: '/images/sky-box/nz.png',
  }

  /**
   * 近地天空盒参数
   */
  const groundSkyBoxParams = reactive({
    /** 旋转角度（度） */
    offsetAngle: 0,
  })

  /** 保存原始天空盒引用，用于恢复 */
  let originalSkyBox = null

  // ==================== 渲染设置 ====================

  /**
   * 渲染设置参数
   * 通过 viewer.setOptions() 应用到场景
   */
  const renderSettings = reactive({
    /** shadows 阴影 - 开启后物体会投射阴影（性能消耗较大） */
    shadows: false,
    /** enableFxaa 快速近似抗锯齿 - 减少锯齿边缘 */
    fxaa: true,
    /** depthTestAgainstTerrain 深度检测 - 开启后物体会被地形遮挡 */
    depthTest: false,
    /** terrainExaggeration 地形夸大 - 放大地形起伏效果（1.0为原始高度） */
    terrainExaggeration: 1.0,
  })

  // ==================== 飞行参数 ====================

  /**
   * 相机飞行参数
   * 用于 flyToPosition 方法
   */
  const flyParams = reactive({
    /** lng 经度 - 范围 -180 到 180 */
    lng: 120.62,
    /** lat 纬度 - 范围 -90 到 90 */
    lat: 31.32,
    /** alt 高度 - 相机距地面高度（米） */
    alt: 50000,
    /** heading 偏航角 - 相机朝向（度），0为正北 */
    heading: 0,
    /** pitch 俯仰角 - 相机俯仰（度），-90为垂直向下 */
    pitch: -45,
    /** duration 飞行时长 - 动画持续时间（秒） */
    duration: 2,
  })

  /**
   * 预设位置配置
   * 提供常用城市的快速定位
   */
  const presetLocations = {
    suzhou: { lng: 120.62, lat: 31.32, alt: 50000, name: '苏州' },
    beijing: { lng: 116.4, lat: 39.9, alt: 80000, name: '北京' },
    shanghai: { lng: 121.47, lat: 31.23, alt: 60000, name: '上海' },
    guangzhou: { lng: 113.26, lat: 23.13, alt: 60000, name: '广州' },
  }

  // ==================== Viewer 信息 ====================

  /**
   * Viewer 实时信息
   * 通过定时器每 500ms 更新一次
   */
  const viewerInfo = reactive({
    /** cameraPosition 相机位置 - 当前相机的经纬度和高度 */
    cameraPosition: { lng: 0, lat: 0, alt: 0 },
    /** resolution 分辨率 - 当前视图每像素代表的米数 */
    resolution: 0,
    /** zoom 缩放级别 - 类似地图的 zoom 层级 */
    zoom: 0,
  })

  /** 信息更新定时器引用 */
  let infoUpdateTimer = null

  // ==================== 场景模式控制 ====================

  /**
   * 切换场景模式
   *
   * @param {'3D'|'2.5D'|'2D'} mode - 目标场景模式
   *
   * @description
   * DC-SDK 场景模式说明：
   * - 3D (SCENE3D=3): 标准三维地球视图
   * - 2.5D (COLUMBUS_VIEW=1): 哥伦布视图，平面但保留高度信息
   * - 2D (SCENE2D=2): 纯二维平面视图
   *
   * @see DC.Viewer.changeSceneMode(sceneMode, duration)
   */
  function changeSceneMode(mode) {
    if (!viewer.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    // 场景模式映射：字符串 -> DC 枚举值
    const modeMap = {
      '3D': 3, // DC.SceneMode.SCENE3D
      '2.5D': 1, // DC.SceneMode.COLUMBUS_VIEW
      '2D': 2, // DC.SceneMode.SCENE2D
    }

    try {
      // 第二个参数是过渡动画时长（秒）
      viewer.value.changeSceneMode(modeMap[mode], 1)
      sceneMode.value = mode
      message.value = { type: 'info', text: `已切换到 ${mode} 模式` }
    } catch (e) {
      message.value = { type: 'error', text: `切换失败: ${e.message}` }
    }
  }

  // ==================== 小部件控制 ====================

  /**
   * 切换 Popup 气泡窗口
   *
   * @description
   * Popup 是 DC-SDK 内置的信息弹窗组件，可以在地图上指定位置显示 HTML 内容。
   *
   * API 说明：
   * - popup.showAt(position, content): 在指定位置显示内容
   *   - position: Cartesian3 世界坐标（需要从经纬度转换）
   *   - content: HTML 字符串或 DOM 元素
   * - popup.hide(): 隐藏弹窗
   *
   * @see DC.Viewer.popup
   */
  function togglePopup() {
    const popup = viewer.value?.popup
    if (!popup) return

    widgetState.popup = !widgetState.popup

    if (widgetState.popup) {
      // 获取 Cesium 库（DC-SDK 基于 Cesium）
      const Cesium = DC.getLib('Cesium')

      // 将经纬度转换为 Cartesian3 世界坐标
      // Cesium.Cartesian3.fromDegrees(lng, lat, height)
      const cartesian = Cesium.Cartesian3.fromDegrees(
        flyParams.lng,
        flyParams.lat,
        0, // 高度为 0，贴地显示
      )

      // 在指定位置显示 Popup
      popup.showAt(
        cartesian,
        '<div style="padding: 10px; color: #333;">这是一个 Popup 示例</div>',
      )
    } else {
      popup.hide()
    }
  }

  /**
   * 切换 Tooltip 提示框
   *
   * @description
   * Tooltip 用于在屏幕指定位置显示提示文本。
   *
   * API 说明：
   * - tooltip.enable: 是否启用
   * - tooltip.showAt(windowPosition, content): 在屏幕坐标显示内容
   *   - windowPosition: {x, y} 屏幕像素坐标
   *   - content: 提示文本
   *
   * @see DC.Viewer.tooltip
   */
  function toggleTooltip() {
    if (!viewer.value?.tooltip) return
    widgetState.tooltip = !widgetState.tooltip
    viewer.value.tooltip.enable = widgetState.tooltip

    // 在屏幕坐标 (500, 100) 位置显示提示
    viewer.value.tooltip.showAt({ x: 500, y: 100 }, '测试')
  }

  /**
   * 切换 ContextMenu 右键菜单
   *
   * @description
   * ContextMenu 用于显示右键操作菜单。
   * 可通过 contextMenu.DEFAULT_MENU 设置默认菜单项。
   *
   * @see DC.Viewer.contextMenu
   */
  function toggleContextMenu() {
    if (!viewer.value?.contextMenu) return
    widgetState.contextMenu = !widgetState.contextMenu
    viewer.value.contextMenu.enable = widgetState.contextMenu
  }

  /**
   * 切换 LoadingMask 加载蒙层
   *
   * @description
   * LoadingMask 用于在地图加载时显示遮罩层。
   *
   * @see DC.Viewer.loadingMask
   */
  function toggleLoadingMask() {
    if (!viewer.value?.loadingMask) return
    widgetState.loadingMask = !widgetState.loadingMask
    viewer.value.loadingMask.enable = widgetState.loadingMask
  }

  // ==================== 导航控件控制 ====================

  /**
   * 切换 Compass 罗盘
   *
   * @description
   * 罗盘显示当前相机朝向，点击可重置为正北方向。
   *
   * @see DC.Viewer.compass
   */
  function toggleCompass() {
    if (!viewer.value?.compass) return
    navControlState.compass = !navControlState.compass
    viewer.value.compass.enable = navControlState.compass
  }

  /**
   * 切换 ZoomController 缩放控制器
   *
   * @description
   * 显示缩放按钮（+/-），用于控制地图缩放。
   *
   * @see DC.Viewer.zoomController
   */
  function toggleZoomController() {
    if (!viewer.value?.zoomController) return
    navControlState.zoomController = !navControlState.zoomController
    viewer.value.zoomController.enable = navControlState.zoomController
  }

  /**
   * 切换 LocationBar 坐标栏
   *
   * @description
   * 在地图底部显示鼠标当前位置的经纬度坐标。
   *
   * @see DC.Viewer.locationBar
   */
  function toggleLocationBar() {
    if (!viewer.value?.locationBar) return
    navControlState.locationBar = !navControlState.locationBar
    viewer.value.locationBar.enable = navControlState.locationBar
  }

  /**
   * 切换 DistanceLegend 比例尺
   *
   * @description
   * 显示当前缩放级别对应的距离比例尺。
   *
   * @see DC.Viewer.distanceLegend
   */
  function toggleDistanceLegend() {
    if (!viewer.value?.distanceLegend) return
    navControlState.distanceLegend = !navControlState.distanceLegend
    viewer.value.distanceLegend.enable = navControlState.distanceLegend
  }

  // ==================== 分割功能控制 ====================

  /**
   * 切换 MapSplit 地图分割（卷帘对比）
   *
   * @description
   * 地图分割功能用于对比两个不同的底图图层。
   * 开启后会在地图中间显示一个可拖动的分割条，
   * 左右两侧分别显示不同的底图。
   *
   * API 说明：
   * - mapSplit.enable: 是否启用分割
   * - mapSplit.addBaseLayer(baseLayer, splitDirection):
   *   - baseLayer: 底图图层
   *   - splitDirection: -1(左侧), 0(无), 1(右侧)
   *
   * @see DC.Viewer.mapSplit
   * @see DC.ImageryLayerFactory
   */
  function toggleMapSplit() {
    if (!viewer.value?.mapSplit) return

    splitState.mapSplit = !splitState.mapSplit

    if (splitState.mapSplit) {
      // 创建 Google 影像底图用于对比
      // DC.ImageryLayerFactory 提供多种底图创建方法
      splitBaseLayer = DC.ImageryLayerFactory.createGoogleImageryLayer()

      // 启用地图分割
      viewer.value.mapSplit.enable = true

      // 将新底图添加到左侧（-1）
      // 原底图默认在右侧
      viewer.value.mapSplit.addBaseLayer(splitBaseLayer, -1)
    } else {
      // 关闭地图分割
      viewer.value.mapSplit.enable = false
      splitBaseLayer = null
    }
  }

  // ==================== 天空盒控制 ====================

  /**
   * 切换标准天空盒 (DC.SkyBox)
   *
   * @description
   * 标准天空盒用于渲染远处的天空背景。
   * 使用立方体贴图（6个面）创建全景天空效果。
   *
   * API 说明：
   * - new DC.SkyBox({ sources: {...} }): 创建天空盒
   * - scene.skyBox: 设置场景天空盒
   *
   * @see DC.SkyBox
   */
  function toggleSkyBox() {
    if (!viewer.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    // 如果开启近地天空盒，先关闭
    if (skyBoxState.groundSkyBox) {
      skyBoxState.groundSkyBox = false
    }

    skyBoxState.skyBox = !skyBoxState.skyBox

    try {
      const scene = viewer.value.scene

      if (skyBoxState.skyBox) {
        // 保存原始天空盒
        if (!originalSkyBox) {
          originalSkyBox = scene.skyBox
        }

        // 创建新的天空盒
        const skyBox = new DC.SkyBox({
          sources: skyBoxSources,
        })
        scene.skyBox = skyBox

        message.value = { type: 'info', text: '已开启天空盒' }
      } else {
        // 恢复原始天空盒
        if (originalSkyBox) {
          scene.skyBox = originalSkyBox
        }
        message.value = { type: 'info', text: '已关闭天空盒' }
      }
    } catch (e) {
      message.value = { type: 'error', text: `天空盒切换失败: ${e.message}` }
    }
  }

  /**
   * 切换近地天空盒 (DC.GroundSkyBox)
   *
   * @description
   * 近地天空盒是标准天空盒的增强版本。
   * 当相机靠近地面时，标准天空盒可能会消失，
   * 而近地天空盒会根据相机高度动态调整，始终可见。
   *
   * 额外属性：
   * - offsetAngle: 旋转角度，可用于调整天空方向
   *
   * @see DC.GroundSkyBox
   */
  function toggleGroundSkyBox() {
    if (!viewer.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    // 如果开启标准天空盒，先关闭
    if (skyBoxState.skyBox) {
      skyBoxState.skyBox = false
    }

    skyBoxState.groundSkyBox = !skyBoxState.groundSkyBox

    try {
      const scene = viewer.value.scene

      if (skyBoxState.groundSkyBox) {
        // 保存原始天空盒
        if (!originalSkyBox) {
          originalSkyBox = scene.skyBox
        }

        // 创建近地天空盒
        const groundSkyBox = new DC.GroundSkyBox({
          sources: skyBoxSources,
          offsetAngle: groundSkyBoxParams.offsetAngle,
        })
        scene.skyBox = groundSkyBox

        message.value = { type: 'info', text: '已开启近地天空盒' }
      } else {
        // 恢复原始天空盒
        if (originalSkyBox) {
          scene.skyBox = originalSkyBox
        }
        message.value = { type: 'info', text: '已关闭近地天空盒' }
      }
    } catch (e) {
      message.value = {
        type: 'error',
        text: `近地天空盒切换失败: ${e.message}`,
      }
    }
  }

  /**
   * 更新近地天空盒旋转角度
   */
  function updateGroundSkyBoxAngle() {
    if (!viewer.value || !skyBoxState.groundSkyBox) return

    try {
      const scene = viewer.value.scene
      if (scene.skyBox && scene.skyBox.offsetAngle !== undefined) {
        scene.skyBox.offsetAngle = groundSkyBoxParams.offsetAngle
      }
    } catch (e) {
      console.warn('更新天空盒角度失败:', e)
    }
  }

  /**
   * 监听近地天空盒参数变化
   */
  watch(
    () => groundSkyBoxParams.offsetAngle,
    () => {
      updateGroundSkyBoxAngle()
    },
  )

  // ==================== 渲染设置 ====================

  /**
   * 应用渲染设置到 Viewer
   *
   * @description
   * 通过 viewer.setOptions() 方法批量设置场景渲染参数。
   *
   * 可用配置项：
   * - shadows: 是否开启阴影
   * - enableFxaa: 是否开启快速近似抗锯齿
   * - globe.depthTestAgainstTerrain: 是否开启地形深度检测
   * - globe.terrainExaggeration: 地形夸大系数
   *
   * @see DC.Viewer.setOptions()
   */
  function applyRenderSettings() {
    if (!viewer.value) return

    try {
      viewer.value.setOptions({
        shadows: renderSettings.shadows,
        enableFxaa: renderSettings.fxaa,
        globe: {
          depthTestAgainstTerrain: renderSettings.depthTest,
          terrainExaggeration: renderSettings.terrainExaggeration,
        },
      })
    } catch (e) {
      console.warn('应用渲染设置失败:', e)
    }
  }

  /**
   * 监听渲染设置变化，自动应用
   * 使用展开运算符创建新对象，确保能检测到嵌套属性变化
   */
  watch(
    () => ({ ...renderSettings }),
    () => {
      applyRenderSettings()
    },
    { deep: true },
  )

  // ==================== 飞行控制 ====================

  /**
   * 飞行到指定位置
   *
   * @description
   * 使用 flyParams 中的参数，控制相机飞行到指定位置。
   *
   * API 说明：
   * - DC.Position(lng, lat, alt, heading, pitch, roll):
   *   创建包含位置和姿态的坐标对象
   * - viewer.flyToPosition(position, callback, duration):
   *   - position: DC.Position 对象
   *   - callback: 飞行完成回调
   *   - duration: 飞行时长（秒）
   *
   * @see DC.Position
   * @see DC.Viewer.flyToPosition()
   */
  function flyToPosition() {
    if (!viewer.value) {
      message.value = { type: 'error', text: 'Viewer 未就绪' }
      return
    }

    try {
      // 创建位置对象（包含经纬度、高度、姿态）
      const position = new DC.Position(
        flyParams.lng, // 经度
        flyParams.lat, // 纬度
        flyParams.alt, // 高度（米）
        flyParams.heading, // 偏航角（度）
        flyParams.pitch, // 俯仰角（度）
      )

      // 执行飞行动画
      viewer.value.flyToPosition(
        position,
        () => {
          message.value = { type: 'success', text: '飞行完成' }
        },
        flyParams.duration, // 飞行时长（秒）
      )
    } catch (e) {
      message.value = { type: 'error', text: `飞行失败: ${e.message}` }
    }
  }

  /**
   * 飞行到预设位置
   *
   * @param {string} presetKey - 预设位置的键名（suzhou/beijing/shanghai/guangzhou）
   */
  function flyToPreset(presetKey) {
    const preset = presetLocations[presetKey]
    if (!preset) return

    // 更新飞行参数
    flyParams.lng = preset.lng
    flyParams.lat = preset.lat
    flyParams.alt = preset.alt

    // 执行飞行
    flyToPosition()
  }

  // ==================== Viewer 信息更新 ====================

  /**
   * 更新 Viewer 实时信息
   *
   * @description
   * 从 viewer 实例获取当前相机位置、分辨率、缩放级别等信息。
   *
   * API 说明：
   * - viewer.cameraPosition: 当前相机位置（DC.Position 对象）
   * - viewer.resolution: 当前分辨率（米/像素）
   * - viewer.zoom: 当前缩放级别
   */
  function updateViewerInfo() {
    if (!viewer.value) return

    try {
      // 获取相机位置
      const cameraPos = viewer.value.cameraPosition
      if (cameraPos) {
        viewerInfo.cameraPosition = {
          lng: cameraPos.lng?.toFixed(4) || 0,
          lat: cameraPos.lat?.toFixed(4) || 0,
          alt: cameraPos.alt?.toFixed(0) || 0,
        }
      }

      // 获取分辨率和缩放级别
      viewerInfo.resolution = viewer.value.resolution?.toFixed(2) || 0
      viewerInfo.zoom = viewer.value.zoom?.toFixed(1) || 0
    } catch (e) {
      // 静默处理异常，避免影响定时器
    }
  }

  /**
   * 启动信息更新定时器
   * 每 500ms 更新一次 Viewer 信息
   */
  function startInfoUpdate() {
    if (infoUpdateTimer) return
    infoUpdateTimer = setInterval(updateViewerInfo, 500)
  }

  /**
   * 停止信息更新定时器
   */
  function stopInfoUpdate() {
    if (infoUpdateTimer) {
      clearInterval(infoUpdateTimer)
      infoUpdateTimer = null
    }
  }

  // ==================== 状态同步 ====================

  /**
   * 同步 Viewer 当前状态到响应式变量
   *
   * @description
   * 在 Viewer 初始化完成后调用，将 Viewer 的实际状态
   * 同步到 Vue 响应式变量，保持 UI 与实际状态一致。
   */
  function syncCurrentState() {
    if (!viewer.value) return

    // 同步导航控件状态
    navControlState.compass = viewer.value.compass?.enable ?? false
    navControlState.zoomController =
      viewer.value.zoomController?.enable ?? false
    navControlState.locationBar = viewer.value.locationBar?.enable ?? false
    navControlState.distanceLegend =
      viewer.value.distanceLegend?.enable ?? false

    // 小部件状态保持默认 false，不同步 viewer 状态
    // 避免 viewer 默认开启的小部件导致 UI 状态不一致

    // 同步场景模式
    const mode = viewer.value.scene?.mode
    if (mode === 2) sceneMode.value = '2D'
    else if (mode === 1) sceneMode.value = '2.5D'
    else sceneMode.value = '3D'
  }

  // ==================== 初始化 ====================

  /**
   * 监听 Viewer 就绪状态
   * 当 Viewer 初始化完成后，同步状态并启动信息更新
   */
  watch(
    isReady,
    (ready) => {
      if (ready && viewer.value) {
        syncCurrentState()
        startInfoUpdate()
      }
    },
    { immediate: true }, // 立即执行一次，处理已就绪的情况
  )

  // ==================== 清理 ====================

  /**
   * 组件卸载时清理资源
   * 停止定时器，避免内存泄漏
   */
  onUnmounted(() => {
    stopInfoUpdate()
  })

  // ==================== 返回值 ====================

  return {
    // ===== 响应式状态 =====
    /** 操作消息提示 */
    message,
    /** 当前场景模式 */
    sceneMode,
    /** 小部件开关状态 */
    widgetState,
    /** 导航控件开关状态 */
    navControlState,
    /** 渲染设置参数 */
    renderSettings,
    /** 飞行参数 */
    flyParams,
    /** Viewer 实时信息 */
    viewerInfo,
    /** 预设位置配置 */
    presetLocations,

    // ===== 场景模式 =====
    /** 切换场景模式 */
    changeSceneMode,

    // ===== 小部件控制 =====
    /** 切换 Popup */
    togglePopup,
    /** 切换 Tooltip */
    toggleTooltip,
    /** 切换 ContextMenu */
    toggleContextMenu,
    /** 切换 LoadingMask */
    toggleLoadingMask,

    // ===== 导航控件 =====
    /** 切换罗盘 */
    toggleCompass,
    /** 切换缩放控制器 */
    toggleZoomController,
    /** 切换坐标栏 */
    toggleLocationBar,
    /** 切换比例尺 */
    toggleDistanceLegend,

    // ===== 分割功能 =====
    /** 分割功能状态 */
    splitState,
    /** 切换地图分割 */
    toggleMapSplit,

    // ===== 天空盒 =====
    /** 天空盒状态 */
    skyBoxState,
    /** 近地天空盒参数 */
    groundSkyBoxParams,
    /** 切换标准天空盒 */
    toggleSkyBox,
    /** 切换近地天空盒 */
    toggleGroundSkyBox,

    // ===== 飞行控制 =====
    /** 飞行到指定位置 */
    flyToPosition,
    /** 飞行到预设位置 */
    flyToPreset,
  }
}
