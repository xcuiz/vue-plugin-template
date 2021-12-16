// eslint-disable-next-line no-unused-vars
import { VNodeDirective } from 'vue'
// bingding属性注解
export interface BindingNote {
  /** 设置元素的初始左侧位置 */
  left: number,
  /** 设置元素的初始右侧位置 */
  right: number,
  /** 设置元素的初始上侧位置 */
  top: number,
  /** 设置元素的初始下侧位置 */
  bottom: number,
  /** 是否禁用拖拽效果 */
  disabled: boolean
}
export interface isDragDirective extends VNodeDirective {
  name: 'isDrag'
  inserted: (el: any, binding: BindingNote, vnode: any, oldVnode: any) => void
  bind: (el: any, binding: BindingNote, vnode: any) => void
  componentUpdated: (el: any, binding: BindingNote, vnode: any, oldVnode: any) => void
  unbind: (el: any, binding: BindingNote, vnode: any, oldVnode: any) => void
}
