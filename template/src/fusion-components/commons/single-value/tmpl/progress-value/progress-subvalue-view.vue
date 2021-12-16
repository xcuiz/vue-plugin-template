<template>
  <single-value-layout
    v-bind="$attrs"
    layout="all"
    :data="data"
    class='idss-progress-subvalue-view'
    :class="isHiddenBorder ? 'no-border' : ''">
    <!-- 左侧标题 -->
    <template slot="top">
      <slot name="name" v-if="$slots.name"></slot>
      <idss-tooltip v-else :content="`${data.name}`" placement="top" :over-width-display="true">
        <span class="idss-progress-subvalue-view_name ellipsis" @click="$emit('clickName', data)">
          {{data.name}}
        </span>
      </idss-tooltip>
    </template>
    <!-- 左侧value -->
    <template slot="left">
      <slot name="value" v-if="$slots.value" ></slot>
      <idss-tooltip v-else :content="`${data.value}`" placement="top" :over-width-display="true">
        <span class="idss-progress-subvalue-view_value ellipsis" @click="$emit('clickValue', data)">
          {{data.value}}
        </span>
      </idss-tooltip>
    </template>
    <!-- 右侧标题 -->
    <template slot="right">
      <slot name="subName" v-if="$slots.subName"></slot>
      <idss-tooltip v-else :content="`${data.subName}`" placement="top" :over-width-display="true">
        <span class="idss-progress-subvalue-view_subname ellipsis" @click="$emit('clickSubName', data)">
          {{data.subName}}
        </span>
      </idss-tooltip>
    </template>
    <!-- 右侧进度条 -->
    <template slot="bottom">
      <slot name="subValue" v-if="$slots.subValue"></slot>
      <div v-else class="idss-progress-subvalue-view_progress">
        <idss-tooltip :content="`${data.subValue}`" placement="top" :over-width-display="true">
          <span class="idss-progress-subvalue-view_subvalue " @click="$emit('clickSubValue', data)">
            {{data.subValue}}
          </span>
        </idss-tooltip>
        <el-progress style="float: right" custom :style="{'width': width}" type="line" :show-text="showText" :stroke-width="strokeWidth" :color="strokeColor"  :percentage="Number(data.percent)" :text-inside="textInside">

        </el-progress>
      </div>
    </template>
  </single-value-layout>
</template>
<script>
import { IdssTooltip } from './../../../index.js'
import service from '../tmpl-service.js'
export default {
  mixins: [service],
  components: { IdssTooltip },
  props: {
    data: {
      type: Object,
      default () {
        return {
          name: '',
          value: '',
          subName: '',
          subValue: '',
          percent: ''
        }
      }
    },
    // 进度条宽度
    width: {
      type: String,
      default: '70px'
    },
    // 进度条高度
    strokeWidth: {
      type: Number,
      default: 8
    },
    // 进度条颜色
    strokeColor: {
      type: String,
      default: ''
    },
    // 进度条内是否显示百分比(只在type为line时可以用)
    textInside: {
      type: Boolean,
      default: false
    },
    // 是否显示进度条文字内容
    showText: {
      type: Boolean,
      default: false
    },
    // 是否展示外边框
    isHiddenBorder: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped lang="postcss">

.idss-progress-subvalue-view {
  --single-value-progress-bg: var(--color-font-5,transparent);
  --single-value-progress-name-font-size: var(--font-size-4, 14px);
  --single-value-progress-value-font-size: var(--font-digital-size-1, 28px);
  --single-value-progress-subvalue-color: var(--color-alarm-2,#eb3d40);
  --single-value-progress-subvalue-view-bg: var(--color-alarm-2,#eb3d40);

  background-color: var(--single-value-progress-bg);
  border: var(--line-size-default,1px) solid var(--color-line-default, rgba(204,211,217,0.5));
  border-radius: 2px;
  min-height: 80px;
  position: relative;
  padding-top: 15px;

  &.no-border {
    border: none;
  }

  & .ellipsis {
    text-overflow: ellipsis;
    max-width: 100%;
    display: block;
  }

  &_name {
    outline: none;
    font-size: var(--single-value-progress-name-font-size);
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    display: inline-block;
    position: absolute;
    left: 20px;
  }
  &_value {
    font-size: var(--single-value-progress-value-font-size);
    outline: none;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    text-overflow: ellipsis;
    display: inline-block;
    cursor: pointer;
    position: absolute;
    left: 20px;
    bottom: 3px;
  }
  &_subname {
    font-size: 10px;
    padding-top: 2px;
    text-align: right;
    position: absolute;
    right: 20px;
  }
  &_subvalue {
    color: var(--single-value-progress-subvalue-color);
    float: right;
    font-size: 16px;
    position: absolute;
    right: 0px;
    top: -10px;
    cursor: pointer;
  }
  &_progress {
    padding-top: 14px;
    position: absolute;
    right: 20px;
    text-align: right;
  }
  >>>.el-progress-bar__outer {
    background-color: var(--single-value-progress-subvalue-view-bg);
  }
}
</style>
