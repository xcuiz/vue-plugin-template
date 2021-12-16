/**
 * 颜色的渐变切割
 * @param {String} startColor
 * @param {String} endColor
 * @param {Number} step
 * @returns {Array} ['rgb(x,x,x)',...]
 */
export const gradientColor = function (startColor, endColor, step) {
  // 转换为rgb数组模式
  let startRGB = color2Rgb(startColor)
  let startR = startRGB[0]
  let startG = startRGB[1]
  let startB = startRGB[2]

  let endRGB = color2Rgb(endColor)
  let endR = endRGB[0]
  let endG = endRGB[1]
  let endB = endRGB[2]

  let sR = (endR - startR) / step// 总差值
  let sG = (endG - startG) / step
  let sB = (endB - startB) / step

  var colorArr = []
  for (var i = 0; i < step; i++) {
    colorArr.push(`rgb(${parseInt(sR * i + startR)}, ${parseInt((sG * i + startG))}, ${parseInt((sB * i + startB))})`)
  }
  return colorArr
}

/**
 * 16进制颜色转化为rgb颜色表达方式
 * @param {String} color
 * @returns {Array} [xx, xx, xx]
 */
export const color2Rgb = function (color) {
  let reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
  color = color.toLowerCase()
  if (color && reg.test(color)) {
    if (color.length === 4) {
      let colorNew = '#'
      for (let i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1))
      }
      color = colorNew
    }
    // 处理六位的颜色值
    let colorChange = []
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)))
    }
    return colorChange
  } else {
    return color
  }
}