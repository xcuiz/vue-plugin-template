import Parallel from '../parallel.js'
import { getPropValue, merge } from '../../util/base.js'
import { data2Parallel } from '../../data-factory'

export default {
  name: 'idss-parallel-chart',
  extends: Parallel,
  data () {
    return {}
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Parallel(data)
    },
    initChartOption () {
      return {
        series: this.transformData.series.map(item => merge({}, {
          type: 'parallel',
          data: item.data,
          lineStyle: getPropValue(this.lineStyle)
        }, item))
      }
    }
  }
}
