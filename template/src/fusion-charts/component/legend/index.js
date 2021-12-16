import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import { merge, isFunction } from '../../util/base.js'
import defaultTmpl from './tmpl-default.js'
import horizontalTmpl from './tmpl-horizontal.js'
import horizontalMultiLineTmpl from './tmpl-horizontal-multi-line.js'
import pieDescriptionTmpl from './tmpl-pie-description.js'

// 模板字典 动态引入
const TMPL = {
  default: defaultTmpl,
  horizontal: horizontalTmpl,
  'horizontal-multi-line': horizontalMultiLineTmpl,
  'pie-description': pieDescriptionTmpl // @FIXME 饼图图例描述模板默认（不同图标，图例数据依赖格式不同，带后期找合理方式）
}

export default function (config = {}) {
  // richClass 默认富文本样式名
  let { _idssTmpl = 'default', richClass = {}, ...option } = config
  option = option || {}
  // legend数据默认从this.transformData获取
  let data = this.transformData.legend || []
  // 获取模板配置（图例模板需要单独获取）
  const tmplConfig = _idssTmpl === 'pie-description' ? TMPL[_idssTmpl](richClass) : TMPL[_idssTmpl]
  // 模板 >> 数据 >> 用户自定义配置
  let newOpt = merge({}, tmplConfig, { data }, option)
  // 为legend formatter绑定this
  if (newOpt.formatter && isFunction(newOpt.formatter)) {
    newOpt.formatter = newOpt.formatter.bind(this)
  }
  return newOpt
}
