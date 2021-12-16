<template>
  <svg
    viewBox="0 0 120 120"
    class="idss-three-border-circle border-circle"
    aria-hidden="true"
    v-on="$listeners">
    <defs>
      <filter :id="`shadow-${key}`">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
        <feOffset dx="0" dy="0" result="offsetblur"/>
        <feFlood :flood-color="colorList[5]"/>
        <feComposite in2="offsetblur" operator="in"/>
        <feMerge>
          <feMergeNode/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <!-- 外圈 -->
    <circle class="line" :stroke="colorToRgba(colorList[5], 0.3)" cx="60" cy="60" r="54" :fill="colorToRgba(colorList[5], 0.2)" :filter="`url(#shadow-${key})`"/>
    <!-- 中圈 -->
    <circle class="line" :stroke="colorToRgba(colorList[5], 0.3)" cx="60" cy="60" r="44" :fill="colorToRgba(colorList[5], 0.2)"/>
    <!-- 内圈 -->
    <g id='center'>
      <circle class="line" :stroke="colorToRgba(colorList[5], 0.3)" cx="60" cy="60" r="32" :fill="color"/>
    </g>
  </svg>
</template>

<script>
import svgService from '../../svg-service.js'
import svgCircleService from './svg-circle-service.js'
/**
 * @cnName 圆形组件（三个圆）
 *
 */
export default {
  name: 'idss-three-border-circle-svg',
  mixins: [svgService, svgCircleService]
}
</script>
<style scoped lang="postcss">
.border-circle {
  >>> .line {
    stroke-width: 0.38px;
  }
  >>> .card-name {
    font-size: 30px;
    fill: rgba(255, 255, 255, 0.9);
  }
}
</style>
