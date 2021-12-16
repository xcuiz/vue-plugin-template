import chinaCoord from '../geo/geo-json/chinaCoord.json'
import worldCoord from '../geo/geo-json/worldCoord.json'
import { isFunction } from '../util/base.js'
const _noop = function () { }
/**
 * @param  {} {top=5 截取 Top值显示
 * @param  {} map='china'
 * @param  {} data=[]}={}
 */
const data2GeoMap = function ({ top = 5, map = 'china', data = [] } = {}, templateCb = {}) {
  if (!data) return
  // 根据 参数 获取相应的地理坐标信息 (将国家与世界的位置混合到一块，世界、国家、省份的位置信息公用)
  let coord = Object.assign({}, chinaCoord, worldCoord)
  // map 为 获取地理坐标信息的参数，默认值为 china
  let result = {
    legend: [],
    map: map,
    maxAndMin: getMaxAndMin(data),
    series: [],
    top: top
  }
  data.forEach((item, index) => {
    // map 为 获取地理坐标信息的参数，默认值为 china
    let { points = [], lines = [], name = '', seriesLines = {}, seriesScatter = {}, seriesEffectScatter = {} } = item
    points = points.map((pointItem, pointIndex) => {
      if (!coord[pointItem.name]) {
        console.error(`位置点：没有 “${pointItem.name}” 城市地理信息！`)
      }
      return Object.assign({
        name: pointItem.name,
        value: [...coord[pointItem.name] || ['', ''], pointItem.value, pointItem] // 根据 map 展示相应的地理坐标信息
      }, isFunction(templateCb.seriesScatterTmplCb) ? templateCb.seriesScatterTmplCb(pointItem, pointIndex) : _noop)
    })
    // lines 可能为 undefined
    if (lines && lines.length) {
      lines = lines.map((lineItem, lineIndex) => {
        if (!coord[lineItem.from] || !coord[lineItem.to]) {
          console.error(`攻击线：没有 “${lineItem.from}“ 或 ”${lineItem.to}” 城市地理信息！`)
        }
        return Object.assign({
          coords: [coord[lineItem.from] || ['', ''], coord[lineItem.to] || ['', '']],
          fromName: lineItem.from,
          toName: lineItem.to
        }, isFunction(templateCb.seriesLinesTmplCb) ? templateCb.seriesLinesTmplCb(lineItem, lineIndex) : _noop)
      })
    }
    // 图例
    result.legend.push(Object.assign({ name: item.name }, isFunction(templateCb.legendTmplCb) ? templateCb.legendTmplCb(item, index) : _noop))

    const formatItem = {
      name: name,
      points: points,
      lines: lines.filter(item => item.coords[0][0] && item.coords[0][1] && item.coords[1][0] && item.coords[1][1]), // 过滤无地理信息的城市
      maxAndMin: getMaxAndMin([{ points }]),
      seriesLines,
      seriesScatter,
      seriesEffectScatter
    }
    result.series.push(Object.assign(
      formatItem,
      (isFunction(templateCb.seriesTmplCb) && templateCb.seriesTmplCb(formatItem, index)) || {}
    ))
  })
  return result
}

/**
 * @param  {} map='china'
 * @param  {} data=[]}={}
 */
const data2GeoMap3D = function ({ map = 'china', data = [] } = {}, templateCb = {}) {
  if (!data) return
  // 根据 参数 获取相应的地理坐标信息 (将国家与世界的位置混合到一块，世界、国家、省份的位置信息公用)
  let coord = Object.assign({}, chinaCoord, worldCoord)
  // map 为 获取地理坐标信息的参数，默认值为 china
  let result = {
    map: map,
    maxAndMin: getMaxAndMin(data),
    series: []
  }
  data.forEach((item, index) => {
    // map 为 获取地理坐标信息的参数，默认值为 china
    /**
     * modify by liuning
     * 新增新参数 map3D --- 与seriesLines3D意思一样，将自定义的option和已配置好的option merge在一起
    */
    let { points = [], lines = [], name = '', seriesLines3D = {}, seriesScatter3D = {}, map3D = {} } = item
    points = points.map((pointItem, pointIndex) => {
      if (!coord[pointItem.name]) {
        console.error(`位置点：没有 “${pointItem.name}” 城市地理信息！`)
      }
      return Object.assign({
        name: pointItem.name,
        value: [...coord[pointItem.name] || ['', ''], pointItem.value, pointItem] // 根据 map 展示相应的地理坐标信息
      }, isFunction(templateCb.seriesScatter3DTmplCb) ? templateCb.seriesScatter3DTmplCb(pointItem, pointIndex) : _noop)
    })
    // lines 可能为 undefined
    if (lines && lines.length) {
      lines = lines.map((lineItem, lineIndex) => {
        if (!coord[lineItem.from] || !coord[lineItem.to]) {
          console.error(`攻击线：没有 “${lineItem.from}“ 或 ”${lineItem.to}” 城市地理信息！`)
        }
        return Object.assign({
          coords: [coord[lineItem.from] || ['', ''], coord[lineItem.to] || ['', '']]
        }, isFunction(templateCb.seriesLines3DTmplCb) ? templateCb.seriesLines3DTmplCb(lineItem, lineIndex) : _noop)
      })
    }

    let formatItem = {
      name: name,
      points: points,
      lines: lines.filter(item => item.coords[0][0] && item.coords[0][1] && item.coords[1][0] && item.coords[1][1]), // 过滤无地理信息的城市
      maxAndMin: getMaxAndMin([{ points }]),
      seriesLines3D,
      seriesScatter3D,
      map3D
    }
    result.series.push(Object.assign(
      formatItem,
      (isFunction(templateCb.seriesTmplCb) && templateCb.seriesTmplCb(formatItem, index)) || {}
    ))
  })
  return result
}

/**
 * @param  data: { "map": "china", "name": "中国", "points": [{"name": "山东省", "value": 1000}, {"name": "河南省", "value": 1200}]}
 */
const data2GeoMapVisual = function (data, templateCb = {}) {
  if (!Array.isArray(data) || !data.length) return
  let result = {
    maxAndMin: getMaxAndMin(data),
    legend: [],
    series: []
  }
  data.forEach(({ map = 'china', name = '', points = [], ...item } = {}, index) => {
    // 图例
    result.legend.push(Object.assign({ name: item.name }, isFunction(templateCb.legendTmplCb) ? templateCb.legendTmplCb(item, index) : _noop))
    result.series.push({
      map: map,
      name: name,
      data: points.map((dataItem, dataIndex) => Object.assign(dataItem, isFunction(templateCb.seriesTmplCb) ? templateCb.seriesTmplCb(dataItem, dataIndex) : _noop)),
      ...item
    })
  })
  return result
}

// 获取最大值和最小值
const getMaxAndMin = function (data = []) {
  if (!(Array.isArray(data) && data.length)) return
  let values = []
  let formatArr = data.map(item => item.points.map(subItem => subItem.value))
  formatArr.forEach(item => {
    values.push(...item)
  })
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  }
}

export {
  data2GeoMap,
  data2GeoMap3D,
  data2GeoMapVisual
}
