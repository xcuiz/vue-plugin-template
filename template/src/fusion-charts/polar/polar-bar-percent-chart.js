import PolarBar from './polar-bar-chart'
import { merge } from '../util/base.js'
import Percent from '../polar/template/tmpl-percent.js'
import { data2PolarBarPercent } from '../data-factory'
/**
 * 极坐标定制化百分比柱图，支持数据系列数据占比和单个值占整组数据比例
 * created by liuyu
 */
import BASE_COLOR from '../theme/default-base-color.js'
export default {
  name: 'idss-polar-bar-percent-chart',
  mixins: [PolarBar],
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2PolarBarPercent(data)
    },
    initChartOption () {
      // 获取 bar 的默认配置(继承与bar-chart.js)
      const option = this.getChartOption()
      option.series = option.series.map(val => {
        return merge(val, {
          stack: val.name,
          // 定制化处理data-factory，添加barWidth属性
          barWidth: val.percent,
          barGap: '0',
          itemStyle: {
            borderWidth: 5,
            borderColor: BASE_COLOR.POLAR.BORDER_COLOR
          }
        })
      })
      return merge(option, Percent)
    }
  }
}
