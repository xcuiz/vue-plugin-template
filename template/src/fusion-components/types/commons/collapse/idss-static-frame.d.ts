// eslint-disable-next-line no-unused-vars
import Vue, { VNode } from 'vue'

export type LocaltionType = 'left' | 'right' | 'left-center' | 'right-center' | 'left-bottom' | 'right-bottom' | 'fullscreen'
export interface StaticFrameSlots {
  /** 弹窗内容 */
  default: VNode[],

  /** 弹窗头部元素 */
  'title-left': VNode[],

  [key: string]: VNode[]
}

/** Informs users while preserving the current page state */
export declare class StaticFrame extends Vue {
    /** 标题 */
    title: string

    /** 宽度 */
    width: string

    /** top值 */
    top: string

    /** 是否显示modal */
    modal: boolean

    /** modal层是否插入到body中 */
    modalAppendToBody: boolean

    /** 弹窗显示时是否锁住body上的滚动条 */
    lockScroll: boolean

    /** 能否单击modal关闭 */
    closeOnClickModal: boolean

    /** 能否通过esc键关闭 */
    closeOnPressEscape: boolean

    /** 是否显示关闭图标 */
    showClose: boolean

    /** 关闭弹窗前的回调 */
    beforeClose: (done: Function) => void

    /** 关闭时是否销毁元素 */
    destroyOnClose: boolean

    $slots: StaticFrameSlots

    /** 是否将弹窗内容添加到body */
    appendToBody: boolean

    /** 弹窗出现的位置 */
    localtion: LocaltionType

    /** 弹窗最大高度 */
    maxHeight: string

    /** 高度 */
    height: string

    /** 弹窗头部样式 */
    headerStyle: object

    /** 弹窗内容样式 */
    mainStyle: object

    /** 弹窗全局样式 */
    globalStyle: object
}
