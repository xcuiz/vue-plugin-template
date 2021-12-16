/**
 * 判断类型
 */
const _isType = function (type) {
  return function (obj) {
    return Object.prototype.toString.call(obj) === '[object ' + type + ']'
  }
}

// 是否为 Object
export const isObject = _isType('Object')
// 是否为 Function
export const isFunction = _isType('Function')
// 是否为 Boolean
export const isBoolean = _isType('Boolean')
// 是否为 Number
export const isNumber = _isType('Number')
// 是否为 Array
export const isArray = Array.isArray || _isType('Array')
// 是否为 String
export const isString = _isType('String')
