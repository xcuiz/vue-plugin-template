<template>
  <svg
    viewBox="0 0 100 160">
    <!-- 模糊效果添加 -->
    <defs>
      <!-- 上下实心圆 -->
      <filter id="circle-filter">
        <feGaussianBlur
          in="SourceGraphic"
          stdDeviation="1.6"/>
        <!-- stdDeviation is how much to blur -->
        <feComponentTransfer>
          <feFuncA
            type="linear"
            slope="1"/>
          <!-- slope is the opacity of the shadow -->
        </feComponentTransfer>
        <feMerge>
          <feMergeNode/>
          <!-- this contains the offset blurred image -->
          <feMergeNode in="SourceGraphic" />
          <!-- this contains the element that the filter is applied to -->
        </feMerge>
      </filter>
      <!-- 柱子渐变 -->
      <linearGradient
        x1="0%"
        y1="100%"
        x2="0%"
        y2="0%"
        :id="`gradient-${color}`">
        <stop
          offset="0"
          :stop-color="colorList[5]"
          stop-opacity="0"/>
        <stop
          offset="0.42"
          :stop-color="colorList[5]"
          stop-opacity="0.4"/>
        <stop
          offset="1"
          :stop-color="colorList[6]"
          ref="stop1"
          stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <!-- 底下最内圈 -->
    <ellipse
      class="bottom-fill-ellipse"
      filter="url(#circle-filter)"
      cx="50"
      :fill="colorList[6]"
      cy="134"
      rx="20"
      ry="8"/>
    <!-- 柱子 -->
    <rect
      class="rect"
      ref="rectRef"
      x="30"
      :fill="`url(#gradient-${color})`"
      :y="30 + heightGradient"
      width="40"
      :height="104 - heightGradient"/>
    <!-- 最上面的圆 -->
    <ellipse
      class="top-fill-ellipse"
      cx="50"
      :fill="colorList[5]"
      :cy="30 + heightGradient"
      rx="20"
      ry="8"/>
    <text
      :x="!textX ? 50 : textX"
      :fill="colorList[6]"
      :y="!textY ? 12 + heightGradient : textY"
      text-anchor="middle"
      style="fontWeight: bold"
      dominant-baseline="middle">
      <slot name="text">
        {{data.value}}
      </slot>
    </text>
  </svg>
</template>
<script>
import svgService from '../svg-service.js'
import { getDomStyle } from 'fusion-components/util/dom.js'
/**
 * @cnName 基础立体柱图
 *
 */
export default {
  name: 'idss-bar-svg',
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
    // @propCnName text水平方向显示位置
    textX: {
      type: String,
      default: ''
    },
    // @propCnName text垂直方向显示位置
    textY: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 基色生成
    colorList () {
      return this.generate(this.color)
    }
  },
  watch: {
    'data.value': {
      immediate: true,
      handler: async function (val) {
        await this.$nextTick()
        // 获取柱子高度
        let rectHeight = parseInt(getDomStyle(this.$refs['rectRef'], 'height'))
        if (val <= this.data.total) {
          // 计算高度梯度
          this.heightGradient = rectHeight - parseInt(rectHeight * (val / this.data.total)) || 0
        }
      }
    }
  },
  data () {
    return {
      heightGradient: 0
    }
  }
}
</script>
