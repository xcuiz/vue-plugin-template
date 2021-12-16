import 'echarts/lib/chart/line'
import Cartesian from '../cartesian.js'
import { getPropValue, merge } from '../../util/base.js'
import { data2Cartesian } from '../../data-factory'
export default {
  name: 'idss-line-chart',
  extends: Cartesian,
  props: {
    // @propCnName 是否平滑曲线
    smooth: {
      type: Boolean,
      default () {
        return true
      }
    },
    // @propCnName symbol大小
    symbol: {
      type: [String, Array],
      default () {
        return 'none'
      }
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Cartesian(data)
    },

    getChartOption () {
      return {
        grid: {
          top: 10,
          left: 60,
          right: 43,
          bottom: 6,
          containLabel: true,
        },
        xAxis: this.transformData.xAxis.map((val, index) => {
          return { boundaryGap: false }
        }),
        series: this.transformData.series.map((val, index) => merge({}, {
          type: 'line',
          stack: getPropValue(this.stack, 'idss-stack'),
          areaStyle: getPropValue(this.areaStyle, { opacity: 1 }),
          label: getPropValue(this.label, { show: true }),
          smooth: getPropValue(this.smooth, true), // 平滑曲线
          symbol: Array.isArray(this.symbol) ? this.symbol[index] : this.symbol
        }, val))
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
