<template>
  <svg
    class="idss-one-border-circle-svg"
    viewBox="0 0 1024 1024">
    <defs>
      <filter id="filter" primitiveUnits="objectBoundingBox">
        <feGaussianBlur stdDeviation="0.1" result="offset-blur"></feGaussianBlur>
        <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"></feComposite>
        <feFlood :flood-color="colorList[4]" flood-opacity="1" result="color"></feFlood>
        <feComposite operator="in" in="color" in2="inverse" result="shadow"></feComposite>
        <feComposite operator="over" in="shadow" in2="SourceGraphic" result="inset-shadow"></feComposite>
        <feFlood :flood-color="colorList[5]"></feFlood>
        <feComposite in2="offsetblur" operator="in"></feComposite>
        <feMerge>
          <feMergeNode in="inset-shadow"></feMergeNode>
        </feMerge>
      </filter>
    </defs>
    <path
      :fill="fillColorList[9]"
      fill-opacity="0.9"
      filter="url(#filter)"
      d="M512 512m-510.723192 0a510.723192 510.723192 0 1 0 1021.446384 0 510.723192 510.723192 0 1 0-1021.446384 0Z">
    </path>
  </svg>
</template>
<script>
import svgService from '../../svg-service.js'
/**
 * @cnName 圆形组件（只有一个圆）
 *
 */
export default {
  name: 'idss-one-border-circle-svg',
  mixins: [svgService],
  props: {
    // @propCnName 基色修改
    color: {
      type: Object,
      default: function () {
        return {
          fillColor: '#2f54eb',
          lineColor: '#1890ff'
        }
      }
    }
  },
  computed: {
    colorList: function () {
      return this.generate(this.color.lineColor)
    },
    fillColorList: function () {
      return this.generate(this.color.fillColor)
    }
  }
}
</script>
