/**
 * 由于dom的渲染顺序和数据的缓存autofocus不好使 通过注册一个局部的自定义指令 v-focus
 * vue focus指令，用指令封装focus进行input 获取焦点操作
 */
const focusTag = 'input[type="text"]:read-write:enabled,input[type="textarea"]:read-write:enabled,textarea:read-write:enabled'

function initEvent (el, binding, vnode) {
  let ele
  if (el.tagName.toLowerCase() === 'form') { // 指令加在el-form上
    const allFocusEls = el.querySelectorAll(focusTag) // 获取需要聚焦的input，textarea元素组
    ele = allFocusEls.length ? Array.from(allFocusEls)[0] : undefined
    console.warn('[fusion-components ][v-focus]:请将 v-focus 加在可输入文本上！')
  } else if (['input', 'textarea'].indexOf(el.tagName.toLowerCase()) !== -1) { // 指令加在input和textarea标签上
    ele = el.hasAttribute('disabled') || el.hasAttribute('readonly') || (!['text', 'textarea'].includes(el.type)) ? undefined : el
  } else { // 指令加在特定的且不是input和textarea标签上，eg：el-form里的input都有一层div包裹
    ele = el.querySelector(focusTag)
  }
  if (ele) {
    ele.focus()
  }
}

export default {
  name: 'focus',
  // 初始化只执行一次
  inserted: function (el, binding, vnode, oldVnode) {
    initEvent(el, binding, vnode)
  },
  bind (el, binding, vNode) {},
  // 组件发生变更会触发多次
  componentUpdated: function (el, binding, vnode, oldVnode) {},
  // 解绑
  unbind: function (el, binding, vnode, oldVnode) {}
}
