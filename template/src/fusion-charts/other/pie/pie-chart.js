/**
 * 常规饼状图，支持南丁格尔
 * created by liuyu
 */
import 'echarts/lib/chart/pie'
import Pie from './pie'
import { merge } from '../../util/base.js'
import BASE_COLOR from '../../theme/default-base-color.js'
import { data2Pie } from '../../data-factory'
export default {
  name: 'idss-pie-chart',
  extends: Pie,
  props: {
    // @propCnName 是否是曼丁格尔玫瑰图
    roseType: Boolean,
    // @propCnName 标题单位（该参数必须与labelCenter配合使用,在idssTmpl=default情况下使用）
    unit: {
      type: String,
      default: '次'
    }
  },
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Pie(data)
    },
    getChartOption () {
      return {
        series: this.transformData.series.map(val => merge({}, {
          type: 'pie',
          roseType: this.roseType,
          avoidLabelOverlap: true,
          // 图形样式，emphasis是图形在高亮状态下的样式
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              // @FIXME color
              shadowColor: BASE_COLOR.PIE.BASE.SHADOW_COLOR
            }
          }
        }, val))
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
