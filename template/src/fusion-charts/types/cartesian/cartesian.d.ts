import { Container } from '../container'

// @fixme props函数返回值待确定
type func = () => void

export declare class Cartesian extends Container {
  // 是否采用堆积图模式显示
  stack: boolean | func
  // label
  label: boolean | object | func
  // 区域填充样式
  areaStyle: boolean | object | func
  // 是否变为横向， x轴与Y轴交换
  horizontal: boolean
  // 类轴是否文字切割
  wordsHandle: object
}
