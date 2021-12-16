// https://github.com/ant-design/ant-design-colors
const { generate } = require('@ant-design/colors')
/**
 * 生成某个颜色的颜色组变量，用于主题替换
 * @param {string} name 需要生成颜色组的名称
 * @param {number} color  主颜色
 * @param {string|boolean} isNeedOpacity 是否需要透明度,默认不需要透明度
 */
module.exports = function (mixin, name, color, isNeedOpacity = false) {
  // generate 函数生成以color为基色，进转换生成的10个颜色
  const colorList = generate(color)
  const res = {}
  colorList.forEach((color, index) => {
    // 基色处理
    res[`--${name}-${index + 1}`] = color
    // 透明度颜色处理
    if (isNeedOpacity) {
      for (let i = 1; i < 10; i++) {
        res[`--${name}-${index + 1}-a${i}0`] = `color-mod(${color} a(${i}0%))`
      }
    }
  })
  return res
}
