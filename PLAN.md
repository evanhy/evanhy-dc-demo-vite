# DC-SDK + Vue3 + Vite Cesium 地图演示系统 - 实施计划

## 项目架构

```
src/
├── composables/
│   └── useViewer.js          # 核心：viewer 实例 provide/inject 管理
├── map/
│   └── MapContainer.vue      # 地图容器，DC.ready + Viewer 初始化
├── config/
│   └── map.js                # 地图配置（初始视角、底图等）
├── modules/
│   ├── marker/               # 点位模块
│   │   ├── MarkerManager.js
│   │   └── useMarker.js
│   ├── polygon/              # 多边形模块
│   │   ├── PolygonManager.js
│   │   └── usePolygon.js
│   ├── polyline/             # 折线模块
│   │   ├── PolylineManager.js
│   │   └── usePolyline.js
│   ├── effect/               # 特效模块（水面、天气、后处理）
│   │   ├── WaterManager.js
│   │   ├── EffectManager.js
│   │   ├── useWater.js
│   │   └── useEffect.js
│   ├── terrain/              # 地形模块
│   │   ├── TerrainManager.js
│   │   └── useTerrain.js
│   └── analysis/             # 分析模块
│       ├── AnalysisManager.js
│       └── useAnalysis.js
├── components/
│   ├── ControlPanel.vue      # 侧边栏控制面板
│   ├── PanelSection.vue      # 可折叠面板区块
│   └── demos/                # 各功能演示组件
│       ├── MarkerDemo.vue
│       ├── PolygonDemo.vue
│       ├── WaterDemo.vue
│       ├── EffectDemo.vue
│       └── AnalysisDemo.vue
├── App.vue
├── main.js
└── style.css
```

## 核心设计原则

- **不使用 Vue Router**：单页地图应用
- **不引入 Pinia**：viewer 通过 provide/inject 共享
- **Manager + Composable 模式**：Manager 封装 DC-SDK API，Composable 提供响应式封装
- **左侧固定侧边栏 + 右侧全屏地图**布局

---

## 阶段一：基础架构 + Viewer 初始化 ✅

### 目标
搭建核心骨架，Viewer 正确初始化，控制面板 UI 框架就位。

### 文件清单

| 文件 | 操作 | 状态 |
|------|------|------|
| `src/config/map.js` | 新建 | ✅ |
| `src/composables/useViewer.js` | 新建 | ✅ |
| `src/map/MapContainer.vue` | 新建 | ✅ |
| `src/components/ControlPanel.vue` | 新建 | ✅ |
| `src/components/PanelSection.vue` | 新建 | ✅ |
| `src/App.vue` | 修改 | ✅ |
| `src/style.css` | 修改 | ✅ |

### 验收标准
- [x] 地图正确加载并显示高德影像底图
- [x] 侧边栏面板可见，可折叠/展开
- [x] 控制台无报错

---

## 阶段二：点位加载（Marker） ✅

### 目标
实现 Billboard/Label/Point 点位加载，支持批量加载、清除、飞行定位。

### 文件清单

| 文件 | 操作 | 状态 |
|------|------|------|
| `src/modules/marker/MarkerManager.js` | 新建 | ✅ |
| `src/modules/marker/useMarker.js` | 新建 | ✅ |
| `src/components/demos/MarkerDemo.vue` | 新建 | ✅ |
| `src/App.vue` | 修改 | ✅ |

### 功能点
- 加载示例点位（20/100 个随机点）
- 支持 Billboard（图标）和 Label（文本）
- 清除所有点位
- 飞行定位到点位范围

### 验收标准
- [x] 点击按钮后地图显示随机分布的点位
- [x] 点位带有名称标签
- [x] 清除和飞行定位功能正常

---

## 阶段三：面加载（Polygon + Polyline） ✅

### 目标
实现多边形和折线加载，支持不同样式和材质。

### 文件清单

| 文件 | 操作 | 状态 |
|------|------|------|
| `src/modules/polygon/PolygonManager.js` | 新建 | ✅ |
| `src/modules/polygon/usePolygon.js` | 新建 | ✅ |
| `src/modules/polyline/PolylineManager.js` | 新建 | ✅ |
| `src/modules/polyline/usePolyline.js` | 新建 | ✅ |
| `src/components/demos/PolygonDemo.vue` | 新建 | ✅ |
| `src/App.vue` | 修改 | ✅ |

