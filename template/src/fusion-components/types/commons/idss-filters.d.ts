// eslint-disable-next-line no-unused-vars
import Vue, { VNode } from 'vue'

export interface FiltersItemsDict {
  value?: any,
  text?: string,
  children?: Array<FiltersItemsDict>,
  [key: string]: any,
}

export interface FiltersItems {
  name: string,
  type? : 'input' | 'select' | 'dataPicker' | 'idssTimeSelect' | 'idssSelectTree',
  props? : {
    [key: string]: any
  },
  dict: Array<FiltersItemsDict> | { [key: string]: FiltersItemsDict },
  dictKey?: string,
  dictName?: string,
  hidden?: boolean,
  default?: any
}

export interface FiltersSlots {
  default: Array<VNode> | undefined
  [key: string]: Array<VNode> | undefined
}

export declare class Filters extends Vue {
  /** 过滤器选项配置对象 */
  filterItems: {
    [key: string]: FiltersItems
  }
  /** 默认 form 参数配置 支持 sync 修饰符 也可以使用 v-model 代替（语法糖，效果一样） */
  defaultParams: { [key: string]: any }
  /** 设置过滤器下拉框选项的默认展示字段 */
  field: string
  /** 设置过滤器尺寸 */
  size: string
  /** 设置过滤器内的 input 组件是否自动获取焦点 */
  autoFocus: boolean
  /** 设置过滤器搜索按钮的文字 */
  btnText: boolean

  $slots: FiltersSlots

  [key: string]: any
}
