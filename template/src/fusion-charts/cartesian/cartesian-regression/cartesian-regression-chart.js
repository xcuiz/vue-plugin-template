import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/line'
import ecStat from 'echarts-stat'
import Cartesian from '../cartesian'
import { getPropValue } from '../../util/base.js'
import { data2Regression } from '../../data-factory'
export default {
  name: 'idss-regression-chart',
  extends: Cartesian,
  props: {
    labelColor: {
      type: String,
      default: '#5C85E1'
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Regression(data)
    },
    getDefaultXAxis () {
      return []
    },
    getChartOption () {
      // 计算回归线
      const regression = ecStat.regression('linear', this.transformData.series)
      regression.points.sort(function (a, b) {
        return a[0] - b[0]
      })
      return {
        xAxis: {
          type: 'value',
          boundaryGap: false
        },
        series: [{
          name: 'scatter',
          type: 'scatter',
          label: getPropValue(this.label, { show: true }),
          data: this.transformData.series
        }, {
          name: 'line',
          type: 'line',
          showSymbol: false,
          data: regression.points,
          markPoint: {
            itemStyle: {
              normal: {
                color: 'transparent'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'left',
                formatter: regression.expression,
                textStyle: {
                  color: this.labelColor,
                  fontSize: 14
                }
              }
            },
            data: [{
              coord: regression.points[regression.points.length - 1]
            }]
          }
        }]
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
