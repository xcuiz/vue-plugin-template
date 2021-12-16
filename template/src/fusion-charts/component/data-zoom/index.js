import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/dataZoomInside'
import 'echarts/lib/component/dataZoomSlider'
import { merge } from '../../util/base.js'
import defaultTmpl from './tmpl-default.js'
import yAxisTmpl from './tmpl-y.js'
import insideDefault from './tmpl-default-inside.js'
import yInside from './tmpl-y-inside.js'
// 模板字典
const TMPL = {
  default: defaultTmpl,
  inside: insideDefault,
  y: yAxisTmpl,
  yInside: yInside
}

export default function (config = {}) {
  if (Array.isArray(config)) {
    return config.map(val => {
      let { _idssTmpl = 'default', ...option } = val
      // 模板 >> 数据 >> 用户自定义配置
      return merge({}, TMPL[_idssTmpl], option)
    })
  } else {
    let { _idssTmpl = 'default', ...option } = config
    // 模板 >> 数据 >> 用户自定义配置
    return merge({}, TMPL[_idssTmpl], option)
  }
}
