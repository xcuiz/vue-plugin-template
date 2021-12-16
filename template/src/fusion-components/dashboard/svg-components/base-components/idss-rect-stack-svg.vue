
<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 419 544">
    <defs>
      <linearGradient
        :id="generateId('back')"
        x1="209.5"
        y1="478.04"
        x2="209.5"
        y2="19.45"
        gradientUnits="userSpaceOnUse">
        <stop offset="0" :stop-color="color" stop-opacity="0" />
        <stop offset="0.07" :stop-color="color" stop-opacity="0.21" />
        <stop offset="0.16" :stop-color="color" stop-opacity="0.45" />
        <stop offset="0.25" :stop-color="color" stop-opacity="0.65" />
        <stop offset="0.33" :stop-color="color" stop-opacity="0.8" />
        <stop offset="0.4" :stop-color="color" stop-opacity="0.91" />
        <stop offset="0.47" :stop-color="color" stop-opacity="0.98" />
        <stop offset="0.52" :stop-color="color" />
        <stop offset="0.56" :stop-color="color" stop-opacity="0.97" />
        <stop offset="0.62" :stop-color="color" stop-opacity="0.9" />
        <stop offset="0.69" :stop-color="color" stop-opacity="0.77" />
        <stop offset="0.78" :stop-color="color" stop-opacity="0.6" />
        <stop offset="0.87" :stop-color="color" stop-opacity="0.38" />
        <stop offset="0.96" :stop-color="color" stop-opacity="0.12" />
        <stop offset="1" :stop-color="color" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="generateId('front')" x1="205.5" y1="478.04" x2="205.5" y2="0" :xlink:href="generateId('#back')" />
      <linearGradient
        :id="generateId('middle')"
        x1="203.17"
        y1="478.04"
        x2="203.17"
        y2="19.45"
        :xlink:href="generateId('#back')"/>
    </defs>
    <g>
      <rect class="rect front" x="128.93" width="153.14" height="478.04" :fill="`url(${generateId('#front')})`">
        <animate
          attributeName="opacity"
          attributeType="CSS"
          begin="0s"
          keyTimes="0;0.5;1"
          values="0.3;0.1;0.3"
          dur="3.0s"
          repeatCount="indefinite"/>
      </rect>
      <rect
        class="rect middle"
        x="82.01"
        y="19.45"
        width="242.31"
        height="458.59"
        :fill="`url(${generateId('#middle')})`">
        <animate
          attributeName="opacity"
          attributeType="CSS"
          begin="1s"
          keyTimes="0;0.5;1"
          values="0.2;0.1;0.2"
          dur="3.0s"
          repeatCount="indefinite"/>
      </rect>
      <rect
        class="rect back"
        x="34.98"
        y="19.45"
        width="349.04"
        height="458.59"
        :fill="`url(${generateId('#back')})`">
        <animate
          attributeName="opacity"
          attributeType="CSS"
          begin="2s"
          keyTimes="0;0.5;1"
          values="0.2;0.1;0.2"
          dur="3.0s"
          repeatCount="indefinite"/>
      </rect>
    </g>
  </svg>
</template>
<script>
import svgService from '../svg-service.js'
export default {
  name: 'idss-rect-stack-svg',
  mixins: [svgService],
  props: {
    color: {
      type: String,
      default: '#2F54EB'
    }
  },
  methods: {
    generateId (param) {
      return `${param}-${this._uid || +new Date()}`
    }
  }
}
</script>
<style scoped lang="postcss">
.rect {
  opacity: 0.2;
}
</style>
