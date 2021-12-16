<template>
  <div class="idss-container"
    @mouseenter="manualStartAnimate"
    @mouseleave="manualStopAnimate">
    <!-- 图标无数据展示 -->
    <div v-show="noData" class="idss-container__nodata">
      <div ref="empty"></div>
    </div>
    <!-- 图标有数据展示 -->
    <div
      ref="chart-container"
      class="idss-container__chart"
      :class="{'is-default-cursor': defaultCursor}"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import Echarts from 'echarts/lib/echarts'
import ElementResizeDetectorMaker from 'element-resize-detector'
// 默认的主题配置
import defaultTheme from './theme/default-theme.json'
import defaultBaseColor from './theme/default-base-color.js'

import getDefaultLegend from './component/legend/index.js'
import getDefaultTooltip from './component/tooltip/index.js'
import getDefaultVisualMap from './component/visual-map/index.js'
import getDefaultDataZoom from './component/data-zoom/index.js'
import getDefaultAxisPointer from './component/axis-pointer/index.js'
// import getDefaultTimeline from './component/timeline/index.js'
import getDefaultGraphic from './component/graphic/index.js'
import getDefaultBrush from './component/brush/index.js'
import * as Events from './util/events.js'

import { merge, isFunction, JSONStringify, parseListeners, diffArray } from './util/base.js'
import { vueEmptyDataService } from 'fusion-components/lib/mixins.js'
/**
 * 组件内的全局配置
 * 会导出一个proxy对象
 * 改变其属性时，container 会做相应的操作
 */
const _ECHARTS_CONFIG = {
  theme: 'default'
}
// container内部使用的bus。用于代理set handler时触发$emit
const _bus = new Vue()
// 代理_ECHARTS_CONFIG。主要监听set函数
const proxyConfig = new Proxy(_ECHARTS_CONFIG, {
  set (target, key, value, receiver) {
    const result = Reflect.set(target, key, value, receiver)
    _bus.$emit(key, value)
    return result
  }
})

export { proxyConfig }

/**
 * 图表组件事件支持，目前兼容echarts暴露的事件方式
 * @event all
 */
