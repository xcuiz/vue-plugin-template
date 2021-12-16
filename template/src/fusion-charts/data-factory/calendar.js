import { isFunction } from '../util/base.js'
const _noop = function () {}

const _data2Single = function (data, processCb) {
  let result = {
    calendar: [],
    series: []
  }
  if (Array.isArray(data.value) && data.value.length) {
    result.calendar.push(Object.assign({ range: data.range }, processCb.calendarProcessCb(data)))
    result.series.push(Object.assign({
      name: data.name,
      data: data.value.map((v, vIndex) => {
        return {
          name: v.name,
          value: [v.name, v.value]
        }
      })
    }, processCb.seriesProcessCb(data, 0)))
  }
  return result
}

const _data2Multiple = function (data, processCb) {
  let result = {
    calendar: [],
    series: []
  }
  if (Array.isArray(data) && data.length) {
    data.forEach((d, dIndex) => {
      result.calendar.push(Object.assign({ range: d.range }, processCb.calendarProcessCb(d, dIndex)))
      result.series.push(Object.assign({
        name: d.name,
        data: d.value.map(v => {
          return {
            name: v.name,
            value: [v.name, v.value]
          }
        })
      }, processCb.seriesProcessCb(d, dIndex)))
    })
  }
  return result
}

const _data2MultipleHeatmap = function (data, processCb) {
  return _data2Multiple(data, processCb)
}

const _data2SingleHeatmap = function (data, processCb) {
  return _data2Single(data, processCb)
}

const data2CalendarHeatmap = function (data, processCb = {}) {
  let cbList = ['seriesProcessCb', 'calendarProcessCb']
  cbList.forEach(cb => {
    processCb[cb] = isFunction(processCb[cb]) ? processCb[cb] : _noop
  })

  return Array.isArray(data) ? _data2MultipleHeatmap(data, processCb) : _data2SingleHeatmap(data, processCb)
}

const _data2SingleScatter = function (data, processCb) {
  let result = {
    calendar: [],
    series: [],
    legend: []
  }
  if (Array.isArray(data.value) && data.value.length) {
    result.calendar.push(Object.assign({ range: data.range }, processCb.calendarProcessCb(data)))

    if (data.value[0] && Array.isArray(data.value[0].value)) { // 多 legend 情况
      data.value.forEach((item, itemIndex) => {
        result.legend.push({ name: item.name })
        result.series.push(Object.assign({
          name: item.name,
          data: item.value.map((v, vIndex) => {
            return {
              name: v.name,
              value: [v.name, v.value]
            }
          })
        }, processCb.seriesProcessCb(item, itemIndex)))
      })
    } else { // 无 legend 情况
      result.series.push(Object.assign({
        name: data.name,
        data: data.value.map((v, vIndex) => {
          return {
            name: v.name,
            value: [v.name, v.value]
          }
        })
      }, processCb.seriesProcessCb(data, 0)))
    }
  }
  return result
}

const _data2MultipleScatter = function (data, processCb) {
  return _data2Multiple(data, processCb)
}

const data2CalendarScatter = function (data, processCb = {}) {
  let cbList = ['seriesProcessCb', 'calendarProcessCb', 'legendProcessCb']
  cbList.forEach(cb => {
    processCb[cb] = isFunction(processCb[cb]) ? processCb[cb] : _noop
  })

  return Array.isArray(data) ? _data2MultipleScatter(data, processCb) : _data2SingleScatter(data, processCb)
}

const data2Calendar = function (data, processCb = {}) {
  let cbList = ['seriesProcessCb', 'calendarProcessCb', 'legendProcessCb']
  cbList.forEach(cb => {
    processCb[cb] = isFunction(processCb[cb]) ? processCb[cb] : _noop
  })

  let result = {
    calendar: [],
    legend: [],
    series: [],

    range: [],
    format: [] // 格式化某个属性
  }
  if (data && data.range && Array.isArray(data.range)) {
    result.calendar.push({ range: data.range })
  } else {
    return
  }
  if (data.value && Array.isArray(data.value)) {
    result.series.push(Object.assign({
      name: data.name,
      data: data.value.map((v, vIndex) => {
        return {
          name: v.name,
          value: v.value
        }
      })
    }, processCb.seriesProcessCb(data, 0)))
  }
  return result
}

export {
  data2CalendarHeatmap,
  data2CalendarScatter,
  data2Calendar
}
