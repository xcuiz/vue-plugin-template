/**
 * 对象序列化
 * 用于兼容JSON.stringify对特殊数据类型处理转化
 */
export const JSONStringify = function (obj) {
  return JSON.stringify(obj, function (key, val) {
    const type = Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase()
    switch (type) {
      case 'symbol':
      case 'function':
      case 'asyncfunction':
        return val.toString()
      case 'undefined':
        return 'undefined'
      default:
        return val
    }
  })
}
