/**
 * @param  {} data
 * 词云数据转换
 */
const data2WordCloud = function (data = {}) {
  let result = {
    series: []
  }
  if (data && Array.isArray(data.value) && data.value.length > 0) {
    let { name = '', value = [], ...others } = data
    result.series.push({ name, data: value, ...others })
  }
  return result
}

export {
  data2WordCloud
}
