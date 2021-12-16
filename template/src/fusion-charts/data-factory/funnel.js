import { data2Pie } from './pie.js'
import { isFunction, merge } from '../util/base.js'
const _noop = function () {}
/**
 * 通用转换方法，单条数据【一维】
 * @param [{key: '', name: '', value: ''},{key: '', name: '', value: ''},...]
 * result: {series: []}
 * name 为一条数据中所对于的key值，xAxis 为一条数据中单值key的值
 */
const data2Funnel = function (res, templateCb = {}) {
  const data = merge([], res)
  // 验证，补全
  _resetTmplCbName(['legendTmplCb', 'seriesTmplCb'], templateCb)
  return data2Pie(data, templateCb)
}

/**
 * 处理模板回调处理对象
 * @param {array|string} 回调函数名称
 * @param {object} tmplObject 要补全对调名的对象
 * @return {object} {tmplname: function, tmplname2: function}
 */
const _resetTmplCbName = function (namelist = [], tmplObject) {
  // 判断是string 处理
  if (typeof namelist === 'string') {
    namelist = [namelist]
  }
  if (Array.isArray(namelist)) {
    namelist.forEach(name => {
      tmplObject[name] = isFunction(tmplObject[name]) ? tmplObject[name] : _noop
    })
  }
}
export {
  data2Funnel
}
