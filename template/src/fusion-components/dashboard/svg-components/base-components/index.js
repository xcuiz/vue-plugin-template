import Vue from 'vue'
const componentObj = {}
const requireComponent = require.context(
  '.',  // 注意，这里只支持静态字符串，不能使用变量
  true,
  /.*-svg.vue$/
)

requireComponent.keys().forEach((fileName) => {
  let componentConfig = requireComponent(fileName)
  let componentName = componentConfig.default.name
  componentObj[componentName] = componentName
  componentName && Vue.component(componentConfig.default.name, componentConfig.default)
})
export { componentObj }
