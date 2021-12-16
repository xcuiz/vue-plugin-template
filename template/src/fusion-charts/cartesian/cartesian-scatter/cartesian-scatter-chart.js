import 'echarts/lib/chart/scatter'
import Cartesian from '../cartesian'
import { merge, getPropValue } from '../../util/base.js'
import { getChartOptionVal, DATA_LIST } from './template/tmpl-scatter.js'
import { data2CartesianScatter } from '../../data-factory'

// 直角坐标系scatter所用模版(为了后期模版统一处理)
const TMPL = {
  scatterChartTmpl: getChartOptionVal // 加图例模版
}

export default {
  name: 'idss-scatter-chart',
  extends: Cartesian,
  props: {
    // @propCnName 显示模版类型
    idssTmpl: String,
    // @propCnName 展示气泡图的配置， 默认为五项配置（symbolSize、offset）
    dataList: {
      type: Array,
      default () {
        return DATA_LIST
      }
    },
    // @propCnName 是否展示legend
    isShowLegend: {
      type: Boolean,
      default: false
    },
    // @propCnName label单位
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
      return data2CartesianScatter(data)
    },
    getChartOption () {
      return {
        tooltip: {
          trigger: 'item'
        },
        series: this.transformData.series.map((item, index) => merge({}, {
          type: 'scatter',
          itemStyle: getPropValue(this.itemStyle),
          label: getPropValue(this.label, { show: true })
        }, item))
      }
    },
    // 模版渲染
    getDefaultTmplOpt (that) {
      return TMPL[this.idssTmpl](that)
    },
    initChartOption () {
      if (this.idssTmpl && TMPL[this.idssTmpl]) {
        return this.getDefaultTmplOpt(this)
      }
      return this.getChartOption()
    }
  }
}
