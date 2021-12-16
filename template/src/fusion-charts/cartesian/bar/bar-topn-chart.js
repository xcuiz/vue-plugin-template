import { merge } from '../../util/base.js'
import Bar from './bar-chart.js'
import Mini from '../../cartesian/template/tmpl-mini.js'
import { data2Cartesian } from '../../data-factory'
export default {
  name: 'idss-bar-topn-chart',
  // extends: Bar,
  mixins: [Bar],
  props: {
    // @propCnName series data label 显示方法， 支持三个属性显示: 值(value)、名称(name)、百分比(percent)
    labelType: {
      type: [String, Array]
    },
    // @propCnName topn必须是横向的，使用topn图表不应该修改此选项
    horizontal: {
      type: Boolean,
      default: true
    },
    // @propCnName 反向TOPN，Y轴在右面面
    right: Boolean
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Cartesian(data)
    },
    initChartOption () {
      const colorLength = this.ECHARTS_THEME.color.length
      // 获取 bar 的默认配置(继承与bar-chart.js)
      const option = this.getChartOption()
      option.series = option.series.map(val => {
        // 计算data的总和
        const total = val.data.reduce((v1, v2) => v1 + v2.value, 0)

        return {
          ...val,
          barMaxWidth: '15px',
          itemStyle: {
            barBorderRadius: 3
          },
          label: {
            show: !!this.labelType,
            // 区别靠左还是靠右显示
            position: this.right ? 'left' : 'right',
            // 格式化回调方法， 支持三个属性显示: 值(value)、名称(name)、百分比(percent)
            formatter: param => {
              const { xAxisName, value } = param.data
              let labelTypeDictionary = {
                percent: `${Math.round(value / total * 100)}%`,
                value: value,
                name: xAxisName
              }
              if (Array.isArray(this.labelType)) {
                // 如果 labelType 是个数组，累加指定的显示内容
                return this.labelType.reduce((v1, v2) => {
                  return (v1 ? v1 + ' ' : '') + (labelTypeDictionary[v2] || '')
                }, '')
              } else {
                // 当 labelType 是个字符串的时候
                return labelTypeDictionary[this.labelType]
              }
            }
          },
          // 覆盖data
          data: val.data.map((value, index) => {
            return merge({
              itemStyle: {
                // topn的柱子颜色每一根都不一样，这是和其他柱状图的区别
                color: this.ECHARTS_THEME.color[index % colorLength]
              }
            }, value)
          })
        }
      })
      return merge(option, Mini, {
        xAxis: [{
          splitLine: {
            show: false
          },
          inverse: this.right
        }],
        yAxis: [{
          // 因为top的y轴是用的x轴的数据，顺序会被颠倒，所以使用 inverse 颠倒回来
          inverse: true,
          axisLabel: {
            show: true,
            align: this.right ? 'left' : 'right'
          },
          position: this.right ? 'right' : 'left'
        }]
      })
    }
  }
}
