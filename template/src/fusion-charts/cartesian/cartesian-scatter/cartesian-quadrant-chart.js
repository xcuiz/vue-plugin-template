import 'echarts/lib/chart/scatter'
import Cartesian from '../cartesian'
import ecStat from 'echarts-stat'
import {
  merge,
  getPropValue
} from '../../util/base.js'
import BASE_COLOR from '../../theme/default-base-color'
import { data2Quadrant } from '../../data-factory'

export default {
  name: 'idss-quadrant-chart',
  extends: Cartesian,
  props: {
    num: { // @propCnName 聚类数量
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      // option的配置项
      options: [],
      timeline: {
        data: []
      }
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Quadrant(data)
    },
    initChartData () {
      const {
        transformData: data,
        num,
        option,
        options,
        timeline
      } = this
      let result
      /**
       * 引入ecStat用于实现聚类算法
       * K均值聚类方法(hierarchicalKMeans):
       * 参数: 第一个参数为聚类所用数据, 第二个参数为聚类数量, 第三个参数标识聚类是否结束。
       * 设置为false时, 则结果直接为result, 结果包含中心点, 评估结果和数据簇
       * 设置为true时, 结果为Object, 包含next()方法, 调用next()方法同样返回Object, Object包含isEnd属性, 判断聚类过程是否结束
       */
      let step = ecStat.clustering.hierarchicalKMeans(data.series[0].data, num, true)
      // 将配置项挂载到option上
      option.options = options
      option.timeline = timeline
      // 可视化聚类过程
      for (let i = 0; !(result = step.next()).isEnd; i++) {
        // timeline需要传入多个option
        options.push(this.generateSeries(result, num))
        timeline.data.push(i + '')
      }
    },
    getChartOption () {
      const {
        timeline,
        options,
        initChartData
      } = this
      // 设置象限图坐标轴样式
      const lineStyle = {
        color: BASE_COLOR.CARTESIAN.QUADRANT.QUADRANT_TXT_COLOR
      }
      const axisConfig = {
        type: 'value',
        axisLine: {
          lineStyle
        },
        axisTick: {
          lineStyle
        }
      }
      initChartData()
      return {
        timeline: {
          top: 'center',
          right: 35,
          height: 300,
          width: 10,
          inverse: true,
          playInterval: 2500,
          symbol: 'none',
          orient: 'vertical',
          axisType: 'category',
          autoPlay: true,
          label: {
            normal: {
              show: false // timeline提示文本
            }
          },
          data: timeline.data
        },
        baseOption: {
          xAxis: axisConfig,
          yAxis: axisConfig,
          series: this.transformData.series.map((item, index) => merge({}, {
            type: 'scatter',
            itemStyle: getPropValue(this.itemStyle),
            label: getPropValue(this.label, {
              show: true
            })
          }, item)),
          options
        }
      }
    },
    /**
     * 生成新的series，根据上一步的聚类结果数据
     * @param {*} result 上一步的聚类结果数据
     * @param {*} num 聚类次数
     */
    generateSeries (result, num) {
      const centroids = result.centroids
      const ptsInCluster = result.pointsInCluster
      let series = []
      for (let i = 0; i < num; i++) {
        series.push({
          name: 'scatter' + i,
          type: 'scatter',
          animation: false,
          data: ptsInCluster[i],
          markPoint: {
            symbolSize: 29,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: true,
                position: 'top',
                formatter: function (params) {
                  return Math.round(params.data.coord[0] * 100) / 100 + '  ' +
                    Math.round(params.data.coord[1] * 100) / 100 + ' '
                },
                textStyle: {
                  color: BASE_COLOR.CARTESIAN.QUADRANT.QUADRANT_TXT_COLOR
                }
              }
            },
            itemStyle: {
              normal: {
                opacity: 0.7
              }
            },
            data: [{
              coord: centroids[i]
            }]
          }
        })
      }
      // FIXME: 为了给所有点加lebel,考虑是否去掉
      series = series.map((item, index) => merge({}, {
        type: 'scatter',
        label: getPropValue(this.label, {
          show: true
        })
      }, item))
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        series: series,
        color: BASE_COLOR.CARTESIAN.QUADRANT.QUADRANT_COLOR
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
