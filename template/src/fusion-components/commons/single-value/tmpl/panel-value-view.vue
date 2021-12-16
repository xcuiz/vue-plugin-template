<template>
  <single-value-layout
    v-bind="$attrs"
    layout="all"
    :data="data"
    class='panel-value-view'
    :class="isHiddenBorder ? 'no-border' : ''">
    <!-- 左标题 -->
    <template slot="top">
      <slot name="leftTitle" v-if="$slots.leftTitle"></slot>
      <idss-tooltip
        v-else
        :content="`${data.leftTitle}`"
        placement="top"
        :over-width-display="true">
        <span class="panel-value-view_name ellipsis" :style="leftTitleStyle">
          {{data.leftTitle}}
        </span>
      </idss-tooltip>
    </template>
    <!-- 左标题描述 -->
    <template slot="left">
      <slot name="leftTitleDesc" v-if="$slots.leftTitleDesc"></slot>
      <idss-tooltip
        v-else
        :content="`${data.leftTitleDesc}`"
        placement="top"
        :over-width-display="true">
        <span class="panel-value-view_value ellipsis" :style="leftTitleDescStyle">
          {{data.leftTitleDesc}}
        </span>
      </idss-tooltip>
    </template>
    <!-- 右侧标题 -->
    <template slot="right">
      <slot name="rightTitle" v-if="$slots.rightTitle"></slot>
      <idss-tooltip
        v-else
        :content="`${data.rightTitle}`"
        placement="top"
        :over-width-display="true">
        <span class="panel-value-view_name panel-value-view_right-name ellipsis" :style="rightTitleStyle">
          {{data.rightTitle}}
        </span>
      </idss-tooltip>
    </template>
    <!-- 右侧标题标题 -->
    <template slot="bottom">
      <slot name="rightTitleDesc" v-if="$slots.rightTitleDesc"></slot>
      <idss-tooltip
        v-else
        :content="`${data.rightTitleDesc}`"
        placement="top"
        :over-width-display="true">
        <span class="panel-value-view_value panel-value-view_right-value ellipsis" :style="rightTitleDescStyle">
          {{data.rightTitleDesc}}
        </span>
      </idss-tooltip>
    </template>
  </single-value-layout>
</template>
<script>
import service from './tmpl-service.js'
import { IdssTooltip } from './../../index.js'
export default {
  mixins: [service],
  components: { IdssTooltip },
  props: {
    data: {
      type: Object,
      default () {
        return {
          leftTitle: '',
          leftTitleDesc: '',
          rightTitle: '',
          rightTitleDesc: ''
        }
      }
    },
    // 左侧标题样式
    leftTitleStyle: {
      type: Object,
      default: () => ({})
    },
    // 左侧描述样式
    leftTitleDescStyle: {
      type: Object,
      default: () => ({})
    },
    // 右侧标题样式
    rightTitleStyle: {
      type: Object,
      default: () => ({})
    },
    // 右侧描述样式
    rightTitleDescStyle: {
      type: Object,
      default: () => ({})
    },
    // 是否展示外边框
    isHiddenBorder: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="postcss">
  .panel-value-view {
    --single-value-panel-bg: var(--color-font-5,transparent);
    --single-value-panel-color: var(--color-font-2, #6a7280);
    --single-value-panel-name-font-size: var(--font-size-4, 14px);
    --single-value-panel-value-font-size: var(--font-digital-size-1, 28px);

    background-color: var(--single-value-panel-bg);
    border: var(--line-size-default,1px) solid
    var(--color-line-default, rgba(204,211,217,0.5));
    color: var(--single-value-panel-color);

    &.no-border {
      border: none;
    }
    .ellipsis {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      display: block;
    }

    &_name {
      outline: none;
      font-size: var(--single-value-panel-name-font-size);
      white-space: nowrap;
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
      display: inline-block;
    }
    &_value {
      font-size: var(--single-value-panel-value-font-size);
      outline: none;
    font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      max-width: 100%;
      text-overflow: ellipsis;
      display: inline-block;
    }

    &_right-name {
      font-size: var(--single-value-panel-name-font-size);
      padding-left: 10px;
    }
    &_right-value {
      padding-left: 10px;
    }
  }
</style>
