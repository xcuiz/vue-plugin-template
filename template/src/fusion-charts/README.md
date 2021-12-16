${toc}
# [Fusion Charts](http://10.10.10.8/IDSS-FE/fusion-charts)

什么是 Fusion Charts？

Fusion Charts是基于 vue 与 echarts，融合的产物。主要是为了简化 echarts 复杂的数据配置并还能保持一定的灵活性。

## 框架构思

整理思路是依赖于 vue 的 **extends** 模式与 **option merge**。
文件级别整体分为三个层级:

- 顶层：container容器
- 中间层：坐标系级
- 底层：具体图表

每个层级都提供本层级的配置，最后通过数据合并生成一个完整的图表配置。

> Container：图表容器，对图表进行绘制
> 坐标系：直角坐标、极坐标、地理坐标、雷达坐标、平行坐标、日历坐标、单轴
> 图表：基本与 echarts 中 series 的 type 对应

为了灵活组合，我们拆分了单独 **组件**，对于组件（title、legend、tooltip、dataZoom、visualMap、timeline、graphic、axisPointer、toolbox、brush）进行单独管理、按需配置即可；
为了方便使用，减少配置项，我们提供 **模板**，可直接使用相关模板（针对某种图表的特殊实现，且具有一定的通用性，抽离为模板），达到相应效果。

> 模板 extends 某图表 extends 某坐标系 extends Container
> Container mixins 组件

``` html
<!-- 使用legend的horizontal模板 -->
<idss-line-chart :data="data" :option="{legend: {_idssTmpl: 'horizontal'}}"></idss-line-chart>
```

## 目录结构说明

    ├── README.md
    ├── calendar		// 日历坐标系
    ├── cartesian		// 笛卡尔坐标系
    ├── component		// 通用组件
    ├── container.vue	// 最顶层容器
    ├── data-factory	// 数据转换方法(将后台约定好的原始数据转换为对应的图表可用数据)
    ├── geo				// 地图
    ├── index.js		// 导出文件
    ├── other			// 其他一些图表 仪表盘、关系图、饼图、桑基图、树图、词云等
    ├── package.json
    ├── parallel		// 平行坐标系
    ├── polar			// 极坐标
    ├── radar			// 雷达图
    ├── single			// 单坐标轴
    ├── theme			// 主题相关
    └── util			// 图表用到的一些工具方法


## Option 合并机制

默认的配置可以满足大部分场景了，但总有些意外。所以在调用图表的时候，给调用者提供更改配置的方式，使用 `option` 可以覆盖默认配置。

> option 的结构与 echarts 官网的 option 结构一致。

```html
<idss-bar-chart
  style="height: 300px"
  :data="barData"
  :option="{
    tooltip: { // 根据数据的情况看是否需要定制tooltip
      formatter: function (params) {
        let result = []
        params.forEach((item, index) => {
          let value = `${item.value}`
          if (index === 2) {
            value = `${item.value * 100}%`
          }
          result.push(`${item.marker} ${item.seriesName}: ${value}`)
        })
        return params[0].axisValueLabel + '<br>' + result.join('<br>')
      }
    },
    yAxis: [{}, {
      max: 'dataMax',
      axisLabel: { formatter: function (value) { return `${value * 100}%` } },
      splitLine: {
        show: false
      }
    }],
    series: [{}, {}, {
      type: 'line',
      yAxisIndex: 1
    }]
  }">
</idss-bar-chart>
```

### option 合并优先级

从左至右优先级从大到小

```
调用时的Option > 图表级别的配置 > 坐标系级别的配置 > container中的配置
```

#### 继承体系

![图表继承体系](/docs/图表继承体系.png)

## 使用说明

### 安装与依赖相关

因为当前规划是将图表库以 `subtree` 的方式来管理。

### 在主项目中以subtree形式添加组件库

```shell

# 添加组件库 remote
$ git remote add fusion-charts git@10.10.10.8:IDSS-FE/fusion-charts.git

# 将 components 子项目 添加到项目src/components 中
$ git subtree add --prefix=src/fusion-charts fusion-charts master

# 获取 components 子项目最新代码
$ git subtree pull --prefix=src/fusion-charts fusion-charts master
```

