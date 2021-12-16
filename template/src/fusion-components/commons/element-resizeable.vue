<template>
  <div
    class="element-resizeable"
    :class="isActive && 'active'"
    :style="eleStyle"
    @mousedown="isActive = true">
    <slot></slot>
    <div
      class="drag-stick"
      v-for="stick in sticks"
      :key="stick"
      :class="'drag-stick-' + stick"
      @mousedown.stop.prevent="mousedownHandle(stick, $event)"></div>
  </div>
</template>
<script>
import { throttleAnimation } from '../util/base.js'
export default {
  name: 'idss-element-resizeable',
  props: {
    // left 值
    l: Number,
    // top 值
    t: Number,
    // width
    w: {
      type: Number,
      default: 120
    },
    // height
    h: {
      type: Number,
      default: 65
    },
    // 可变的最小宽度
    minW: {
      type: Number,
      default: 120
    },
    // 可变的最小高度
    minH: {
      type: Number,
      default: 65
    },
    // resize 的拖拽节点。 tl 表示 top-left 的位置，即左上角. 以此类推
    sticks: {
      type: Array,
      default () {
        return ['tl', 'tm', 'tr', 'mr', 'br', 'bm', 'bl', 'ml']
      }
    }
  },
  data () {
    return {
      left: this.l,
      top: this.t,
      width: this.w,
      height: this.h,
      // 标记是否点击了元素，激活resize拖拽节点
      isActive: false,
      // 标记鼠标是否在拖拽节点是按下了
      isDrag: false,
      // 拖拽的缩放类型，上下左右的区别
      dragType: '',
      // 开始拖拽的鼠标坐标
      startPoint: {
        x: 0,
        y: 0
      },
      // requestAnimationFrame API 封装
      moveHandleRaf: throttleAnimation()
    }
  },
  watch: {
    l (val) {
      this.left = val
    },
    t (val) {
      this.top = val
    },
    w (val) {
      this.width = val
    },
    h (val) {
      this.height = val
    }
  },
  computed: {
    eleStyle () {
      return {
        left: this.left + 'px',
        top: this.top + 'px',
        width: (this.width < this.minW ? this.minW : this.width) + 'px',
        height: (this.height < this.minH ? this.minH : this.height) + 'px'
      }
    }
  },
  methods: {
    mousedownHandle (stick, event) {
      this.dragType = stick
      this.startPoint.x = event.x
      this.startPoint.y = event.y
      this.isDrag = true
    },
    moveHandle (event) {
      if (!this.isDrag) {
        return
      }
      event.stopPropagation()

      this.moveHandleRaf(_ => {
        const offsetX = event.x - this.startPoint.x
        const offsetY = event.y - this.startPoint.y

        switch (this.dragType[0]) {
          case 'b':
            // 只计算高度
            this.height += offsetY
            break
          case 't':
            // top需要改变
            this.top += offsetY
            // 取相对值
            this.height -= offsetY
            break
        }

        switch (this.dragType[1]) {
          case 'r':
            // 只计算宽度
            this.width += offsetX
            break
          case 'l':
            // 计算宽度并改变left值
            this.left += offsetX
            // 取相对值
            this.width -= offsetX
            break
        }
        // 重新记录鼠标起点，以便下次计算差值
        this.startPoint = {
          x: event.x,
          y: event.y
        }

        this.$emit('resizing', {
          left: this.left,
          top: this.top,
          width: this.width < this.minW ? this.minW : this.width,
          height: this.height < this.minH ? this.minH : this.height
        })
      })
    },
    // 监听 document 上的鼠标按下事件，主要判断是否需要 active
    documentMousedownHandle (event) {
      if (event.target !== this.$el && event.target.parentNode !== this.$el) {
        this.isActive = false
      }
    },
    mouseupHandle () {
      if (this.isDrag) {
        this.isDrag = false
      }
    }
  },
  mounted () {
    document.documentElement.addEventListener('mousemove', this.moveHandle)
    document.documentElement.addEventListener('mousedown', this.documentMousedownHandle)
    document.documentElement.addEventListener('mouseup', this.mouseupHandle)
  },
  beforeDestroy () {
    document.documentElement.removeEventListener('mousemove', this.moveHandle)
    document.documentElement.removeEventListener('mousedown', this.documentMousedownHandle)
    document.documentElement.removeEventListener('mouseup', this.mouseupHandle)
  }
}
</script>
<style lang="postcss" scoped>
.element-resizeable {
  &.active:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    outline: 1px dashed #d6d6d6;
  }

  &.active {
    & .drag-stick {
      box-sizing: border-box;
      position: absolute;
      font-size: 1px;
      background: #ffffff;
      border: 1px solid #6c6c6c;
      box-shadow: 0 0 2px #bbb;
      width: 8px;
      height: 8px;
    }

    & .drag-stick-tl {
      cursor: nwse-resize;
      top: -4px;
      left: -4px;
    }
    & .drag-stick-tm {
      left: 50%;
      cursor: ns-resize;
      top: -4px;
      margin-left: -4px;
    }
    & .drag-stick-tr {
      cursor: nesw-resize;
      top: -4px;
      right: -4px;
    }
    & .drag-stick-mr {
      top: 50%;
      cursor: ew-resize;
      margin-top: -4px;
      right: -4px;
    }
    & .drag-stick-br {
      cursor: nwse-resize;
      bottom: -4px;
      right: -4px;
    }
    & .drag-stick-bm {
      cursor: ns-resize;
      left: 50%;
      bottom: -4px;
      margin-left: -4px;
    }
    & .drag-stick-bl {
      cursor: nesw-resize;
      bottom: -4px;
      left: -4px;
    }
    & .drag-stick-ml {
      top: 50%;
      cursor: ew-resize;
      left: -4px;
      margin-top: -4px;
    }
  }
}
</style>
