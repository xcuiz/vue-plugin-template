<template>
  <single-value-layout
    v-bind="$attrs"
    layout="top-bottom"
    class='idss-title-value'
    :data="data"
    :class="className">
    <!-- 标题 -->
    <template slot="verticalTop">
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
    </template>
    <!-- value -->
    <template slot="verticalBottom">
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
    </template>
  </single-value-layout>
</template>
<script>
import service from './title-value-service.js'
export default {
  mixins: [service]
}
</script>

<style>
  @import "./title-value.css";
</style>
