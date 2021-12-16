<template>
  <div ref="dragContainer" class="idss-drag">
    <div class="idss-drag__target" @mousedown="dragFn" :style="{'width': acLeftWidth + 'px'}">
      <div class="idss-drag__resize" ref="dragFlag"></div>
      <div class="idss-drag__container">
        <slot name="dragTarget"></slot>
      </div>
    </div>
    <div class="idss-drag__aside" :style="{'width': acRightWidth + 'px'}">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * 容器拖拽组件，主要针对左右两栏布局的拖拽，两栏中间通过手柄拖拽操作，是两栏宽度之和永远是父级组件宽度
 * 通过控制左侧一栏的最小宽度控制，而控制左右栏的最小值和最大值
 */
import { throttle } from '../util/base'

export default {
  name: 'idss-drag-container',
  props: {
    // 左侧栏的默认宽度
    width: {
      default: '',
      type: String
    },
    // 左侧栏的最小宽度
    minLeftWidth: {
      default: 300,
      type: Number
    },
    // 右侧栏最小宽度
    minRightWidth: {
      default: 300,
      type: Number
    }
  },
  data () {
    return {
      acLeftWidth: 0,
      acRightWidth: 0
    }
  },
  methods: {
    // 拖拽
    dragFn (e) {
      // 非拖拽标记元素，跳出
      if (e.target !== this.$refs['dragFlag']) return
      // 重新计算最大宽度
      this._setContanierWidth()
      const maxLeftWidth = this.maxLeftWidth
      let width = this.acLeftWidth
      let posX = e.pageX
      const minLeftWidth = this.minLeftWidth
      const _self = this

      this.$dragContainer.onmousemove = throttle((e) => {
        let currentWidth = width + (e.pageX - posX)
        // 设置左右侧栏宽度
        _self._setWidth(_self, currentWidth, minLeftWidth, maxLeftWidth)
      })

      document.onmouseup = () => {
        this.$dragContainer.onmousemove = null
      }
    },
    /**
     * 设置左右栏宽度
     * @param {object<vm>} vm vm实例
     * @param {number} currentWidth 当前左侧栏宽度
     * @param {number} minLeftWidth 做小左侧栏宽度
     * @param {number} maxLeftWidth 最大左侧栏宽度
     */
    _setWidth (vm, currentWidth, minLeftWidth, maxLeftWidth) {
      // 左侧栏大于最大宽度处理
      if (currentWidth > maxLeftWidth) {
        currentWidth = maxLeftWidth
        vm.$dragContainer.onmousemove = null
      } else if (currentWidth < minLeftWidth) {
        // 如果小于最小宽度，停止拖拽
        currentWidth = minLeftWidth
        vm.$dragContainer.onmousemove = null
      }

      vm.acLeftWidth = currentWidth
      vm.acRightWidth = vm.containerWidth - currentWidth
    },

    /**
     * 计算容器宽度和左侧栏最大宽度
     */
    _setContanierWidth () {
      // 左侧栏最大宽度(容器宽度减去右侧最小宽度)
      this.containerWidth = this.$dragContainer.getBoundingClientRect().width
      this.maxLeftWidth = this.containerWidth - this.minRightWidth
    }
  },
  async mounted () {
    // 避免子组件未渲染完成
    await this.$nextTick()
    // 处理初始化时，宽度大小与默认宽度的关系
    this.$dragContainer = this.$refs['dragContainer']  // 拖拽容器
    this._setContanierWidth()
    // 初始化判断，对比最小宽度和默认宽度大小（暂时只读取百分比和px结束的）
    const acLeftWidth = this.width.endsWith('px') ? parseFloat(this.width) : (this.containerWidth * parseFloat(this.width) / 100)
    // 设置左右侧栏宽度
    this._setWidth(this, acLeftWidth, this.minLeftWidth, this.maxLeftWidth)
  }
}
</script>

<style scoped lang='postcss'>
.idss-drag {
  display: flex;
  border: var(--color-line-3,rgba(204,211,217,0.3)) solid var(--line-size-default,1px);
  user-select: none;

  /* tree 左侧树 */
  &__target {
    position: relative;
    border-right: var(--color-line-3,rgba(204,211,217,0.3)) solid var(--line-size-default,1px);
  }

  /* 右侧 表单 */
  &__aside {
    flex-grow: 1;
    flex-shrink: 1;
  }

  /* 拖拽样式条 */
  &__resize {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 10px;
    height: 100%;
    z-index: 1;
    cursor: ew-resize;
  }
  &__container {
    width: calc(100% - 10px);
    height: 100%;
    overflow: hidden;
  }
}
</style>
