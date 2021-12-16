<template>
  <svg
    viewBox="0 0 128 128"
    class="idss-two-circle-card border-circle"
    aria-hidden="true"
    v-on="$listeners">
    <defs>
      <filter :id="`shadow-${key}`">
        <feGaussianBlur in="SourceAlpha" stdDeviation="5"/>
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
    <circle class="line" :stroke="colorToRgba(colorList[5], 0.3)" cx="64" cy="60" r="54" :fill="colorToRgba(colorList[5], 0.2)" :filter="`url(#shadow-${key})`"/>
    <!-- 内圈 -->
    <g id='center'>
      <circle class="line" :stroke="colorToRgba(colorList[5], 0.3)" cx="64" cy="60" r="44"  :fill="color"/>
    </g>
  </svg>
</template>

<script>
import svgService from '../../svg-service.js'
import svgCircleService from './svg-circle-service.js'
/**
 * @cnName 圆形组件（两个圆）
 *
 */
export default {
  name: 'idss-two-border-circle-svg',
  mixins: [svgService, svgCircleService]
}
</script>
