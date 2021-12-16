import Echarts from 'echarts/lib/echarts'
import 'echarts-gl'
import Geo from './geo.js'
import { merge, dataScale } from '../util/base.js'
import mapImage from './images/earth.jpg'
import { data2GeoMap3D } from '../data-factory'

export default {
  name: 'idss-geo-map-3d-chart',
  extends: Geo,
  props: {
    symbolSize: [Number, Array, Function],
    map: {
      type: String,
      default: mapImage
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2GeoMap3D(data)
    },
    getChartOption () {
      // 如果地图没有被注册
      if (!Echarts.getMap(this.transformData.map)) {
        const geoJson = require('./geo-json/' + this.transformData.map + '.json')
        Echarts.registerMap(this.transformData.map, geoJson)
      }
      let series = []
      this.transformData.series.forEach((item, index) => {
        series.push(merge({
          type: 'lines3D', // 类型为线型
          name: `${item.name}的攻击线`,
          coordinateSystem: 'globe',
          show: !!(item.lines && item.lines.length), // 是否显示攻击线
          effect: {
            show: true,
            period: 6,
            trailWidth: 4,
            trailLength: 0.2,
            trailColor: '#25ffde',
            trailOpacity: 0.6
          }, // 效果
          lineStyle: {
            opacity: 0.5,
            width: 1 // 外框
          }, // 线的效果
          data: item.lines,
          blendMode: 'lighter'
        }, item.seriesLines3D),
        merge({
          name: `${item.name}的气泡图`,
          type: 'scatter3D',
          coordinateSystem: 'globe',
          show: !!(item.points && item.points.length),
          symbolOffset: this.transformData.series.length > 1 && [index * 10 - 5, index * 10 - 5],
          symbolSize: this.symbolSize || (val => {
            let { max = 0, min = 0 } = this.transformData.maxAndMin
            return dataScale({ current: val[2], maxNum: max, minNum: min })
          }),
          label: {
            show: true,
            distance: 5,
            position: 'right',
            formatter: (params) => {
              let { data: { name = '', value = [] } } = params
              return `${name}：${value[2]}`
            },
            textStyle: {
              color: '#2d9ddb',
              borderColor: '#2d9ddb'
            }
          },
          data: item.points,
          blendMode: 'lighter'
        }, item.seriesScatter3D))
      })

      return {
        tooltip: {
          trigger: 'item'
        },
        // 地图信息
        globe: merge({
          baseTexture: this.map,
          globeOuterRadius: 100, // 动态参数需要外面赋值
          shading: 'lambert',
          lambertMaterial: {
            textureTiling: 1,
            textureOffset: 0
          },

          light: { // 光照阴影
            main: {
              color: '#fff', // 光照颜色
              intensity: 0, // 光照强度
              shadowQuality: 'medium', // 阴影亮度
              shadow: true, // 是否显示阴影
              alpha: 100,
              beta: 0
            },
            ambient: {
              color: '#fff', // 'rgba(162, 192, 231, 0.3)', // '#a2c0e7',
              intensity: 1
            },
            ambientCubemap: {
              diffuseIntensity: 0.3,
              specularIntensity: 0.3
            }
          },
          viewControl: {
            alpha: 30,
            autoRotate: true,
            autoRotateAfterStill: 10,
            distance: 220,
            minDistance: 40,
            maxDistance: 260,
            // 第一次渲染定位到北京，后面更新保持原位置不变
            targetCoord: [116.46, 39.92]
          }
        }, this.option.globe ? this.option.globe : {}),
        series: series
      }
    },
    initChartOption () {
      return this.getChartOption()
    }
  }
}