关于更多 subtree 相关请看这里：[组件库管理说明](http://10.10.10.8/IDSS-FE/FE/blob/master/standard/%E7%BB%84%E4%BB%B6%E5%BA%93%E7%AE%A1%E7%90%86%E8%AF%B4%E6%98%8E.md)

### 将subtree引入的项目添加到workspace中

package.json中添加如下代码，idss-components 为当前 `fusions-charts` 的路径。[workspace介绍](https://classic.yarnpkg.com/zh-Hans/docs/workspaces)

``` json

"workspaces": [
  "idss-components/fusions-charts"
]
```

 > 配置好依赖之后，通过在终端执行`yarn`后，项目中可以直接饮用该`fusions-charts`包

### 在项目中使用

`Fusion charts`支持全量引用，同样支持按需引用，主要暴露了所有的`echarts`二次封装后的所有`图表组件`，以及数据处理函数`dataFactory`，同时暴露了图表换肤方法`$setTheme`。

#### 全量引入

```js

// 全量的图表库 在 main.js 中引入
import funsionCharts from 'fusion-charts'
Vue.use(funsionCharts)
```

#### 按需引用

```js
// 按需引入
import {
  IdssLineChart, 
  IdssLineMiniChart, 
  IdssLineBaselineChart, 
  IdssBarChart, 
  IdssBarMiniChart, 
  IdssBarTopnChart, 
  IdssBarMirrorChart, 
  IdssScatterChart, 
  IdssRegressionChart, 
  IdssCandlestickChart,
  IdssBoxplotChart, 
  IdssQuadrantChart, 
  IdssHeatmapChart, 
  IdssParallelChart, 
  IdssGeoMapChart, 
  IdssGeoMapVisualChart, 
  IdssGeoMap3dChart, 
  IdssGeoMap3dMapChart, 
  IdssCalendarChart, 
  IdssCalendarHeatmapChart, 
  IdssCalendarScatterChart, 
  IdssRadarChart, 
  IdssPieChart, 
  IdssPieRoundChart, 
  IdssPieDetailChart, 
  IdssPieNestChart, 
  IdssPolarBarChart, 
  IdssPolarBarPercentChart, 
  IdssPolarScatterChart, 
  IdssPolarBarBendChart, 
  IdssSankeyChart, 
  IdssGraphChart, 
  IdssGaugeChart, 
  IdssMultiGaugeChart, 
  IdssTreeChart, 
  IdssTreeMapChart, 
  IdssWordCloudChart, 
  IdssFunnelChart } from 'fusion-charts/lib'

  // 组件注册
  Vue.component('IdssBarChart', IdssBarChart)

  // data Factory & $setTheme
  import { data2Cartesian, $setTheme } from 'fusion-charts/lib'

```

#### 通用属性 Props

| 参数   | 说明 | 类型   | 可选值 | 默认值  |
| --------- | ----------| ---------| --------- | --------- |
!!! include(idss-components/fusion-charts/docs/props-base.md)!!!

#### 通用 Events
除个别组件（brush、datazoom）内置了事件处理函数，图表组件内部默认并未添加事件处理函数，但是对Echarts支持的事件做拦截处理，用户可根据实际情况来自行定义使用。使用示例如下，echarts事件详情请参照 [Echarts events](https://www.echartsjs.com/zh/api.html#events)。

注意：echarts默认支持click事件，所以在图表上使用click事件会按照echarts规则触发。如果要使用原生click事件，可使用 `@click.native`方式。

- 格式：`{事件名称}:{动作}:{条件}`，更多格式请参照下面示例。
- 事件名称：legendselectchanged、click、datazoom 等。
- 动作：on | one，可选，默认为 on。
- 条件：`string`，格式为`series`或`series.bar`，`series.bar`格式直接使用时，注意要使用`[]`包裹一下，否则vue无法正确识别。
- 分隔符：冒号(:)，使用对象语法时，冒号(:)和点(.)都可以。

```js
  // 基础使用方式
  @legendselectchanged="clickFn"

  // 事件名称:动作:条件，使用冒号(:)分隔
  @legendselectchanged:one:serise="clickFn"
  @legendselectchanged:one:[serise.line]="clickFn"

  // 省略动作，默认为 on
  @legendselectchanged:serise="clickFn"
  @legendselectchanged:[serise.line]="clickFn"

  // 对象语法，可使用 点(.)
  v-on="{ 'legendselectchanged.on.serise.line': clickFn }"
```

#### 示例地址

我们创建了一个[demo合集项目](http://192.168.0.135/)来专门演示图表库以及组件库的使用，详细的使用示例请移步。

## 组件开发说明

如果是对已有组件进行改造，要经过相关组件开发作者确认后，方可提交。**这里严禁做破坏性提交（非兼容升级），所有修改必须及时反映到Demo上，Demo项目地址 http://10.10.10.8/IDSS-FE/demo-collection！！！**

### 开发规范

- 1. 所有组件名称和属性使用中横线（“-”）表示< eg: `bar-chart, empty-text`>。
- 2. 组件文件的命名要和组件name要以 `-chart`结尾，例： `bar-chart.js  idss-bar-chart` 
- 3. 新增图表类型，如果有对图表的引用，要使用按需的方式，例： `import 'echarts/lib/chart/bar'`。
- 4. data-factory 输出结果是图表直接可用的数据，而不能是对某一字段，比如 `series` 的单独处理。
- 5. data-factory 数据处理中，对于标准数据之外的变量，保留处理。例如： {key, name, value, custom, ...} 中的custom要保留到 series的data中，以便扩展。
- 6. 对于 container 的额外扩展组件，例如 legend，建议采用函数方式引入，不要使用 mixins，以避免不必要的注入。
- 7. 图表开发完成之后，要手动导出，在根目录下 `charts.js` 下配置。
- 8. 原则上，图表库不对echarts的事件做特殊的业务处理，只做转发处理。

### 在option中添加组件模板
为了快速开发，我们支持模板模式，所有主题均在当前组件文件夹下编写（如，component/lenged/tmpl-default,component/lenged/tmpl-horizontal），不设置模板的，默认使用**default**，主题通过属性**_idssTmpl**进行设置!

```html
<idss-line-chart :data="data" :option="{legend: {_idssTmpl: 'horizontal'}}"></idss-line-chart>
```

```javascript

  getDefaultLegend (config = {}) {
    let { _idssTmpl = 'default', ...option } = config
    option = option || {}
    // legend数据默认从this.transformData获取
    let data = this.transformData.visualMap || []
    // 模板 >> 数据 >> 用户自定义配置
    return merge({}, TMPL[_idssTmpl], { data }, option)
  }
```

## 图表换肤

采用 echarts 的[主题构建工具](http://echarts.baidu.com/theme-builder/)

当前已内置一套调整好的色彩搭配。

在 `theme` 文件夹下有一套 `default-theme.json 和 default-base-color.js` 这两个文件为默认的主题配置。

> default-base-color.js 这个文件的存在 是因为有些颜色配置在 default-theme.json 中并没有配置全，所以需要单独写出来

> 所以所有的主题中的 xx-base-color.js 格式与 `default-base-color.js` 保持一致即可。

### 换肤API

我们提供了 `$setTheme` API接口来实现动态换肤的功能。

```js

/**
 * 动态设置echarts的主题颜色
 * @param {Object|String} theme
 * 当 theme 是string时，表示使用component中定制好的主题
 * 当 theme 是Object时，表示传递一个配置好的主题对象格式如下：
 * {
 *   echartsTheme: {}  // echartsTheme 中的内容是百度echarts主题工具生成的js文件配置
 *   baseColor: {} // color 是echarts主题工具生成的文件中，没有覆盖到的颜色补充的配置. 详细请看 default-base-color.js
 * }
 */
export const $setTheme = function (theme) {
  proxyConfig.theme = theme
}
```


* 使用内置的主题

  ```js
  // 引入index中的 $setTheme
  import { $setTheme } from 'fusion-charts/lib'
  
  // 可以直接传递一个字符串，name就是图表内置的主题名称，默认name='default'
  $setTheme(theme)
  // 比如当前图表中内置了一套 dark 的测试主题，这样所有的图表就会切换为 dark 主题的颜色配置
  $setTheme('dark')
  ```

* 使用外部自己生成的主题

  ```js
  // 引入index中的 $setTheme
  import { $setTheme } from 'fusion-charts/lib'
  // 引入自己的定制的json
  import themeJSON from './customed.project.json'
  import themeBaseColor from './customed-base-color.js'
  
  // 传递一个对象， 所有的图表
  $setTheme({
    echartsTheme: themeJSON, 	// echarts 主题工具定制的格式即可
    baseColor: themeBaseColor // 如果不传递 baseColor，还是会使用默认的baseColor
  })
  ```

## 性能相关

与echarts图表性能相关主要有一下几个点：
  * 1. `canvas过多`，会占用很多的内存
  * 2. `canvas渲染数据量过大`，也会占用过多内存
  * 3.  3d图表，启用`webgl`，会消耗过多的gpu
  * 4. canvas图表渲染的使用机制使用使用`requestAnimationFrame`,而echarts中对图表的渲染同样也是使用了`requestAnimationFrame`来实现图表渲染，大量图表频繁渲染也会消耗过多的内存

上述前三点，在项目中尽量需要避免，但是无法控制，而第三点则是可以通过一定手段来进行优化。

### props keepAnimate控制动画

在echarts中，主要使用了`zrender`库来进行渲染，`zrender`内部封装了`animation`，对图表进行逐帧渲染，但是在使用过程中会发现，`当图表处于静态过程中`，依然会频繁触发逐帧渲染，这样依然会消耗一定的内存，所以需要对这部分进行优化，使图表处于静态状态时，尽量避免重新渲染

而`keepAnimate`属性，就是用于控制当前组件是否实时触发animation动画，对于部分图表如柱图、曲线等图表，不需要实时开启渲染动画，可以开启；而一些需要实时保持animate状态的图标组件，需要开启开属性。

现有组件中关于echarts中keepAnimate 设置：

  * 1 `effectScatter` 带涟漪的散点图，即使不设置keepAnimate，也不会触发finished配置。但是为了保险起见，建议都添加keepAnimate配置
  * 2 `攻击地图、3d地图、effectScatter散点地图`等，带有连续动画的，都应该设置keepAnimate
  * 3 `仪表盘、词云、关系图`都不是一帧动画就能结束的，所以需要设置keepAnimate


#### 注意事项
* 1 `echarts bug`: echarts webgl中的3d 图表处理，在图表销毁以后，echarts实例的内部animation对象没有被完全销毁，存在bug，所以3d类图表会影响性能， 需要慎用
* 2 effectScatter等都是连续动画，需要实时刷新，对cpu占用率高，也需要谨慎使用，尽量避免泛用

### 使用 Canvas 或者 SVG 渲染

一般来说，Canvas 更适合绘制图形元素数量非常大（这一般是由数据量大导致）的图表（如热力图、地理坐标系或平行坐标系上的大规模线图或散点图等），也利于实现某些视觉 特效。但是，在不少场景中，SVG 具有重要的优势：它的内存占用更低（这对移动端尤其重要）、渲染性能略高、并且用户使用浏览器内置的缩放功能时不会模糊,所以引入svg渲染，会对部分场景下起到一定的性能优化。[具体介绍](https://echarts.apache.org/zh/tutorial.html#%E4%BD%BF%E7%94%A8%20Canvas%20%E6%88%96%E8%80%85%20SVG%20%E6%B8%B2%E6%9F%93)

选择哪种渲染器，我们可以根据软硬件环境、数据量、功能需求综合考虑。

* 1 在软硬件环境较好，数据量不大的场景下（例如 PC 端做商务报表），两种渲染器都可以适用，并不需要太多纠结。
* 2 在环境较差，出现性能问题需要优化的场景下，可以通过试验来确定使用哪种渲染器。比如有这些经验：

    * 1) 在须要创建很多 ECharts 实例且浏览器易崩溃的情况下（可能是因为 Canvas 数量多导致内存占用超出手机承受能力），可以使用 SVG 渲染器来进行改善。大略得说，如果图表运行在低端安卓机，或者我们在使用一些特定图表如 水球图 等，SVG 渲染器可能效果更好。
    * 2) 数据量很大、较多交互时，可以选用 Canvas 渲染器。

#### props isSvgRender属性用于控制svg渲染

``` html

  <idss-line-chart :data="data" :option="option" is-svg-render></idss-line-chart>
```