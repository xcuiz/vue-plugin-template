/**
 * 仪表盘
 */
import 'echarts/lib/chart/gauge'
import Container from '../../container'
import { getGaugeChartOption, NEST_GRADE } from './template/tmpl-nest-gauge.js'
import { data2Gauge } from '../../data-factory'
export default {
  name: 'idss-gauge-chart',
  extends: Container,
  props: {
    // @propCnName 双层嵌套仪表盘模版
    idssTmpl: String,
    // @propCnName 状态等级（低危、中危、高危、严重）
    nestGrade: {
      type: Array,
      default () {
        return [0.3, 0.6, 0.8, 1]
      }
    },
    // @propCnName 空心仪表盘的 级别查询逻辑函数
    nestGradeFindIndex: {
      type: Function,
      default: (baseVal, item) => {
        return baseVal < item
      }
    },
    // @propCnName 字体颜色-边框线颜色配置
    nestOption: {
      type: Array,
      default () {
        return NEST_GRADE
      }
    },
    // @propIsApi
    data: {
      type: [Object, Array],
      default () {
        return {
          max: 100,
          data: []
        }
      }
    },
    keepAnimate: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Gauge(data)
    },
    // 没有默认配置项
    initDefaultOption () { return {} },
    // 获取图表配置项
    getChartOption () {
      return {
        grid: {
          top: '5%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        series: [{
          type: 'gauge',
          axisLine: {
            axisLine: true
          },
          splitLine: {
            lineStyle: {
              opacity: 0.7
            }
          },
          axisTick: {
            length: 5,
            lineStyle: {
              width: 2,
              opacity: 0.7
            }
          },
          pointer: {
            color: 'auto'
          },
          title: {
            show: false,
            fontSize: 16
          },
          axisLabel: {
            fontSize: 16
          },
          detail: {
            formatter: '{value}%',
            fontSize: 30
          },
          max: this.transformData.max,
          data: this.transformData.data
        }]
      }
    },
    getDefaultTmplOpt (that) {
      return getGaugeChartOption(that)
    },
    initChartOption () {
      if (this.idssTmpl === 'nestGauge') {
        return this.getDefaultTmplOpt(this)
      }
      return this.getChartOption()
    }
  }
}
