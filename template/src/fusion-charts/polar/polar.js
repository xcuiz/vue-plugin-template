import 'echarts/lib/component/polar'
import Container from '../container'
export default {
  extends: Container,
  props: {
    // @propIsApi 基础数据
    data: {
      type: [Object, Array],
      default () {
        return {
          series: [],
          radiusAxis: [],
          angleAxis: [],
          legend: []
        }
      }
    }
  },
  methods: {
    /**
     * 初始化polar默认配置
     */
    initDefaultOption () {
      // 轴坐标配置
      const radiusAxis = this.getDefaultRadiusAxis()
      // 角坐标配置
      const angleAxis = this.getDefaultAngleAxis()
      return {
        // 继承覆盖式tooltip处理
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c}'
        },
        // 默认极坐标
        polar: {},
        radiusAxis: radiusAxis,
        angleAxis: angleAxis
      }
    },

    /**
     * 轴坐标初始化配置
     */
    getDefaultRadiusAxis () {
      return {
        axisTick: {
          interval: 0,
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          interval: 0
        },
        splitLine: {
          show: true
        }
      }
    },
    /**
     * 角坐标初始化配置
     */
    getDefaultAngleAxis () {
      return {
        startAngle: 90,
        axisTick: {
          interval: 0,
          show: false
        },
        axisLine: {
          show: false
        },
        axisLabel: {
          show: true,
          interval: 0
        },
        splitLine: {
          show: true
        }
      }
    }
  }
}
