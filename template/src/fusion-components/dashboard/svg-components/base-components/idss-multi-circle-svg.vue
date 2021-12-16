<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 612 612">
    <defs>
      <linearGradient :id="generateId('big')">
        <stop offset="0" :stop-color="color" stop-opacity="0.8" />
        <stop offset="0.5" :stop-color="color" stop-opacity="0" />
        <stop offset="1" :stop-color="color" stop-opacity="0.8" />
      </linearGradient>
      <linearGradient :id="generateId('small')">
        <stop offset="0" :stop-color="color" stop-opacity="0" />
        <stop offset="0.5" :stop-color="color" stop-opacity="0.6" />
        <stop offset="1" :stop-color="color" stop-opacity="0" />
      </linearGradient>
      <linearGradient :id="generateId('smaller')">
        <stop offset="0" :stop-color="color" stop-opacity="0.7" />
        <stop offset="0.5" :stop-color="color" stop-opacity="0.3" />
        <stop offset="1" :stop-color="color" stop-opacity="0.7" />
      </linearGradient>
      <linearGradient :id="generateId('smallest')">
        <stop offset="0" :stop-color="color" stop-opacity="0.6" />
        <stop offset="0.3" :stop-color="color" stop-opacity="0" />
        <stop offset="0.6" :stop-color="color" stop-opacity="0" />
        <stop offset="1" :stop-color="color" stop-opacity="0.6" />
      </linearGradient>
    </defs>
    <circle
      class="biggest circle"
      stroke-width="2"
      cx="306"
      cy="306"
      r="291"
      :style="{stroke: `${color}`}"/>
    <ellipse
      class="bigger circle"
      cx="305.91"
      cy="305.85"
      rx="249.82"
      ry="250.28"
      :style="{stroke: `${color}`}"/>
    <ellipse
      class="big circle"
      cx="306"
      cy="306"
      rx="241"
      ry="241.31"
      :style="{stroke: `url(${generateId('#big')})`}"/>
    <ellipse
      class="small circle"
      cx="306"
      cy="306"
      rx="206.47"
      ry="206.86"
      :style="{stroke: `url(${generateId('#small')})`}"/>
    <ellipse
      class="smaller smaller-first circle"
      cx="306.64"
      cy="308.64"
      rx="184"
      ry="184.24"
      :style="{stroke: `url(${generateId('#smaller')})`}"/>
    <ellipse
      class="smaller smaller-second circle"
      cx="304.74"
      cy="302.74"
      rx="184"
      ry="184.34"
      :style="{stroke: `url(${generateId('#smaller')})`}"/>
    <ellipse
      class="smallest circle"
      cx="306"
      cy="306"
      rx="147.63"
      ry="147.83"
      :style="{stroke: `url(${generateId('#smallest')})`}"/>
  </svg>
</template>
<script>

import svgService from '../svg-service.js'
export default {
  name: 'idss-multi-circle-svg',
  mixins: [svgService],
  props: {
    color: {
      type: String,
      default: '#1890FF'
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
.circle {
  fill: none;
  stroke: #000;
  transform-origin: center;
}
/* 公共的写上面，自定义的写下面；从而自定义的可以覆盖公共的 */
.big,
.biggest,
.small,
.smallest {
  stroke-miterlimit: 10;
}
/* 公共的样式写最上面，自定义的写下面；从而自定义的可以覆盖公共的 */
.bigger,
.big,
.small,
.smaller,
.smallest {
  animation-name: rotate-ccw;
  animation-duration: 48s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}
.biggest {
  animation-name: rotate-cw;
  animation-duration: 60s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  stroke-width: 30px;
  stroke-dasharray: 4 6;
  opacity: 0.4;
}
.bigger {
  stroke-linejoin: round;
  stroke-width: 16px;
  stroke-dasharray: 90 300;
  opacity: 0.3;
}
.small {
  stroke-width: 10px;
  stroke-dasharray: 10 10;
}
.smaller-first {
  animation-name: rotate-cw;
  animation-duration: 10s;
}
.smallest {
  animation-duration: 10s;
  stroke-width: 4px;
}
@keyframes rotate-cw {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}
@keyframes rotate-ccw {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(-360deg);
  }
}
</style>
