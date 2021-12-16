import 'echarts/lib/chart/sankey'
import Container from '../../container.vue'
import { debounce } from '../../util/base.js'
import { data2Sankey } from '../../data-factory'

export default {
  extends: Container,
  name: 'idss-sankey-chart',
  data () {
    return {
      tempArr: [],
      links: [],
      nodes: []
    }
  },
  mounted () {
    // 监听visualMap变化, 动态改变sankey图数据
    this.myChart.on('datarangeselected', debounce(this.generateChartData, true))
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Sankey(data)
    },
    initDefaultOption () {
      return {}
    },
    getChartOption () {
      // 备份数据
      this.links = this.transformData.series[0].links
      this.nodes = this.transformData.series[0].nodes
      return {
        series: [
          {
            type: 'sankey',
            links: this.links,
            data: this.nodes
          }
        ]
      }
    },
    /**
     * 过滤sankey图数据
     */
    generateChartData (params) {
      this.tempArr = []
      // 过滤link数据
      this.links = this.transformData.series[0].links.filter((item, index) => {
        return item.value > params.selected[0] && item.value < params.selected[1]
      })
      // 获取节点name信息
      this.links.forEach(e => {
        this.tempArr.push(e.source)
        this.tempArr.push(e.target)
      })
      // 过滤节点数据
      this.nodes = this.transformData.series[0].nodes.filter((item, index) => {
        return this.tempArr.indexOf(item.name) !== -1
      })
      this.myChart.setOption({
        series: [{
          links: this.links,
          data: this.nodes
        }]
      })
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
