<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    width="500px"
    :title="statusTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="table-record-dialog"
    @close="closeDialog"
  >
    <div class="table-record-dialog-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="表名:" prop="senTypeId">
          {{ tableNames ? tableNames.toString() : "-" }}
        </el-form-item>
        <el-form-item label="用途:" prop="useInfo">
          <el-input v-model="formData.useInfo"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        :loading="loading"
        size="small"
        type="primary"
        :disabled="loading"
        @click="handleSaveForm"
      >
        保 存
      </el-button>
      <el-button size="small" @click="closeDialog"> 取 消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable no-empty */
export default {
  name: "TableRecordDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    tableNames: {
      type: Array,
      default: () => [],
    },
    filingState: {
      type: Number,
    },
    useInfo: {
      type: String,
    },
    statusTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      formData: {
        useInfo: "",
      },
      rules: {
        useInfo: [
          {
            required: true,
            message: "用途必填",
          },
        ],
      },
      loading: false,
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.formData.useInfo = this.useInfo;
      }
    },
  },
  methods: {
    handleSaveForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            await this.$request({
              url: "/gov/api/asset/filing/filingTableBatch",
              method: "POST",
              data: {
                ids: this.selectedIds,
                useInfo: this.formData.useInfo,
                filingState: this.filingState,
              },
            });

            this.$message.success("备案成功");

            this.closeDialog();

            this.$emit("update-list");
          } catch (e) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
    closeDialog() {
      this.$refs.form.resetFields();

      this.$emit("update:visible", false);
    },
  },
};
</script>

<style lang="postcss">
.table-record-dialog-box {
}
</style>
