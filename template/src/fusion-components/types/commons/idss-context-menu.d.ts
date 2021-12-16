import Vue, { VNode } from 'vue'
export interface contextMenuSlots {
  default: VNode[],
  /** 该元素会填充右键点击后的内容 */
  'context-menu': VNode[],

  [key: string]: VNode[]
}
export declare class ContextMenu extends Vue {
  /** 设置右键弹出内容元素的层级 */
  zIndex: Number

  /**
   * 展示菜单
   * @param e 获取当前点击Dom对象
   */
  openMenu(e: object): void

  /** 插槽 */
  $slots: contextMenuSlots

  [key: string]: any
}
