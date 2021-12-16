/**
 * 饼图data-facotry
 * created by liuyu
 */
import {
  isFunction,
  merge
} from '../util/base.js'
const _noop = function () { }
/**
 * 接口数据，转换为基础饼状图
 * @model [{"key": 1508104800000,"name": "6:00","value": 23},{"key": 1508115600000,"name": "9:00","value": 45},...]
 */
const data2Pie = function (res = [], templateCb = {}) {
  const data = merge([], res)
  // 验证，补全
  _resetTmplCbName(['legendTmplCb', 'seriesTmplCb'], templateCb)
  let result = {
    legend: [],
    series: []
  }
  if (Array.isArray(data) && data.length) {
    // 处理数据
    const singleData = []
    // 拼接 legend 和 series(pie将处理为一组series数据)
    data.forEach((item, itemIndex) => {
      // 处理图例
      result.legend.push(Object.assign({
        name: item.name
      },
      templateCb.legendTmplCb(item, itemIndex)
      ))
      singleData.push(Object.assign({
        key: item.key,
        name: item.name,
        value: item.value
      }, templateCb.seriesTmplCb(item, itemIndex)))
    })
    result.series.push({
      data: singleData
    })
  }
  return result
}

/**
 * 接口数据，转换为有嵌套结构的饼图使用数据
 * @model [
    {"key": "","name": "inner","value": [{"key": 1508083200000,"name": "日本","value": 23},...]},
    {"key": "","name": "outer","value": [{"key": "与inner的name同名将隐藏, 并且value要相等","name": "日本","value": 23},...]}
   ]
 */
const data2NestPie = function (res = [], templateCb = {}) {
  const data = merge([], res)
  // 验证，补全
  _resetTmplCbName(['legendTmplCb', 'seriesTmplCb'], templateCb)
  let result = {
    legend: [],
    series: [{
      data: []
    }, {
      data: []
    }]
  }
  if (Array.isArray(data) && data.length) {
    // 拼接 legend 和 series
    data.forEach((item, index) => {
      const singleData = []
      item.value.forEach((subItem, subIndex) => {
        // 过滤重复,不存在并添加
        !result.legend.includes(subItem.name) && result.legend.push(Object.assign({
          name: subItem.name
        },
        templateCb.legendTmplCb(subItem, subIndex, item, index)
        ))
        // 拼接单组数据
        singleData.push(Object.assign({
          key: subItem.key,
          name: subItem.name,
          value: subItem.value
        }, templateCb.seriesTmplCb(subItem, subIndex, item, index)))
      })
      // 处理series数据
      result.series[index].data = singleData
    })
  }
  return result
}

/**
 * 接口数据，转换为有带富文本详情的饼图使用数据
 * @model [{"key": "","name": "人员A","value": [{"key": 1508083200001, "name": "确认","value": "80"},{"key": 1508083200002, "name": "处理完成","value": "60"},...]},...]
 * @param detailTotal 不高亮情况下的详情数据 不设置高亮的情况下此数据必须
 */
const data2DetailPie = function (res = [], detailTotal = [], sum = 0) { // @FIXME:考虑到后期重写以及兼容之前的写法，暂时先枚举传参。。
  const data = merge([], res)
  let result = { legend: [], series: [] }

  // FIXME: 处理默认不高亮情况的详情数据
  let detailTotalData = []
  if (Array.isArray(detailTotal) && detailTotal.length) {
    let total = detailTotal.reduce((a, b) => a + b.value, 0)
    detailTotal.forEach((item, index) => {
      detailTotalData.push({
        name: item.name,
        rate: (total ? (Math.round((item.value / total) * 10000) / 100).toFixed(0) + '%' : 0 + '%'),
        value: item.value
      })
    })
    detailTotalData.sort(function (a, b) {
      return b.value - a.value
    })
  }
  if (Array.isArray(data) && data.length) {
    // 处理数据
    const singleData = []
    data.forEach(item => {
      // 图例
      result.legend.push(Object.assign({
        name: item.name
      }))
      // series
      let detail = []
      let total = 0
      if (Array.isArray(item.value) && item.value.length) {
        // FIXME:  两次循环
        item.value.forEach(v => {
          total += +v.value
        })
        item.value.forEach(v => {
          // 添加rate属性
          // 兼容如果传入了总数，则直接使用总数
          if (!sum) {
            v.rate = total ? (Math.round((v.value / total) * 10000) / 100).toFixed(0) + '%' : 0 + '%'
          } else {
            v.rate = (Math.round((v.value / sum) * 10000) / 100).toFixed(0) + '%'
          }
          detail.push(v)
        })
        // 对detail数据进行排序
        detail.sort(function (a, b) {
          return b.value - a.value
        })
        item.value = total
      }
      singleData.push({ ...item, detail })
    })
    result.series.push({
      data: singleData,
      detailTotalData
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

/**
 * 接口数据，转换为百分比数据图
 * @model [{"key": 1508104800000,"name": "6:00","value": 23},{"key": 1508115600000,"name": "9:00","value": 45},...]
 */
const data2Progress = function (res = [], templateCb = {}) {
  const data = merge([], res)
  // 验证，补全
  _resetTmplCbName(['seriesTmplCb'], templateCb)
  let result = {
    series: []
  }
  if (Array.isArray(data) && data.length) {
    // 拼接 series(pie将处理为一组series数据)
    data.forEach((item, itemIndex) => {
      result.series.push(Object.assign({
        key: item.key,
        name: item.name,
        value: item.value
      }, templateCb.seriesTmplCb(item, itemIndex)))
    })
  }
  return result
}
export {
  data2Pie,
  data2NestPie,
  data2DetailPie,
  data2Progress
}
