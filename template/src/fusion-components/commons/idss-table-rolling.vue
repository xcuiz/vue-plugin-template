<template>
  <div
    class="idss-table-rolling"
    @mouseover="stop"
    @mouseleave="move"
    @wheel.prevent="handleScroll"
    v-clickoutside="move">
    <slot></slot>
  </div>
</template>

<script>
/**
 * table 滚动组件
 * 支持无缝滚动、延迟滚动、加载到底停止滚动模式
 * @FIXME 无缝滚动借助单个dom元素的插入处理，(考虑到复制开销太大)，该种方式处理，导致鼠标滚动时，频抖效果，待后期好的方案处理
 */
import Clickoutside from 'element-ui/src/utils/clickoutside'
import { throttle } from '../util/base'
export default {
  name: 'idss-table-rolling',
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    // css 动画过度时间，单位ms 秒
    transitionDuration: {
      type: Number,
      default: 600
    },
    // duration 配置，单位ms 秒，动画间隔时长
    duration: {
      type: Number,
      default: 600
    },
    // delay 配置，单位ms 毫秒，动画延迟时长
    delay: {
      type: Number,
      default: 0
    },
    // 是否触底停止滚动
    isBottomStopRolling: {
      type: Boolean,
      default: false
    }
  },
  directives: { Clickoutside },
  data () {
    return {
      // 标记当前滚动位置
      markPosition: 0,
      // 标记滚动区域最大显示数量
      maxDisplaylen: 0
    }
  },
  computed: {
    // 判读当前滚动数据是否可以滚动
    isCanMove () {
      if (this.isBottomStopRolling && (this.markPosition + this.maxDisplaylen) < this.data.length) {
        // 触底停止滚动状态时，最后一条数据展示出来时，停止滚动
        return true
      }
      // 数据量小于可展示数据，没有滚动的必要
      if (!this.isBottomStopRolling && this.data.length > this.maxDisplaylen) {
        return true
      }
      return false
    }
  },
  watch: {
    data: {
      deep: true,
      handler: function () {
        if (this.data.length) {
          this.$nextTick(() => {
            this.init()
          })
        }
      }
    }
  },
  methods: {
    /**
     * 初始化滚动所需数据
     */
    init () {
      // 停止动画
      this.stop()
      // 保证表格渲染完成，开始滚动控制
      let $rollingTable = this.$el
      let $wrapper = $rollingTable.querySelector('.el-table__body-wrapper')
      this.$tbody = $rollingTable.querySelector('.el-table__body-wrapper tbody')
      if (!this.$tbody || !$wrapper) return
      this.rowHeight = this.$tbody.children[0].scrollHeight
      // 修复组件初始化之后，高度设置错误bug
      const wapperHeight = $rollingTable.querySelector('.el-table').clientHeight - $rollingTable.querySelector('.el-table__header-wrapper').clientHeight
      // 容器可视范围内展示的数量
      this.maxDisplaylen = Math.floor(wapperHeight / this.rowHeight)
      // 检查当前运动位置是否正确，修正位置
      this._checkTransformPosition()
    },
    /**
     * table滚动处理
     */
    move () {
      // 判断当前是否可以move
      if (!this.isCanMove || this._status === 'deactivated') return
      // 停止动画
      this.stop()
      // 开始动画运动
      this._translate()
    },
    /**
     * 开始动画运动,运动动画，涉及到延迟处理，借助定时去和transition动画间隔做延迟
     * @param {number} interval 运动时间间隔
     * @param {number} delayInterval 延迟时间间隔
     */
    _translate (interval = this.duration, delayInterval = this.transitionDuration + this.delay) {
      this.timer = setTimeout(() => {
        this.markPosition = (this.markPosition + 1) % this.data.length
        // 判断滚动距离(触底停止滚动，不会clone节点)
        const rollHeight = this.isBottomStopRolling ? this.markPosition * this.rowHeight : this.rowHeight
        this.$tbody.style.transform = `translate3D(0, -${rollHeight}px, 0)`
        this.$tbody.style.transition = this.transitionDuration ? `${this.transitionDuration}ms linear` : null
        // 延迟动画处理
        this._delay(delayInterval)
      }, interval)
    },
    /**
     * 动画延迟处理
     * @param {number} interval 延迟时间间隔
     */
    _delay (interval = this.transitionDuration + this.delay) {
      // 定时器间隔考虑到动画的transitionDuration时间
      this.delayer = setTimeout(() => {
        // 动画延迟处理(非触底停止滚动状态时)
        if (!this.isBottomStopRolling) {
          this.$tbody.appendChild(this.$tbody.children[0])
          // 重置位置、动画过度效果
          this._restTransition()
          this.move()
        } else {
          // 触底停止滚动，继续滚动处理
          this.move()
        }
      }, interval)
    },
    /**
     * 停止动画
     */
    stop () {
      clearTimeout(this.timer)
      clearTimeout(this.delayer)
    },
    /**
     * 检查当前运动位置是否正确，修正位置
     */
    _checkTransformPosition () {
      // 触底停止滚动时，判断当前数据长度小于当前滚动位置，需要修复定位
      if (this.isBottomStopRolling && this.markPosition + this.maxDisplaylen > this.data.length) {
        this.markPosition = 0
        // 重置位置、动画过度效果
        this._restTransition()
      }
      // 监听数据变化，运动开始
      this.move()
    },
    /**
     * 鼠标滚轮事件触发
     */
    handleScroll: throttle(function (e) {
      // 停止动画
      this.stop()
      if (e.deltaY > 0) {
        // 向上滚动
        this._scrollUpOrDown('up')
      } else if (e.deltaY < 0) {
        // 向下滚动
        this._scrollUpOrDown('down')
      }
    }, 200, 200),
    /**
     * 判断向上、下滚动处理
     * 主要处理鼠标滚动事件，（鼠标滚动不涉及动画过度）
     * @param {string} type up/down
     */
    _scrollUpOrDown (type) {
      const dict = {
        // 向上滚动
        up: {
          method: 'appendChild', // 底部插入第一个子节点
          child: 'firstChild',
          isBottomMove: this.markPosition + this.maxDisplaylen < this.data.length,
          markPosition: (this.markPosition + 1) % this.data.length
        },
        // 向下滚动
        down: {
          method: 'prepend', // 顶部插入最后一个子节点
          child: 'lastChild',
          isBottomMove: this.markPosition > 0,
          markPosition: (this.markPosition - 1) % this.data.length
        }
      }
      // 判断触底停止
      if (this.isBottomStopRolling) {
        // 判断当前是否可以运动
        if (!dict[type].isBottomMove) return
        this.markPosition = dict[type].markPosition
        const rollHeight = this.markPosition * this.rowHeight
        this.$tbody.style.transform = `translate3D(0, -${rollHeight}px, 0)`
      } else {
        // 判断无限滚动
        // 判断当前是否可以move
        if (!this.isCanMove) return
        // 滚动时差，不需要运动动画
        this.$tbody[dict[type].method](this.$tbody[dict[type].child])
        this.$tbody.style.transform = `translate3D(0, 0, 0)`
      }
      this.$tbody.style.transition = `600ms linear`
    },
    /**
     * 重置动画过度效果
     */
    _restTransition () {
      this.$tbody.style.transform = `translate3D(0, 0, 0)`
      this.$tbody.style.transition = null
    }
  },
  beforeDestroy () {
    this.stop()
  },
  deactivated () {
    // 非激活状态停止动画
    this.stop()
    this._status = 'deactivated'
  },
  activated () {
    this._status = 'activated'
    // 激活状态重新move
    if (this.data.length) {
      this.$nextTick(() => {
        this.init()
      })
    }
  }
}
</script>

<style lang="postcss" scoped>
.idss-table-rolling {
  /* 滚动过渡 */
  & >>> .el-table__body {
    tbody {
      transition-delay: 0;
      transition-duration: 0;
      transition-property: transform;
      transition-timing-function: linear;
    }
  }
  /* 隐藏滚动条 */
  & >>> .el-table--scrollable-y .el-table__body-wrapper {
    overflow-x: auto; /* 处理拉伸《列》线后隐藏其他列问题 */
    overflow-y: hidden;
  }
}
</style>
