import Line from '../../cartesian/line/line-chart.js'
import Baseline from '../../cartesian/template/tmpl-baseline.js'
import { merge } from '../../util/base.js'
import { data2Baseline } from '../../data-factory'
export default {
  name: 'idss-line-baseline-chart',
  extends: Line,
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Baseline(data)
    },
    initChartOption () {
      return merge(
        this.getChartOption(),
        Baseline, {
          visualMap: {
            pieces: this.transformData.visualMap.pieces
          }
        }
      )
    }
  }
}
