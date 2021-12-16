import Container from '../../container'
export default {
  extends: Container,
  props: {
    // @propIsApi 基础数据
    data: {
      type: [Object, Array],
      default () {
        return {
          series: [],
          legend: []
        }
      }
    }
  },
  methods: {
    /**
     * 初始化funnel默认配置
     */
    initDefaultOption () {
      return {
        // 继承覆盖式tooltip处理
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c}'
        }
      }
    }
  }
}
