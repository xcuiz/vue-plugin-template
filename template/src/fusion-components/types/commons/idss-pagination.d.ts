// eslint-disable-next-line no-unused-vars
import Vue, { VNode } from 'vue'
import { Pagination as ElPagination } from 'element-ui/types'

export interface PaginationSlots {
  default: VNode[],
  [key: string]: VNode[]
}

export declare class Pagination extends ElPagination {
  /** 表格数据 */
  tableData: {
    /** 当前页码 */
    pageNum: number,
    /** 每页显示条目个数 */
    pageSize: number,
    /** 总条目数 */
    total: number
  }

  /** 样式控制，相同名称会覆盖已有样式 */
  styles: CSSStyleDeclaration

  /** 限制最大显示条数 */
  totalLimit: number
}
