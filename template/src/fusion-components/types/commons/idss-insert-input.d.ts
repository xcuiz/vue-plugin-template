// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
export declare class InsertInput extends Vue {
  /** 文本框value值 */
  value: string
  /** 文本框类型 */
  type: string
  /**
   * 插入文本，主要获取上次文本历史位置，然后拼接文本
   * @param text 插入内容
  */
  insertText(text: string): void
}
