<template>
  <svg
    viewBox="0 0 1024 770">
    <defs>
      <linearGradient
        :id="`Gradient-${color}`"
        x1="0"
        x2="0"
        y1="0"
        y2="1">
        <stop offset="0%" :stop-color="colorList[2]"/>
        <stop offset="100%" :stop-color="colorList[5]"/>
      </linearGradient>
      <!-- 内阴影 -->
      <filter :id="`inner-filter-${color}`">
        <feComponentTransfer in=SourceAlpha>
          <feFuncA type="table" tableValues="10 0" />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="5"/>
        <feOffset dx="-10" dy="10" result="offsetblur"/>
        <feFlood
          :flood-color="colorList[1]"
          result="color"
          flood-opacity="0.5"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feComposite in2="SourceAlpha" operator="in" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode />
        </feMerge>
      </filter>
      <!-- 外阴影 -->
      <filter :id="`outer-filter-${color}`">
        <feMorphology in="SourceAlpha" operator="dilate" radius="3"></feMorphology>
        <feGaussianBlur stdDeviation="20" result="dilated"></feGaussianBlur>
        <feFlood :flood-color="colorList[9]"></feFlood>
        <feComposite in2="dilated" operator="in"></feComposite>
        <feMerge>
          <feMergeNode></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    </defs>
    <path
      :fill="`url(#Gradient-${color})`"
      style="transform: translateY(-16%)"
      :filter="`url(#outer-filter-${color})`"
      d="M36.266667 631.466667c0 102.4 74.666667 185.6 166.4 185.6H832c102.4 0 185.6-91.733333 185.6-206.933334S936.533333 405.333333 832 405.333333c-10.666667 0-21.333333 2.133333-34.133333 2.133334 0-6.4 2.133333-14.933333 2.133333-21.333334 0-78.933333-57.6-142.933333-128-142.933333-40.533333 0-76.8 21.333333-100.266667 55.466667-42.666667-59.733333-106.666667-98.133333-179.2-98.133334-123.733333 0-224 108.8-228.266666 247.466667-72.533333 25.6-128 98.133333-128 183.466667z">
    </path>
    <path
      :fill="`url(#Gradient-${color})`"
      style="transform: translateY(-16%)"
      :filter="`url(#inner-filter-${color})`"
      d="M36.266667 631.466667c0 102.4 74.666667 185.6 166.4 185.6H832c102.4 0 185.6-91.733333 185.6-206.933334S936.533333 405.333333 832 405.333333c-10.666667 0-21.333333 2.133333-34.133333 2.133334 0-6.4 2.133333-14.933333 2.133333-21.333334 0-78.933333-57.6-142.933333-128-142.933333-40.533333 0-76.8 21.333333-100.266667 55.466667-42.666667-59.733333-106.666667-98.133333-179.2-98.133334-123.733333 0-224 108.8-228.266666 247.466667-72.533333 25.6-128 98.133333-128 183.466667z">
    </path>
  </svg>
</template>
<script>
/**
 * @cnName 云组件
 *
 */
import svgService from '../svg-service.js'
export default {
  name: 'idss-3D-cloud-svg',
  mixins: [svgService],
  props: {
    // @propCnName 基色
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  computed: {
    colorList: function () {
      return this.generate(this.color)
    }
  }
}
</script>
