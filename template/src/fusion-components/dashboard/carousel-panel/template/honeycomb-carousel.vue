<template>
  <div>
    <idss-carousel
      ref="carousel"
      :type="type"
      :style="carouselStyle"
      :option="option"
      @move="moveSlide"
      v-if="Array.isArray(widgetData) && widgetData.length > 0">
      <idss-carousel-slide v-for="(item, index) in widgetData" :key="index">
        <crosswise-panel :data="Object.assign({order: index + 1}, item)"></crosswise-panel>
      </idss-carousel-slide>
    </idss-carousel>
    <div v-show="!widgetData.length">
      <div ref="empty"></div>
    </div>
  </div>
</template>
<script>
import idssCarousel from '../components/carousel.vue'
import idssCarouselSlide from '../components/carousel-slide.vue'
import crosswisePanel from '../components/crosswise-panel.vue'

import { vueEmptyDataService } from '../../../mixins'
const CAROUSEL_DEFAULT_OPTION = {
  delay: 5000,
  offset: 60,
  deactivatedStyle: { 'background-color': 'transparent' }
}
export default {
  name: 'honeycomb-carousel',
  mixins: [vueEmptyDataService],
  components: { idssCarousel, idssCarouselSlide, crosswisePanel },
  props: {
    widgetData: {
      type: Array,
      default () {
        return []
      }
    },
    type: {
      type: String,
      default: 'portrait'
    },
    carouselStyle: {                                // carousel样式
      type: Object,
      default () {
        return {
          margin: '110px 20px 100px;'
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
  methods: {
    moveSlide (currIndex) {
      this.$emit('move', currIndex)
    }
  },
  watch: {
    widgetData: {
      immediate: true,
      async handler () {
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
