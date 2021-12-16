/**
 * 嵌套环饼图
 * created by liuyu
 */
import PieChart from './pie-chart'
import { merge } from '../../util/base.js'
import nestDefault from './template/tmpl-nest-default.js'
import nestDescription from './template/tmpl-nest-description.js'
import nestRound from './template/tmpl-nest-round'
import { data2NestPie } from '../../data-factory'
// 内外圈魔板配置
const TMPL = {
  default: nestDefault,
  // 外圈带描述
  'outer-description': nestDescription,
  // 空心圆
  round: nestRound
}
export default {
  name: 'idss-pie-nest-chart',
  mixins: [PieChart],
  props: {
    // @propCnName 嵌套环饼图魔板配置，支持 default、outer-description、round
    idssTmpl: {
      type: String,
      default: 'default'
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2NestPie(data)
    },
    initChartOption () {
      // 获取 bar 的默认配置(继承与bar-chart.js)
      let option = this.getChartOption()
      option = merge(option, {
        tooltip: {
          formatter: '{b}: {c} ({d}%)'
        }
      }, this.getDefaultInnerOpt())
      return option
    },

    /**
     * 获取内部饼图配置
     */
    getDefaultInnerOpt () {
      return TMPL[this.idssTmpl] || TMPL['default']
    }
  }
}
