<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="pool-manage-dialog"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="pool-manage-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="type !== 'detail' ? rules : {}"
        label-width="100px"
      >
        <el-form-item label="资源池名称" prop="poolName">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.poolName"
              placeholder="请输入资源池名称"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.poolName }}</span>
        </el-form-item>
        <el-form-item label="描述" prop="poolDesc">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.poolDesc"
              placeholder="请输入描述"
              maxlength="255"
              type="textarea"
              :rows="3"
            ></el-input>
          </div>
          <span v-else>{{ formData.poolDesc }}</span>
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
  name: "NewForm",
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

      formData: {
        poolName: "",
        poolDesc: "",
      },

      rules: {
        poolName: [
          {
            required: true,
            message: "资源池名称必填",
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

      return map[this.type] + "资源池";
    },
  },
  created() {
    this.getDetail();
  },
  methods: {
    async getDetail() {
      if (!this.selectedId) {
        return;
      }

      this.loadingDetail = true;
      try {
        const result = await this.$request({
          url: `/gov/api/asset/pool/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const { poolName, poolDesc } = result;

          this.formData = {
            poolName,
            poolDesc,
          };
        }
      } catch (e) {
      } finally {
        this.loadingDetail = false;
      }
    },
    closeDialog() {
      this.$emit("update:visible");
    },
    async handleSaveForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { type, formData, selectedId } = this;
          this.loading = true;

          const { poolName, poolDesc } = formData;

          let url = "/gov/api/asset/pool/create";
          let method = "POST";
          let msg = "新增";
          if (type === "edit") {
            url = `/gov/api/asset/pool/${selectedId}`;
            method = "PUT";
            msg = "编辑";
          }
          try {
            await this.$request({
              url,
              method,
              data: {
                poolName,
                poolDesc,
              },
            });

            this.$message.success(`${msg}资源池成功`);
            this.$emit("after-close");
          } catch (e) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
  },
};
</script>
