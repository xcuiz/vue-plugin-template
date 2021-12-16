/**
 * 笛卡尔坐标系（直角坐标系）
 */
import 'echarts/lib/component/grid'
import Container from '../container'
import { handleWords } from '../util/base.js'
export default {
  extends: Container,
  props: {
    // @propCnName 是否采用堆积图模式显示
    stack: [Boolean, Function],
    // @propCnName label
    label: [Boolean, Object, Function],
    // @propCnName 区域填充样式
    areaStyle: [Boolean, Object, Function],
    // @propCnName 是否变为横向， x轴与Y轴交换
    horizontal: Boolean,
    // @propCnName 类轴是否文字切割
    wordsHandle: {
      type: Object,
      default () {
        return { wordsWidth: 120 }
      }
    },
    // @propIsApi
    data: {
      type: [Object, Array],
      default () {
        return {
          series: [],
          xAxis: [],
          yAxis: [],
          legend: []
        }
      }
    }
  },
  methods: {
    initDefaultOption () {
      // 获取x轴的配置
      const xAxis = this.getDefaultXAxis()
      // 获取y轴的配置
      const yAxis = this.getDefaultYAxis()
      return {
        grid: this.getDefaultGrid(),
        // 如果是横向的， x轴与y轴交换
        xAxis: this.horizontal ? yAxis : xAxis,
        yAxis: this.horizontal ? xAxis : yAxis
      }
    },
    /**
     * 获取直角坐标系默认绘图网格
     */
    getDefaultGrid () {
      // 判断分支在这里处理
      return {
        containLabel: true,
        top: '3%',
        left: '6%',
        right: '6%',
        bottom: '6%'
      }
    },
    /**
     * 获取直角坐标系默认x轴配置
     */
    getDefaultXAxis () {
      let xAxisData = this.transformData.xAxis
      if (xAxisData.length <= 0) {
        return []
      }
      let len = Array.isArray(this.option.xAxis) ? this.option.xAxis.length : 1
      let getTmpl = (index) => {
        return {
          type: 'category',
          // 坐标名称
          nameTextStyle: {
            fontFamily: 'Microsoft YaHei',
            fontSize: '16px',
            lineHeight: '36px'
          },
          // 轴线
          axisLine: {
            show: true
          },
          // 刻度线
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          // 刻度标签
          axisLabel: {
            opacity: 1,
            fontFamily: 'Microsoft YaHei',
            formatter: (name) => {
              return handleWords({ words: name, ...this.wordsHandle })
            }
          },
          // 如果指定了多x轴，但却只给了一个x轴的数据，那就共用
          data: xAxisData[index] ? xAxisData[index].data : xAxisData[0].data
        }
      }
      return new Array(len).fill('-').map((item, index) => {
        return getTmpl(index)
      })
    },
    getDefaultYAxis () {
      let len = Array.isArray(this.option.yAxis) ? this.option.yAxis.length : 1
      let getTmpl = (index) => {
        return {
          type: 'value',
          // 轴线
          axisLine: {
            show: true
          },
          // 刻度线
          axisTick: {
            show: false
          },
          // 刻度标签
          axisLabel: {
            opacity: 1,
            fontFamily: 'Microsoft YaHei',
            formatter: (name) => {
              return handleWords({ words: name, ...this.wordsHandle })
            }
          },
          // 分隔线
          splitLine: {
            show: true,
            lineStyle: {
              opacity: 0.3
            }
          }
        }
      }
      return new Array(len).fill('-').map((item, index) => {
        return getTmpl(index)
      })
    }
  }
}
