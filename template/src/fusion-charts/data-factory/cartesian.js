import { isFunction } from '../util/base.js'
import BASE_COLOR from '../theme/default-base-color.js'

const _noop = function () { }

/**
 * 通用方法，获取时间间隔，用于下钻
 * @param {Object} data
 * result: 时间间隔
 */
const _getInterval = function (data) {
  // 时间间隔，点击曲线点，下钻携带改点时间, 注意：-1 是业务需求（例：2:00 - 2:59:59）
  let intervalTime = 0
  if (data[0] && Array.isArray(data[0].value)) {
    intervalTime = data[0].value[1] ? data[0].value[1].key - data[0].value[0].key - 1 : 0
  } else {
    intervalTime = data[1] && data[1].key - data[0].key - 1
  }
  return intervalTime
}

/**
 * 通用转换方法，单条数据【一维】
 * @param [{key: '', name: '', value: ''},{key: '', name: '', value: ''},...]
 * result: {xAxis: [], series: []}
 * name 为一条数据中所对于的key值，xAxis 为一条数据中单值key的值
 */
const _data2Single = function (data, templateCb) {
  let result = {
    legend: [], // 单曲线legend为空
    xAxis: [{ data: [] }],
    series: [{ data: [] }] // 要求的返回格式：{name: '', data: [{name: '', value: 0}]}
  }
  // 时间间隔，点击曲线点，下钻携带改点时间, 注意：-1 是业务需求（例：2:00 - 2:59:59）
  let intervalTime = _getInterval(data)
  data.map((d, dataIndex) => {
    let { key, name, value } = d
    result.xAxis[0].data.push(templateCb.xAxisTmplCb(d, dataIndex) || name)
    // series数据
    result.series[0].data.push(Object.assign({ name: key, value: value, xAxis: key, startTime: +key, endTime: (+key) + (+intervalTime), xAxisName: name }, templateCb.seriesTmplCb(d, dataIndex)))
  })
  return result
}

/**
 * 通用转换方法，多条数据【二维】
 * @param [{key: '', name: '', value: [{key: '', name: '', value: ''}, {...}]}, {...}]
 * result: {legend: [], xAxis: [], series: []}
 */
const _data2Multiple = function (data, templateCb) {
  let result = {
    legend: [],
    xAxis: [{ data: [] }],
    series: [] // 要求的返回格式：{name: '', data: [{name: '', value: 0}]}
  }
  // 时间间隔，点击曲线点，下钻携带改点时间, 注意：-1 是业务需求（例：2:00 - 2:59:59）
  let intervalTime = _getInterval(data)
  data.map((item, itemIndex) => {
    // legend数据封装
    result.legend.push(Object.assign({ name: item.name }, templateCb.legendTmplCb(item, itemIndex)))
    let itemSeriesAry = []
    item.value.map((d, dataIndex) => {
      // x轴数据，只获取第一组数据即可，其他相同
      itemIndex === 0 && result.xAxis[0].data.push(templateCb.xAxisTmplCb(d, dataIndex) || d.name)
      // 回调数据：当前item数据，及value所属层数据
      itemSeriesAry.push(Object.assign({ name: item.key, value: d.value, xAxis: d.key, startTime: +d.key, endTime: (+d.key) + (+intervalTime), xAxisName: item.name }, templateCb.seriesTmplCb(d, dataIndex, item, itemIndex)))
    })
    // vaule为空时 ，设置series为空，进行无数据提示
    itemSeriesAry.length && result.series.push({
      name: item.name,
      data: itemSeriesAry
    })
  })
  return result
}

/**
 * 笛卡尔坐标系统一转换方法
 */
const data2Cartesian = function (data = [], templateCb = {}) {
  // 验证，补全
  templateCb.legendTmplCb = isFunction(templateCb.legendTmplCb) ? templateCb.legendTmplCb : _noop
  templateCb.xAxisTmplCb = isFunction(templateCb.xAxisTmplCb) ? templateCb.xAxisTmplCb : _noop
  templateCb.seriesTmplCb = isFunction(templateCb.seriesTmplCb) ? templateCb.seriesTmplCb : _noop
  let result = {
    legend: [],
    xAxis: [],
    series: [] // 要求的返回格式：{name: '', data: [{name: '', value: 0}]}
  }
  if (Array.isArray(data) && data.length) {
    // value为数组的，为多条曲线
    result = Array.isArray(data[0].value) ? _data2Multiple(data, templateCb) : _data2Single(data, templateCb)
  }
  return result
}

