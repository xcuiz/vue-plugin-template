<!--
 * @Author: yincheng
 * @Date: 2021-04-23 15:53:40
 * @LastEditors: yincheng
 * @LastEditTime: 2021-04-26 11:01:12
-->
<template>
  <div class="container">
    <AssetInfo
      :asset-id="assetId"
      :task-id="taskId"
      style="margin-bottom: 15px"
    />
    <AssetFileTable
      v-if="storageMode === 'File'"
      :task-id="taskId"
      :asset-id="assetId"
    />
    <AssetDBTable
      v-else
      :task-id="taskId"
      :asset-id="assetId"
      :storage-mode="storageMode"
    />
  </div>
</template>
<script>
import AssetInfo from "./components/asset-info";
import AssetDBTable from "./components/asset-db-table";
import AssetFileTable from "./components/asset-file-table";
export default {
  components: {
    AssetInfo,
    AssetDBTable,
    AssetFileTable,
  },
  props: {
    taskId: {
      type: Number,
      required: true,
    },
    assetId: {
      type: Number,
      required: true,
    },
    storageMode: {
      type: String,
      required: true,
    },
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
