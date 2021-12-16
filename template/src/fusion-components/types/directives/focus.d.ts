// eslint-disable-next-line no-unused-vars
import { VNodeDirective } from 'vue'

export interface FocusDirective extends VNodeDirective {
  name: 'focus'
  inserted:(el:any, binding:any, vnode:any, oldVnode:any) => void
  bind:(el:any, binding:any, vnode:any) => void
  componentUpdated: (el:any, binding:any, vnode:any, oldVnode:any) => void
  unbind: (el:any, binding:any, vnode:any, oldVnode:any) => void
}
