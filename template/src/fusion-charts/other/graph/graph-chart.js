/**
 * 关系图
 */
import 'echarts/lib/chart/graph'
import Container from '../../container'
import { data2Graph } from '../../data-factory'
export default {
  name: 'idss-graph-chart',
  extends: Container,
  props: {
    // @propIsApi
    data: {
      type: [Object, Array],
      default () {
        return {
          legend: [],
          categories: [],
          nodes: [],
          lines: []
        }
      }
    },
    keepAnimate: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Graph(data)
    },
    // 没有默认配置项
    initDefaultOption () { return {} },
    // 获取图表配置项
    initChartOption () {
      return {
        grid: {
          top: '3%',
          left: '3%',
          right: '100px',
          bottom: '3%',
          containLabel: true
        },
        series: {
          type: 'graph',
          layout: 'force',
          symbol: 'circle',
          symbolSize: 15,
          hoverAnimation: false,
          focusNodeAdjacency: true,
          legendHoverLink: true,
          roam: true,
          draggable: true,
          label: {
            show: true,
            position: 'top'
          },
          force: {
            repulsion: [
              10,
              100
            ]
          },
          categories: this.transformData.categories,
          nodes: this.transformData.nodes,
          links: this.transformData.lines,
          lineStyle: {
            'curveness': 0.1,
            'width': 1
          }
        }
      }
    }
  }
}
