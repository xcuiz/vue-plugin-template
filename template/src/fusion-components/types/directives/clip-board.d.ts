// eslint-disable-next-line no-unused-vars
import { VNodeDirective } from 'vue'

export interface ClipBoardDirective extends VNodeDirective {
  name: 'clip-board'
  bind:(el:any, binding:any, vnode:any) => void
  update: (el:any, binding:any) => string
  unbind: (el:any, binding:any) => void
}
