import { isFunction } from '../util/base.js'
const _noop = function () {}

const _data2Single = function (data, processCb) {
  let result = {
    series: [],
    legend: [],
    indicator: []
  }
  if (Array.isArray(data)) {
    let dataArray = []
    data.forEach((item, itemIndex) => {
      dataArray.push(item.value)

      result.indicator.push(Object.assign({
        name: item.name,
        max: item.max
      }, processCb.indicatorProcessCb(item, itemIndex)))
    })

    result.series.push(Object.assign({
      name: '',
      value: dataArray
    }, processCb.seriesProcessCb()))
  }
  return result
}

const _data2Multiple = function (data, processCb) {
  let result = {
    series: [],
    legend: [],
    indicator: []
  }
  if (Array.isArray(data)) {
    data.forEach((item, itemIndex) => {
      result.legend.push(Object.assign({ name: item.name }, processCb.legendProcessCb(item, itemIndex)))

      let dataArray = []
      item.value.forEach((valueItem, valueIndex) => {
        dataArray.push(valueItem.value)

        itemIndex === 0 && result.indicator.push(Object.assign({
          name: valueItem.name,
          max: valueItem.max
        }, processCb.indicatorProcessCb(item, itemIndex, valueItem, valueIndex)))
      })

      result.series.push(Object.assign({
        name: item.name,
        value: dataArray
      }, processCb.seriesProcessCb(item, itemIndex)))
    })
  }
  return result
}

const data2Radar = function (data = [], processCb = {}) {
  let cbList = ['seriesProcessCb', 'legendProcessCb', 'indicatorProcessCb']
  cbList.forEach(cb => {
    processCb[cb] = isFunction(processCb[cb]) ? processCb[cb] : _noop
  })

  let result = {
    series: [],
    legend: [],
    indicator: []
  }
  if (Array.isArray(data) && data.length) {
    // value为数组的，为多组数据
    result = Array.isArray(data[0].value) ? _data2Multiple(data, processCb) : _data2Single(data, processCb)
  }
  return result
}

export {
  data2Radar
}
