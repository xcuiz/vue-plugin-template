/**
 * 复制/剪切/拷贝指令
 */
const _noop = function () { }
const normalizeProps = function (param) {
  let obj = {
    text: '',
    action: param.arg ? param.arg : 'copy', // @FIXME: 剪切操作(action='cut')只对<input>或<textarea></textarea>元素起作用
    success: _noop,
    error: _noop
  }
  let type = Object.prototype.toString.call(param.value).match(/^\[object (.*)\]$/)[1].toLowerCase()
  switch (type) {
    case 'string':
      obj.text = param.value
      break
    case 'object':
      obj = Object.assign({}, obj, param.value)
      break
    default:
      break
  }
  return obj
}
const ClipBoard = require('clipboard')
export default {
  name: 'clip-board',
  bind: function (el, binding, vnode) {
    let { action, success, error } = normalizeProps(binding)
    const clipboard = new ClipBoard(el, { // 实例化，需要传一个DOM选择器或HTML元素或HTML元素列表
      action () { return action } // 定义粘贴板操作属性是剪切还是复制 默认为复制
    })
    clipboard.on('success', e => { // 处理成功时的回调
      success()
    })
    clipboard.on('error', e => { // 处理失败时的回调
      error()
    })
    el._clipboard = clipboard
    // 解决初始化输入框里面已经存在值的情况
    el._clipboard.text = function () {
      return normalizeProps(binding)['text']
    }
  },
  update (el, binding) {
    el._clipboard.text = function () {
      return normalizeProps(binding)['text']
    }
  },
  unbind (el, binding) {  // 解绑
    el._clipboard.destroy()
    delete el._clipboard
  }
}
