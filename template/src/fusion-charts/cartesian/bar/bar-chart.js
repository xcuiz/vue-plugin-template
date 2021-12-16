import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import Cartesian from '../cartesian.js'
import { merge, getPropValue } from '../../util/base.js'
import { data2Cartesian } from '../../data-factory'

export default {
  name: 'idss-bar-chart',
  extends: Cartesian,
  props: {
    symbol: {
      type: [String, Array],
      default () {
        return 'none'
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Cartesian(data)
    },
    getChartOption () {
      return {
        tooltip: {
          axisPointer: {
            type: 'shadow'
          }
        },
        series: this.transformData.series.map((val, index) => merge({}, {
          type: 'bar',
          stack: getPropValue(this.stack, 'idss-stack'),
          areaStyle: getPropValue(this.areaStyle, { opacity: 1 }),
          label: getPropValue(this.label, { show: true }),
          symbol: Array.isArray(this.symbol) ? this.symbol[index] : this.symbol,
          barMaxWidth: 20
        }, val))
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
  // install (Vue) {
  //   Vue.component('idss-bar-chart', this)
  // }
}
