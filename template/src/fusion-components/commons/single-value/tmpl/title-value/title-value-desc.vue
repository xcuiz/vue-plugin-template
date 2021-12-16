<template>
  <single-value-layout
    v-bind="$attrs"
    layout="top-left-right"
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
    <template slot="horizontalLeft">
      <slot name="value" v-if="$slots.value"></slot>
      <idss-tooltip
        v-else
        :content="`${data.value}`"
        placement="top"
        :over-width-display="true">
        <div class="idss-title-value_value ellipsis vertical-middle paddingL10" :style="valueStyle">
          {{data.value}}
        </div>
      </idss-tooltip>
    </template>
    <!-- 描述 -->
    <template slot="horizontalRight">
      <slot name="desc" v-if="$slots.desc"></slot>
      <idss-tooltip
        v-else
        :content="`${data.desc}`"
        placement="top"
        :over-width-display="true">
        <div class="idss-title-value_desc ellipsis vertical-middle paddingL10" :style="descStyle">
          {{data.desc}}
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
