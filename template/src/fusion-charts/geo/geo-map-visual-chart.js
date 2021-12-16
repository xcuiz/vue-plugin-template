import Echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/map'
import getDefaultTooltip from './../component/tooltip'
import getDefaultVisualMap from './../component/visual-map'
import Geo from './geo.js'
import { merge, getPropValue } from '../util/base.js'
import { data2GeoMapVisual } from '../data-factory'
export default {
  name: 'idss-geo-map-visual-chart',
  extends: Geo,
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2GeoMapVisual(data)
    },
    getChartOption () {
      let { max, min } = this.transformData && this.transformData.maxAndMin
      return {
        tooltip: getDefaultTooltip.call(this, {
          trigger: 'item',
          formatter: (params) => {
            if (!params.data) return
            let { name = '', value = 0 } = params.data
            return `${name}：${value}`
          }
        }),
        legend: this.option.legend && this.getDefaultLegend({ show: false, data: this.transformData.legend }),
        visualMap: getDefaultVisualMap.call(this, { max, min }),
        series: this.transformData.series.map(({ map = 'china', name = '', data = [], ...item }) => {
          // 如果地图没有被注册
          if (!Echarts.getMap(map)) {
            const geoJson = require('./geo-json/' + map + '.json')
            Echarts.registerMap(map, geoJson)
          }
          // 加载世界地图中中英文对照表
          let worldEn2Ch = map === 'world' && require('./geo-json/worldEn2Ch.json')
          return merge({
            type: 'map',
            name: name,
            map: map, // 地图名称,
            roam: true,
            data: data,
            nameMap: map === 'world' ? worldEn2Ch : null, // 自定义名称映射
            label: getPropValue(this.label, { show: true }),
            itemStyle: {
              borderWidth: 0.8,
              borderType: 'solid'
            }
          }, { ...item })
        })
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