/**
 * 虚线折线图数据格式转换
 * @param [{key: '', name: '', value:'', type:0},{key: '', name: '', value: '', type:1},...]
 * 其中type为1表示为实线部分；0表示为虚线部分
 * result: {xAxis: [], series: []}
 */
const data2DashSingle = function (data) {
  // 获取切割点，第一个不相同点的下标
  let splitIndex = data.findIndex(item => {
    return item.type !== data[0].type
  })
  // 调用笛卡尔坐标系基础转换方法
  let result = data2Cartesian(data)
  let resultData = result.series[0].data
  // @fixme 这里是先实后虚线，后续业务扩充，可以增加外部参数控制
  let firstSeries = {
    data: JSON.parse(JSON.stringify(resultData)).fill({ value: '-' }, splitIndex)
  }
  let secondSeries = {
    lineStyle: {
      width: 2,
      type: 'dotted'
    },
    data: JSON.parse(JSON.stringify(resultData)).fill({ value: '-' }, 0, splitIndex - 1)
  }
  result.series = [firstSeries, secondSeries]
  return result
}

/**
 * 转换基线
 * @param [{key: '', name: '', value: '', high: '', low: ''},...]
 * result: {xAxis: [], series: []}
 */
const data2Baseline = function (data) {
  let result = {
    xAxis: [{ data: [] }],
    series: [{ data: [] }, { data: [] }, { data: [] }, { data: [] }],
    visualMap: { pieces: [] }
  }
  let intervalTime = _getInterval(data)
  let _getItemSeries = function (item, intervalTime, value) {
    let { key, name } = item
    return { name: key, value, xAxis: key, startTime: +key, endTime: (+key) + (+intervalTime), xAxisName: name }
  }
  data.map((item, index) => {
    let { name, value, high, low } = item
    // xAxis数据
    result.xAxis[0].data.push(name)
    /* series数据 */
    // 当前值
    result.series[0].data.push(_getItemSeries(item, intervalTime, value))
    // 历史最高值
    result.series[1].data.push(_getItemSeries(item, intervalTime, high))
    // 历史最低值
    result.series[2].data.push(_getItemSeries(item, intervalTime, low))
    // 历史差值
    result.series[3].data.push(_getItemSeries(item, intervalTime, high - low))
    /* 生成pieces，标红展示 */
    if (value > high || value < low) {
      // 由于非线性原因，目前只让点显示红色
      result.visualMap.pieces.push({
        gt: index - 0.75,
        lt: index + 0.75,
        color: BASE_COLOR.CARTESIAN.BASELINE.PIECES_COLOR
      })
    }
  })
  return result
}

/**
 * 散点图数据转换方法(多组)
 * @param [{key: '', name: '', value: [{key: '', name: '', value: ''}, {...}]}, {...}]
 * result:{legend:[],xAxis:[],yAxis:[],series:[]}
 */
const _data2MultipleCartesianScatter = function (data, templateCb = {}) {
  let result = {
    legend: [],
    xAxis: [{ data: [] }],
    yAxis: [{ data: [] }],
    series: [] // 要求的返回格式：{name:'',data: [name:'',{value: []}]}
  }
  data.map((item, index) => {
    result.legend.push(Object.assign({ name: item.name }, templateCb.legendTmplCb(item, index)))
    result.yAxis[0]['data'].push(templateCb.yAxisTmplCb(item, index) || item.name)
    let itemData = []
    item.value.map((d, subIndex) => {
      // x轴数据
      index === 0 && result.xAxis[0]['data'].push(templateCb.xAxisTmplCb(d, subIndex) || d.name)
      itemData.push(Object.assign({ name: d.name, key: d.key, value: [d.name, d.value, d.value] }, templateCb.seriesTmplCb(item, index, d, subIndex)))
    })
    itemData.length && result.series.push({
      name: item.name,
      data: itemData
    })
  })
  return result
}
/**
     * 散点图数据转换方法(单组)
     * @param [{key: '', name: '', value: ''}, {...}]
     * result:{xAxis:[],yAxis:[],series:[]}
     */
