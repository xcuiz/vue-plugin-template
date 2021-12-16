<template>
  <svg class="idss-earth-svg"  :id="generateId('curId')"  viewBox="0 0 412 412"  xml:space="preserve">
    <!-- 外发光 start -->
    <defs>
      <filter :id="generateId('outer-glow')" x="-50%" y="-50%" width="200%" height="200%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="3"></feMorphology>
        <feGaussianBlur stdDeviation="20" result="dilated"></feGaussianBlur>
        <feFlood :flood-color="colorToRgba(colorList[4], 0.5)"></feFlood>
        <feComposite in2="dilated" operator="in"></feComposite>
        <feMerge>
          <feMergeNode></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
    </defs>
    <!-- 外发光 end -->
    <!-- 内发光 -->
    <filter :id="generateId('inner-glow')" >
      <feComponentTransfer in=SourceAlpha>
        <feFuncA type="table" tableValues="1 0" />
      </feComponentTransfer>
      <feGaussianBlur stdDeviation="20"/>
      <feOffset dx="0" dy="0" result="offsetblur"/>
      <feFlood :flood-color="colorList[2]" result="color"/>
      <feBlend in="SourceGraphic" in2="floodFill" mode="multiply"/>
      <feComposite in2="offsetblur" operator="in"/>
      <feComposite in2="SourceAlpha" operator="in" />
      <feMerge>
        <feMergeNode />
      </feMerge>
    </filter>
    <!-- 底圆 start -->
    <circle :fill="colorToRgba(colorList[8], 0.8)"  :filter="`url(${generateId('#outer-glow')})`" cx="206" cy="198" r="150"/>
    <circle :fill="colorToRgba(colorList[8], 0.8)"  :filter="`url(${generateId('#inner-glow')})`" cx="206" cy="198" r="150"/>
    <!-- 底圆 end -->
    <!-- 地图镂空背景 start -->
    <path :fill="colorToRgba(colorList[6], 0.2)"  d="M206.2,48.9c-83.2,0-150.7,67.4-150.7,150.6S123,350.1,206.2,350.2s150.7-67.4,150.7-150.6c0,0,0,0,0,0
          C356.9,116.3,289.4,48.9,206.2,48.9z M219.1,59.5c0,0,9.4-5.5,12.7-2.2s14.8-0.5,44.3,17c0,0-6.5,6.9-7.9,6.5
          c0.8,1.5,3.4,6.1,5.2,9c2.2,3.4,2.7,3.7,2.7,3.7l-2.2,3.3l2.2,0.6c-2.2-0.6-3.3,6-6.5,7.1s1,7.1-0.1,8.2c-1.1,1.1,0.5,10.9,0,16.8
          c-0.6,5.8-2.7,0.8-5.5,0c-2.7-0.8-7.1-2.5-7.5-4.2c-0.4-1.6-1.3-6.6-0.2-9.3c1.1-2.7-3.3-5.5-5.5-7.5s-10.9,0.4-12.6,0
          s-2.7-5.1-2.7-9.5s7.7,0.5,12,0s5-11.5,5-11.5l-0.2-9.3c-1.8-0.7-2.1-1.6,0.8-2.8c0,0-9.3-2.2-11.5,2.7s-3.3,4.4-3.8,9.3
          s-9.1,0.6-11.1,0s-7.5-7.2-7.5-7.2c1.6-3.8,2.7-6.6,2.7-6.6l-2.9-6.6L219.1,59.5z M132.7,110.4c0.9-1.2,7.1-12,14.8-8.8
          c7.7,3.2,12.6-3.8,12.6-3.8S171.4,86.3,172,88l0.7,1.6c-0.7-1.6,9.3-4.4,10.4,1.1s7.7,8.2,7.7,8.2s-3.8,6.6-2.7,11.5
          s4.9,6,2.7,10.4s-6.6,6-7.7,8.2c-1.1,2.2-10.1-7.1-11.1-10.4s-5.8-6.6-9.9-5.5s-15.1,3.8-17.3,2.7S130.2,113.9,132.7,110.4z
          M279.4,271.3c-4.4,11.5-14.8,31.2-20.2,36.7c-5.5,5.5-12,15.9-17,19.7s-4.9,11-10.9,10.4s-13.1-17.5-11.5-21.9s-30.1-12-30.1-12
          s-13.7-1.7-16.4-28c-0.5-4.7-0.8-8-1-10.3c-4.1-1.8-20.2-8.5-30.2-6.1c-11.5,2.7-14.2-3.6-24.1-5.1L101,239
          c0,0-27.9-32.3-24.6-37.8c3.3-5.5,3.3-20.2,3.8-23.5c0.6-3.3-4.4-24.1-4.1-26.8c0.3-2.7-4.1-13.1-4.1-13.1s10.4-21.9,12-21.9
          s7.7,18.6,13.7,19.2s22.4-0.6,24.9-3.3c2.5-2.7,4.7-6,7.4-6c2.7,0,2.7-1.7,7.7,0.5s10.4,5.5,12.6,8.8c2.2,3.3-1.6,9.9,9.9,9.9
          s11.5-2.7,13.1,4.9s3.6,24.6-1.2,25.7s-19,17.8-17.9,23.1s1.1,13.6-1.1,18.5s-3.8,6.6-12,6s-15.2-4.9-17.4,1.6s-6.6,21.4,1,19.9
          c0,0,12-3.7,16.4,0s32.3,15.7,32.3,15.7s25.2-27.4,64.6-9.9l6.6,4.4l10.9-2.4c0,0,14.2-4.2,19.2-3.1l4.9,1.1v-2.2
          C279.4,248.3,283.8,259.8,279.4,271.3L279.4,271.3z M343.4,208.9c0,0-3.3-4.9-3.3-10.1s-3.8-4.7-3.8-11.2s-4.9-4.4-8.2-8.8
          s-4.9,1.6-7.7,2.2s-2.2,4.9-4.9,10.1s-9.9,8.5-12,7.5s-10.4-8.3-10.9-10s-11.5-10.9-11.2-13.1s-3-13.7-5.2-19.2c-2.2-5.5,0-27,0-27
          c-3.3-1.9,30.1-15.7,25.7-17.3s-6.6-19.7-6.6-19.7l15.9,8.2c16,8.2,36.1,73.3,36.1,73.3v18.6L343.4,208.9z"/>
    <!-- 地图镂空背景 end -->
  </svg>
</template>
<script>
/**
 * @cnName 地球svg组件
 *
 */
import svgService from '../svg-service.js'
export default {
  name: 'idss-earth-svg',
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
  },
  data () {
    return {}
  }
}
</script>
