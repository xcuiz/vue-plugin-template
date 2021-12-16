/**
 * 计算一个字符串的真实长度。一个汉字会被计算会2个长度
 * e.g:
 * '你好Aa' 会返回 6
 * @param {String} text：文本  maxLength: 最大长度
 * @returns {Number}
 */
export const charCodeLength = function (text, maxLength) {
  let textLength = 0
  for (let i = 0, length = text.length; i < length; i++) {
    if ((text.charCodeAt(i) & 0xff00) !== 0) {
      textLength++
    }
    textLength++
    // 返回index
    if (textLength >= maxLength) {
      return i
    }
  }
  return textLength
}

/**
 * 根据传入的数据，通过canvas进行计算宽度
 * data: String || Array 传入的数据可以是字符串或者是数组['11132', 'ertrt', ...]
 * fontStyle: String 字体样式
 */
export const computeWid = function (data, fontStyle = '16px Arial') {
  if (!data) return
  let canvas = document.createElement('canvas')  // 创建canvas
  let ctx = canvas.getContext('2d')
  ctx.font = fontStyle
  let wid = []
  if (Array.isArray(data) && data.length) {
    for (let i of data) {
      wid.push(ctx.measureText(i).width)
    }
  }
  if (typeof data === 'string') {
    wid = ctx.measureText(data).width
  }
  canvas = null
  return wid
}
