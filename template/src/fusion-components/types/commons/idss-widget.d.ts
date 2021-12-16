// eslint-disable-next-line no-unused-vars
import Vue from 'vue'

export type ShadowType = 'always' | 'never' | 'hover'

export type HeaderType = 'primary' | 'plain-border' | 'header-float-right'

export declare class Widget extends Vue {
  /** 是否有阴影 */
  shadow: ShadowType
  /** 背景的快捷方式 */
  headerType: HeaderType

  /** 定义整个组件全局样式 */
  globalStyle: object

  /** 定义组件 Header 样式 */
  headerStyle: object

  /** 定义组件 Main 的样式 */
  mainStyle: object

  /** 定义组件 Footer 的样式 */
  footerStyle: object
}
