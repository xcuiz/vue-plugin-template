/* eslint-disable no-unused-vars */
import Vue, { VNode } from 'vue'
import { ElementUIComponentSize } from 'element-ui/types/component'
import { TreeProps } from 'element-ui/types/tree'

export interface SelectTreeSlots {

  /** 默认插槽 */
  default: VNode[],

  /** tree的作用域插槽 */
  node: VNode[]

}
export declare class SelectTree extends Vue {
  /** el-select大小 */
  size: ElementUIComponentSize

  /** v-model绑定值 */
  value: any[] | string | number

  /** 要展示的数据 */
  data: any[]

  /** 占位符 */
  placeholder: string

  /** el-tree props 配置项 */
  props: TreeProps

  /** 树的唯一标识 */
  nodeKey: string

  /** el-tree 配置项 */
  tree: object

  /** el-select 配置项 */
  select: object
}
