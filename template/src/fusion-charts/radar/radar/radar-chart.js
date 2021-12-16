import 'echarts/lib/chart/radar'
import Radar from '../radar.js'
import { getPropValue, merge } from '../../util/base.js'
import { data2Radar } from '../../data-factory'

export default {
  name: 'idss-radar-chart',
  extends: Radar,
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Radar(data)
    },
    initChartOption () {
      return {
        tooltip: {
          trigger: 'item'
        },
        series: this.transformData.series.map(item => merge({}, {
          type: 'radar',
          data: [item],
          label: getPropValue(this.label),
          itemStyle: getPropValue(this.itemStyle),
          lineStyle: getPropValue(this.lineStyle),
          areaStyle: getPropValue(this.areaStyle)
        }, item))
      }
    }
  }
}
