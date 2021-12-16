import 'echarts/lib/chart/tree'
import Container from '../../container'
import { data2FullTree } from '../../data-factory'
export default {
  name: 'idss-tree-chart',
  extends: Container,
  props: {
    // @propIsApi
    data: {
      type: [Object, Array],
      default () {
        return {
          series: []
        }
      }
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2FullTree(data)
    },
    // 没有默认配置项
    initDefaultOption () { return {} },
    // 获取图表配置项
    initChartOption () {
      return {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: {
          type: 'tree',
          symbolSize: 8,
          top: '6%',
          right: '12%',
          bottom: '6%',
          left: '12%',
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right'
          },
          leaves: {
            label: {
              position: 'right',
              verticalAlign: 'middle',
              align: 'left'
            }
          },
          expandAndCollapse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          data: this.transformData.series
        }
      }
    }
  }
}
