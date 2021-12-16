<template>
  <div class="container">
    <BasicInfo :task-id="taskId" style="margin-bottom: 15px" />
    <SensitiveRankChart :task-id="taskId" style="margin-bottom: 15px" />
    <SensitiveTable :task-id="taskId" />
  </div>
</template>
<script>
import SensitiveTable from "./components/sensitive-table";
import SensitiveRankChart from "./components/sensitive-rank-chart";
import BasicInfo from "./components/basic-info";
export default {
  components: {
    SensitiveTable,
    SensitiveRankChart,
    BasicInfo,
  },
  props: {
    taskId: String,
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="postcss">
/* @import url("base.css"); */
.container {
  padding: 10px 15px;
  .idss-font--title {
    font-size: var(--font-size-16);
    margin-bottom: 10px;
  }
  >>> .page-header {
    padding-top: 6px;
    padding-bottom: 6px;
    .title {
      min-width: 112px;
    }
  }
}
.el-button + .el-select {
  margin-left: 10px;
}
.filter-items {
  display: flex;
  .select.el-select {
    width: 85px;
  }
}
</style>
