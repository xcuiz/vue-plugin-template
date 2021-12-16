import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'
import Calendar from '../calendar.js'
import { getPropValue, merge } from '../../util/base.js'
import { data2CalendarScatter } from '../../data-factory'

export default {
  name: 'idss-calendar-scatter-chart',
  extends: Calendar,
  props: {
    // @propCnName 带涟漪的气泡效果，默认不带
    effectScatter: {
      type: Boolean,
      default: false
    },
    // @propCnName 动态气泡的数量topN, 默认为0
    effectTopN: {
      type: Number,
      default: 0
    },
    // @propCnName 是否显示标签
    label: [Boolean, Object, Function],
    keepAnimate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2CalendarScatter(data)
    },
    initChartOption () {
      return {
        legend: {
          selectedMode: 'single'
        },
        tooltip: {
          trigger: 'item'
        },
        series: this.getDefaultSeries()
      }
    },

    getDefaultSeries () {
      // 求气泡的大小
      const computedSymbolSize = function (val, max, min) {
        let baseSize = 5
        let grade = 8
        let gradeDiff = 4
        let gradeLength = (max - min) / grade
        return baseSize + Math.round((val[1] - min) / gradeLength) * gradeDiff
      }

      let series = []
      this.transformData.series.forEach(item => {
        // 求最大值、最小值
        let values = item.data.map(i => i.value[1])
        let maxValue = Math.max(...values)
        let minValue = Math.min(...values) || 1
        minValue = minValue === maxValue ? minValue - 1 : minValue

        series.push(merge({}, {
          type: this.effectScatter ? 'effectScatter' : 'scatter',
          label: getPropValue(this.label, { show: true }),
          coordinateSystem: 'calendar',
          rippleEffect: {
            scale: 2
          },
          symbolSize: val => {
            return computedSymbolSize(val, maxValue, minValue)
          }
        }, item))

        // 有动态气泡的情况
        if (this.effectTopN) {
          let sortData = item.data.slice(0).sort((a, b) => b.value[1] - a.value[1])
          series.push(merge({}, {
            name: item.name,
            type: 'effectScatter',
            coordinateSystem: 'calendar',
            rippleEffect: {
              scale: 2
            },
            symbolSize: val => {
              return computedSymbolSize(val, maxValue, minValue)
            },
            data: sortData.slice(0, this.effectTopN)
          }))
        }
      })
      return series
    }
  }
}
