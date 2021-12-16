// eslint-disable-next-line no-unused-vars
import Vue, { VNode } from 'vue'
export interface DragContainerSlots {
  /** 默认内容 */
  default: VNode[],

  /** 可拖拽的内容 */
  dragTarget: VNode[]
}
export declare class DragContainer extends Vue {
  /** 左侧栏的默认宽度 */
  width: string
  /** 左侧栏的最小宽度 */
  minLeftWidth: number
  /** 右侧栏的最小宽度 */
  minRightWidth: number
}
