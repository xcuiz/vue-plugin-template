import { isNumber } from '../objects/type.js'

const B = 1024
const KB = B * 1024
const MB = KB * 1024
const GB = MB * 1024
const TB = GB * 1024

/**
 * 根据传入的字节转换为 对应的 字节单位
 * 如下:
 * num:10 => 10B
 * num:1024 => 1KB
 * ...
 * @param {Number} num
 */
export const formatByte = function (num, decimals = 2) {
  if (!isNumber(num)) {
    return num
  }
  if (num < B) {
    // 字节
    return num + 'B'
  } else if (num < KB) {
    // KB
    return (num / B).toFixed(decimals) + 'KB'
  } else if (num < MB) {
    // MB
    return (num / KB).toFixed(decimals) + 'MB'
  } else if (num < GB) {
    // GB
    return (num / MB).toFixed(decimals) + 'GB'
  } else if (num < TB) {
    // TB
    return (num / GB).toFixed(decimals) + 'TB'
  }
}

/**
 * 格式化字节单位 (类似下载单位)
 * 如下:
 * num:10 => 10B/s
 * num:1024 => 1KB/s
 * ...
 * @param {Number} num
 */
export const formatPks = function (num) {
  return formatByte(num) + '/s'
}
