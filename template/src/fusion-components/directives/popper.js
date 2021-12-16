import { onEvent, offEvent } from '../util/dom'
// 设置默认tooltip配置
const defaultOpt = {
  trigger: 'click',
  onOpen: undefined,
  onClose: undefined
}
/**
 * 将popper的引用元素设置为当前触发元素
 * @param {dom} el
 * @param {object} popper popper对象
 * @param {function} bindingObj 回调函数
 * @param {any} args 回调函数参数
 * @param {string} openType 事件类型
 */
function setReference (el, popper, bindingObj, { args }, openType) {
  return function () {
    // 在设置popper相关属性前，判断当前popper实例是关联el是否修改(el修改且showPoper为true时触发原有元素的close事件)
    if (popper.referenceElm && popper.referenceElm !== el && popper.showPopper) {
      hideOldPopper(popper)
    }
    // 设置引用元素
    popper.referenceElm = popper.$refs.reference = el
    // 判断上次click的元素和当前元素相同时，当前showPopper取反，其他情况均为true
    popper.showPopper = (popper.oldPopper && popper.oldPopper.el === el && openType === 'click') ? !popper.showPopper : true
    if (popper.showPopper) {
      // 记录上次操作元素
      popper.oldPopper = {
        el,
        bindingObj,
        args,
        openType
      }
      popper.createPopper()
      bindingObj.onOpen && bindingObj.onOpen(args)
    }
  }
}
/**
 * 取消popper触发
 * @param {dom} el
 * @param {object} popper popper对象
 * @param {function} onClose popper关闭回调函数
 * @param {any} args 回调函数参数
 */
function offReference (el, popper, onClose, { args }) {
  return function () {
    // 防止重复触发回调
    if (popper.referenceElm === null && popper.$refs.reference === null) return
    popper.referenceElm = popper.$refs.reference = null
    popper.showPopper = false
    // popper.createPopper()
    onClose && onClose(args)
  }
}

/**
 * 隐藏old popper弹框，触发close事件
 * @param {object} popper popper实例
 */
function hideOldPopper (popper) {
  const { el: oldEl, bindingObj: { onClose: oldClose }, args: oldArgs } = popper.oldPopper
  offReference(oldEl, popper, oldClose, { args: oldArgs })()
}

/**
 * 获取tooltipVm实例
 * @param {vnode} vnode 虚拟节点
 * @param {string|vm} vm popper实例名称，获取当前父级中的ref或者传递的vm实例
 */
function getPopperVm (vnode, { vm = 'idss-popper' }) {
  let popper
  // 判断是ref引用名称
  if (typeof vm === 'string') {
    popper = vnode.context.$refs[vm]
    if (popper && Array.isArray(popper)) {
      popper = popper[0]
    }
  } else {
    popper = vm
  }
  return popper
}
/**
 * 初始化事件
 */
function initEvent (el, binding, vnode) {
  const bindingObj = binding.value && Object.prototype.toString.call(binding.value) === '[object Object]'
    ? Object.assign({}, defaultOpt, binding.value)
    : Object.assign({}, defaultOpt)
  // 记录上次传入的绑定
  el.oldBindings = binding
  // 作为argument传入的，接收ref或者vm实例 arg写法规则：{vm: 'idss-tooltip', value: [string,array,object]}
  const popper = getPopperVm(vnode, binding.arg || {})
  if (!popper) return
  // 记录原有popper对象，popper发生变化，清除事件
  if (el.oldPopper && el.oldPopper !== popper) {
    el.oldPopper.$off('hide')
  }
  // 挂载当前popper
  el.oldPopper = popper
  // 处理事件, 默认click
  const eventOpt = {
    open: 'click',
    close: '' // click状态时，document的click，已经被popper处理
  }
  // hover事件处理
  if (bindingObj.trigger === 'hover') {
    eventOpt.open = 'mouseenter'
    eventOpt.close = 'mouseleave'
  } else if (bindingObj.trigger === 'focus') {
    // 获取焦点处理（文本域）
    if (el.querySelector('input, textarea')) {
      eventOpt.open = 'focusin'
      eventOpt.close = 'focusout'
    } else {
      // 非文本域
      eventOpt.open = 'mousedown'
      eventOpt.close = 'mouseup'
    }
  }
  // 绑定触发popper 事件
  onEvent(el, eventOpt.open, setReference(el, popper, bindingObj, binding.arg || {}, eventOpt.open))
  // 取消popper事件
  onEvent(el, eventOpt.close, offReference(el, popper, bindingObj.onClose, binding.arg || {}))
  if (bindingObj.trigger === 'click' && !popper.isAddHideEvent) {
    popper.isAddHideEvent = true
    // 监听 popper 的隐藏事件
    popper.$on('hide', () => {
      hideOldPopper(popper)
    })
  }
}

/**
 * 解绑事件
 */
function unbindEvent (el) {
  offEvent(el, 'click')
  offEvent(el, 'mouseenter')
  offEvent(el, 'mouseleave')
  offEvent(el, 'focusin')
  offEvent(el, 'focusout')
  offEvent(el, 'mousedown')
  offEvent(el, 'mouseup')
  // popper && popper.$off('hide')
}
/**
 * 更新事件
 */
function updateEvent (el, binding, vnode, popper) {
  // 解绑事件
  unbindEvent(el)
  // 绑定事件
  initEvent(el, binding, vnode)
}

export default {
  name: 'idss-popper',
  bind (el, binding, vnode) {
    // 绑定事件
    initEvent(el, binding, vnode)
  },
  update (el, binding, vnode) {
    // vm实例不同 或者 数据变化，更新操作
    let bindingArg = binding.arg || {}
    let oldBindingArg = el.oldBindings.arg || {}

    if (bindingArg.vm !== oldBindingArg.vm ||
        bindingArg.args !== oldBindingArg.args ||
        JSON.stringify(binding.value) !== JSON.stringify(el.oldBindings.value)) {
      // 更新事件
      // const popper = getPopperVm(vnode, binding.arg || {})
      updateEvent(el, binding, vnode)
    }
  },
  unbind (el, binding, vnode) {
    // 获取popper对象
    const popper = getPopperVm(vnode, binding.arg || {})
    // 清除当前poper提示框
    popper && popper.$off('hide')
    if (popper && popper.referenceElm === el) {
      popper.showPopper = false
      popper.doDestroy()
    }
    // 解绑事件
    unbindEvent(el, binding, vnode, popper)
  }
}
