<template>
  <div class="idss-steps-view-container">
    <div v-show="nodata" class="idss-steps-view-container__content">
      <div ref="empty"></div>
    </div>
    <el-scrollbar style="height: 100%; width: 100%;" v-if="!nodata">
      <el-steps class="idss-steps-view-container__content" v-bind="$attrs">
        <slot :data="data">
          <el-step v-for="(item, index) in data" :key="index" :title="item.title" :icon="icons[index] || item.icon" :description="item.description" :status="status[index]"></el-step>
        </slot>
      </el-steps>
    </el-scrollbar>
  </div>
</template>
<script>
import ElSteps from 'element-ui/lib/steps.js'
import ElStep from 'element-ui/lib/step.js'
import ElScrollbar from 'element-ui/lib/scrollbar.js'

import 'element-ui/lib/theme-chalk/steps.css'
import 'element-ui/lib/theme-chalk/step.css'
import 'element-ui/lib/theme-chalk/scrollbar.css'

import { vueEmptyDataService } from '../../../mixins'
export default {
  name: 'steps-view-layout',
  components: {
    ElSteps,
    ElStep,
    ElScrollbar
  },
  mixins: [vueEmptyDataService],
  computed: {
    nodata () {
      return !this.data || (this.data && !this.data.length)
    }
  },
  props: {
    data: Array,
    /* 自定义默认模版的图标 */
    icons: {
      type: Array,
      default () {
        return []
      }
    },
    /* 自定义默认模版的单步 step 状态 */
    status: {
      type: Array,
      default () {
        return []
      }
    }
  },
  mounted () {
    // 创建空对象
    this.createEmptyDom()
  }
}
</script>
<style scoped lang="postcss">
.idss-steps-view-container {
  flex-grow: 1;
  display: flex;
  &__content {
    width: 100%;
    height: 100%;
    padding: 6px;
  }
}
</style>
