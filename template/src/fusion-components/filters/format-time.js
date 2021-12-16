/**
 *  数字大于1000 保留两位小数 20,34k   2.12m
 */
export default function (value) {
  const M = 1 * 60
  const H = 1 * 60 * 60
  const D = 1 * 24 * 60 * 60
  const MM = 1 * 30 * 24 * 60 * 60
  let val = Math.round(value)

  if (val >= MM) {
    return Math.round(val / MM * 100) / 100 + '月'
  } else if (val >= D) {
    return Math.round(val / D * 100) / 100 + '天'
  } else if (val >= H) {
    return Math.round(val / H * 100) / 100 + '小时'
  } else if (val >= M) {
    return Math.round(val / M * 100) / 100 + '分钟'
  } else {
    return val + '秒'
  }
}
