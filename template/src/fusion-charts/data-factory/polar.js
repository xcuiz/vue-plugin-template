/**
 * 极坐标data-facotry
 * created by liuyu
 */
import { data2Cartesian } from './cartesian'
import { isFunction, isObject, merge } from '../util/base.js'
const _noop = function () { }
/**
 * 接口数据，转换为极坐标堆积图、柱图(数据结构类似柱图)
 * @model [{key: '', name: '', value: [{key: '', name: '', value: ''}, {...}]}, {...}]
 */
const data2BarStackPolar = function (res = [], templateCb = {}) {
  const data = merge([], res)
  // 验证，补全
  _resetTmplCbName(['legendTmplCb', 'angleAxisTmplCb', 'seriesTmplCb'], templateCb)
  // 引用笛卡尔坐标系方法，补全笛卡尔坐标系回调
  templateCb.xAxisTmplCb = templateCb.angleAxisTmplCb
  // 对柱图数据进行整合处理
  const cartesianData = data2Cartesian(data, templateCb)
  const result = {
    legend: cartesianData.legend,
    angleAxis: cartesianData.xAxis.length ? cartesianData.xAxis[0].data : [],
    radiusAxis: cartesianData.xAxis.length ? cartesianData.xAxis[0].data : [],
    series: cartesianData.series
  }
  return result
}

/**
 * 接口数据，转换为极坐标百分比图
 * @model [{"key": "","name": "","value": [{"key": "","name": "A","value": 68},{"key": "","name": "B","value": 10}]}, ...]
 */
const data2PolarBarPercent = function (res = [], templateCb = {}) {
  const data = merge([], res)
  // 验证，补全回调魔板
  _resetTmplCbName(['legendTmplCb', 'seriesTmplCb'], templateCb)
  let result = {
    legend: [],
    series: [] // 要求的返回格式：{name: '', data: [{name: '', value: 0}]}
  }
  let count = 0
  const countList = {}
  data.forEach((item, itemIndex) => {
    result.legend.push(Object.assign(
      { name: item.name },
      templateCb.legendTmplCb(item, itemIndex)
    ))
    countList[item.name] = item.value.reduce((total, subItem) => {
      total += subItem.value
      return total
    }, 0)
    count += countList[item.name]
  })

  data.forEach((item, itemIndex) => {
    item.value.forEach((subItem, subIndex) => {
      // 百分比值
      result.series.push(Object.assign({
        name: item.name,
        // 该系列数据占比
        percent: Math.round(countList[item.name] / count * 100) + '%',
        data: [{
          name: subItem.name,
          // 该数据占整组数据比例
          value: Math.round(subItem.value / countList[item.name] * 100) / 100,
          data: subItem
        }]
      },
      templateCb.seriesTmplCb(subItem, subIndex, item, itemIndex)))
    })
  })
  return result
}

/**
 * 接口数据，转换为极坐标散点图
 * @model {
    "angleAxis<Array?>": [{"key": 1508094000000,"value": "数据安全协议","name": "数据安全协议"},{"key": 1508094000000,"name": "定期日志审计","value": "定期日志审计"},...],
    "radiusAxis<Array?>": [{"key": 1508094000000,"name": 1,"value": 1},{"key": 1508094000000,"name": 2,"value": 2},...],
    "data": [{"key": "firewall","name": "Firewall","value": [{"key": 1508083200000,"value": [1, "数据安全协议", 4]},{"key": 1508094000000,"value": [8, "落实防护措施", 8]},{"key": 1508104800000,"value": [9, "定期日志审计", 12]}]},...]
  }
 */
const data2PolarScatter = function (res = [], templateCb = {}) {
  const data = merge([], res)
  // 验证，补全回调魔板
  _resetTmplCbName(['legendTmplCb', 'seriesTmplCb', 'angleAxisTmplCb', 'radiusAxisTmplCb'], templateCb)
  let result = {
    legend: [],
    series: [],
    // 角坐标刻度数据
    angleAxis: undefined,
    // 径坐标数据
    radiusAxis: undefined
  }
  // 角坐标处理
  if (Array.isArray(data.angleAxis)) {
    result.angleAxis = []
    data.angleAxis.forEach((item, index) => {
      result.angleAxis.push(Object.assign(item, templateCb.angleAxisTmplCb(item, index)))
    })
  }
  // 轴坐标处理
  if (Array.isArray(data.radiusAxis)) {
    result.radiusAxis = []
    data.radiusAxis.forEach((item, index) => {
      result.radiusAxis.push(Object.assign(item, templateCb.radiusAxisTmplCb(item, index)))
    })
  }
  // 处理单组数据兼容
  if (Array.isArray(data.data) && Array.isArray(data.data[0].value) && !isObject(data.data[0].value[0])) {
    data.data = [{ name: '', value: data.data }]
  }
  // 数据处理
  if (Array.isArray(data.data)) {
    data.data.forEach((item, itemIndex) => {
      // legend处理
      item.name && result.legend.push(Object.assign(
        { name: item.name },
        templateCb.legendTmplCb(item, itemIndex)
      ))
      // 三维数据处理
      const lineData = []
      item.value.map((subItem, subIndex) => {
        const [radius, angle, ...value] = subItem.value
        // 查找角坐标index
        let angleIndex = -1
        // 兼容不传输角坐标的数据
        if (Array.isArray(data.angleAxis) && data.angleAxis.length) {
          angleIndex = result.angleAxis.findIndex(item => item.value === angle || item.name === angle)
        } else {
          angleIndex = angle
        }
        // 查找径坐标index
        let radiusIndex = -1
        // 兼容不传输径坐标的数据
        if (Array.isArray(data.radiusAxis) && data.radiusAxis.length) {
          radiusIndex = result.radiusAxis.findIndex(item => item.value === radius || item.name === radius)
        } else {
          radiusIndex = radius
        }
        // 整理三维数据（轴坐标、角坐标、value）
        lineData.push(Object.assign({
          name: subItem.name,
          value: [radiusIndex, angleIndex, ...value]
        }, templateCb.seriesTmplCb(subItem, subIndex, item, itemIndex)))
      })
      result.series.push({
        name: item.name,
        data: lineData
      })
    })
  }
  return result
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
  data2BarStackPolar,
  data2PolarBarPercent,
  data2PolarScatter
}
