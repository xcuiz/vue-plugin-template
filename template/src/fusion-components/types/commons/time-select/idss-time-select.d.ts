import Vue from 'vue'
import { ElementUIComponentSize } from 'element-ui/types/component'
import { PopoverPlacement } from 'element-ui/types/popover'
export type Unit = 's' | 'm' | 'h' | 'd' | 'w' |'M' |'y'
export interface GlobalTime {
  timeFlag?: 1|2|3
  startTime?: number
  endTime?: number
  timeInterval?: number
  timeUnit?:Unit
}
export declare class TimeSelect extends Vue {
  // 组件绑定值
  time:GlobalTime
  //  tooltip出现位置
  placement: PopoverPlacement
  // 最小宽度
  minWidth: string
  // 无需时间间隔
  noTimeRange: boolean
  // Popover 是否可用
  disabled: boolean
  // 显示在输入框中的格式
  formatter: string
  // 影响Popover的层级
  isInDialog: boolean
  //  是否展示tooltip
  isShowTooltip: boolean
  // 是否禁用结束日期
  disableChangeEndTime: boolean
  // 自定义快捷选项
  customQuickTime:object
  // 输入框尺寸
  size:ElementUIComponentSize
  // 用户确认选定的值时触发
  change(value: GlobalTime):void
}
