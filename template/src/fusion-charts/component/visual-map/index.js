import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/visualMapContinuous'
import 'echarts/lib/component/visualMapPiecewise'
import { merge } from '../../util/base.js'

import defaultTmpl from './tmpl-default.js'
import horizontalTmpl from './tmpl-horizontal.js'

// 模板字典
const TMPL = {
  default: defaultTmpl,
  horizontal: horizontalTmpl
}

export default function (config = {}) {
  if (Array.isArray(config)) {
    // 多个visual map的配置
    return config.map(val => {
      let { _idssTmpl = 'default', ...option } = val
      return merge({}, TMPL[_idssTmpl], option)
    })
  } else {
    // 一个配置，按对象处理
    let { _idssTmpl = 'default', ...option } = config
    // 模板 >> 数据 >> 用户自定义配置
    return merge({}, TMPL[_idssTmpl], option)
  }
}