export default {
  mixins: [vueEmptyDataService],
  props: {
    // @propsIgnore
    isDebugger: {
      type: Boolean,
      default () {
        return false
      }
    },
    // @propCnName data发生变化图表重新渲染时是否调用chart.clear()
    isClear: Boolean,
    // @propCnName 全局option配置项
    option: {
      type: Object,
      default () {
        return {}
      }
    },
    // @propIsApi
    data: {
      type: [Object, Array],
      default () {
        return {
          series: []
        }
      }
    },
    // @propCnName 手型控制
    defaultCursor: {
      type: Boolean,
      default: false
    },
    // @propCnName 是否使用svg渲染
    isSvgRender: {
      type: Boolean,
      default: false
    },
    // 在当前生命周期中保持animate，由于词云的渲染不是一帧渲染完成，故保持动画
    // @propCnName 是否渲染起见一直保持animate状态
    keepAnimate: {
      type: Boolean,
      default: false
    },
    // @propCnName 是否使用内置的dataFactory函数
    isUseDefaultDataFactory: {
      type: Boolean,
      default: _ => {
        return Vue.prototype.$CHARTS_CONFIG && Vue.prototype.$CHARTS_CONFIG.hasOwnProperty('isUseDefaultDataFactory')
          ? Vue.prototype.$CHARTS_CONFIG.isUseDefaultDataFactory
          : true
      }
    },
    // @propCnName 对即将渲染的数据进行修改和装饰，用于修改自定义展示数据
    dataDecorate: Function
  },
  data () {
    this.listenerStore = new Map()
    return {
      // echarts 的主题配置
      ECHARTS_THEME: Object.freeze(defaultTheme),
      // echarts 主题配置覆盖不到其他颜色配置。BASE_COLOR与ECHARTS_THEME必须配套使用。
      BASE_COLOR: Object.freeze(defaultBaseColor),
      // scatter 中气泡的基础大小
      scaleBaseSize: 10
    }
  },
  computed: {
    transformData () {
      let data = this.data
      // 通过内置的datFactory方法处理数据
      if (this.isUseDefaultDataFactory && isFunction(this.getDataFactory)) {
        // @FIXME 目前加入默认factory之后，默认数据变成了factory参数处理，导致接口或者报错，或者返回异常。目前处理为兼容性处理，带后期更好方案
        try {
          data = this.getDataFactory(data)
        } catch (err) {
          data = this.data
        }
      }
      // 对数据进行装饰处理
      if (this.dataDecorate && isFunction(this.dataDecorate)) {
        data = this.dataDecorate(data)
      }
      return data
    },
    noData () {
      if (!this.transformData) {
        return true
      } else if (this.transformData.series) {
        if (this.transformData.series.length) { // 桑基图 series:[{links:[], nodes: []}]
          let { links, nodes } = this.transformData.series[0]
          if (nodes && !nodes.length) {
            return nodes && !nodes.length && (links && !links.length)
          }
        }
        // 笛卡尔坐标系
        return this.transformData.series && !this.transformData.series.length
      } else if (this.transformData.nodes) {
        // 关系图
        return this.transformData.nodes && !this.transformData.nodes.length && (this.transformData.lines && !this.transformData.lines.length)
      } else if (this.transformData.data) {
        // 仪表盘
        return !this.transformData.data.length
      }
      return true
    }
  },
  methods: {
    initComponentDefaultOption () {
      let { legend, tooltip, visualMap, dataZoom, axisPointer, graphic, brush } = this.option

      return {
        /* 【必选项】默认存在，如不想携带该配置，需在option相应的属性中设置show:false */
        legend: (this.transformData.legend || legend) && getDefaultLegend.call(this, legend),
        tooltip: getDefaultTooltip.call(this, tooltip),

        /* 【可选项】option中存在，则添加相应配置 */
        visualMap: visualMap && getDefaultVisualMap.call(this, visualMap),
        dataZoom: dataZoom && getDefaultDataZoom.call(this, dataZoom),
        // @FIXME echart官网中推荐axis-pointer在tooltip中配置。而且更详细的配置还需要在各自轴中去配置。目前这种merge方式无法完美解决。
        axisPointer: axisPointer && getDefaultAxisPointer.call(this, axisPointer),
        // @FIXME timeline 实现机制比较复杂，规划一个好的方案来实现。
        // timeline: timeline && getDefaultTimeline.call(this, timeline),
        graphic: graphic && getDefaultGraphic.call(this, graphic),
        brush: brush && getDefaultBrush.call(this, brush)
      }
    },
    /**
     * 初始化echarts实例。
     * 多次调用时会销毁当前的实例，重新初始化一个新的实例。
     */
    _initEcharts () {
      const container = this.$refs['chart-container']
      // 销毁实例(如果存在)重新渲染图表
      if (this.myChart && typeof this.myChart.dispose === 'function') {
        // 清除当前图表
        this._clearChart()
      }
      // 挂载图表,根据父级节点宽高设置size
      this.myChart = Echarts.init(container, 'customed', { renderer: this.isSvgRender ? 'svg' : 'canvas' })
      this.myChartZr = this.myChart.getZr()
      this._setScatterBaseSize()
      // 修复legend变为同步渲染后，父级存在宽边为0的情况，初始化手动调用一次resize
      this.$nextTick(() => {
        this.myChart.resize()
      })
    },
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
    _setTheme (theme = 'default') {
      switch (typeof theme) {
        case 'string':
          // 如果是string，说明是主题名称，动态引入主题
          try {
            const requireBaseColor = require(`./theme/${theme}-base-color.js`)
            const requireEchartsTheme = require(`./theme/${theme}-theme.json`)
            this.BASE_COLOR = Object.freeze(merge({}, requireBaseColor.default))
            this.ECHARTS_THEME = Object.freeze(merge({}, requireEchartsTheme))
          } catch (e) {
            // 找不到文件，会抛出错误
            throw new Error(e)
          }
          break
        case 'object': // 如果是对象，说明传入的是主题配置json
          if (theme.baseColor) {
            this.BASE_COLOR = Object.freeze(merge({}, theme.baseColor))
          }
          if (theme.echartsTheme) {
            this.ECHARTS_THEME = Object.freeze(merge({}, theme.echartsTheme))
          }
          break
        default:
          console.warn('不识别的主题格式：' + theme)
          return
      }

      // 注册echarts定制化后的主题
      Echarts.registerTheme('customed', this.ECHARTS_THEME)
    },
    /**
     * 调用echarts.setOption渲染图表。
     * 这里的merge操作是把各个层级的配置合并到一起，最终生成一个新而全的option传递给setOption
     */
    $setOption () {
      // 无数据，不进行图表绘制
      if (!this.noData) {
        this.manualStartAnimate()
        // 覆盖顺序：组件配置项目（legend、tooltip） -> 默认配置项（坐标系） -> 图表配置项（line、bar） -> 用户配置项 (container)
        const option = merge(this.initComponentDefaultOption(), this.initDefaultOption(), this.initChartOption(), this.option)
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && this.isDebugger) {
          console.log(JSONStringify(option))
        }
        // FIXME: 由于merge的bug，处理 const option = merge() 中 merge 时，如果有不可枚举的属性添加一个公共的回调函数（noEnumCallback）进行处理。
        this.noEnumCallback && isFunction(this.noEnumCallback) && this.noEnumCallback(option)

        this.myChart.setOption(option, true)

        // 手动停止zrender animate
        this.manualStopAnimate()
      } else {
        this.myChart.setOption({}, true)
        // 停止animation动画
        this._stopAnimate()
      }
    },
    /**
     * 渲染图表方法
     * 分为三个步骤：
     *  1. 注册主题
     *  2. 初始化echats实例
     *  3. 调用echarts.setOption
     */
    _renderEcharts () {
      // 注册主题。
      this._setTheme(_ECHARTS_CONFIG.theme)
      // 初始化echarts实例
      this._initEcharts()
      // 渲染图表
      this.$setOption()
      // 绑定事件
      this.eventBind()
    },
    /**
     * 计算气泡图表中气泡的baseSize
     * 取宽高的
     */
    _setScatterBaseSize () {
      const dom = this.myChart.getDom().getBoundingClientRect()
      const min = Math.min(dom.width, dom.height)
      // 宽高取最小的 * 1/50 来确定气泡的baseSize
      this.scaleBaseSize = min * 1 / 50
    },

    /**
     * 事件绑定
     */
    eventBind () {
      this._bindEvent(Object.keys(this.$listeners))
      this.$nextTick(() => {
        // 图表resize监听
        this.elementResizeDetector = ElementResizeDetectorMaker({
          strategy: 'scroll',
          callOnAdd: false
        })
        const container = this.$refs['chart-container']
        this.elementResizeDetector.listenTo(container, () => {
          this._setScatterBaseSize()
          // resize手动触发animate
          this.manualStartAnimate()
          this.myChart.resize()

          // 手动停止zrender animate
          this.manualStopAnimate()

          // @FIXME (该方法会导致重新渲染) 针对个别图标需要resize之后的回调处理，如需使用，在图表组件中添加method
          this._chartResizeCb && this._chartResizeCb()
        })
      })
    },
    /**
     * 手动触发echarts中zrender内部的animation的事件
     */
    manualStartAnimate () {
      if (this.myChart && !this.noData) {
        this.running = true
        !this.myChartZr.animation._running && this.myChartZr.animation.start()
      }
    },
    /**
     * 内部调用停止echarts中zrender内部的animation动画函数
     */
    _stopAnimate () {
      this.$nextTick(() => {
        // 当前图表非keepAnimate状态/无数据状态，且图表处于运动中是，停止动画
        if (this.myChart && (!this.keepAnimate || this.noData) && this.myChartZr.animation._running) {
          this.myChartZr.animation.stop()
        }
      })
    },
    /**
     * 手动触发zrender 停止运动处理
     */
    manualStopAnimate () {
      if (!this.myChart) return
      // 手动触发下一帧渲染，触发finished事件
      this.myChartZr.refresh()
      this.running = false

      // 组件内部自定义接收finish事件，与startAnimate配合使用，主要在第一次触发渲染完成后使用
      this.myChart.one('finished', () => {
        // 手动触发停止 animation动画
        if (!this.running) {
          this._stopAnimate()
        }
      })
    },

    /**
     * 清除图表实例，update、destory调用
     */
    _clearChart () {
      // 销毁实例之前，将ResizeDetector销毁
      if (this.elementResizeDetector) {
        this.elementResizeDetector.uninstall(this.$refs['chart-container'])
        this.elementResizeDetector = null
      }
      if (this.myChart) {
        // 清除当前图表动画
        this.myChartZr.animation.stop()
        this.myChart.dispose()
        this.myChartZr = null
        this.myChart = null
      }
    },

    /**
     * 事件绑定
     * @params {Array} listeners：监听事件的key值组成的数组
     */
    _bindEvent (listeners) {
      if (!listeners || !listeners.length) return
      for (let listenerName of listeners) {
        const option = parseListeners(listenerName)
        let { fullEventName, eventName, action, query } = option

        // 兼容旧事件处理
        const oldEventComparison = {
          'clickItem': 'click',
          'brush-finished': 'brushselected',
          'brush-clear': 'brush',
          'dragzoom': 'datazoom'
        }
        eventName = oldEventComparison[eventName] || eventName

        // 存在部分处理特殊业务的事件
        let handler = (Events[`${eventName}Handler`] && Events[`${eventName}Handler`].bind(this)) || this.$listeners[fullEventName]
        if (handler && isFunction(handler)) {
          this.listenerStore.set(fullEventName, handler)
          this.myChart[action](eventName, query, handler)
        }
      }
    },

    /**
     * 事件解绑
     * @params {Array} listeners：监听事件的key值组成的数组
     */
    _unbindEvent (listeners) {
      if (!listeners || !listeners.length) return
      for (let listenerName of listeners) {
        const { fullEventName, eventName } = parseListeners(listenerName)
        let handler = this.listenerStore.get(fullEventName)
        this.listenerStore.delete(fullEventName)
        this.myChart.off(eventName, handler)
      }
    }
  },
  deactivated () {
    // 非激活状态时，无论组件何种状态，停止animate
    this.myChart && this.myChartZr.animation.stop()
  },
  activated () {
    // 当处于激活状态时，keepAnimate状态存在时，且存在数据时，触发animate
    if (this.keepAnimate && !this.noData && this.myChart && !this.myChartZr.animation._running) {
      this.manualStartAnimate()
    }
  },
  created () {
    // 全局监听watcher处理，原有watcher监听$props oldvalue newvalue 相同
    this.watcher = this.$watch(() => {
      return JSONStringify(this.$props)
    }, (newV, oldV) => {
      if (newV === oldV) return
      // 匹配当前svg渲染值
      const isSvgReg = /"isSvgRender":\s?(true|false)/
      if (newV.match(isSvgReg)[1] !== oldV.match(isSvgReg)[1]) {
        // 重新渲染组件
        this._renderEcharts()
      } else {
        // 默认不调用 clear()
        this.isClear && this.myChart.clear()
        this.$setOption()
      }
    })

    /**
     * 事件监听处理
     * @FIXME:
     * 1. vue内部对$listeners的fn做了代理，当fn变化后，代理的内部的指向会被更新，所以会自动指向变更后的fn，故此处仅监听keys的变化。
     * 2. 如果$listener移除某个事件，依然能通过代理访问到此事件，所以这里要手动unbind事件。
     * 3. vue $listener处理机制： https://github.com/vuejs/vue/blob/0baa129d4cad44cf1847b0eaf07e95d4c71ab494/src/core/vdom/helpers/update-listeners.js#L36
     */
    this.eventWatcher = this.$watch(() => {
      return JSONStringify(Object.keys(this.$listeners))
    }, (newVal, oldVal) => {
      if (newVal === oldVal) return
      const [newArray, oldArray] = diffArray(JSON.parse(newVal), JSON.parse(oldVal))
      this._unbindEvent(oldArray)
      this._bindEvent(newArray)
    })
  },
  async mounted () {
    this._renderEcharts()

    // 监听主题变动，重现设置主题并渲染图表
    _bus.$on('theme', _ => {
      this._renderEcharts()
    })
    // 创建图表暂无数据展示节点
    this.createEmptyDom()

    // 如果没有数据，直接触发 finished 事件
    if (this.noData) {
      await this.$nextTick()
      this.$emit('finished')
    }
  },
  beforeDestroy () {
    _bus.$off()
    // 清除watcher
    this.watcher()
    this.eventWatcher()
    this._clearChart()
  }
}
</script>

<style scoped>
.idss-container {
  position: relative;
}
.idss-container__chart,
.idss-container__nodata {
  width: 100%;
  height: 100%;
}
.idss-container__nodata {
  position: absolute;
  transform: translateZ(0, 0, 0);
}

/* 手型控制 */
.idss-container__chart {
  z-index: 2;
  &.is-default-cursor >>> div:nth-of-type(1) {
    cursor: default !important;
  }
}
</style>
