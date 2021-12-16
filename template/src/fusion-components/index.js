// 组件引入
import * as commonsComponents from './lib/components.js'
// 大屏组件
import * as dashboardComponents from './lib/dashboard-components.js'

// directives引入
import * as directives from './lib/directives.js'

// filters引入
import * as filters from './lib/filters.js'

const install = function (Vue) {
  const components = { ...commonsComponents, ...dashboardComponents }
  // 组件注册
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
