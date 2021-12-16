<template>
  <components v-bind:is="tmpl" v-bind="$attrs" ></components>
</template>
<script>

import stepsDefault from './tmpl/steps-default'
import stepsList from './tmpl/steps-list'
import stepsTable from './tmpl/steps-table'
export default {
  name: 'idss-steps-view',
  components: {
    stepsDefault,
    stepsList,
    stepsTable
  },
  props: {
    /* 定义 模版类型，默认使用 ElementUI 的步骤条 */
    tmpl: {
      type: String,
      default: 'steps-default'
    }
  }
}
</script>
