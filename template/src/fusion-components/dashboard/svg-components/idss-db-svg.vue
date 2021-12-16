<template>
  <svg
    v-if="svgName.startsWith('#')"
    class="idss-db-svg"
    aria-hidden="true">
    <use :xlink:href="svgName"></use>
  </svg>
  <component
    v-else
    :is="svgName"
    v-on="$listeners"
    :color="color"
    :animation="animation">
  </component>
</template>
<script>
import { componentObj } from './base-components/index.js'
/**
 * @cnName 大屏svg基础组件容器
 * @event all 对于事件目前主要通过vOn="$listeners"传入组件内部
 */
export default {
  name: 'idss-db-svg',
  props: {
    // @propCnName 具体svg组件名称
    name: {
      type: String,
      default: ''
    },
    /**
     * @propCnName 颜色修改
     * @propDesc 针对组件渐变或者填充色等基色修改
     */
    color: [String, Object],
    // @propCnName 用于组件动画
    animation: Object
  },
  computed: {
    svgName: function () {
      let name = componentObj[this.name] ? this.name : `#icon-${this.name}`
      return name
    }
  }
}
</script>
