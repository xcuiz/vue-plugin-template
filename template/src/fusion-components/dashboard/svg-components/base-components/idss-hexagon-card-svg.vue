<template>
  <svg
    viewBox="0 0 97 108"
    class="idss-hexagon-card"
    v-on="$listeners"
    aria-hidden="true">
    <defs>
      <filter :id="`color-hover-${key}`">
        <feOffset result = "offOut" in = "SourceGraphic" dx = "0" dy = "0"/>
        <feFlood :flood-color="colorList[6]"></feFlood>
        <feGaussianBlur result = "blurOut" in = "offOut" stdDeviation = "1"/>
        <feBlend in = "SourceGraphic" in2 = "blurOut" mode = "normal"/>
      </filter>
      <!-- 中心shadow -->
      <filter :id="`shadow-${key}`">
        <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
        <feOffset dx="0" dy="0" result="offsetblur"/>
        <feFlood :flood-color="colorList[6]"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <!-- 其他shadow -->
      <filter :id="`shadow-light-${key}`">
        <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
        <feOffset dx="0" dy="0" result="offsetblur"/>
        <feFlood :flood-color="colorList[6]"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      <linearGradient :id="`linear-${key}`" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop id="stop1" offset="0%" :stop-color="colorList[7]" />
        <stop id="stop2" offset="100%" :stop-color="colorList[5]"/>
      </linearGradient>
      <linearGradient :id="`linear-op-${key}`" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop id="stop1" offset="0%" :stop-color="colorList[7]" />
        <stop id="stop2" offset="100%" :stop-color="colorList[5]"/>
      </linearGradient>
    </defs>
    <!-- 外层路径 -->
    <g id="outter">
      <!-- 上部分路径 -->
      <g id="outter-top-path" :filter="`url(#shadow-light-${key})`">
        <polyline
          class="outer-line"
          :fill="`url(#linear-${key})`"
          points="54.27 7.97 48.64 4.72 43.01 7.97 42.63 7.32 48.64 3.85 54.65 7.32 54.27 7.97"/>
        <polyline
          class="outer-line"
          :fill="`url(#linear-op-${key})`"
          points="92.58 49.65 91.83 49.65 91.83 29.66 65.53 14.47 65.9 13.82 92.58 29.23 92.58 49.65"/>
        <polyline
          class="outer-line"
          :fill="`url(#linear-op-${key})`"
          points="5.45 49.65 4.7 49.65 4.7 29.23 31.36 13.83 31.73 14.48 5.45 29.66 5.45 49.65"/>
      </g>
      <!-- 下部分路径 -->
      <g id="outter-bottom-path">
        <polyline
          class="outer-line"
          :fill="`url(#linear-op-${key})`"
          points="42.73 101.03 48.36 104.28 53.99 101.03 54.37 101.68 48.36 105.15 42.35 101.68 42.73 101.03"/>
        <polyline
          class="outer-line"
          :fill="`url(#linear-${key})`"
          points="4.42 59.35 5.17 59.35 5.17 79.34 31.48 94.53 31.1 95.18 4.42 79.78 4.42 59.35"/>
        <polyline
          class="outer-line"
          :fill="`url(#linear-${key})`"
          points="91.55 59.35 92.3 59.35 92.3 79.78 65.64 95.17 65.27 94.52 91.55 79.34 91.55 59.35"/>
      </g>
      <!-- 上部分点 -->
      <g id="outter-top-point">
        <circle cx="5" cy="50" r="1.5" :fill="colorList[5]"/>
        <circle cx="32.5" cy="13.5" r="1.5" :fill="colorList[7]"/>
        <circle cx="65" cy="13.5" r="1.5" :fill="colorList[7]"/>
        <circle cx="92" cy="50" r="1.5" :fill="colorList[5]"/>
      </g>
      <!-- 下部分点 -->
      <g id="outter-bottom-point">
        <circle cx="92" cy="59" r="1.5" :fill="colorList[5]"/>
        <circle cx="64.5" cy="95" r="1.5" :fill="colorList[7]"/>
        <circle cx="32" cy="95" r="1.5" :fill="colorList[7]"/>
        <circle cx="5" cy="59" r="1.5" :fill="colorList[5]"/>
      </g>
    </g>
    <!-- 中间路径 -->
    <g id="middle" :filter="`url(#shadow-light-${key})`">
      <polygon class="middle-line"
        :fill="colorToRgba(colorList[5], 0.2)"
        :stroke="`url(#linear-${key})`"
        points="87.73 77.2 87.73 31.99 48.58 9.39 9.43 31.99 9.43 77.2 48.58 99.8 87.73 77.2"/>
    </g>
    <!-- 中心路径 -->
    <g id="center" :filter="`url(#shadow-${key})`">
      <polygon
        class="center-shadow"
        :fill="color"
        points="79.58 72.09 79.58 36.29 48.58 18.39 17.57 36.29 17.57 72.09 48.58 90 79.58 72.09"/>
    </g>
  </svg>
</template>

<script>
import svgService from '../svg-service.js'
/**
 * @cnName 六角卡片组件
 *
 */
export default {
  name: 'idss-hexagon-card-svg',
  mixins: [svgService],
  computed: {
    colorList: function () {
      return this.generate(this.color)
    }
  },
  props: {
    // @propCnName 基色
    color: {
      type: String,
      default: '#7243E9'
    },
    // @propCnName 动画设置
    animation: {
      type: Object,
      default: function () {
        return {
          isAnimate: true,
          delay: 500,
          duration: 4500
        }
      }
    }
  },
  data () {
    return {
      key: Date.now()
    }
  }
}
</script>

<style lang='postcss'>
  .idss-hexagon-card {
    .middle-line, .center-shadow {
      stroke-width:0.75px;
    }
    .outer-line{
      stroke-width:0.38px;
    }
    .card-name {
      font-size: 14px;
      fill: #A8C4D9;
    }
    .card-title {
      font-size: 18px;
      fill: rgba(255, 255, 255, 0.9);
    }
    .card-subTitle {
      font-size: 12px;
      fill: rgba(255, 255, 255, 0.6);
    }
  }
</style>
