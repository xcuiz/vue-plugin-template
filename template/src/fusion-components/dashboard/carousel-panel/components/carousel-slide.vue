<template>
  <div class="carousel-slide" :style="style">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'idss-carousel-slide',
  data () {
    return {
      // 轮播项样式. 在父组件内设置, 父组件根据数据索引动态控制样式显示
      baseStyle: {},                                // 基础样式
      variableStyle: {}                             // 轮播动态样式
    }
  },
  computed: {
    style () {
      return Object.assign({}, this.baseStyle, this.variableStyle)
    }
  }
}
</script>
<style scoped lang="postcss">
.carousel-slide {
  position: absolute;
  left: 0;
  top: 0;
  width: inherit;
  height: inherit;
}
</style>
