import Echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/lines'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/chart/effectScatter'
import getDefaultLegend from './../component/legend'
import getDefaultTooltip from './../component/tooltip'
import getDefaultVisualMap from './../component/visual-map'
import Geo from './geo.js'
import { merge, getPropValue, dataScale } from '../util/base.js'
import { data2GeoMap } from '../data-factory'
export default {
  name: 'idss-geo-map-chart',
  extends: Geo,
  props: {
    symbolSize: [Number, Array, Function], // @propCnName 自定义气泡的大小
    regions: [Array], // @propCnName 自定义某一组省份选中的颜色
    area: ''
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2GeoMap(data)
    },
    getChartOption () {
      // 如果地图没有被注册
      if (!Echarts.getMap(this.transformData.map)) {
        var geoJson = require('./geo-json/' + this.transformData.map + '.json')
        if (this.area) {
          const areaJson = require('./geo-json/' + this.area + '.json')
          geoJson.features.push(...areaJson.features)
        }
        Echarts.registerMap(this.transformData.map, geoJson)
      }
      let { max, min } = this.transformData && this.transformData.maxAndMin
      let series = []
      this.transformData.series.forEach((item, index) => {
        series.push(merge({
          type: 'lines', // 类型为线型
          name: `${item.name}`,
          coordinateSystem: 'geo',
          show: !!(item.lines && item.lines.length), // 是否显示攻击线
          effect: {
            show: true,
            period: 6,
            constantSpeed: 60, // 速度
            symbolSize: 3, // 宽度
            trailLength: 0.4 // 尾巴长度
          }, // 效果
          lineStyle: {
            width: 1, // 外框
            curveness: 0.2 // 弧度
          }, // 线的效果
          zlevel: 2, // 浮现在模板上面
          data: item.lines
        }, item.seriesLines),
        merge({
          name: `${item.name}`,
          type: 'scatter',
          coordinateSystem: 'geo',
          show: !!(item.points && item.points.length),
          symbolOffset: this.transformData.series.length > 1 && [index * 10 - 5, index * 10 - 5],
          symbolSize: this.symbolSize || (val => {
            if (val[2] === 0) return '-' // 处理当值为 0 时，气泡不再显示，但是显示省份“标签”
            let { max = 0, min = 0 } = this.transformData.maxAndMin
            return dataScale({ current: val[2], maxNum: max, minNum: min, baseSize: this.scaleBaseSize, scale: this.scaleBaseSize })
          }),
          label: {
            formatter: '{b}',
            position: 'right',
            show: true
          },
          emphasis: {
            label: {
              show: true
            }
          },
          // 去除 top 的 name，是为了防止当鼠标悬浮到 top 的点时， top 的点变大，name 会出现两个不完全重叠的样子
          data: item.points.map((val, index) => {
            if (index < this.transformData.top) {
              return { value: val.value }
            }
            return val
          })
        }, item.seriesScatter),
        merge({
          name: `${item.name}`,
          type: 'effectScatter',
          coordinateSystem: 'geo',
          showEffectOn: 'render',
          rippleEffect: {
            brushType: 'stroke'
          },
          hoverAnimation: true,
          label: {
            formatter: '{b}',
            position: 'right',
            show: true
          },
          symbolOffset: this.transformData.series.length > 1 && [index * 10 - 5, index * 10 - 5],
          symbolSize: val => {
            if (val[2] === 0) return '-'/*  */ // 处理当值为 0 时，气泡不再显示，但是显示省份“标签”
            let { max = 0, min = 0 } = this.transformData.maxAndMin
            return dataScale({ current: val[2], maxNum: max, minNum: min, baseSize: this.scaleBaseSize, scale: this.scaleBaseSize })
          },
          zlevel: 1,
          data: item.points.slice(0, this.transformData.top)
        }, item.seriesEffectScatter))
      })
      return {
        legend: this.option.legend && getDefaultLegend.call(this, { show: false, data: this.transformData.legend }),
        tooltip: getDefaultTooltip.call(this, {
          trigger: 'item',
          formatter: (params) => {
            if (!params.value) return
            if (params.value && typeof (params.value)[2] === 'undefined') {
              return params.name + ' : ' + params.value
            } else {
              return params.name + ' : ' + params.value[2]
            }
          }
        }),
        visualMap: this.option.visualMap && getDefaultVisualMap.call(this, { show: false, max, min }),
        // 地图信息
        geo: merge({
          map: this.transformData.map, // 地图名称
          roam: false, // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
          nameMap: this.transformData.map === 'world' ? require('./geo-json/worldEn2Ch.json') : null, // 自定义名称映射( 加载世界地图中中英文对照表)
          label: getPropValue(this.label, { show: true }),
          regions: this.regions // 在地图中对特定的区域配置样式
        }, this.option.geo ? this.option.geo : {}),
        series: series
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
