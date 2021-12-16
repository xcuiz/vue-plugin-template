/**
 * 数值格式化处理
 * 数字大于1000 保留两位小数 20,34k   2.12m
 * @param {number} value
 * @param {string} type 转化类型 en、zh
 */
export const formatNumber = function (value, type = 'en') {
  // 区分是中文单位还是英文单位
  const unitType = {
    en: ['B', 'M', 'K'],
    zh: ['亿', '百万', '千']
  }
  const val = Math.round(value)
  if (val >= 100000000 || val <= -100000000) { // 亿级别
    return Math.round(val / 100000000 * 100) / 100 + unitType[type][0]
  } else if (val >= 1000000 || val <= -1000000) { // 百万级
    return Math.round(val / 1000000 * 100) / 100 + unitType[type][1]
  } else if (val >= 1000 || val <= -1000) { // 千级
    return Math.round(val / 1000 * 100) / 100 + unitType[type][2]
  } else { // 取整
    return val
  }
}
