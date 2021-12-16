import 'echarts/lib/chart/scatter'
import { merge } from '../util/base.js'
import Polar from './polar'
import { data2PolarScatter } from '../data-factory'
/**
 * 极坐标散点图
 * created by liuyu
 */
export default {
  name: 'idss-polar-scatter-chart',
  extends: Polar,
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2PolarScatter(data)
    },
    getChartOption () {
      return {
        // 继承覆盖式tooltip处理
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let text = params.seriesName ? `${params.seriesName} <br>` : ''
            text += `${this.transformData.angleAxis
              ? this.transformData.angleAxis[params.value[1]].value
              : params.value[1]} ${this.transformData.radiusAxis
              ? this.transformData.radiusAxis[params.value[0]].value
              : params.value[0]}: ${params.value[2]}`
            return text
          }
        },
        radiusAxis: { type: 'category', data: this.transformData.radiusAxis },
        angleAxis: { type: 'category', data: this.transformData.angleAxis },
        series: this.transformData.series.map((val, index) => merge({}, {
          type: 'scatter',
          coordinateSystem: 'polar',
          symbolSize: function (val) {
            return val[2] * 2
          },
          animationDelay: function (idx) {
            return idx * (index + 3)
          }
        }, val))
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
