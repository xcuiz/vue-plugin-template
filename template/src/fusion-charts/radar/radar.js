import Container from '../container'
export default {
  extends: Container,
  props: {
    // @propCnName 图形上的文本标签
    label: [Boolean, Object, Function],
    // @propCnName 折线拐点标志的样式
    itemStyle: [Boolean, Object, Function],
    // @propCnName 线条样式
    lineStyle: [Boolean, Object, Function],
    // @propCnName 区域填充样式
    areaStyle: [Boolean, Object, Function],
    // @propIsApi 基础数据
    data: {
      type: [Object, Array],
      default () {
        return {
          indicator: [],
          series: [],
          legend: []
        }
      }
    }
  },
  data () {
    return {}
  },
  methods: {
    initDefaultOption () {
      return {
        // 雷达图坐标系的配置
        radar: this.getDefaultRadar()
      }
    },

    getDefaultRadar () {
      return {
        axisLine: {
          show: true
        },
        splitLine: {},
        splitArea: {},
        indicator: this.transformData.indicator
      }
    }
  }
}
