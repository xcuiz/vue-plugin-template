import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/custom'
import Polar from './polar'
import { formatNumber } from '../util/base.js'
import { data2BarStackPolar } from '../data-factory'

export default {
  name: 'idss-polar-bar-bend-chart',
  extends: Polar,
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2BarStackPolar(data)
    },
    getChartOption () {
      let series = []
      this.transformData.series.forEach((item, index) => {
        series.push({
          name: item.name ? item.name : index, // 兼容没有图例的配置
          type: 'bar',
          coordinateSystem: 'polar',
          barWidth: 16,
          label: {
            show: true
          },
          itemStyle: {
            barBorderRadius: 14,
            shadowBlur: 6
          },
          data: [].concat(item.data).reverse()
        }, {
          type: 'custom',
          coordinateSystem: 'polar',
          renderItem: (params, api) => {
            var values = [api.value(0), api.value(1)]
            var coord = api.coord(values)
            return {
              type: 'text',
              rotation: coord[3] + Math.PI / 2 + Math.PI,
              origin: [coord[0], coord[1]],
              style: {
                text: formatNumber(api.value(1)),
                fontSize: '12px',
                textAlign: 'left',
                textVerticalAlign: 'middle',
                x: coord[0] + 10,
                y: coord[1]
              }
            }
          },
          data: [].concat(item.data).reverse()
        })
      })
      return {
        radiusAxis: {
          type: 'category',
          axisLabel: {
            interval: 0
          },
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          splitLine: {
            show: false
          },
          data: [].concat(this.transformData.radiusAxis).reverse()
        },
        angleAxis: {
          show: false,
          min: 0,
          max: ({ max }) => {
            return Math.round(max * 4)
          }
        },
        series: series
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
