import 'echarts-gl'
import Echarts from 'echarts/lib/echarts'
import getDefaultTooltip from './../component/tooltip'
import Geo from './geo.js'
import { merge, dataScale } from '../util/base.js'
import { data2GeoMap3D } from '../data-factory'
export default {
  name: 'idss-geo-map-3d-map-chart',
  extends: Geo,
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2GeoMap3D(data)
    },
    getChartOption () {
      // 地图是否被注册过
      if (!Echarts.getMap(this.transformData.map)) {
        const geoJson = require('./geo-json/' + this.transformData.map + '.json')
        Echarts.registerMap(this.transformData.map, geoJson)
      }
      let series = []
      let legendArr = []
      this.transformData.series.forEach((item, index) => {
        // legend所需数据
        legendArr.push({ name: item.name })
        // 配置项
        series.push(
          merge({
            type: 'lines3D',
            name: `${item.name}`,
            coordinateSystem: 'geo3D',
            show: !!(item.points && item.points.length),
            effect: {
              show: true,
              period: 6,
              trailWidth: 5,
              trailOpacity: 0.5,
              trailLength: 0.2,
              constantSpeed: 5
            },
            blendMode: 'lighter',
            lineStyle: {
              width: 0.2,
              opacity: 0.05
            },
            zlevel: 2,
            data: item.lines
          }, item.seriesLines3D),
          merge({
            type: 'scatter3D',
            name: `${item.name}`,
            coordinateSystem: 'geo3D',
            show: !!(item.points && item.points.length),
            symbolSize: this.symbolSize || (val => {
              if (val[2] === 0) return '-' // 处理当值为 0 时，气泡不再显示，但是显示省份“标签”
              let { max = 0, min = 0 } = this.transformData.maxAndMin
              return dataScale({ current: val[2], maxNum: max, minNum: min, baseSize: this.scaleBaseSize, scale: this.scaleBaseSize })
            }),
            opacity: 1,
            emphasis: {
              label: {
                show: false
              },
              itemStyle: {
                borderWidth: 5,
                opacity: 1
              }
            },
            data: item.points,
            zlevel: 1
          }, item.seriesScatter3D),
          merge({
            type: 'map3D',
            map: this.transformData.map,
            itemStyle: {
              color: this.BASE_COLOR.GEO_3D_MAP_BG_COLOR,
              opacity: 1,
              borderWidth: 0.8,
              borderColor: 'rgb(62,215,213)'
            },
            label: {
              show: true,
              textStyle: {
                color: '#fff',
                fontSize: 12,
                opacity: 1,
                backgroundColor: 'rgba(0,0,0,0)'
              }
            },
            emphasis: {
              label: {
                show: true,
                textStyle: {
                  color: '#ffffff',
                  fontSize: 12,
                  backgroundColor: 'rgba(0,23,11,0)'
                }
              }
            },
            light: { // 光照阴影
              main: {
                color: '#fff', // 光照颜色
                intensity: 1.2, // 光照强度
                shadow: false, // 是否显示阴影
                alpha: 55,
                beta: 10
              },
              ambient: {
                intensity: 0.3
              }
            },
            viewControl: { // 鼠标拖拽默认是右键
              panMouseButton: 'right'
            },
            zlevel: 1,
            regions: this.regions // 在地图中对特定的区域配置样式
          }, item.map3D))
      })
      return {
        legend: {
          show: false,
          data: legendArr
        },
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
        // 地图信息（配合scatter3D以及lines3D使用）
        geo3D: merge({
          show: false,
          map: this.transformData.map, // 地图名称
          roam: true // 是否开启鼠标缩放和平移漫游。默认不开启。如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move'。设置成 true 为都开启
        }, this.option.geo3D || {}),
        series: series
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
