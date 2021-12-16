<template>
  <steps-view-layout v-bind="$attrs">
    <template slot-scope="steps">
      <div class="steps-item" v-for="(item, index) in steps.data" :key="index">
        <div class="time">
          <p>{{item.time && item.time.length ? item.time.split(' ')[0] : ''}}</p>
          <p>{{item.time && item.time.length ? item.time.split(' ')[1] : ''}}</p>
        </div>
        <el-step class="steps-icon">
          <template slot="icon" v-if="isIconSlot && config.iconNames[index]">
            <idss-icon-svg :name="config.iconNames[index]"></idss-icon-svg>
          </template>
          <template slot="description">
            <div class="description" v-for="(subItem, subIndex) in item.content" :key="subIndex" v-html="subItem.description">
            </div>
          </template>
        </el-step>
      </div>
    </template>
  </steps-view-layout>
</template>
<script>
import ElStep from 'element-ui/lib/step.js'
import service from './tmpl-service.js'
import { IdssIconSvg } from './../../index.js'

import 'element-ui/lib/theme-chalk/step.css'
export default {
  mixins: [service],
  components: {
    IdssIconSvg,
    ElStep
  }
}
</script>
<style scoped lang="postcss">
  .steps-item {
    --steps-list-description-color: var(--color-font-1,#464c59);
    --steps-list-description-param-color: var(--color-font-5,#ffffff);
    --steps-list-url-bg: var(--color-alarm-5,#69c0ff);
    --steps-list-target-bg: var(--color-alarm-5,#69c0ff);
    --steps-list-operation-bg: var(--color-alarm-3,#fb9d35);
    --steps-list-success-bg: var(--lime-6,#a0d911);
    --steps-list-error-bg: var(--color-alarm-2,#eb3d40);
    width: 100%;
    height: 100%;
    display: flex;
    .time {
      text-align: right;
      padding: 0 10px;
      min-width: 100px;
    }
    >>> .el-step {
      flex: 1;
    }
    >>> .el-step:last-of-type .el-step__line {
      display: block;
    }
    .description {
      padding: 0 0 14px;
      font-size: 16px;
      color: var(--steps-list-description-color);
      >>> p {
        margin-bottom: 0;
      }
      >>> span {
        display: inline-block;
        padding: 0 6px;
        margin: 2px 4px;
        line-height: 17px;
        border-radius: 4px;
        color: var(--steps-list-description-param-color);
      }
      >>> .url {
        background-color: var(--steps-list-url-bg);
      }
      >>> .target {
        background-color: var(--steps-list-target-bg);
      }
      >>> .operation {
        background-color: var(--steps-list-operation-bg);
      }
      >>> .success {
        display: inline-block;
        padding: 0 6px;
        margin: 0 4px;
        border-radius: 2px;
        background-color: var(--steps-list-success-bg);
      }
      >>> .error {
        display: inline-block;
        padding: 0 6px;
        margin: 0 4px;
        border-radius: 4px;
        background-color: var(--steps-list-error-bg);
      }
    }
  }

</style>
