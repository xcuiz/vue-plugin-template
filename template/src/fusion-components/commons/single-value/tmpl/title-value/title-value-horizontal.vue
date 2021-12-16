<template>
  <single-value-layout
    v-bind="$attrs"
    layout="left-right"
    class='idss-title-value'
    :data="data"
    :class="className">
    <!-- 标题 -->
    <div slot="horizontalLeft" class="vertical-middle">
      <slot name="title" v-if="$slots.title"></slot>
      <idss-tooltip
        v-else
        :content="`${data.name}`"
        placement="top"
        :over-width-display="true">
        <div class="idss-title-value_title ellipsis" :style="titleStyle">
          {{data.name}}
        </div>
      </idss-tooltip>
    </div>
    <!-- value -->
    <div slot="horizontalRight" class="vertical-middle paddingL10">
      <slot name="value" v-if="$slots.value"></slot>
      <idss-tooltip
        v-else
        :content="`${data.value}`"
        placement="top"
        :over-width-display="true">
        <div class="idss-title-value_value ellipsis" :style="valueStyle">
          {{data.value}}
        </div>
      </idss-tooltip>
    </div>
  </single-value-layout>
</template>
<script>
import service from './title-value-service.js'
export default {
  mixins: [service]
}
</script>

<style lang="postcss">
  @import "./title-value.css";
  .idss-title-value {
    & .idss-title-value_title {
      padding-bottom: 0;
    }
  }
</style>
