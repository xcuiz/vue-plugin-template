const install = function (Vue, opt = {}) {
  const { components = {}, filters = {}, directives = {} } = opt
  // 通用组件
  Object.values(components).forEach(component => {
    // 这里只注册"idss-"开头的组件
    if (component.name && component.name.startsWith('idss-')) {
      Vue.component(component.name, component)
    }
  })

  // filter注册
  Object.entries(filters).forEach(([ name, handler ]) => {
    Vue.filter(name, handler)
  })
  // directive注册
  Object.entries(directives).forEach(([ name, hooks ]) => {
    Vue.directive(name, hooks)
  })
}
export default {
  install
}