const _data2SingleCartesianScatter = function (data, templateCb = {}) {
  let result = {
    legend: [],
    xAxis: [{ data: [] }],
    yAxis: [{ data: [] }],
    series: [{ data: [] }] // 要求的返回格式：{data: [{value: []}]}
  }
  data.map((item, index) => {
    result.yAxis[0]['data'].push(templateCb.yAxisTmplCb(item, index) || item.value)
    let itemData = []
    // x轴数据
    result.xAxis[0]['data'].push(templateCb.xAxisTmplCb(item, index) || item.name)
    itemData.push(item.name, item.value, item.value)
    result.series[0].data.push(Object.assign({ name: item.name, key: item.key, value: itemData }, templateCb.seriesTmplCb(item, index)))
  })
  return result
}
/**
     * 散点图通用转换方式
     */
const data2CartesianScatter = function (data, templateCb = {}) {
  let cbList = ['legendTmplCb', 'xAxisTmplCb', 'yAxisTmplCb', 'seriesTmplCb']
  cbList.forEach(cb => {
    templateCb[cb] = isFunction(templateCb[cb]) ? templateCb[cb] : _noop
  })
  let result = {
    legend: [],
    xAxis: [{ data: [] }],
    yAxis: [{ data: [] }],
    series: [] // 要求的返回格式：{data: [{value: []}]}
  }
  if (Array.isArray(data) && data.length) {
    // value为数组的，为多组散点图
    result = Array.isArray(data[0].value) ? _data2MultipleCartesianScatter(data, templateCb) : _data2SingleCartesianScatter(data, templateCb)
  }
  return result
}

/**
 * 象限图数据转换方法
 * @param {*} [{ x: '', y: ''},{ x: '', y: ''},{...}]
 * result:{xAxis:[],yAxis:[],series:[]}
 */

const data2Quadrant = function (data, templateCb = {}) {
  let result = {
    xAxis: [{ data: [] }],
    yAxis: [{ data: [] }],
    series: [{ data: [] }] // 要求的返回格式：{data: [[x,y],[...]]}
  }
  data.map((item, index) => {
    result.yAxis[0]['data'].push(item.x)
    let itemData = []
    // x轴数据
    result.xAxis[0]['data'].push(item.y)
    itemData.push(item.x, item.y)
    result.series[0].data.push(itemData)
  })
  return result
}

/**
 * k线图数据转换方法
 * @param {*} data  [{key: '', name: '', value: ''},...]
 * result: {xAxis: [], yAxis:[], series:[]}
 */
const data2Candlestick = function (data) {
  let result = {
    xAxis: [{ data: [] }],
    yAxis: [{ data: [] }],
    series: [{ data: [] }]
  }
  data.map((item, index) => {
    result.xAxis[0]['data'].push(item.name)
    result.series[0]['data'].push(item.value)
  })
  return result
}

/**
 * 盒须图数据转换方法
 * @param {*} data {name: '', value: '', data: []}
 * result: {series:[]}
 */
const data2Boxplot = function (data) {
  let result = {
    xAxis: [{ data: [] }],
    yAxis: [{ data: [] }],
    series: [{ data: [] }, { data: [] }]
  }

  let oData = JSON.parse(JSON.stringify(data))
  oData.forEach(v => {
    v.data = []
    v.data[0] = v.xStart
    v.data[1] = v.xrangeStart
    v.data[2] = v.xrangeEnd
    v.data[3] = v.xrangeEnd
    v.data[4] = v.xEnd
  })

  result.series['name'] = oData.map(v => v.name).reverse()
  result.series[0]['data'] = oData.map(v => v.data).reverse()
  result.series[1]['data'] = oData.map(v => v.signPoint).reverse()

  return result
}

/**
 * 象形柱图数据转换方法
 * @param {*} data {key, '', name: '', value: ''}
 * result: {series:[]} // 象形柱图数据
 */
const data2Pictorialbar = function (data) {
  let result = {
    xAxis: [{ data: [] }],
    yAxis: [{ data: [] }],
    series: [{ data: [] }]
  }
  data.map((item, index) => {
    let { key, name, value } = item
    // x轴
    result.xAxis[0].data.push(name)
    // y轴
    result.yAxis[0].data.push(name)
    // series数据
    result.series[0].data.push(Object.assign({ name: key, value: value, xAxis: key, xAxisName: name }))
  })
  return result
}

/**
 * 直角坐标系回归线数据转换方法
*/
const data2Regression = function (data) {
  let result = {
    series: []
  }
  data.map(item => {
    result.series.push(item)
  })
  return result
}

export {
  data2Cartesian,
  data2DashSingle,
  data2Baseline,
  data2CartesianScatter,
  data2Quadrant,
  data2Candlestick,
  data2Boxplot,
  data2Pictorialbar,
  data2Regression
}
