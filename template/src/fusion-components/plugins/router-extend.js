/*
 * @Author: your name
 * @Date: 2020-08-27 15:20:26
 * @LastEditTime: 2020-09-02 16:30:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/components/plugins/router-extend.js
 */

import Router from 'vue-router'
import { Bus } from 'vue-happy-bus'
const EventName = {
  // tags-view 动态tab
  TAGS_VIEW_CLOSE: 'tags-view-close'
}
// 用于处理是否刷新的后缀
const suffixRefresh = '__isRefresh=1'
/**
 * 格式化url，将链接格式化为对象,主要转译vue router的fullPath
 * @param {string} url router的fullPath
 * @returns {object}
 */
function formatFullPath (url = '') {
  const res = {
    query: {},
    hash: '',
    path: ''
  }
  if (!url) return res
  // 处理path
  const arr = url.split('?')
  res.path = arr[0]
  // 处理hash
  const arr2 = arr[1].split('#')
  res.hash = arr2[1]
  // 过滤query
  const queryStr = arr2[0] || ''
  queryStr.replace(/([^&]+)=([^&]*)/g, function ($0, $1, $2) {
    res.query[$1] = $2
  })
  return res
}

/**
 * 扩展VueRouter原型，关闭tags并且跳转
 */
Router.prototype.replaceTagPush = function (to, from, onComplete, onAbort) {
  if (from) {
    let { name, query } = from
    Bus.$emit(EventName.TAGS_VIEW_CLOSE, { name, _r: query._r })
  }
  this.push(to, onComplete, onAbort)
}

/**
 * 新开路由，query中添加from属性，from为父级页面路径
 * @param {object} to 需要跳转路由
 * @param {object} from 原路由
 * @param {boolean} isRefreshParent 是否刷新父级路由,默认刷新
 */
Router.prototype.pushWithFromPath = function (to, from, isRefreshParent = true, onComplete, onAbort) {
  if (from) {
    to.query.from = from.fullPath
    // 是否刷新父级路由,对fullpath处理
    isRefreshParent && (to.query.from += suffixRefresh)
  }
  this.push(to, onComplete, onAbort)
}
// 回到原始路由
Router.prototype.backToFromPath = function (from, { isClose = false }, onComplete, onAbort) {
  if (from) {
    // 是否关闭当前 tag 页
    if (isClose) {
      let { name, query } = from
      Bus.$emit(EventName.TAGS_VIEW_CLOSE, { name, _r: query._r })
    }
    // 获取即将跳转的全路径
    const fullPath = from.query.from.split(suffixRefresh)[0]
    // 对全路径进行解析处理
    const to = formatFullPath(fullPath)
    this.push(to, onComplete, onAbort)
  }
}
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this,location).catch(err => err)
}
export default Router
