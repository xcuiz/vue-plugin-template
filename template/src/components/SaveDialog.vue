<template>
  <el-dialog
    top="25vh"
    title="保存过滤条件"
    :visible.sync="saveDialogVisible"
    class="save-dialog"
    :close-on-click-modal="false"
    @close="handleCancelClick"
  >
    <el-form ref="saveForm" inline :model="saveForm">
      <el-form-item
        label="名称"
        :rules="[{ required: true, message: '名称不能为空' }]"
        size="mini"
        prop="name"
        label-width="60px"
      >
        <el-input
          v-model="saveForm.name"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述" size="mini" label-width="60px">
        <el-input
          v-model="saveForm.desc"
          autocomplete="off"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button
        size="mini"
        type="primary"
        @click="handleConfirmClick('saveForm')"
        >确定</el-button
      >
      <el-button size="mini" @click="handleCancelClick">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "SaveDialog",
  props: {
    visible: {
      type: Boolean,
      require: true,
    },
  },
  data() {
    return {
      saveDialogVisible: this.visible,
      saveForm: {
        name: "",
        desc: "",
      },
    };
  },
  watch: {
    visible(newVal) {
      this.saveDialogVisible = newVal;
    },
  },
  methods: {
    // 保存
    handleConfirmClick(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveDialogVisible = false;
          this.$emit("save", this.saveForm);
          this.saveForm = {
            name: "",
            desc: "",
          };
        } else {
          return false;
        }
      });
    },
    handleCancelClick() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped lang="postcss">
.save-dialog {
  >>> .el-dialog {
    width: 288px;

    .el-dialog__body {
      padding: 10px 10px 0;

      .el-form-item {
        .el-form-item__content {
          width: 180px;
        }
      }
    }
  }

  >>> .el-dialog__footer {
    padding: 0 10px 10px;

    .dialog-footer {
      text-align: center;
    }
  }
}
</style>
