<template>
  <div style="width: 100%; height: inherit;">
    <div
      class="carousel-container"
      @mouseenter="mouseenter"
      @mouseleave="mouseleave">
      <slot></slot>
      <div class="btn">
        <slot name="next"></slot>
        <slot name="prev"></slot>
      </div>
    </div>
  </div>
</template>
<script>
const defaultOption = {
  offset: 60,
  scaleStep: 0.1,
  opacityStep: 0.3,
  autoPlay: true,
  speed: 1000,
  delay: 2000,
  stopOnHover: true,
  transitionTimingFunction: 'ease',
  deactivatedStyle: undefined,
  init: false
}

const carouselType = {
  // 纵向轮播
  portrait (componentOption, slideLength, index) {
    let deactivatedStyle = index === 0 ? undefined : componentOption.deactivatedStyle
    return Object.assign({
      'z-index': slideLength - index,
      'transform': `translate3d(0, -${index * componentOption.offset}px, 0) scale(${1 - index * componentOption.scaleStep})`,
      'opacity': 1 - index * componentOption.opacityStep
    }, deactivatedStyle)
  },
  // 环形轮播
  circular (componentOption, slideLength, index) {
    let midIndex = 0
    if (Number.isInteger(slideLength / 2)) {
      midIndex = Math.ceil(slideLength / 2) + 1
    } else {
      midIndex = Math.ceil(slideLength / 2)
    }

    let order = midIndex - index
    let trueOrder = order <= 0 ? order - 1 : order
    // let trueOrder
    // if (Number.isInteger(slideLength / 2)) {
    //   trueOrder = order
    // } else {
    //   trueOrder = order <= 0 ? order - 1 : order
    // }
    let direction = trueOrder / Math.abs(trueOrder)
    let xOffset = direction * (Math.abs(trueOrder) - midIndex) * componentOption.offset
    let deactivatedStyle = order === midIndex ? undefined : componentOption.deactivatedStyle
    return Object.assign({
      'z-index': Math.abs(trueOrder),
      'transform': `translate3d(${-xOffset}px, 0, 0) scale(${1 - (midIndex - Math.abs(trueOrder)) * componentOption.scaleStep})`,
      'opacity': 1 - (midIndex - Math.abs(trueOrder)) * componentOption.opacityStep
    }, deactivatedStyle)
  }
}

export default {
  name: 'idss-carousel',
  props: {
    // 轮播类型
    type: {
      type: String,
      default: 'portrait'
    },
    // 配置项
    option: {
      type: Object,
      default () {
        return defaultOption
      }
    }
  },
  data () {
    return {
      // 组件配置项
      componentOption: Object.assign({}, defaultOption, this.option),
      // 可变状态列表
      variableStates: [],
      // 定时器
      interval: undefined,
      // slide 基础样式
      slideBaseStyle: undefined
    }
  },
  computed: {
    // 当前展示的下标
    currIndex () {
      return this.variableStates.findIndex(state => state['z-index'] === Math.max.apply(null, this.variableStates.map(item => item['z-index'])))
    }
  },
  watch: {
    option: {
      deep: true,
      handler (newVal) {
        this.componentOption = Object.assign(this.componentOption, defaultOption, newVal)
      }
    }
  },
  methods: {
    /**
     * 播放
     */
    move () {
      if (!this.$children || !this.$children.length) return
      this.variableStates.unshift(this.variableStates.pop())
      // 暴露事件
      this.$emit('move', this.currIndex)
      this.$children.forEach((child, index) => {
        child.$children[0].setTransparent && child.$children[0].setTransparent(this.variableStates[index].opacity !== 1)
        child.variableStyle = this.variableStates[index]
      })
    },

    /**
     * 向前切换
     */
    prev () {
      if (!this.$children || !this.$children.length) return
      this.variableStates.push(this.variableStates.shift())
      // 暴露事件
      this.$emit('move', this.currIndex)
      this.$children.forEach((child, index) => {
        child.variableStyle = this.variableStates[index]
      })
    },

    /**
     * 向后切换
     */
    next () {
      this.move()
    },

    /**
     * 停止
     */
    stop () {
      this.interval && clearInterval(this.interval)
    },

    /**
     * 自动轮播
     */
    autoPlay () {
      let timeout = this.componentOption.delay || 2000
      // 有定时器先清空上一个定时器
      this.interval && clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.move()
      }, timeout)
    },

    /**
     * 初始化
     */
    init () {
      if (!this.$children || !this.$children.length) return

      // 事件绑定
      this.unbindEvent()
      this.bindEvent()
      // slide 基础样式
      this.slideBaseStyle = {
        'transform-style': 'flat',
        'transition': `all ${this.componentOption.speed}ms ${this.componentOption.transitionTimingFunction} 0s`
      }
      // 顺序给 slide 赋值对应的状态样式控制
      this.variableStates = []
      let slideLength = this.$children.length
      this.$children.forEach((child, index) => {
        // 第一个卡片设置透明度为false
        index === 0 && child.$children[0].setTransparent && child.$children[0].setTransparent(false)
        let curentState = carouselType[this.type](this.componentOption, slideLength, index)
        this.variableStates.push(curentState)
        child.baseStyle = this.slideBaseStyle
        child.variableStyle = curentState
      })
      // 自动轮播控制
      this.componentOption.autoPlay && this.autoPlay()
    },

    /**
     * 重启轮播
     */
    restart () {
      this.stop()
      this.init()
    },

    /**
     * 事件绑定
     */
    bindEvent () {
      if (this.$slots.next) {
        this.$nextEl = this.$slots.next[0].elm
        this.$nextEl.addEventListener('click', this.next)
      }
      if (this.$slots.prev) {
        this.$prevEl = this.$slots.prev[0].elm
        this.$prevEl.addEventListener('click', this.prev)
      }
    },

    /**
     * 事件解绑
     */
    unbindEvent () {
      this.$nextEl && this.$nextEl.removeEventListener('click', this.next)
      this.$prevEl && this.$prevEl.removeEventListener('click', this.prev)
    },

    /**
     * 鼠标移入时触发
     */
    mouseenter () {
      this.componentOption.stopOnHover && this.stop()
    },

    /**
     * 鼠标移出时触发
     */
    mouseleave () {
      this.componentOption.autoPlay && this.autoPlay()
    }
  },
  mounted () {
    // 初始化配置项
    this.componentOption.init && this.init()
  },
  activated () {
    this.componentOption.autoPlay && this.autoPlay()
  },
  deactivated () {
    this.stop()
  },
  beforeDestroy () {
    this.interval && clearInterval(this.interval)
    this.unbindEvent()
  }
}
</script>
<style scoped lang="postcss">
.carousel-container {
  position: relative;
  width: 100%;
  height: inherit;
  margin: auto;
  z-index: 0;
  .btn {
    position: absolute;
    right: 66px;
    bottom: 26px;
    z-index: 100;
  }
}
</style>
