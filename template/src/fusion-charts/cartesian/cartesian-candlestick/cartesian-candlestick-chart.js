import 'echarts/lib/chart/boxplot'
import 'echarts/lib/chart/candlestick'
import 'echarts/lib/chart/line'
import Cartesian from '../cartesian'
import { data2Candlestick } from '../../data-factory'

export default {
  name: 'idss-candlestick-chart',
  extends: Cartesian,
  props: {
    dayCount: {
      type: Array
    }
  },
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Candlestick(data)
    },
    getChartOption () {
      let baseOption = {
        xAxis: this.transformData.xAxis[0],
        yAxis: {},
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        series: [
          {
            type: 'k',
            data: this.transformData.series[0].data
          }
        ]
      }
      this.generateSeries(baseOption)
      return baseOption
    },
    initChartOption () {
      return this.getChartOption()
    },
    /**
     * 生成移动平均线series
     */
    generateSeries (option) {
      // 判断是否传入dayCount
      if (this.dayCount) {
        this.dayCount.forEach(e => {
          option.series.push({
            type: 'line',
            data: this.calculateMA(e),
            smooth: true,
            lineStyle: {
              normal: { opacity: 0.5 }
            }
          })
        })
      }
    },
    /**
     * 计算移动平均线数据
     */
    calculateMA (dayCount) {
      let result = []
      const data = this.transformData.series[0].data
      // 数据量少于移动平均线最小天数时
      if (data.length <= dayCount) {
        return []
      } else {
        for (let i = 0, len = data.length; i < len; i++) {
          if (i < dayCount) {
            result.push('-')
            continue
          }
          let sum = 0
          for (let j = 0; j < dayCount; j++) {
            sum += data[i - j][1]
          }
          result.push(sum / dayCount)
        }
        return result
      }
    }
  }
}
