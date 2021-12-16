// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { StepStatus } from 'element-ui/types/step'
import { Steps as ElSteps } from 'element-ui/types'
export type TmlpType = 'steps-default' | 'steps-list' | 'steps-table'
export declare class StepsView extends ElSteps {
  /** 步骤条数据 */
  data:any[]
  /** 自定义默认模版的图标 */
  icons:string[]
  /** 步骤状态 */
  status:StepStatus
  /** _idssTmpl */
  tmpl: TmlpType
  /** 自定义 slot='icon' 的样式(可以设置除了element之外的图标样式) */
  config: object
}
