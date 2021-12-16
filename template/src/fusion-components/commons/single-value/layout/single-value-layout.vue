<template>
  <div
    class="idss-single-value-layout"
    :class="{'is-stretch': stretch}"
    :style="layoutStyle">
    <!-- 传入空对象是处理 -->
    <div v-if="!Object.keys(data).length || !data" class="vertical-middle text-center">
      {{emptyText}}
    </div>
    <!-- 水平布局 -->
    <div v-else-if="horizontalLayout.indexOf(layout) !== -1" class="horizontal">
      <!-- 左侧布局 -->
      <div class="left">
        <slot name="horizontalLeft" v-if="layout.indexOf('left') !== -1"></slot>
        <!-- 左侧分为上下布局 -->
        <div class="vertical" v-else>
          <div class="top">
            <slot name="verticalTop"></slot>
          </div>
          <div class="bottom">
            <slot name="verticalBottom"></slot>
          </div>
        </div>
      </div>
      <div class="right">
        <!-- 纯右侧布局 -->
        <slot name="horizontalRight" v-if="layout.indexOf('right') !== -1"></slot>
        <!-- 右侧分为上下布局 -->
        <div class="vertical" v-else>
          <div class="top">
            <slot name="verticalTop"></slot>
          </div>
          <div class="bottom">
            <slot name="verticalBottom"></slot>
          </div>
        </div>
      </div>
    </div>
    <!-- 垂直布局 -->
    <div v-else-if="verticalLayout.indexOf(layout) !== -1"  class="vertical">
      <!-- 上侧布局 -->
      <div class="top">
        <slot name="verticalTop" v-if="layout.indexOf('top') !== -1"></slot>
        <!-- 上侧分为左右布局 -->
        <div class="horizontal" v-else>
          <div class="left">
            <slot name="horizontalLeft"></slot>
          </div>
          <div class="right">
            <slot name="horizontalRight"></slot>
          </div>
        </div>
      </div>
      <div class="bottom">
        <!-- 纯下侧布局 -->
        <slot name="verticalBottom" v-if="layout.indexOf('bottom') !== -1"></slot>
        <!-- 下侧分为左右布局 -->
        <div class="horizontal" v-else>
          <div class="left">
            <slot name="horizontalLeft"></slot>
          </div>
          <div class="right">
            <slot name="horizontalRight"></slot>
          </div>
        </div>
      </div>
    </div>
    <!-- 四宫图 -->
    <div class="horizontal" v-else>
      <!-- 左侧布局 -->
      <div class="left">
        <div class="vertical">
          <div class="top">
            <slot name="top"></slot>
          </div>
          <div class="bottom">
            <slot name="left"></slot>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="vertical">
          <div class="top">
            <slot name="right"></slot>
          </div>
          <div class="bottom">
            <slot name="bottom"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'single-value-layout',
  props: {
    /**
     * 组件布局属性
     * 主要分为
     * left-right 左右布局 （slot 分为 horizontalLeft horizontalRight ）
     * top-bottom 上下布局（slot 分为 verticalTop verticalBottom）
     * left-top-bottom 左侧一栏，右侧上下布局（slot 分为 horizontalLeft verticalTop verticalBottom）
     * top-bottom-right 右侧一栏，左侧上下布局（slot 分为 verticalTop verticalBottom horizontalRight)
     * top-left-right 上侧一栏，下侧左右一栏（slot 分为 verticalTop horizontalLeft horizontalRight)
     * left-right-bottom 下侧一栏，上次左右一栏（slot 分为 horizontalLeft horizontalRight verticalBottom)
     * all 四宫格 (slot分为 top left right bottom)
     */
    layout: {
      type: String,
      default: 'left-right'
    },
    stretch: {
      type: Boolean,
      default: false
    },
    layoutStyle: {
      type: Object,
      default: () => ({})
    },
    data: Object,
    emptyText: {
      type: String,
      default: '暂无数据'
    }
  },
  data () {
    return {
      horizontalLayout: ['left-right', 'left-top-bottom', 'top-bottom-right'],
      verticalLayout: ['top-bottom', 'top-left-right', 'left-right-bottom']
    }
  }
}
</script>

<style scoped lang="postcss">
  %flex {
    max-width: 100%;
    overflow: hidden;
    display: inline-flex;
    justify-content: center;
    align-items: stretch;
  }
  /* layout 布局样式 */
  .idss-single-value-layout {
    padding: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: stretch;
    max-width: 100%;
    /* 水平布局 */
    & .horizontal, & .vertical {
      flex-direction: row;
      @extend %flex;
    }
    /* 垂直布局 */
    & .vertical {
      flex-direction: column;
    }
    /* 左右栏 */
    & .left, & .right, & .top, & .bottom {
      flex-grow: 1;
      flex-grow: 1;
      @extend %flex;
    }
    &.is-stretch {
      width: 100%;
      height: 100%;

      & .horizontal, & .vertical {
        width: 100%;
      }
    }
    /* flex 左对齐控制 */
    & .align-left {
      padding-left: 10px;
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: flex-start;
    }
    /* flex 居中对齐 */
    & .vertical-middle {
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
    }
    .paddingL10 {
      padding-left: 10px;
    }
    .text-center {
      text-align: center;
    }
  }
</style>
