
import { data2Cartesian } from './cartesian'
import { isFunction, merge } from '../util/base'
const _noop = function () { }
/**
 * 镜像图标数据处理
 * @param {array} res data数据
 * @param {object} templateCb
 * @param {object} diffConfig diff配置
 * @model [{"key": 1508104800000, "name": "6:00","value": 23},{"key": 1508115600000,"name": "9:00","value": 45},...]
 */
const data2Mirror = function (res, templateCb = {}, diffConfig) {
  const data = merge([], res)
  // 验证，补全
  _resetTmplCbName(['legendTmplCb', 'seriesTmplCb', 'xAxisTmplCb'], templateCb)
  // 数据处理进行分发函数处理(如果data数据data[0].value[0].value 是数组，则自动进行diff)
  if (Array.isArray(data) && Array.isArray(data[0].value) && Array.isArray(data[0].value[0].value)) {
    return _data2MultiMirror(data, templateCb, diffConfig)
  } else {
    // 处理普通数据
    return _data2NormalMirror(data, templateCb, diffConfig)
  }
}
/**
 * 处理通用柱图数据，对series数据进行处理，如需diff，需要对diffConfig.series进行配置
 * @param {array} series 主要针对普通数据，series需要按序排列，进行diff eg: [{axis0: serieName1, axis1: serieName2, isIdff: true, diffIndex: 1} ]
 */
const _data2NormalMirror = function (data, templateCb, diffConfig = { series: [] }) {
  // 如果其他情况，则使用笛卡尔方法暂时处理
  const cartesianData = data2Cartesian(data, templateCb)
  if (diffConfig && diffConfig.series.length) {
    const seriesData = []
    // axis0 第一个坐标轴series名称、axis1 => 第二个坐标轴series名称
    // isDiff=>[boolear,string] 是否diff,如果diff为string，则添加diff图例
    // diffIndex diff数据显示坐标轴位置
    diffConfig.series.forEach(({ axis0, axis1, isDiff, diffIndex = 0 }) => {
      const series = cartesianData.series
      const leftIndex = series.findIndex(item => item.name === axis0)
      const rightIndex = series.findIndex(item => item.name === axis1)
      const leftData = series[leftIndex]
      const rightData = merge(series[rightIndex], {
        yAxisIndex: 1,
        xAxisIndex: 1
      })
      // 按照diffConfig配置，对数据重新排序，并对axis1的数据添加右下坐标轴配置
      seriesData.push(leftData, rightData)
      // 处理diff数据
      if (isDiff) {
        let legendName = `${diffIndex ? rightData.name : leftData.name}差值`
        // diff添加图例名称
        if (typeof isDiff === 'string' && cartesianData.legend.findIndex(item => item.name === isDiff) === -1) {
          // 用于处理diff获取series名称
          legendName = isDiff
          cartesianData.legend.push(
            Object.assign({ name: isDiff },
              templateCb.legendTmplCb({ name: isDiff }, cartesianData.legend.length))
          )
        }
        // diff数据处理
        const diffSeries = []
        leftData.data.forEach((left, index) => {
          const right = rightData.data[index]
          const item = _diffValue([left, right], diffIndex)
          diffSeries.push(Object.assign(item,
            templateCb.seriesTmplCb(item, diffSeries.length, leftData, leftIndex, rightData, rightIndex)))
        })
        // 处理stack数据
        const stack = diffIndex ? rightData.name : leftData.name
        diffIndex ? rightData.stack = stack : leftData.stack = stack
        // series 添加diff数据
        seriesData.push({
          name: legendName,
          stack,
          data: diffSeries,
          yAxisIndex: diffIndex,
          xAxisIndex: diffIndex
        })
      }
    })
    cartesianData.series = seriesData
  }
  const result = {
    legend: cartesianData.legend,
    xAxis: cartesianData.xAxis,
    series: cartesianData.series
  }
  return result
}

/**
 * 处理特殊数据，主要针对series下面存在2-3个value值得情况
 * @param {object} diffConfig diff数据配置 eg: { series: [{ axis: '', diffIndex: 0, diffName: false }] }
 */
