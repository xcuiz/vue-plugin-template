<template>
  <svg
    viewBox="0 0 520 240">
    <defs>
      <linearGradient
        :id="`one-gradient-${colorList[5]}`"
        y1="0%"
        x2="0%"
        y2="100%"
        gradientUnits="userSpaceOnUse">
        <stop
          offset="0"
          :stop-color="colorList[5]"
          stop-opacity="0%"/>
        <stop
          offset="25%"
          :stop-color="colorList[5]"
          stop-opacity="30%"/>
        <stop
          offset="50%"
          :stop-color="colorList[5]"
          stop-opacity="40%"/>
      </linearGradient>
      <linearGradient
        :id="`two-gradient-${colorList[5]}`"
        y1="0%"
        x2="0%"
        y2="100%">
        <stop
          offset="0"
          :stop-color="colorList[5]"
          stop-opacity="0%"/>
        <stop
          offset="25%"
          :stop-color="colorList[5]"
          stop-opacity="30%"/>
        <stop
          offset="50%"
          :stop-color="colorList[5]"
          stop-opacity="60%"/>
      </linearGradient>
      <linearGradient
        :id="`three-gradient-${colorList[5]}`"
        y1="0%"
        x2="0%"
        y2="100%">
        <stop
          offset="0"
          :stop-color="colorList[5]"
          stop-opacity="0%"/>
        <stop
          offset="25%"
          :stop-color="colorList[5]"
          stop-opacity="30%"/>
        <stop
          offset="50%"
          :stop-color="colorList[5]"
          stop-opacity="80%"/>
      </linearGradient>
      <filter :id="`idss-three-seat-svg-${colorList[5]}`" x="-50%" y="-50%" width="200%" height="200%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="3"></feMorphology>
        <feGaussianBlur stdDeviation="6" result="dilated"></feGaussianBlur>
        <feFlood :flood-color="colorList[5]"></feFlood>
        <feComposite in2="dilated" operator="in"></feComposite>
        <feMerge>
          <feMergeNode></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    </defs>
    <!-- 最外层圆 -->
    <ellipse
      :fill="bgColorList[5]"
      :stroke="`url(#one-gradient-${colorList[5]})`"
      :filter="`url(#idss-three-seat-svg-${colorList[5]})`"
      class="one-ellipse"
      cx="246"
      stroke-width="0.2%"
      cy="110"
      rx="246"
      ry="109"/>
    <!-- 次外层圆 -->
    <ellipse
      :fill="bgColorList[5]"
      :stroke="`url(#two-gradient-${colorList[5]})`"
      :filter="`url(#idss-three-seat-svg-${colorList[5]})`"
      class="two-ellipse"
      stroke-width="0.3%"
      cx="246"
      cy="94"
      rx="177"
      ry="77"/>
    <!-- 最内层圆 -->
    <ellipse
      :fill="bgColorList[5]"
      :filter="`url(#idss-three-seat-svg-${colorList[5]})`"
      stroke-width="0.4%"
      :stroke="`url(#three-gradient-${colorList[5]})`"
      class="three-ellipse"
      cx="246"
      cy="85"
      rx="118"
      ry="52"/>
  </svg>
</template>
<script>
import svgService from '../../svg-service.js'
/**
 * @cnName 圆形底座（三个圆组成）
 *
 */
export default {
  name: 'idss-three-seat-svg',
  mixins: [svgService],
  props: {
    // @propCnName 基色设置
    color: {
      type: Object,
      default: function () {
        return {
          bgColor: '#2f54eb',
          lineColor: '#1890ff'
        }
      }
    }
  },
  computed: {
    bgColorList: function () {
      return this.generate(this.color.bgColor)
    },
    colorList: function () {
      return this.generate(this.color.lineColor)
    }
  }
}
</script>
<style scoped lang="postcss">
>>> .one-ellipse,
>>> .two-ellipse,
>>> .three-ellipse {
  transform: translate(12px, 12px);
  fill-opacity: 0.1
}
</style>
