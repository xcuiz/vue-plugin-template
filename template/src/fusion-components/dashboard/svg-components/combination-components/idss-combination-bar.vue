<template>
  <div class="idss-combination-bar-container">
    <!-- 柱图组件 -->
    <idss-bar-svg
      v-bind="$attrs"
      class="combination-bar-svg bar-svg">
      <template slot="text">
        <slot name="text"></slot>
      </template>
    </idss-bar-svg>
    <!-- 基础底座组件 -->
    <idss-db-svg
      v-bind="$attrs"
      name="idss-two-seat-svg"
      class="combination-bar-svg seat-svg">
    </idss-db-svg>
  </div>
</template>
<script>
/**
 * @cnName 组合立体柱图组件
 * @props {Object} data $$_立体柱图数据
 * @props {String} color 基色修改
 * @props {String} textY 展示内容垂直方向的距离
 * @props {String} textX 展示内容水平方向的距离
 * @props {String} name 基础svg组件名称
 * @props {Object} animation 动画
 * @slot text 自定义文本内容
 */
import { IdssDbSvg, IdssBarSvg } from './../../index.js'
export default {
  name: 'idss-combination-bar',
  components: { IdssDbSvg, IdssBarSvg }
}
</script>
<style scoped lang="postcss">
.idss-combination-bar-container{
  position: relative;
  height:100%;
  display: flex;
  justify-content: center;
  & .combination-bar-svg {
    position: absolute;
  }
  & .bar-svg {
    height:70%;
    z-index:2;
    top:14%;
  }
  & .seat-svg {
    height: 27.5%;
    bottom: 14%;
  }
}
</style>
