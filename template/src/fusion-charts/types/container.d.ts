import Vue from 'vue'

export declare class Container extends Vue {
  // data发生变化图表重新渲染时是否调用chart.clear()
  isClear: boolean

  // 全局option配置项
  option: object

  // @propIsApi
  data: object | any[]

  // 手型控制
  defaultCursor: boolean

  // 是否使用svg渲染
  isSvgRender: boolean

  // 是否渲染起见一直保持animate状态
  keepAnimate: boolean

  // 是否使用内置的dataFactory函数
  isUseDefaultDataFactory: boolean

  // 对即将渲染的数据进行修改和装饰，用于修改自定义展示数据
  dataDecorate: () => void
}
