import 'echarts/lib/chart/parallel'
import Container from '../container'
import { merge } from '../util/base.js'

export default {
  extends: Container,
  props: {
    // @propCnName 竖直排布各个坐标轴，默认为水平排布
    vertical: Boolean,
    // @propIsApi 基础数据
    data: {
      type: [Object, Array],
      default () {
        return {
          series: [],
          parallelAxis: [
            { dim: 0, name: 'XXX' }
          ],
          legend: []
        }
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    initDefaultOption () {
      return {
        parallel: this.getDefaultParallel(),
        parallelAxis: this.getDefaultParallelAxis()
      }
    },

    /**
     * 获取平行坐标系默认配置
     */
    getDefaultParallel () {
      // 判断分支在这里处理
      return {
        top: '30px',
        left: '6%',
        right: '100px',
        bottom: '6%',
        layout: this.vertical ? 'vertical' : 'horizontal',
        triggerEvent: true
      }
    },

    /**
     * 获取平行坐标系中的坐标轴
     */
    getDefaultParallelAxis () {
      let axisData = this.transformData.parallelAxis
      if (!Array.isArray(axisData) || axisData.length <= 0) {
        return []
      }
      let parallelAxisTemp = {
        type: 'value'
      }
      return axisData.map((axis, index) => merge(parallelAxisTemp, axis))
    }
  }
}
