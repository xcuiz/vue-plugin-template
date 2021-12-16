<template>
  <div>
    <!-- 无数据展示 -->
    <div ref="empty">
    </div>
  </div>
</template>
<script>
import { vueEmptyDataService } from '../mixins'
export default {
  name: 'idss-no-data',
  mixins: [vueEmptyDataService],
  mounted () {
    // 创建空对象
    this.createEmptyDom()
  }
}
</script>
