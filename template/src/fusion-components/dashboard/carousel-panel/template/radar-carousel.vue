<template>
  <div>
    <idss-carousel
      ref="carousel"
      :type="type"
      :style="carouselStyle"
      :option="option"
      @move="moveSlide"
      v-if="Array.isArray(realData.data) && realData.data.length > 0">
      <idss-carousel-slide v-for="(item, index) in realData.data" :key="index">
        <circular-panel :data="item.otherData">
          <idss-radar-chart :data="item.chartData" :option="radarOption" style="height: 100%;"></idss-radar-chart>
        </circular-panel>
      </idss-carousel-slide>
    </idss-carousel>

    <div v-show="!realData.data.length">
      <div ref="empty"></div>
    </div>
  </div>
</template>

<script>
import idssCarousel from '../components/carousel.vue'
import idssCarouselSlide from '../components/carousel-slide.vue'
import { IdssRadarChart } from 'fusion-charts/lib'
import circularPanel from '../components/circular-panel.vue'

import { vueEmptyDataService } from '../../../mixins'
const CAROUSEL_DEFAULT_OPTION = {
  offset: 80,
  speed: 2000,
  deactivatedStyle: { 'background-color': 'transparent' }
}
export default {
  name: 'radar-carousel',
  mixins: [vueEmptyDataService],
  components: {
    idssCarousel,
    idssCarouselSlide,
    circularPanel,
    IdssRadarChart
  },
  props: {
    widgetData: {
      type: Object,
      default () {
        return { total: 0, data: [] }
      }
    },
    type: {
      type: String,
      default: 'circular'
    },
    carouselStyle: {                                // carousel样式
      type: Object,
      default () {
        return {
          margin: '10px 20px;'
        }
      }
    },
    option: {
      type: Object,
      default () {
        return CAROUSEL_DEFAULT_OPTION
      }
    }
  },
  data () {
    return {
      // 转换后的数据
      realData: {
        total: 0,
        data: []
      },
      // 雷达图配置项
      radarOption: {
        color: '#00aeff',
        symbol: 'circle',
        symbolSize: 2,
        tooltip: {
          extraCssText: 'text-align: left'
        },
        label: {
          show: true,
          color: '#FFFFFF',
          fontSize: 14,
          position: 'top',
          distance: 3,
          formatter: function (params) {
            return params.value
          }
        },
        lineStyle: {
          color: '#FFFFFF'
        },
        radar: {
          radius: '60%',
          name: {
            padding: [0, 0, 5, 0],
            color: '#FFF'
          },
          splitNumber: 2,
          axisLine: {
            lineStyle: {
              color: ['rgba(255, 255, 255, 0.7)']
            }
          },
          splitLine: {
            lineStyle: {
              width: 0.7,
              color: 'rgba(255, 255, 255, 1)'
            }
          },
          splitArea: {
            show: false,
            areaStyle: {
              color: ['rgba(0, 174, 255, 0.50)', 'rgba(0, 174, 255, 0.50)', 'rgba(0, 174, 255, 0.37)', 'rgba(0, 174, 255, 0.22)'],
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              shadowBlur: 10
            }
          }
        }
      }
    }
  },
  methods: {
    moveSlide (currIndex) {
      this.$emit('move', currIndex)
    }
  },
  watch: {
    widgetData: {
      immediate: true,
      async handler (val) {
        const { total = 0, data = [] } = val
        this.realData.total = total
        this.realData.data = data.map(({ domain = '', name = '', total = 0, data: itemData }, index) => {
          return {
            otherData: Object.assign({}, { domain, name, total, order: index + 1 }),
            chartData: Object.assign([], itemData ? itemData.value : [])
          }
        })
        await this.$nextTick()
        this.$refs.carousel && this.$refs.carousel.restart()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      // 创建暂无数据展示节点
      this.createEmptyDom()
    })
  }
}
</script>
<style lang="postcss" scoped>
</style>
