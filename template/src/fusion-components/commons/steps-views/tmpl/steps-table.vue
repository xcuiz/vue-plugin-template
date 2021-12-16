<template>
  <steps-view-layout v-bind="$attrs">
    <template slot-scope="steps">
      <div class="steps-content" v-for="(item, index) in steps.data" :key="index">
        <div class="date-time-container">
          <div class="date">{{item.time && item.time.length ? item.time.split(' ')[0] : ''}}</div>
          <div class="time">{{item.time && item.time.length ? item.time.split(' ')[1] : ''}}</div>
        </div>
        <el-step class="step-container">
          <template slot="icon" v-if="isIconSlot && config.iconNames[index]">
            <idss-icon-svg :name="config.iconNames[index]"></idss-icon-svg>
          </template>
          <template slot="title">
            <div v-for="(subItem,subIndex) in item.content" :key="subIndex">
              <div class="sub-title">{{subItem.title}}</div>
              <div class="sub-content" :title="subItem.description">{{subItem.description && subItem.description.length > 15 ? subItem.description.substr(0,13) + '...' : subItem.description}}</div>
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
  components: { IdssIconSvg, ElStep }
}
</script>

<style scoped lang="postcss">
.steps-content{
  --steps-table-description-bg: var(--color-alarm-5,#69c0ff);
  --steps-table-description-color: var(--color-font-5,#ffffff);
  --steps-table-sub-title-color: var(--color-font-1,#464c59);
  --steps-table-date-time-container-color: var(--color-alarm-5,#69c0ff); /* @fixme未找到原先没定义的值 */

  display: flex;
  padding-left:20px;

  & .date-time-container {
    padding-right: 15px;
    padding-bottom: 18px;
    > div {
      width: 100px;
      color: var(--steps-table-date-time-container-color);
    }
    .date {
      font-size: 18px;
      padding-bottom: 6px;
    }
    .time {
      font-size: 14px;
    }
  }

  & .step-container {
    display: flex;
    flex-grow: 1;
    justify-content: space-between;
    .sub-content {
      width: 150px;
      min-height:35px;
      background: var(--steps-table-description-bg);
      color: var(--steps-table-description-color);
      padding: 5px 10px;
      border-radius: 3px;
      text-align: center;
    }
    .sub-title {
      color: var(--steps-table-sub-title-color);
      font-size: 18px;
    }
  }

  & .el-steps,
  & .el-step:last-of-type.is-flex {
    flex-grow: 1;
  }
  & >>> .el-step.is-vertical {
    & .el-step__title {
      display: flex;
      justify-content: space-around;
    }
    & .el-step__title {
      padding-bottom: 20px;
    }
  }
  & >>> .el-step:last-of-type{
    & .el-step__line{
      display: block;
    }
  }
}

</style>
