import 'echarts/lib/chart/heatmap'
import Cartesian from '../cartesian'
import { merge, getPropValue } from '../../util/base.js'
import { data2CartesianScatter } from '../../data-factory'
export default {
  name: 'idss-heatmap-chart',
  extends: Cartesian,
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2CartesianScatter(data)
    },
    getChartOption () {
      return {
        visualMap: {
          show: true,
          min: 0,
          max: 100,
          calculable: true,
          left: 'left',
          bottom: '15%'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          show: false
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'category'
        },
        series: this.transformData.series.map((item, index) => merge({}, {
          type: 'heatmap',
          label: getPropValue(this.label, { show: true })
        }, item))
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