const _data2MultiMirror = function (data, templateCb, diffConfig = { series: [] }) {
  let result = {
    legend: [],
    xAxis: [{ data: [] }],
    series: [] // 要求的返回格式：{name: '', data: [{name: '', value: 0}]}
  }
  // 时间间隔，点击曲线点，下钻携带改点时间, 注意：-1 是业务需求（例：2:00 - 2:59:59）
  let intervalTime = _getInterval(data)
  data.forEach((item, itemIndex) => {
    // 获取diff所在坐标轴索引、diff series 名称
    const seriesDiffIndex = Array.isArray(diffConfig.series) ? diffConfig.series.findIndex(diff => diff.axis === item.name) : -1
    const { diffIndex = 0, diffName } = seriesDiffIndex > -1 ? diffConfig.series[seriesDiffIndex] : {}
    // legend数据封装
    result.legend.push(Object.assign({ name: item.name }, templateCb.legendTmplCb(item, itemIndex)))
    // diff legend
    if (diffName && result.legend.findIndex(item => item.name === diffName) === -1) {
      result.legend.push(Object.assign({ name: diffName },
        templateCb.legendTmplCb({ name: diffName }, itemIndex)))
    }
    let itemSeriesAry = []
    let itemSecondAry = []
    let diffArray = []
    // 针对数组value的diff处理
    item.value.map((subItem, dataIndex) => {
      // x轴数据，只获取第一组数据即可，其他相同
      itemIndex === 0 && result.xAxis[0].data.push(templateCb.xAxisTmplCb(subItem, dataIndex) || subItem.name)
      // 回调数据：当前item数据，及value所属层数据
      if (Array.isArray(subItem.value) && subItem.value.length > 1) {
        const [firstData, secondData, thirdData] = subItem.value
        // 处理第一坐标轴数据
        const leftData = Object.assign({ name: secondData.key, value: firstData.value, xAxis: firstData.key, startTime: +firstData.key, endTime: (+firstData.key) + (+intervalTime), xAxisName: firstData.name },
          templateCb.seriesTmplCb(firstData, 0, dataIndex, item, itemIndex))
        // 处理第二坐标轴数据
        const rightData = Object.assign({ name: secondData.key, value: secondData.value, xAxis: secondData.key, startTime: +secondData.key, endTime: (+secondData.key) + (+intervalTime), xAxisName: secondData.name },
          templateCb.seriesTmplCb(secondData, 1, dataIndex, item, itemIndex))
        itemSeriesAry.push(leftData)
        itemSecondAry.push(rightData)
        // 处理diff数据
        const diffData = _diffValue([leftData, rightData, thirdData], diffIndex)
        diffArray.push(Object.assign(diffData,
          templateCb.seriesTmplCb(diffData, 2, dataIndex, item, itemIndex)))
      }
    })
    // vaule为空时 ，设置series为空，进行无数据提示
    itemSeriesAry.length && result.series.push({
      name: item.name,
      stack: !diffIndex ? item.name : undefined,
      data: itemSeriesAry
    })
    // 第二组series
    itemSeriesAry.length && result.series.push({
      name: item.name,
      stack: diffIndex ? item.name : undefined,
      data: itemSecondAry,
      yAxisIndex: 1,
      xAxisIndex: 1
    })
    // diffseries
    diffArray.length && result.series.push({
      name: diffName || `${item.name}差值`,
      stack: item.name,
      data: diffArray,
      yAxisIndex: diffIndex,
      xAxisIndex: diffIndex
    })
  })
  return result
}

/**
 * diff数据处理
 * @param {array} data data为两组数据，则两组数据自己diff；三组数据是，第三组数据为diff
 * @param {number} diffIndex diff数据展示坐标轴索引位置,默认0
 */
const _diffValue = function (data = [], diffIndex) {
  const [left, right, diffData] = data
  let leftValue = left.value
  let rightValue = right.value
  let diff = diffIndex ? right : left
  let diffValue = 0
  // 当diffvalue存在时，diffvalue作为diff值
  if (diffData) {
    diffValue = diffData.value
    if (diffIndex === 1) {
      rightValue = [rightValue, diffValue]
    } else {
      leftValue = [leftValue, diffValue]
    }
  } else {
    // leftvalue和rightvalue进行diff
    diffValue = +Math.abs(rightValue - leftValue).toFixed(2)
    // 设置去除差值显示value
    let showValue = rightValue > leftValue ? leftValue : rightValue
    // 根据差值显示位置，修改是左上/右下数值被重写
    if (diffIndex === 1) {
      rightValue = [showValue, rightValue, diffValue]
    } else {
      leftValue = [showValue, leftValue, diffValue]
    }
    // 对原始数据进行重新赋值，设置为显示值
    diff.value = showValue
  }
  diff.data = diffIndex === 1 ? rightValue : leftValue
  return merge(diff, {
    name: `${diff.name}差值`,
    value: diffValue
  })
}
/**
 * 获取镜像数据，多组value值时时间间隔，用于下钻
 * @param {Object} data
 * result: 时间间隔
 */
const _getInterval = function (data) {
  // 时间间隔，点击曲线点，下钻携带改点时间, 注意：-1 是业务需求（例：2:00 - 2:59:59）
  let intervalTime = 0
  if (data[0] && Array.isArray(data[0].value) && Array.isArray(data[0].value[0].value)) {
    intervalTime = data[0].value[0].value[1] ? data[0].value[0].value[1].key - data[0].value[0].value[0].key - 1 : 0
  }
  return intervalTime
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
  data2Mirror
}
