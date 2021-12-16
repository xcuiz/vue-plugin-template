<template>
  <single-value-layout
    v-bind="$attrs"
    layout="top-bottom-right"
    :data="data"
    class='idss-progress-value-view'
    :class="isHiddenBorder ? 'no-border' : ''">
    <!-- 标题 -->
    <div slot="verticalTop" class="align-left">
      <slot name="name" v-if="$slots.name"></slot>
      <idss-tooltip
        v-else
        :content="`${data.name}`"
        placement="top"
        :over-width-display="true">
        <div class="idss-progress-value-view_name ellipsis" :style="nameStyle">
          {{data.name}}
        </div>
      </idss-tooltip>
    </div>
    <!-- value -->
    <div slot="verticalBottom"  class="align-left">
      <slot name="value" v-if="$slots.value"></slot>
      <idss-tooltip
        v-else
        :content="`${data.value}${data.unit}`"
        placement="top"
        :over-width-display="true">
        <span class="ellipsis" :style="valueStyle">
          <label class="idss-progress-value-view_value">{{data.value | formatNumber}}</label>
          <label class="idss-progress-value-view_unit">{{data.unit}}</label>
        </span>
      </idss-tooltip>
    </div>
    <!-- 右侧进度条描述 -->
    <template slot="horizontalRight">
      <slot name="desc" v-if="$slots.desc"></slot>
      <!-- 百分比模板处理 -->
      <div
        v-else
        class="idss-progress-value-view__progress"
        :style="{width: width + 'px', height: width + 'px'}">
        <el-progress
          custom
          :width="width" type="circle"
          :stroke-width="strokeWidth"
          :color="strokeColor"
          :percentage="Number(data.percent)">
        </el-progress>
        <idss-tooltip
          :content="`${data.percentName}`"
          placement="top"
          :over-width-display="true">
          <span class="idss-progress-value-view_percent-name ellipsis"
            :style="{maxWidth: width - 15 + 'px', descStyle}">
            {{data.percentName}}
          </span>
        </idss-tooltip>
      </div>
    </template>
  </single-value-layout>
</template>
<script>
import service from './progress-value-view-service.js'
import { IdssTooltip } from './../../../index.js'
export default {
  mixins: [service],
  components: { IdssTooltip }
}
</script>

<style scoped lang="postcss">
  @import "./progress-value.css";
</style>
