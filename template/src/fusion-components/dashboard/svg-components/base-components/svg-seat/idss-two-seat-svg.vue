<template>
  <svg
    viewBox="0 0 130 60">
    <!-- 模糊效果添加 -->
    <defs>
      <!-- 上下实心圆 -->
      <filter id="circle-filter">
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation="1.5"/>
        <!-- stdDeviation is how much to blur -->
        <feComponentTransfer>
          <feFuncA
            type="linear"
            slope="2"/>
          <!-- slope is the opacity of the shadow -->
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <!-- this contains the offset blurred image -->
          <feMergeNode in="SourceGraphic" />
          <!-- this contains the element that the filter is applied to -->
        </feMerge>
      </filter>
      <linearGradient
        :id="`circle-linear-${color}`"
        gradientUnits="userSpaceOnUse">
        <stop
          offset="0"
          :stop-color="colorList[5]"
          stop-opacity="0%"/>
        <stop
          offset="25%"
          :stop-color="colorList[5]"
          stop-opacity="10%"/>
        <stop
          offset="40%"
          :stop-color="colorList[5]"
          stop-opacity="80%"/>
        <stop
          offset="50%"
          :stop-color="colorList[5]"
          stop-opacity="100%"/>
        <stop
          offset="60%"
          :stop-color="colorList[5]"
          stop-opacity="80%"/>
        <stop
          offset="75%"
          :stop-color="colorList[5]"
          stop-opacity="10%"/>
        <stop
          offset="100%"
          :stop-color="colorList[5]"
          stop-opacity="0%"/>
      </linearGradient>
    </defs>
    <!-- 底下最外圈 -->
    <ellipse
      class="stroke-dasharray-ellipse"
      filter="url(#circle-filter)"
      :stroke="`url(#circle-linear-${color})`"
      :style="`animationDuration: ${animation.duration}s`"
      cx="65"
      cy="31"
      rx="46"
      ry="22"/>
    <!-- 底下次外圈 -->
    <ellipse
      class="stroke-width-ellipse"
      cx="65"
      :stroke="colorList[7]"
      cy="31"
      rx="33"
      ry="14"/>
    <!-- 底下最内圈 -->
    <ellipse
      class="bottom-fill-ellipse"
      filter="url(#circle-filter)"
      cx="65"
      :fill="colorList[6]"
      cy="31"
      rx="20"
      ry="8"/>
  </svg>
</template>
<script>
import svgService from '../../svg-service.js'
/**
 * @cnName 圆形底座（两个圆组成）
 *
 */
export default {
  name: 'idss-two-seat-svg',
  mixins: [svgService],
  props: {
    // @propCnName 组件数据，用于处理计算高度
    data: {
      type: Object,
      default: function () {
        return {
          value: 0,
          total: 0
        }
      }
    },
    // @propCnName 基色
    color: {
      type: String,
      default: '#0cbcec'
    },
    // @propCnName 组件动画
    animation: {
      type: Object,
      default: function () {
        return {
          duration: 5
        }
      }
    }
  },
  computed: {
    // 基色生成
    colorList () {
      return this.generate(this.color)
    }
  }
}
</script>

<style scoped lang="postcss">
@keyframes animate-stroke-dashoffset {
  0% {
    stroke-dashoffset: 0%;
  }
  25% {
    stroke-dashoffset: 25%;
  }
  50% {
    stroke-dashoffset: 50%;
  }
  75% {
    stroke-dashoffset: 75%;
  }
  100% {
    stroke-dashoffset: 100%;
  }
}
.stroke-dasharray-ellipse {
  animation-name: animate-stroke-dashoffset;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.stroke-dasharray-ellipse,
.stroke-width-ellipse {
  fill: none;
}
.stroke-dasharray-ellipse {
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 42;
}
.stroke-width-ellipse {
  stroke-miterlimit: 10;
}
</style>
