<template>
  <component v-bind:is="tmpl" v-bind="$attrs" v-on="$listeners">
    <template v-for="(item, name) in $slots">
      <template :slot="name">
        <slot :name="name"></slot>
      </template>
    </template>
  </component>
</template>
<script>
import titleValue from './tmpl/title-value/title-value.vue'
import titleValueHorizontal from './tmpl/title-value/title-value-horizontal.vue'
import titleValueDesc from './tmpl/title-value/title-value-desc.vue'
import titleValueDescVertical from './tmpl/title-value/title-value-desc-vertical.vue'
import panelValueView from './tmpl/panel-value-view.vue'
import progressValueView from './tmpl/progress-value/progress-value-view.vue'
import progressValueReverse from './tmpl/progress-value/progress-value-reverse.vue'
import progressSubvalueView from './tmpl/progress-value/progress-subvalue-view.vue'
/**
 * @cnName 单值组件
 * @props {[object,array]} data $$_单值数据
 */
export default {
  name: 'idss-single-value',
  components: {
    titleValue,
    titleValueHorizontal,
    titleValueDesc,
    titleValueDescVertical,
    panelValueView,
    progressValueView,
    progressValueReverse,
    progressSubvalueView
  },
  props: {
    /**
     * 魔板名称
     * title-value 标题-值显示魔板
     * title-value-horizontal 标题-值显示魔板 左右展示
     * title-value-desc 标题-值-值描述魔板
     * title-value-desc-vertical 标题-值-值描述魔板 左右-下展示布局
     * panel-value-view 四宫格的展示情况，主要拆分为左右两宫格，左右继续拆分两个子宫格
     * progress-value-view 进度条的展示情况，主要拆分为左栏，右侧上下两栏
     * progress-value-reverse 进度条的展示左右翻转情况，主要拆分为左侧上下两栏，右侧一栏
     */
    tmpl: {
      type: String,
      default: 'title-value'
    }
  }
}
</script>
