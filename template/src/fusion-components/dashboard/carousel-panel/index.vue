<template>
  <component
    :is="currentTmpl"
    :widgetData="data"
    :type="type"
    :carouselStyle="carouselStyle"
    :option="option"
    v-on="$listeners">
    <template v-slot="scope">
      <slot :data="scope.carouselData"></slot>
    </template>
  </component>
</template>

<script>
/**
 * @name 循环轮播
 * @event {Function} move 轮播触发事件
 * @props {Array} data $$_数据项
 * @props {String} tmplName 模板名称
 * @props {String} type 轮播类型
 * @props {Object} carouselStyle 轮播样式
 * @props {Object} option 轮播配置项
 */
export default {
  name: 'idss-carousel-panel',
  props: {
    data: [Array, Object],
    tmplName: {
      type: String,
      default: 'honeycomb-carousel'
    },
    type: String,
    carouselStyle: Object,
    option: Object
  },
  data () {
    return {
      currentTmpl: null
    }
  },
  methods: {
    loadTmpl () {
      if (!this.tmplName) return null
      return () => import(`./template/${this.tmplName}`)
    }
  },
  mounted () {
    try {
      this.currentTmpl = this.loadTmpl()
    } catch (error) {
      console.error('循环轮播动态组件引入失败！！！请检查')
      this.currentTmpl = () => import(`./template/${this.tmplName}`)
    }
  }
}
</script>
<style lang="postcss" scoped>
</style>
