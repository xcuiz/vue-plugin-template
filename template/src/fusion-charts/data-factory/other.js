import { dataScale } from '../util/base.js'
import { merge, isFunction } from 'fusion-utils'

const _noop = function () { }

/**
 * 基础关系图转换方法
 * @param {
 *  nodes:[{name:'来源1', type:''...},...]
 *  lines:[{source: '来源1', target: '目标1'}, ...]
 *  templateCb:{模板钩子函数}
 * }
 * result: {legend: [], nodes: [{name:'', category: legend下标}], lines: []}
 */
const data2Graph = function (data = { nodes: [], lines: [] }, templateCb = {}) {
  // 验证，补全
  templateCb.categoriesSetTmplCb = isFunction(templateCb.categoriesSetTmplCb) ? templateCb.categoriesSetTmplCb : _noop
  templateCb.nodesTmplCb = isFunction(templateCb.nodesTmplCb) ? templateCb.nodesTmplCb : _noop
  templateCb.linesTmplCb = isFunction(templateCb.linesTmplCb) ? templateCb.linesTmplCb : _noop

  let result = {
    legend: [],
    categories: [],
    nodes: [],
    lines: []
  }
  if (Array.isArray(data.nodes)) {
    let categoriesSet = new Set()
    // 是否需要根据动态计算 symbolSize
    let isCalculateSymbolSize = (data.nodes.length > 0 && typeof (data.nodes[0].value) === 'number')
    let maxNum, minNum
    // 取 node 的最大值，最小值
    if (isCalculateSymbolSize) {
      let sortableData = data.nodes.sort((current, prev) => prev.value - current.value)
      maxNum = sortableData[0].value
      minNum = sortableData[sortableData.length - 1].value
    }
    // 数据节点
    let categoriesAry = []
    data.nodes.map((item, index) => {
      let { type, name, value } = item
      // 节点分类的类目
      categoriesSet.add(templateCb.categoriesSetTmplCb(item, index) || type)
      categoriesAry = [...categoriesSet]
      result.nodes.push(Object.assign({
        name: name,
        category: categoriesAry.indexOf(type),
        type: type,
        value: value,
        symbolSize: isCalculateSymbolSize ? dataScale({ current: value, maxNum: maxNum, minNum: minNum }) : 15
      }, templateCb.nodesTmplCb(item, index)))
    })
    categoriesAry.map(val => {
      result.categories.push({ name: val })
      result.legend.push({ name: val })
    })
    // 数据节点关系
    data.lines.map((item, index) => {
      result.lines.push(templateCb.linesTmplCb(item, index) || item)
    })
  }
  return result
}

/**
 * 转换为仪表盘使用的数据
 * @param
 * {
 *  "maxValue": 100,
    "name": "分数",
    "value": 80
 * }
 */
const data2Gauge = function (data = {}, templateCb = {}) {
  templateCb.seriesTmplCb = isFunction(templateCb.seriesTmplCb) ? templateCb.seriesTmplCb : _noop

  let result = {
    max: 100,
    data: []
  }
  if (data.value) {
    return {
      max: data.maxValue,
      data: [Object.assign({ value: data.value || 0, name: data.name }, templateCb.seriesTmplCb(data))]
    }
  } else {
    return result
  }
}

/**
 * 转换为多仪表盘使用的数据
 * @param data 源数据 [{"key": 1, "name": "xxx", "value": xx}, ...]
 * target: {"name": {
 *    "key": 1,
 *    "name": "xxx",
 *    "value": xx,
 *    "min": xx,
 *    "max": xx
 *  }, ...}
 */
const data2MultiGauge = function (data = [], templateCb = {}) {
  templateCb.seriesTmplCb = isFunction(templateCb.seriesTmplCb) ? templateCb.seriesTmplCb : _noop
  let result = {
    series: []
  }
  if (Array.isArray(data) && data.length > 0) {
    data.forEach((item, index) => {
      let singleData = []
      let { name, value, min = 0, max = 100 } = item
      singleData.push(Object.assign({ name, value }, templateCb.seriesTmplCb(item, index)))
      result.series.push({
        min,
        max,
        data: singleData
      })
    })
  }
  return result
}

