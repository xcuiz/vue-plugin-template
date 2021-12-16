/**
 * 常规漏斗图
 * created by liuyu
 */
import 'echarts/lib/chart/funnel'
import Funnel from './funnel'
import { merge } from '../../util/base.js'
import { data2Funnel } from '../../data-factory'
export default {
  name: 'idss-funnel-chart',
  extends: Funnel,
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Funnel(data)
    },
    getChartOption () {
      return {
        series: this.transformData.series.map((val, index) => merge({}, {
          type: 'funnel'
        }, val))
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
