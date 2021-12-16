import Container from '../../container'
import 'echarts-wordcloud'
import getDefaultTooltip from './../../component/tooltip'
import { merge } from '../../util/base.js'
import { data2WordCloud } from '../../data-factory'

export default {
  name: 'idss-word-cloud-chart',
  extends: Container,
  props: {
    portraitImage: {
      type: String,
      default: ''
    },
    // 词云组件在当前生命周期中保持animate，由于词云的渲染不是一帧渲染完成，故保持动画
    keepAnimate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2WordCloud(data)
    },
    noEnumCallback (option) {
      if (option.series[0].maskImage) {
        let image = new Image()
        image.src = this.portraitImage
        option.series[0].maskImage = image

        // 处理异步渲染图片，重新渲染图片
        image.onload = () => {
          if (this.myChart) {
            this.myChart.clear()
            this.myChart.setOption(option, true)
          }
        }
      }
    },
    // 没有默认配置项
    initDefaultOption () {
      return {}
    },
    getChartOption () {
      if (!this.transformData.series || !this.transformData.series.length) return
      return {
        tooltip: getDefaultTooltip.call(this, {
          trigger: 'item',
          formatter ({ seriesName, name }) {
            return `${seriesName}:</br>${name}`
          }
        }),
        series: this.transformData.series.map(({ name = '', data = [], ...others }) => merge({
          name: name,
          type: 'wordCloud',
          gridSize: 1,
          sizeRange: [20, 30],
          textRotation: [0, 0],
          rotationRange: [0, 0],
          drawOutOfBound: true,
          shape: 'circle',
          textPadding: 0,
          autoSize: {
            enable: false,
            minSize: 16
          },
          textStyle: {
            normal: {
              color: function () {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')'
              }
            },
            emphasis: {
              shadowBlur: 10
            }
          },
          maskImage: this.portraitImage ? {} : undefined,
          width: '86%',
          height: '85%',
          data: data
        }, others))
      }
    },
    // 获取图表配置项
    initChartOption () {
      return this.getChartOption()
    }
  }
}
