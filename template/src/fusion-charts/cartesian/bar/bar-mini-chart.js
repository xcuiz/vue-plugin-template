import Bar from './bar-chart.js'
import Mini from '../../cartesian/template/tmpl-mini.js'
import { merge } from '../../util/base.js'
import { data2Cartesian } from '../../data-factory'
export default {
  name: 'idss-bar-mini-chart',
  extends: Bar,
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Cartesian(data)
    },

    initChartOption () {
      return merge(
        this.getChartOption(),
        Mini
      )
    }
  }
}
