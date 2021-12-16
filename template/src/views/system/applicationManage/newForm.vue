<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    class="application-manage-dialog"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="application-manage-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="type !== 'detail' ? rules : {}"
        label-width="100px"
      >
        <el-form-item label="应用系统" prop="businessSysName">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.businessSysName"
              placeholder="请输入应用系统"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.businessSysName }}</span>
        </el-form-item>
        <el-form-item label="应用编码" prop="businessSysCode">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.businessSysCode"
              placeholder="请输入应用编码"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.businessSysCode }}</span>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptName">
          <el-tree
            ref="deptTree"
            class="dept-tree"
            :data="treeData"
            show-checkbox
            node-key="code"
            :default-checked-keys="formData.deptName"
            :props="defaultProps"
            check-strictly
            @check="checkChange"
          >
          </el-tree>
        </el-form-item>
        <el-form-item label="负责人" prop="owner">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.owner"
              placeholder="请输入负责人"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.owner }}</span>
        </el-form-item>
        <el-form-item label="联系方式" prop="ownerMobile">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.ownerMobile"
              placeholder="请输入联系方式"
              maxlength="64"
            ></el-input>
          </div>
          <span v-else>{{ formData.ownerMobile }}</span>
        </el-form-item>
        <el-form-item label="是否4A纳管" prop="isFourA">
          <div v-if="type !== 'detail'">
            <el-radio v-model="formData.isFourA" label="1">是</el-radio>
            <el-radio v-model="formData.isFourA" label="0">否</el-radio>
          </div>
          <span v-else>{{ formData.isFourA === "1" ? "是" : "否" }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="businessSysDesc">
          <div v-if="type !== 'detail'">
            <el-input
              v-model="formData.businessSysDesc"
              placeholder="请输入备注"
              maxlength="255"
              type="textarea"
              :rows="3"
            ></el-input>
          </div>
          <span v-else>{{ formData.businessSysDesc }}</span>
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

      defaultProps: {
        children: "children",
        label: "name",
      },
      treeData: [],

      formData: {
        businessSysName: "",
        businessSysCode: "",
        deptName: [],
        owner: "",
        ownerMobile: "",
        isFourA: "1",
        businessSysDesc: "",
      },

      rules: {
        businessSysName: [
          {
            required: true,
            message: "应用系统必填",
          },
        ],
        businessSysCode: [
          {
            required: true,
            message: "应用编码必填",
          },
        ],
        isFourA: [
          {
            required: true,
            message: "4A纳管必填",
          },
        ],
        deptName: [
          {
            validator: (rule, value, callback) => {
              if (Array.isArray(value) && value.length > 0) {
                callback();
              } else {
                callback(new Error("所属部门必填"));
              }
            },
          },
          {
            required: true,
            message: "所属部门必填",
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

      return map[this.type] + "应用系统";
    },
  },
  created() {
    this.getDeptList();
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
          url: `/gov/api/asset/businessSys/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const {
            businessSysName,
            businessSysCode,
            deptId,
            owner,
            ownerMobile,
            isFourA,
            businessSysDesc,
          } = result;

          this.formData = {
            businessSysName,
            businessSysCode,
            deptName: [deptId],
            owner,
            ownerMobile,
            isFourA,
            businessSysDesc,
          };
        }
      } catch (e) {
      } finally {
        this.loadingDetail = false;
      }
    },
    async getDeptList() {
      try {
        const result = await this.$request({
          url: "/gov/api/asset/dept/select",
          method: "GET",
        });

        if (result) {
          this.setCheck(result);
          this.treeData = result;
        }
      } catch (e) {}
    },
    setCheck(items) {
      if (!items) {
        return;
      }

      for (const item of items) {
        if (item.childrenList) {
          this.setCheck(item.childrenList);
        }

        if (item.children) {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      }
    },
    checkChange({ code }) {
      this.formData.deptName = [code];
      this.$refs["deptTree"].setCheckedKeys([code]);
    },
    closeDialog() {
      this.$emit("update:visible");
    },
    async handleSaveForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const { type, formData, selectedId } = this;
          this.loading = true;

          const {
            businessSysName,
            businessSysCode,
            deptName,
            owner,
            ownerMobile,
            isFourA,
            businessSysDesc,
          } = formData;

          let url = "/gov/api/asset/businessSys/create";
          let method = "POST";
          let msg = "新增";
          if (type === "edit") {
            url = `/gov/api/asset/businessSys/${selectedId}`;
            method = "PUT";
            msg = "编辑";
          }
          try {
            await this.$request({
              url,
              method,
              data: {
                businessSysName,
                businessSysCode,
                deptId: deptName[0],
                owner,
                ownerMobile,
                isFourA,
                businessSysDesc,
              },
            });

            this.$message.success(`${msg}应用系统成功`);
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

<style lang="postcss">
.dept-tree {
  .el-checkbox {
    &.is-disabled {
      display: none;
    }
  }
}
</style>
