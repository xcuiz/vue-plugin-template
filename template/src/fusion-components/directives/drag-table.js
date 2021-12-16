/*
* table 表格拖拽指令
*/
import Sortable from 'sortablejs'
export default {
  name: 'drag-table',
  bind: function (el, binding, vnode) {
    // console.log('1-bind')
  },
  inserted: function (el, binding, vnode) {
    // console.log('2-inserted')
  },
  update: function (el, binding, vnode, oldVnode) {
    // console.log('3-update')
  },
  componentUpdated: function (el, binding, vnode, oldVnode) {
    // console.log('4-componentUpdated')
    let { data } = binding.value
    const $el = el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    Sortable.create($el, {
      ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
      setData: function (dataTransfer) {
        // to avoid Firefox bug
        // Detail see : https://github.com/RubaXa/Sortable/issues/1012
        dataTransfer.setData('Text', '')
      },
      onEnd: evt => {
        const targetRow = data.splice(evt.oldIndex, 1)[0]
        data.splice(evt.newIndex, 0, targetRow)
      }
    })
  },
  unbind: function (el, binding, vnode) {
    // console.log('5-unbind')
  }
}
