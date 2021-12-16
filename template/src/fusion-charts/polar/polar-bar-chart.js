import 'echarts/lib/chart/bar'
import Polar from './polar'
import { merge } from '../util/base.js'
import { data2BarStackPolar } from '../data-factory'
/**
 * 极坐标柱状图，支持堆积、横向纵向转化
 * created by liuyu
 */
export default {
  name: 'idss-polar-bar-chart',
  extends: Polar,
  props: {
    // @propCnName 变为横向，轴坐标与角坐标交换，当前业务场景只在极坐标堆叠图中使用
    horizontal: Boolean,
    // @propCnName 是否堆积模式
    stack: {
      type: [Boolean, String],
      default () {
        return null
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2BarStackPolar(data)
    },
    getChartOption () {
      // 分类轴配置
      const cateOption = {
        type: 'category',
        data: this.transformData.angleAxis || []
      }
      return {
        radiusAxis: this.horizontal ? cateOption : {},
        angleAxis: this.horizontal ? {} : cateOption,
        series: this.transformData.series.map(val => merge({}, {
          type: 'bar',
          coordinateSystem: 'polar',
          stack: this.stack
        }, val))
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
