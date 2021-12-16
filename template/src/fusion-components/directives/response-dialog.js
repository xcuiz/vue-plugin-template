/**
 * 动态处理弹窗位置
 * Created by sundong on 2019/08/01
 */
import ElementResizeDetectorMaker from 'element-resize-detector'
import { throttle } from '../util/base'
/**
 * 通过改变元素的translate值，让其自适应
 * @param {Number} bodyClientH body的可视高度
 * @param {Object} el 指令绑定的节点
 */
const setDomTopVal = function ({ bodyClientH, el } = {}) {
  let targetEle = el.querySelector('.el-dialog')
  // 处理弹窗重新打开和关闭时情况
  if (targetEle.clientHeight === 0 || isNaN(bodyClientH)) {
    targetEle.style.transform = null
    return
  }
  // 剩余的body可视高度
  let residueH = (bodyClientH - targetEle.clientHeight) / 2
  // 弹窗应距视窗上部的距离@FIXME:每次获取高度或者获取offsetTop时可能会导致回流
  let topVal = bodyClientH < targetEle.clientHeight ? -targetEle.offsetTop : residueH - targetEle.offsetTop
  // 处理弹窗位置,居上还是居中@FIXME:暂时解决文案虚的问题（如果translate3d的属性值不是整数会出现文案虚的情况）
  targetEle.style.transform = `translate3d(0, ${parseInt(topVal)}px, 0)`
}
let ele
const fn = throttle(function () {
  setDomTopVal({ bodyClientH: document.body.clientHeight, el: ele })
})
export default {
  name: 'responseDialog',  // 自适应弹窗位置
  // 初始化
  bind (el, binding, vNode) {
    ele = el
    // 监听视图元素resize
    el._elementResizeDetector = ElementResizeDetectorMaker()
    // 监听el-dialog__body元素变化
    el._elementResizeDetector.listenTo(vNode.elm.childNodes[0], (ele) => {
      setDomTopVal({ bodyClientH: document.body.clientHeight, el })
    })
    // 监听body变化
    window.addEventListener('resize', fn)
  },
  // 解绑
  unbind (el, binding, vnode, oldVnode) {
    window.removeEventListener('resize', fn)
    el._elementResizeDetector.uninstall(vnode.elm.childNodes[0])
    el._elementResizeDetector = null
  }
}
