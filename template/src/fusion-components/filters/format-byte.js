/**
 *  数字大于1000 保留两位小数 20,34k   2.12m
 */
import { formatByte } from '../util/base.js'

export default function (value) {
  if (typeof (value) === 'string') value = parseInt(value)
  return formatByte(value)
}
