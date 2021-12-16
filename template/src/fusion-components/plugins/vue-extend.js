/**
 * 刷新当前页面的父级跳转页面
 */
function refreshParentPage () {
  let fullPath = this.$route.query.from
  const arr = fullPath.split('__isRefresh=')
  fullPath = arr[0]
  // 是否刷新父级页面
  const isRefresh = arr[1]
  // 如果没有原始调转链接退出、或者不刷新父级路由，退出
  if (!fullPath || !isRefresh) return
  // 通过keepAlive处理 @todos router-keep-alive修改时，需要配合修改该路径 如果app-main-container 修改也会影响
  const keepAliveVm = document.querySelector('.app-main-container').__vue__.$refs['router-view'].$options.parent
  const cacheList = keepAliveVm.cache || {}
  const index = Object.keys(cacheList).findIndex(key => key.indexOf(fullPath) > -1)
  if (index > -1) {
    const parentVm = Object.values(cacheList)[index].componentInstance
    // 刷新页面
    parentVm && parentVm.init()
  }
}

export default {
  install (Vue) {
    Vue.prototype.$refreshParentPage = refreshParentPage
  }
}
