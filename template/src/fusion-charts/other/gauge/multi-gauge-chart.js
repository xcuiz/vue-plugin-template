import 'echarts/lib/chart/gauge'
import Container from '../../container'
import tmplThreeGauge from './template/tmpl-three-gauge.js'
import { merge } from '../../util/base.js'
import { data2MultiGauge } from '../../data-factory'

const TMPL = {
  'default': tmplThreeGauge
}

export default {
  name: 'idss-multi-gauge-chart',
  extends: Container,
  props: {
    idssTmpl: {
      type: String,
      default: 'default'
    },
    keepAnimate: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2MultiGauge(data)
    },
    initDefaultOption () {
      let series = []
      const baseSeries = {
        type: 'gauge',
        axisLine: {                       // 坐标轴线
          lineStyle: {                    // 属性lineStyle控制线条样式
            width: 10
          }
        },
        axisTick: {                       // 坐标轴小标记
          length: 15,                     // 属性length控制线长
          lineStyle: {                    // 属性lineStyle控制线条样式
            color: 'auto'
          }
        },
        splitLine: {                      // 分隔线
          length: 20,                     // 属性length控制线长
          lineStyle: {                    // 属性lineStyle（详见lineStyle）控制线条样式
            color: 'auto'
          }
        },
        title: {
          fontWeight: 'bolder',
          fontSize: 16
        },
        detail: {
          fontWeight: 'bolder',
          fontSize: 18,
          formatter: '{value}%'
        }
      }
      series = this.transformData.series.map(item => merge({}, baseSeries, item))
      return {
        series
      }
    },

    initChartOption () {
      return merge(
        this.initDefaultOption(),
        TMPL[this.idssTmpl] || {}
      )
    }
  }
}
