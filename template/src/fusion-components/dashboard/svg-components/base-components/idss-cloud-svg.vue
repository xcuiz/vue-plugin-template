<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 1080 690">
    <defs>
      <filter :id="generateId('outer-glow')" x="-50%" y="-50%" width="200%" height="200%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="3"></feMorphology>
        <feGaussianBlur stdDeviation="30" result="dilated"></feGaussianBlur>
        <feFlood :flood-color="filterColorList[3]"></feFlood>
        <feComposite in2="dilated" operator="in"></feComposite>
        <feMerge>
          <feMergeNode></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      <filter :id="generateId('inner-glow')" x="-50%" y="-50%" width="200%" height="200%">
        <feComponentTransfer in=SourceAlpha>
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="100"/>
        <feOffset dx="100" dy="0" result="offsetblur"/>
        <feOffset dx="0" dy="100" result="offsetblur"/>
        <feOffset dx="-80" dy="-80" result="offsetblur"/>
        <feFlood :flood-color="filterColorList[6]" result="color"/>
        <feBlend in="SourceGraphic" in2="floodFill" mode="multiply"/>
        <!-- <feBlend in="SourceGraphic" in2="floodFill" mode="multiply"/>
        <feBlend in="SourceGraphic" in2="floodFill" mode="multiply"/> -->
        <feComposite in2="offsetblur" operator="in"/>
        <feComposite in2="SourceAlpha" operator="in" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode />
          <feMergeNode />
        </feMerge>
      </filter>
    </defs>
    <g class="group">
      <path
        class="cloud outer-glow"
        :style="{fill: colorOption.baseColor}"
        :filter="`url(${generateId('#outer-glow')})`"
        stroke-width="6"
        :stroke="filterColorList[5]"
        d="M978.4 597.6c0-77.6-52-142.4-122.4-160-3.2-121.6-100-219.2-219.2-219.2-69.6 0-132 33.6-172 85.6-22.4-29.6-57.6-48.8-97.6-48.8-68 0-123.2 56.8-123.2 126.4 0 6.4 0.8 12 1.6 17.6-10.4-1.6-20.8-3.2-32-3.2-98.4 0-178.4 81.6-178.4 183.2s80 183.2 178.4 183.2h604.8c88.8 0 160-73.6 160-164.8z"
        transform="translate(30 -150)"/>
      <path
        class="cloud inner-glow"
        :style="{fill: colorOption.baseColor}"
        :filter="`url(${generateId('#inner-glow')})`"
        d="M978.4 597.6c0-77.6-52-142.4-122.4-160-3.2-121.6-100-219.2-219.2-219.2-69.6 0-132 33.6-172 85.6-22.4-29.6-57.6-48.8-97.6-48.8-68 0-123.2 56.8-123.2 126.4 0 6.4 0.8 12 1.6 17.6-10.4-1.6-20.8-3.2-32-3.2-98.4 0-178.4 81.6-178.4 183.2s80 183.2 178.4 183.2h604.8c88.8 0 160-73.6 160-164.8z"
        transform="translate(30 -150)"/>
    </g>
  </svg>
</template>
<script>
import svgService from '../svg-service.js'
const DEFAULT_COLOR = {
  baseColor: '#91e7ff',
  filterColor: '#1890FF'
}
export default {
  name: 'idss-cloud-svg',
  mixins: [svgService],
  props: {
    color: {
      type: Object,
      default () {
        return {
          baseColor: '#7ae0ff',
          filterColor: '#1890FF'
        }
      }
    }
  },
  computed: {
    filterColorList () {
      return this.generate(this.colorOption.filterColor)
    }
  },
  data () {
    return {
      colorOption: Object.assign({}, DEFAULT_COLOR, this.color)
    }
  },
  methods: {
    generateId (param) {
      return `${param}-${this._uid || +new Date()}`
    }
  }
}
</script>