### 功能点
- 多边形：普通填充、拉伸高度、半透明、圆形
- 折线：实线、发光线、箭头线、虚线、流动线

### 验收标准
- [x] 多边形正确渲染，支持半透明填充和描边
- [x] 拉伸多边形有高度效果
- [x] 折线支持 4 种材质样式

---

## 阶段四：水动力效果 ✅

### 目标
实现 WaterPrimitive 水面效果，支持参数动态调节。

### 文件清单

| 文件 | 操作 | 状态 |
|------|------|------|
| `src/modules/effect/WaterManager.js` | 新建 | ✅ |
| `src/modules/effect/useWater.js` | 新建 | ✅ |
| `src/components/demos/WaterDemo.vue` | 新建 | ✅ |
| `src/App.vue` | 修改 | ✅ |

### 功能点
- 加载示例河流/湖面
- 参数调节：颜色、频率、动画速度、振幅、镜面反射

### 验收标准
- [x] 水面正确渲染，有波纹动画效果
- [x] 参数滑块实时影响水面表现
- [x] 支持河流型和湖面型两种预设

---

## 阶段五：天气特效 + 后处理 ✅

### 目标
实现天气效果（雨/雪/雾/云）和视觉后处理（bloom/夜视等）。

### 文件清单

| 文件 | 操作 | 状态 |
|------|------|------|
| `src/modules/effect/EffectManager.js` | 新建 | ✅ |
| `src/modules/effect/useEffect.js` | 新建 | ✅ |
| `src/components/demos/EffectDemo.vue` | 新建 | ✅ |
| `src/App.vue` | 修改 | ✅ |

### 功能点
- 天气：雨、雪、雾、云（独立开关 + 参数调节）
- 后处理：Bloom、夜视、亮度
- 扫描效果：圆形扫描、雷达扫描

### 验收标准
- [x] 可独立开启/关闭雨、雪、雾、云效果
- [x] Bloom 等后处理效果可控
- [x] 圆形扫描和雷达扫描可启动/停止

---

## 阶段六：地形 + 分析功能 ✅

### 目标
加载地形数据，实现视域分析、阴影分析、通视分析等。

### 文件清单

| 文件 | 操作 | 状态 |
|------|------|------|
| `src/modules/terrain/TerrainManager.js` | 新建 | ✅ |
| `src/modules/terrain/useTerrain.js` | 新建 | ✅ |
| `src/modules/analysis/AnalysisManager.js` | 新建 | ✅ |
| `src/modules/analysis/useAnalysis.js` | 新建 | ✅ |
| `src/components/demos/TerrainDemo.vue` | 新建 | ✅ |
| `src/components/demos/AnalysisDemo.vue` | 新建 | ✅ |
| `src/App.vue` | 修改 | ✅ |

### 功能点
- 地形：椭球/Cesium/ArcGIS/自定义URL 地形切换
- 地形设置：夸张系数、深度测试、地形光照
- 分析：可视域、通视线、通视圆、日照阴影
- 裁剪：地球裁剪、地形裁剪

### 验收标准
- [x] 地形正确加载
- [x] 各分析功能可正常运行并显示结果
- [x] 裁剪功能正常

---

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `src/composables/useViewer.js` | 核心枢纽，所有模块依赖此获取 viewer |
| `src/map/MapContainer.vue` | 地图容器，DC.ready 初始化 |
| `src/components/ControlPanel.vue` | 侧边栏 UI 框架 |
| `src/modules/*/Manager.js` | 各模块的核心逻辑类 |
| `src/modules/*/use*.js` | 各模块的 Vue composable |

## 验证方式

每个阶段完成后：
1. 运行 `pnpm dev` 启动开发服务器
2. 验证地图正常显示
3. 测试对应阶段的功能按钮
4. 检查控制台无报错
5. 运行 `pnpm lint` 确保代码规范
6. 运行 `pnpm build` 确保构建成功
