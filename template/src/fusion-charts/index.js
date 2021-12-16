import * as components from './charts'

const install = function (Vue, _) {
  Object.keys(components).forEach(key => {
    if (components[key].name) {
      Vue.component(components[key].name, components[key])
    }
  })
}

export default {
  install
}
