<template>
  <div class="swiper-container"
    @mouseenter="mouseEvent('stop')"
    @mouseleave="mouseEvent('start')">
    <!-- 视差背景,暂时无使用场景 -->
    <slot name="parallax-bg"></slot>
    <div :class="classes.wrapperClass" :style="{'transition-timing-function': transitionTimingFunction}">
      <slot></slot>
    </div>
    <!-- 分页 -->
    <slot name="pagination">
      <!-- <div class="swiper-pagination"></div> -->
    </slot>
    <!-- 后退按钮 -->
    <slot name="button-prev">
      <!-- <div class="swiper-button-prev"></div> -->
    </slot>
    <!-- 前进按钮 -->
    <slot name="button-next">
      <!-- <div class="swiper-button-next"></div> -->
    </slot>
    <!-- 滚动条 -->
    <slot name="scrollbar"></slot>
  </div>
</template>
<script>
import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.min.css'
import { JSONStringify } from './../util/base.js'
const DEFAULT_EVENTS = [
  'beforeDestroy',
  'slideChange',
  'slideChangeTransitionStart',
  'slideChangeTransitionEnd',
  'slideNextTransitionStart',
  'slideNextTransitionEnd',
  'slidePrevTransitionStart',
  'slidePrevTransitionEnd',
  'transitionStart',
  'transitionEnd',
  'touchStart',
  'touchMove',
  'touchMoveOpposite',
  'sliderMove',
  'touchEnd',
  'click',
  'tap',
  'doubleTap',
  'imagesReady',
  'progress',
  'reachBeginning',
  'reachEnd',
  'fromEdge',
  'setTranslate',
  'setTransition',
  'resize'
]
const DEFAULT_OPTION = {
  direction: 'vertical',
  mousewheel: true,
  watchOverflow: true,
  loop: true,
  speed: 1000,
  runCallbacksOnInit: false,
  init: false,
  touchStartPreventDefault: false // 阻止`touchstart` (`mousedown`)的默认事件，设置为false则不阻止
}

export default {
  name: 'idss-swiper',
  props: {
    option: {
      type: Object,
      default () {
        return {}
      }
    },
    // 是否开启悬停，默认为不开启
    isHover: {
      type: Boolean,
      default: false
    },
    transitionTimingFunction: {
      type: String,
      default: 'ease-out'
    },
    isAutoInit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      swiper: null,
      classes: {
        wrapperClass: 'swiper-wrapper'
      }
    }
  },
  watch: {
    option: {
      deep: true,
      handler (val, oldVal) {
        if (JSONStringify(val) === JSONStringify(oldVal)) return
        // 监听option变化
        this.isAutoInit && this.init()
      }
    }
  },
  methods: {
    /**
     * 初始化方法
     */
    init () {
      const swiperOption = Object.assign({}, DEFAULT_OPTION, this.option)
      // 清除dom对象上的swiper实例，防止重复创建
      const swiper = this.$el.swiper
      if (swiper && !swiper.destroyed) {
        swiper.destroy && swiper.destroy(true, false)
        this.$el.swiper = null
      }
      this.swiper = new Swiper(this.$el, swiperOption)
      this.$el.swiper = this.swiper
      this.bindEvents()
      !swiperOption.init && this.swiper.init()
      this.$emit('mounted', this.swiper)
    },

    /**
     * 事件绑定
     */
    bindEvents () {
      DEFAULT_EVENTS.forEach(eventName => {
        this.swiper.on(eventName, () => {
          this.$emit(eventName, ...arguments)
          this.$emit(eventName.replace(/([A-Z])/g, '-$1').toLowerCase(), ...arguments)
        })
      })
    },

    /**
     * 鼠标悬停事件
     */
    mouseEvent (action) {
      if (this.isHover) {
        action === 'stop' ? this.swiperStop() : this.swiperStart()
      }
    },

    /**
     * 停止轮播
     */
    swiperStop () {
      this.swiper && this.swiper.autoplay && this.swiper.autoplay.stop()
    },

    /**
     * 开始轮播
     */
    swiperStart () {
      this.swiper && this.swiper.autoplay && this.swiper.autoplay.start()
    },

    /**
     * 销毁实例
     */
    destroy () {
      if (this.swiper) {
        this.swiper.destroy && this.swiper.destroy(true, true)
        delete this.swiper
      }
    }
  },
  mounted () {
    this.isAutoInit && this.init()
  },
  activated () {
    this.swiperStart()
  },
  deactivated () {
    this.swiperStop()
  },
  beforeDestroy () {
    this.destroy()
  }
}
</script>
