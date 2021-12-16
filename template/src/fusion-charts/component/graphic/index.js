import 'echarts/lib/component/graphic'
import { merge } from '../../util/base.js'
import defaultTmpl from './tmpl-default.js'

// 模板字典
const TMPL = {
  default: defaultTmpl
}
export default function (config = {}) {
  let { _idssTmpl = 'default', ...option } = config
  option = option || {}
  // legend数据默认从this.transformData获取
  let data = this.transformData.graphic || []
  // 模板 >> 数据 >> 用户自定义配置
  return merge({}, TMPL[_idssTmpl], { data }, option)
}
