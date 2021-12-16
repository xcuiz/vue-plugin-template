
<template>
  <div class='contentBox'>
    <countTo ref='countToRef'
      useEasing
      :autoplay="state === 'running'"
      :startVal='startVal'
      :endVal='endVal'
      :duration='duration'
      :decimals='decimals'
      :decimal='decimal'
      :separator='separator'
      :prefix='prefix'
      :suffix='suffix'
      :easingFn='easingFn'
      @callback='callback'>
    </countTo>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
/**
 * @name 数字滚动
 * @type basis
 */
export default {
  name: 'idss-count-to',
  components: { countTo },
  props: {
    // @propDesc  开始值
    startVal: {
      type: Number,
      default: 0
    },
    // @propDesc  结束值
    endVal: {
      type: Number,
      default: 2020
    },
    // @propDesc  持续时间，以毫秒为单位
    duration: {
      type: Number,
      default: 3000
    },
    // @propDesc  要显示的小数位数
    decimals: {
      type: Number,
      default: 0,
      validator (value) {
        return isFinite(value)
      }
    },
    // @propDesc  小数分割符
    decimal: {
      type: String,
      default: '.'
    },
    // @propDesc  分隔符
    separator: {
      type: String,
      default: ','
    },
    // @propDesc 前缀
    prefix: {
      type: String,
      default: ''
    },
    // @propDesc  后缀
    suffix: {
      type: String,
      default: ''
    },
    // @propDesc  state为running是开始，paused是暂停
    state: {
      type: String,
      default: 'running'
    },
    // @propDesc  是否循环
    loop: {
      type: Boolean,
      default: false
    },
    // @propDesc 循环间隔，单位是秒
    interval: {
      type: Number,
      default: 10
    },
    /***
    缓动动画函数，参数：
    t: 动画执行到当前帧所经历的时间
    b: begining 起始值
    c: change 需要变化的量
    d: duration 动画的总时间
    ***/
    // @propDesc  缓动动画函数
    easingFn: {
      type: Function,
      default (t, b, c, d) {
        return c * (-Math.pow(2, -10 * t / d) + 1) * 1024 / 1023 + b
      }
    }
  },
  watch: {
    state: {
      immediate: true,
      handler: function () {
        if (this.state === 'running') { // 开始
          this.start()
        } else { // 暂停
          this.pause()
        }
      }
    }
  },
  methods: {
    dealRef (type) { // 方法调用提取的函数
      this.$refs && this.$refs.countToRef && this.$refs.countToRef[type]()
    },
    setIntervalFn () { // 开启和清除定时器
      clearInterval(this.countTimer)
      this.countTimer = setTimeout(() => {
        this.start()
      }, this.interval * 1000)
    },
    start () { // 开始计数
      this.dealRef('start')
    },
    pause () { // 暂停计数
      this.dealRef('pause')
    },
    pauseResume () { // 暂停恢复
      this.dealRef('pauseResume')
    },
    callback () { // countTo宗华结束后的回调
      if (this.loop) { // 开启循环刷新
        this.setIntervalFn()
      }
      this.$emit('animationEndCallback')
    }
  },
  mounted () {
    this.$emit('mountedCallback')// 挂载以后的回调
  },
  beforeDestroy () {
    clearInterval(this.countTimer)
  }
}
</script>
