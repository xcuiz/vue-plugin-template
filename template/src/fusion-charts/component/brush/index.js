import 'echarts/lib/component/brush'
import { merge } from '../../util/base.js'
import defaultTmpl from './tmpl-default.js'
const TMPL = {
  default: defaultTmpl
}
export default function (config = {}) {
  // 清空选框
  this.brushClear = () => {
    this.myChart.dispatchAction({
      type: 'brush',
      areas: []
    })
  }

  const { _idssTmpl = 'default', ...option } = config
  return merge({}, TMPL[_idssTmpl], option)
}
