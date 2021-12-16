/**
 * @note 开发者注意，暴露组件时，存在依赖关系的，一定要被依赖的前置，大颗粒度、大功能的组件后置
 * 原因：后置加载的组件在加载时，如果前置以来的组件没有被引入时，会报错
 */

// 基础功能单元的组件，svg/tooltip/SelectTree等比较基础的组件
export { default as IdssDbSvg } from './svg-components/idss-db-svg.vue'
export { default as IdssCountTo } from './idss-count-to.vue'
export { default as IdssAtomLine } from './idss-atom-line.vue'
export { default as IdssNeonLights } from './idss-neon-lights.vue'
export { default as IdssClock } from './idss-clock.vue'

// 大功能、容器类、组合类的组件集合存放处
export { default as IdssCarouselPanel } from './carousel-panel/index.vue'
export { default as IdssHoneycombChart } from './honeycomb-chart/index.vue'
export { default as IdssDrawerTable } from './drawer-table.vue'
export { default as IdssGradientBar } from './gradient-bar.vue'
export { default as IdssDbStep } from './idss-db-step.vue'
export { default as IdssListItem } from './idss-list-item.vue'
export { default as IdssTableList } from './idss-table-list.vue'
export { default as IdssTriangleBox } from './idss-triangle-box.vue'
export { default as IdssKillChain } from './kill-chain.vue'
export { default as IdssRealtimeEvent } from './realtime-event.vue'
export { default as IdssBarSvg } from './svg-components/combination-components/idss-bar-svg.vue'
export { default as IdssCombinationBar } from './svg-components/combination-components/idss-combination-bar.vue'

// const requireComponent = require.context(
//   '.',  // 注意，这里只支持静态字符串，不能使用变量
//   true,
//   /^(?!.*(\/|\\)base-components(\/|\\)).*\.vue$/
// )
// requireComponent.keys().forEach((fileName) => {
//   let componentConfig = requireComponent(fileName)
//   let componentName = componentConfig.default.name
//   if (componentName) {
//     componentName = componentName.replace(/-(\w)/g, ($0, $1) => String.fromCharCode($1.charCodeAt() - 32))
//     console.log(`export {default as ${componentName}} from '${fileName}'`)
//   }
// })
