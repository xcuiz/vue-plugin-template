<template>
  <el-dialog
    custom
    title="连通性测试结果"
    :visible="visible"
    append-to-body
    width="580px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="error-box">
      <div v-if="errorList.length > 0" class="error-list">
        <el-table size="mini" :data="errorList" border :show-header="false">
          <el-table-column prop="label" show-overflow-tooltip></el-table-column>
          <el-table-column prop="info" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <div v-else class="no-error">连通成功</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ConnectTestDialog",
  props: {
    errorList: {
      type: Array,
      default: () => [],
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="postcss">
.error-box {
  .error-list {
    .error-item {
      display: flex;
      font-size: 14px;

      .error-label {
        width: 80px;
        margin-right: 10px;
        flex-shrink: 0;
      }

      .error-info {
      }
    }
  }
}
</style>
