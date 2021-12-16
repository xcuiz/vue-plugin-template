// eslint-disable-next-line no-unused-vars
import Vue, { VNode } from 'vue'

export interface SlideAsideSlots {
  /** 内容区域 */
  default: VNode[],
  /** 侧边栏区域 */
  aside: VNode[],

  [key: string]: VNode[]
}

/** Informs users while preserving the current page state */
export declare class SlideAside extends Vue {
  /** 是否显示侧边栏 */
  value: boolean
  /** 是否拉伸 */
  stretch: boolean
  /** 侧边栏方向 */
  left: boolean
  /** 侧边栏宽度 */
  width: string
  /** 最小高度 */
  minHeight: string
  /** 高度 */
  height: string
  /** 主体部分样式 */
  mainStyle: object
  /** 侧边栏样式 */
  asideStyle: object
  /** 是否显示手柄 */
  handle: boolean
  /** 插槽 */
  $slots: SlideAsideSlots
}