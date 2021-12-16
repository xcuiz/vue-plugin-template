import Bar from './bar-chart.js'
import { merge, getPropValue } from '../../util/base.js'

export default {
  name: 'idss-bar-mirror-chart',
  extends: Bar,
  props: {
    top: { // @propCnName 网格top位置
      type: [String, Number],
      default: 20
    },
    bottom: { // @propCnName 网格bottom位置
      type: [String, Number],
      default: 50
    },
    left: { // @propCnName 网格left位置
      type: [String, Number],
      default: 80
    },
    right: { // @propCnName 网格right位置
      type: [String, Number],
      default: 20
    },
    gap: { // @propCnName 两个网格之间间距
      type: Number,
      default: 10
    },
    // @propCnName 是否使用内置的dataFactory函数
    isUseDefaultDataFactory: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    initChartOption () {
      // 获取父级定位
      const parentOffset = this.getContainerOffset()
      return merge(this.getChartOption(), {
        series: this.transformData.series.map((val, index) => merge({}, {
          type: 'bar',
          stack: getPropValue(this.stack, `idss-stack-${this.option.series && this.option.series[index] && this.option.series[index].yAxisIndex
            ? this.option.series[index].yAxisIndex
            : (val.yAxisIndex || 0)}`)
        }, val))
      }, this.horizontal ? this.getHorizontalOpt(parentOffset) : this.getVerticalOpt(parentOffset))
    },

    /**
     * 获取垂直镜像配置
     * @param {object} parentOffset 父级元素定位位置
     */
    getVerticalOpt (parentOffset) {
      const { parent: { height }, self: { top, bottom, left, right } } = parentOffset
      const acHeight = Math.round((height - top - bottom - this.gap) / 2)
      // 获取value坐标轴最大值，为双数轴设置相同最大值
      this.getAxisMaxValue()
      // 竖向 镜像图表的配置
      const vertical = {
        grid: [{
          ...this.getDefaultGrid(),
          containLabel: false,
          top: top,
          left: left,
          right: right,
          height: acHeight
        }, {
          ...this.getDefaultGrid(),
          containLabel: false,
          top: top + acHeight + this.gap,
          left: left,
          right: right,
          height: acHeight
        }],
        xAxis: [{
          boundaryGap: true,
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          }
        }, {
          boundaryGap: true,
          axisTick: {
            show: false
          },
          gridIndex: 1,
          position: 'bottom'
        }],
        yAxis: [{
        }, {
          gridIndex: 1,
          inverse: true
        }]
      }
      return vertical
    },

    /**
     * 获取水平镜像配置
     * @param {object} parentOffset 父级元素定位位置
     */
    getHorizontalOpt (parentOffset) {
      const { parent: { width }, self: { top, bottom, left, right } } = parentOffset
      const acWidth = Math.round((width - left - right - this.gap) / 2)
      // 获取value坐标轴最大值，为双数轴设置相同最大值
      this.getAxisMaxValue()
      // 横向 镜像 图表的配置
      const horizontal = {
        grid: [{
          ...this.getDefaultGrid(),
          containLabel: false,
          top: top,
          left: left,
          bottom: bottom,
          width: acWidth
        }, {
          ...this.getDefaultGrid(),
          containLabel: false,
          top: top,
          left: left + acWidth + this.gap,
          bottom: bottom,
          width: acWidth
        }],
        xAxis: [{
          inverse: true
        }, {
          gridIndex: 1,
          position: 'bottom'
        }],
        yAxis: [{
          axisTick: {
            show: false,
            inside: true
          }
        }, {
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          },
          gridIndex: 1
        }]
      }
      return horizontal
    },

    /**
     * 获取父级元素的定位信息
     */
    getContainerOffset () {
      const offset = this.$refs['chart-container'].getBoundingClientRect()
      const { width, height } = offset
      return {
        parent: offset,
        self: {
          left: this.switchPercentToAbsnum(this.left, width),
          right: this.switchPercentToAbsnum(this.right, height),
          top: this.switchPercentToAbsnum(this.top, height),
          bottom: this.switchPercentToAbsnum(this.bottom, height)
        }
      }
    },
    /**
     * 将百分比、数字等处理成绝对数组，主要用于处理百分比宽高转为数值
     * @param {string|number} val
     * @param {number} relativeTotal 百分比时相对值
     */
    switchPercentToAbsnum (val, relativeTotal) {
      const percentReg = /^(\d+(.\d+))?%$/
      if (typeof val === 'string' && val.match(percentReg)) {
        val = +val.replace(percentReg, '$1')
        if (!isNaN(val)) {
          val = (+val) / 100
          return val * relativeTotal
        }
      } else if (typeof val === 'number') {
        return val
      }
      return 0
    },

    /**
     * 获取value坐标轴最大值，为双数轴设置相同最大值
     */
    getAxisMaxValue () {
      // https://github.com/apache/incubator-echarts/issues/5143 参考
      // https://github.com/apache/incubator-echarts/blob/master/src/scale/helper.js
      this.$nextTick(() => {
        // 获取坐标轴name
        const axisName = this.horizontal ? 'xAxis' : 'yAxis'
        // 获取最大值
        const model = this.myChart.getModel()
        const option = this.myChart.getOption()
        // model.getComponent(axisName, 0).axis.scale.getExtent() 返回[min, max]
        const max = Math.max(model.getComponent(axisName, 0).axis.scale.getExtent()[1],
          model.getComponent(axisName, 1).axis.scale.getExtent()[1])
        option[axisName][0].max = option[axisName][1].max = max
        this.myChart.setOption(option)
      })
    },

    /**
     * 图表resize事件回调触发
     */
    _chartResizeCb () {
      // 重新设置option
      this.horizontal && this.$setOption()
    }
  }
}
