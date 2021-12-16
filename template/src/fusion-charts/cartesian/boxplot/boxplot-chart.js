import 'echarts/lib/chart/boxplot'
import 'echarts/lib/chart/scatter'
import Cartesian from '../cartesian'
import { data2Boxplot } from '../../data-factory'

export default {
  name: 'idss-boxplot-chart',
  extends: Cartesian,
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Boxplot(data)
    },
    getChartOption () {
      return {
        tooltip: {
          trigger: 'item'
        },
        xAxis: {},
        yAxis: {
          show: false,
          type: 'category'
        },
        series: [
          {
            type: 'boxplot',
            data: this.transformData.series[0]['data'],
            itemStyle: {
              shadowBlur: 0
            },
            tooltip: {
              formatter: (param) => {
                let index = param.name ? param.name : 0
                return [
                  `${this.transformData.series['name'][index]}:`,
                  `最小值: ${param.data[1]}`,
                  `最大值: ${param.data[5]}`
                ].join('<br/>')
              }
            }
          },
          {
            type: 'scatter',
            data: this.transformData.series[1]['data'],
            tooltip: {
              formatter: (param) => {
                return `当前值: ${param.data}`
              }
            }
          }
        ]
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
