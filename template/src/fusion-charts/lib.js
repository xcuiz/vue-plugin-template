import { proxyConfig } from './container.vue'
export * from './charts.js'
export * from './data-factory'

/**
 * 动态设置echarts的主题颜色
 * @param {Object|String} theme
 * 当 theme 是string时，表示使用component中定制好的主题
 * 当 theme 是Object时，表示传递一个配置好的主题对象格式如下：
 * {
 *   echartsTheme: {}  // echartsTheme 中的内容是百度echarts主题工具生成的js文件配置
 *   baseColor: {} // color 是echarts主题工具生成的文件中，没有覆盖到的颜色补充的配置. 详细请看 default-base-color.js
 * }
 */
export const $setTheme = function (theme) {
  proxyConfig.theme = theme
}
