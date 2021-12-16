<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="new-sensitive-template-dialog"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="new-sensitive-template-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="模板名称" prop="templateName">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.templateName"
              placeholder="请输入模板名称"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.templateName }}</span>
        </el-form-item>
        <el-form-item label="模板标识" prop="code">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.code"
              placeholder="请输入模板标识"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.code }}</span>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.description"
              placeholder="请输入描述"
              type="textarea"
              :rows="3"
              maxlength="255"
            ></el-input>
          </div>
          <span v-else>{{ formData.description }}</span>
        </el-form-item>
        <el-form-item label="策略" prop="sensitiveConfigIds">
          <el-select
            v-model="formData.sensitiveConfigIds"
            style="width: 100%"
            multiple
          >
            <el-option
              v-for="item in sensitiveConfigs"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button
        v-if="type !== 'detail'"
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
export default {
  name: "NewSensitiveFeat",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectedId: {
      type: [Number, String],
      default: null,
    },
    type: {
      // add, edit, detail
      type: String,
      default: "",
    },
  },
  data() {
    return {
      loading: false,

      loadingDetail: false,

      defaultCheckedKeys: [],
      defaultProps: {
        children: "childrenList",
        label: "classifyName",
      },

      sensitiveConfigs: [],

      formData: {
        templateName: "",
        code: "",
        description: "",
        sensitiveConfigIds: [],
      },
      rules: {
        templateName: [
          {
            required: true,
            message: "模板名称必填",
          },
        ],
        code: [
          {
            required: true,
            message: "模板标识必填",
          },
        ],
        sensitiveConfigIds: [
          {
            type: "array",
            required: true,
            message: "请选择策略",
          },
        ],
      },
    };
  },
  computed: {
    dialogTitle() {
      const map = {
        add: "添加",
        edit: "编辑",
        detail: "查看",
      };

      return map[this.type] + "特征模板";
    },
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          this.getDetail();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.getSensitiveConfigs();
  },
  methods: {
    getSensitiveConfigs() {
      this.$request({
        method: "get",
        url: "/gov/api/strategy/sensitiveConfig/getAllConfigs",
      }).then((res) => {
        this.sensitiveConfigs = res;
      });
    },
    async getDetail() {
      if (!this.selectedId) {
        return;
      }

      this.loadingDetail = true;
      try {
        const result = await this.$request({
          url: `/gov/api/strategy/feature/template/detail/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const {
            templateName,
            code,
            description,
            sensitiveConfigIds,
          } = result;

          this.formData = {
            templateName,
            code,
            description,
            sensitiveConfigIds:
              sensitiveConfigIds?.split(",").filter(Boolean).map(Number) || [],
          };
        }
      } finally {
        this.loadingDetail = false;
      }
    },
    closeDialog() {
      this.$emit("update:visible");
    },
    handleSaveForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.loading = true;
          try {
            const url = this.selectedId
              ? "/gov/api/strategy/feature/template/edit"
              : "/gov/api/strategy/feature/template/add";
            const data = {
              ...this.formData,
              sensitiveConfigIds: this.formData.sensitiveConfigIds.join(","),
            };

            const body = this.selectedId
              ? {
                  ...data,
                  id: this.selectedId,
                }
              : data;

            await this.$request({
              url,
              method: "POST",
              data: body,
            });

            this.$message.success(
              `${this.selectedId ? "编辑" : "新增"}特征模板成功`
            );

            this.$emit("after-close");
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>

<style lang="postcss">
.new-sensitive-template-box {
  overflow: auto;
  padding-right: 5px;
  max-height: 300px;
  .rule-info {
    padding-bottom: 5px;
    border-bottom: 1px solid #dcdfe6;

    .rule-item {
      display: flex;
      margin-bottom: 10px;
      .rule-label {
        width: 80px;
      }

      .rule-content {
        flex: 1;

        .el-radio-group {
          display: flex;
          flex-wrap: wrap;
          .el-radio {
            width: 25%;
            flex-shrink: 0;
            margin-bottom: 5px;
          }
        }
      }
    }
  }
}

.feature-tree {
  .el-checkbox {
    &.is-disabled {
      display: none;
    }
  }
}
</style>
