<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="location-manage-dialog"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="location-manage-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="type !== 'detail' ? rules : {}"
        label-width="100px"
      >
        <el-form-item label="物理位置" prop="name">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.name"
              placeholder="请输入物理位置"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.name }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="locationDesc">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.locationDesc"
              placeholder="请输入备注"
              maxlength="255"
              type="textarea"
              :rows="3"
            ></el-input>
          </div>
          <span v-else>{{ formData.locationDesc }}</span>
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
        name: "",
        netdistrictId: null,
        locationDesc: "",
        deptId: null,
      },

      rules: {
        name: [
          {
            required: true,
            message: "地理位置必填",
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

      return map[this.type] + "物理位置";
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
          url: `/gov/api/asset/location/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const { name, netdistrictId, locationDesc, deptId } = result;

          this.formData = {
            name,
            netdistrictId,
            locationDesc,
            deptId,
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

          const { name, netdistrictId, locationDesc, deptId } = formData;

          let url = "/gov/api/asset/location/create";
          let method = "POST";
          let msg = "新增";
          if (type === "edit") {
            url = `/gov/api/asset/location/${selectedId}`;
            method = "PUT";
            msg = "编辑";
          }
          try {
            await this.$request({
              url,
              method,
              data: {
                name,
                netdistrictId,
                locationDesc,
                deptId,
              },
            });

            this.$message.success(`${msg}物理位置成功`);
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
