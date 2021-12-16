/**
 * 饼图图例描述魔板
 * created by liuyu
 * @NOTE customFormatter函数为formatter内部调用函数，方便用户继承该魔板使用
 */
import { formatNumber, checkFormatter } from '../../../util/base.js'
import defaultBaseColor from '../../../theme/default-base-color.js'
export default {
  tooltip: {
    formatter (param) {
      const {
        percent,
        data: {
          name,
          value
        }
      } = param
      return value !== '_r' ? `${name}: ${value} (${percent}%)` : ''
    }
  },
  series: [{
    center: ['15%', '50%'],
    label: {
      normal: {
        show: false,
        position: 'center',
        formatter (item) {
          const chartOption = this.myChart.getOption()
          const series = chartOption.series.reduce((a, b) => {
            a.push(...b.data)
            return a
          }, [])
          let detailTotalNum
          if (Array.isArray(chartOption.series[0].detailTotalData) && chartOption.series[0].detailTotalData.length > 0) {
            detailTotalNum = chartOption.series[0].detailTotalData.reduce((a, b) => a + (isNaN(b.value) ? 0 : +b.value), 0)
          }
          // 获取当前选中的select数据
          const selectdData = chartOption.legend[0].selected
          // 获取所有数量
          const selectTotal = series.filter(v => {
            return !(selectdData[v.name] === false)
          }).reduce((a, b) => a + (isNaN(b.value) ? 0 : +b.value), 0)
          // 获取比率
          const rate = selectTotal ? (Math.round((item.value / selectTotal) * 10000) / 100).toFixed(0) + '%' : 0
          // 将自定义函数this指向为vue实例，方便后续获取
          const format = chartOption.series[item.seriesIndex].label.customFormatter.bind(this)
          return checkFormatter(format, {
            name: item.name,
            value: item.value === '_r' ? selectTotal : item.value,
            rate: item.value === '_r' ? '100%' : rate,
            detailValue: item.value === '_r' ? detailTotalNum : item.value,
            detailTotalNum
          })
        },
        customFormatter (item) {
          return [
            `{title|${item.name}}`,
            `{rate|${this.showRate ? item.rate : ''}} {time|${formatNumber(item.value, 'zh')}}{sub|${this.unit}}`
          ].join('\n')
        },
        textStyle: {
          align: 'center',
          rich: {
            title: {
              fontSize: 16,
              lineHeight: 30,
              color: defaultBaseColor.PIE.ROUND.TEXT_COLOR
            },
            rate: {
              fontSize: 14,
              color: defaultBaseColor.PIE.ROUND.TEXT_COLOR
            },
            time: {
              fontSize: 25,
              fontWeight: 500,
              lineHeight: 40,
              color: defaultBaseColor.PIE.ROUND.TEXT_COLOR
            },
            sub: {
              fontSize: 14,
              color: defaultBaseColor.PIE.ROUND.TEXT_COLOR
            },
            detailValue: {
              fontSize: 25,
              fontWeight: 500,
              lineHeight: 40,
              color: defaultBaseColor.PIE.ROUND.TEXT_COLOR
            },
            detailTotalNum: {
              fontSize: 25,
              fontWeight: 500,
              lineHeight: 40,
              color: defaultBaseColor.PIE.ROUND.TEXT_COLOR
            }
          }
        }
      },
      emphasis: {
        show: true
      }
    }
  }]
}
