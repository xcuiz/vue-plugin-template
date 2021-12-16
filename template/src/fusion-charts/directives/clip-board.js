/**
 * 复制/剪切/拷贝指令
 */
const _noop = function () {}
const ClipBoard = require('clipboard')
export default {
  name: 'clip-board',
  hooks: {
    bind: function (el, binding, vnode) {
      const clipboard = new ClipBoard(el, { // 实例化，需要传一个DOM选择器或HTML元素或HTML元素列表
        action () { return binding.arg === 'cut' ? 'cut' : 'copy' } // 定义粘贴板操作属性是剪切还是复制 默认为复制
      })
      if (typeof (binding.value) === 'object') { // 如果传入的是对象，则可能需要复制成功或者是失败时的函数回调
        let { success = _noop, error = _noop } = binding.value
        clipboard.on('success', e => { // 处理成功时的回调
          success()
        })
        clipboard.on('error', e => { // 处理失败时的回调
          error()
        })
      }
      el._clipboard = clipboard
    },
    update (el, binding) {
      el._clipboard.text = function () {
        if (typeof (binding.value) === 'string') {  // 支持字符串与对象两种形式
          return binding.value
        } else {
          return binding.value.value
        }
      }
    },
    unbind (el, binding) {  // 解绑
      el._clipboard.destroy()
      delete el._clipboard
    }
  }
}
