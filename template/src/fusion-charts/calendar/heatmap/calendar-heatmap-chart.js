import 'echarts/lib/component/visualMap'
import 'echarts/lib/chart/heatmap'
import Calendar from '../calendar.js'
import { merge } from '../../util/base.js'
import { data2CalendarHeatmap } from '../../data-factory'

export default {
  name: 'idss-calendar-heatmap-chart',
  extends: Calendar,
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2CalendarHeatmap(data)
    },
    initChartOption () {
      return {
        tooltip: {
          trigger: 'item'
        },
        visualMap: {
          type: 'piecewise',
          precision: 0,
          orient: 'horizontal',
          left: 'center',
          top: 10,
          min: 0,
          max: Math.ceil(Math.max(...this.transformData.series.map(item => {
            return Math.max(...item.data.map(i => i.value[1]))
          })) / 50) * 50
        },
        series: this.transformData.series.map((item, index) => merge({}, {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: item.data
        }, item))
      }
    }
  }
}
