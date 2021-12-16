<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    title="类别编辑"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="class-edit-dialog"
    @close="closeDialog"
  >
    <div class="new-monitor-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="级别名称" prop="topName">
          <el-input
            v-model="formData.topName"
            maxlength="64"
            placeholder="请输入级别名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="2"
            placeholder="请输入描述"
            maxlength="200"
          >
          </el-input>
        </el-form-item>
      </el-form>
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
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "ClassEdit",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: false,
      formData: {
        topName: "",
        description: "",
      },
      rules: {
        topName: [
          {
            required: true,
            message: "级别名称不能为空",
          },
        ],
      },
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.formData = this.info;
        }
      },
      immediate: true,
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible");
    },
    handleSaveForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const { id, topName, description } = this.formData;

          try {
            await this.$request({
              url: "/gov/api/strategy/classify/top/edit",
              method: "POST",
              data: {
                id,
                topName,
                description,
              },
            });

            this.$message.success("编辑成功");

            this.$emit("after-close");
          } catch (e) {}
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.class-edit-dialog {
  .dialog-footer {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
