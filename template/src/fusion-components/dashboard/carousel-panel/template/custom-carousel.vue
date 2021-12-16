<template>
  <div>
    <idss-carousel
      ref="carousel"
      :type="type"
      :style="carouselStyle"
      :option="option"
      @move="moveSlide"
      v-if="Array.isArray(widgetData) && widgetData.length > 0">
      <idss-carousel-slide
        v-for="(item, index) in widgetData" :key="index">
        <void-slot-component>
          <slot :carouselData="item"></slot>
        </void-slot-component>
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
import voidSlotComponent from '../components/empty-component.vue'
import { vueEmptyDataService } from '../../../mixins'
const CAROUSEL_DEFAULT_OPTION = {
  offset: 80,
  speed: 2000,
  deactivatedStyle: { 'background-color': 'transparent' }
}
export default {
  name: 'custom-carousel',
  mixins: [vueEmptyDataService],
  components: {
    idssCarousel,
    idssCarouselSlide,
    voidSlotComponent
  },
  props: {
    widgetData: {
      type: Array,
      default () {
        return []
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
          margin: '10px 20px'
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
<style lang="postcss" scoped>
</style>
