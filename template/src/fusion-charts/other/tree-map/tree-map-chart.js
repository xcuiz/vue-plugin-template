import 'echarts/lib/chart/treemap'
import Container from '../../container'
import { merge } from '../../util/base.js'
import { data2TreeMap } from '../../data-factory'
export default {
  name: 'idss-tree-map-chart',
  extends: Container, // 继承公用模板
  props: {
    // @propIsApi
    data: {
      type: [Object, Array],
      default () {
        return {
          legend: [],
          series: []
        }
      }
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2TreeMap(data)
    },
    // 没有默认配置项
    initDefaultOption () { return {} },
    initChartOption () {
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: this.transformData.series.map(item => merge({}, {
          name: 'option',
          type: 'treemap',
          left: '3%',
          right: '3%',
          top: '3%',
          bottom: '3%',
          leafDepth: 1,
          roam: 'move',
          nodeClick: false,
          breadcrumb: {
            show: false,
            top: '94%'
          },
          label: {
            show: true,
            formatter: '{b}'
          },
          levels: this.getLevelOption()
        }, item))
      }
    },
    // 最顶层级用颜色区分，分成了『红』『绿』『蓝』等大块。每个颜色块中是下一个层级，使用颜色的饱和度来区分
    getLevelOption () {
      return [
        {
          itemStyle: {
            normal: {
              gapWidth: 5 // 第一层级间的缝隙
            }
          }
        },
        {
          itemStyle: {
            normal: {
              gapWidth: 1 // 第二层级间的缝隙
            }
          }
        },
        {
          colorSaturation: [0.35, 0.5],
          itemStyle: {
            normal: {
              gapWidth: 1, // 第三层级间的缝隙
              borderColorSaturation: 0.6
            }
          }
        }
      ]
    }
  }
}
