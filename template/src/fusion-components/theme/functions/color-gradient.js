// https://github.com/ant-design/ant-design-colors
const { generate } = require('@ant-design/colors')
/**
 * 生成某个颜色的颜色变量，用于主题替换
 * @param {string} color 需要生成颜色组的颜色
 * @param {number} colorIndex  变量名前缀
 */
module.exports = function (color, colorIndex) {
  // generate 函数生成以color为基色，进转换生成的10个颜色
  return generate(color)[Number(colorIndex) - 1]
}
