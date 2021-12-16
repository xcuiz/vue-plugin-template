/**
 * 日期对象格式化为文本
 * @param time
 * @returns string
 */
import { formatDate } from './base.js'

const TIME_UNIT = {
  s: '秒',
  m: '分钟',
  h: '小时',
  d: '天',
  w: '周',
  M: '月',
  y: '年'
}

export function formatTimeToText (time) {
  let { timeFlag, startTime, endTime, timeInterval, timeUnit } = time
  if (timeFlag === 1) {
    return '不依赖时间条件'
  } else if (timeFlag === 2) { // 绝对时间
    startTime = formatDate.call(new Date(startTime), 'yyyy-MM-dd hh:mm:ss')
    endTime = formatDate.call(new Date(endTime), 'yyyy-MM-dd hh:mm:ss')
    return `${startTime} - ${endTime}`
  } else if (timeFlag === 3) { // 相对时间
    return `最近${timeInterval}${TIME_UNIT[timeUnit]}`
  } else {
    console.log('formatTimeToText 参数错误！')
    return ''
  }
}