/**
 * 基础桑基图转换方法
 * @param {
 *  nodes:[{name:'来源1', type:''...},...]
 *  lines:[{source: '来源1', target: '目标1'}, ...]
 *  templateCb:{模板钩子函数}
 * }
 * result: {series: [nodes: [{name:''}], lines: []]}
 */
const data2Sankey = function (data, templateCb = {}) {
  let cbList = ['nodesTmplCb', 'linksTmplcb']
  cbList.forEach(cb => {
    templateCb[cb] = isFunction(templateCb[cb]) ? templateCb[cb] : _noop
  })
  let result = {
    series: []
  }
  if (Array.isArray(data.links) && Array.isArray(data.nodes)) {
    result.series.push({ links: templateCb.linksTmplcb(data.links, 0) || data.links, nodes: templateCb.nodesTmplCb(data.nodes) || data.nodes })
  }
  return result
}

/** TreeMap 层级图
 * @param  {} data
 */
const data2TreeMap = function (data, templateCb = {}) {
  const { seriesTmplCb, seriesItemTmplCb } = templateCb
  let result = {
    series: []  // series: [{name: '', data: [{name, value, children: [....]}, ....}]
  }
  if (Array.isArray(data) && data.length) {
    data = data.map(d => {
      const deepCopyData = merge(d)
      return isFunction(seriesItemTmplCb) ? _treeMaprecursive(deepCopyData, seriesItemTmplCb) : deepCopyData
    })
    result.series.push(merge({
      data: data
    }, isFunction(seriesTmplCb) ? seriesTmplCb(data) : {}))
  }
  return result
}

function _treeMaprecursive (data, tmplCb) {
  data = merge(data, tmplCb(data) || {})
  if (Array.isArray(data.children)) {
    data.children = data.children.map(val => merge(val, _treeMaprecursive(val, tmplCb) || {}))
  }
  return data
}

/**
 * @abandoned
 * 树状图的转换方法。因为与后台接口约定的格式是与echart tree 组件使用一样的。所以这里只对含有callback的方法进行改造
 * @param {*} data 原始数据
 * @param {*} processCb 层级回调函数，参数: data-对应当前层级的 data 数据、level-当前层级
 */
const data2Tree = function (data, processCb) {
  const deepCopyData = merge(data)
  return [isFunction(processCb) ? _treeRecursiveProcessCb(deepCopyData, 1, processCb) : deepCopyData]
}

/**
 * @new
 * 树状图的转换方法。因为与后台接口约定的格式是与echart tree 组件使用一样的。所以这里只对含有callback的方法进行改造
 * @param {*} data 原始数据
 * @param {*} processCb 层级回调函数，参数: data-对应当前层级的 data 数据、level-当前层级
 */
const data2FullTree = function (data, processCb) {
  let result = {
    series: []
  }
  const deepCopyData = merge(data)
  result.series = [isFunction(processCb) ? _treeRecursiveProcessCb(deepCopyData, 1, processCb) : deepCopyData]
  return result
}

/**
 * 递归调用树图的 processCb
 * @param {*} data 树的数据
 * @param {*} level 当前的层级
 * @param {*} processCb 树中的回调
 */
function _treeRecursiveProcessCb (data, level, processCb) {
  data = merge(data, processCb(data, level++) || {})
  if (Array.isArray(data.children)) {
    data.children = data.children.map(val => merge(val, _treeRecursiveProcessCb(val, level, processCb) || {}))
  }
  return data
}

export {
  data2Graph,
  data2Gauge,
  data2MultiGauge,
  data2Sankey,
  data2TreeMap,
  data2Tree,
  data2FullTree
}
