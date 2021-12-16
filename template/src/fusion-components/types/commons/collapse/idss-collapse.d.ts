// eslint-disable-next-line no-unused-vars
import Vue, { VNode } from 'vue'

export interface CollapseSlots {
  /** 折叠内容 */
  default: VNode[],
  /** header区域 */
  header: VNode[],
  /** 自定义展开按钮 */
  button: VNode[],
  /** isButtonShow为true时，按钮文案定义 */
  collapseButton: VNode[]

  [key: string]: VNode[]
}

/** Informs users while preserving the current page state */
export declare class Collapse extends Vue {
  /** 初始是否折叠面板 */
  collapse: boolean
  /** 组件标题 */
  title: string
  /** 是否显示面板头部 (隐藏后可自定义头部) */
  hideHeader: boolean
  /** 是否显示按钮 */
  isButtonShow: boolean
  /** 按钮主题（is-button-show为true显示按钮时使用） */
  buttonType: string
  /** 是否显示箭头 */
  isArrowShow: boolean
  /** 是否显示图标 */
  isShowIcon: boolean
  /** 图标名字 */
  iconName: string
  /** 插槽 */
  $slots: CollapseSlots
}