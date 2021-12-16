
import { isObject, isFunction } from '../util/base.js'
const _noop = function () {}

const _data2Single = function (data = [], processCb = {}) {
  let result = {
    series: [],
    parallelAxis: []
  }
  if (Array.isArray(data)) {
    data.forEach((d, dIndex) => {
      result.parallelAxis.push(Object.assign({
        dim: dIndex,
        name: d.name,
        type: d.type || 'value',
        data: d.categoryList || []
      }, processCb.parallelAxisProcessCb(d, dIndex)))
    })

    let multiArray = data[0].value.map((col, i) => {
      return Object.assign({
        value: data.map(row => row.value[i])
      }, processCb.seriesProcessCb(col, i))
    })
    result.series.push({
      data: multiArray
    })
  }
  return result
}

const _data2Multiple = function (data = [], processCb = {}) {
  let result = {
    series: [],
    parallelAxis: [],
    legend: []
  }
  if (Array.isArray(data)) {
    data.forEach((d, dIndex) => {
      result.legend.push(Object.assign({ name: d.name }, processCb.legendProcessCb(d, dIndex)))

      d.value.forEach((v, vIndex) => {
        dIndex === 0 && result.parallelAxis.push(Object.assign({
          dim: vIndex,
          name: v.name,
          type: v.type || 'value',
          data: v.categoryList || []
        }, processCb.parallelAxisProcessCb(d, dIndex)))
      })

      let multiArray = d.value[0].value.map((col, i) => {
        return Object.assign({
          value: d.value.map(row => row.value[i])
        }, processCb.seriesProcessCb(col, i))
      })

      result.series.push({
        name: d.name,
        data: multiArray
      })
    })
  }
  return result
}

const data2Parallel = function (data, processCb = {}) {
  let cbList = ['seriesProcessCb', 'legendProcessCb', 'parallelAxisProcessCb']
  cbList.forEach(cb => {
    processCb[cb] = isFunction(processCb[cb]) ? processCb[cb] : _noop
  })

  let result = {
    series: [],
    parallelAxis: [],
    legend: []
  }
  if (Array.isArray(data) && Array.isArray(data[0].value) && data[0].value.length) {
    result = isObject(data[0].value[0]) ? _data2Multiple(data, processCb) : _data2Single(data, processCb)
  }
  return result
}

export {
  data2Parallel
}
