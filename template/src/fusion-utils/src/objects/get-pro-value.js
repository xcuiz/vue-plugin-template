
/**
 * 获取属性值
 * 如果是Boolean，直接返回默认值
 * 如果是Object，返回所传属性
 * 如果是Function，返回函数执行结果
 */
export const getPropValue = function (prop, defaultValue) {
  let type = Object.prototype.toString.call(prop).match(/^\[object (.*)\]$/)[1].toLowerCase()
  switch (type) {
    case 'boolean':
      return prop ? defaultValue : null
    case 'object':
      return prop
    case 'function':
      return prop()
  }
}
