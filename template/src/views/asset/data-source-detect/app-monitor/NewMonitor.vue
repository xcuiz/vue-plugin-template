<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    :title="dialogTitle"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    @close="closeDialog"
  >
    <div v-loading="loadingDetail" class="new-monitor-box">
      <el-form
        ref="form"
        size="mini"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="任务名称" prop="name">
          <el-input
            v-model="formData.name"
            maxlength="64"
            placeholder="请输入任务名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="APP名称" prop="appName">
          <el-input
            v-model="formData.appName"
            maxlength="64"
            placeholder="请输入APP名称"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="归属业务系统" prop="businessSysId">
          <el-select
            v-model="formData.businessSysId"
            placeholder="请输入归属业务系统"
            style="width: 100%"
          >
            <el-option
              v-for="business of businessList"
              :key="business.code"
              :label="business.name"
              :value="business.code"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="归属部门" prop="deptName">
          <div class="dept-tree-box">
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
          </div>
        </el-form-item>
        <el-form-item label="APP类型" prop="appType">
          <el-input
            v-model="formData.appType"
            maxlength="64"
            placeholder="请输入APP类型"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传APP文件" prop="file">
          <el-upload
            class="upload-app"
            :multiple="false"
            :limit="1"
            action=""
            :http-request="uploadFile"
            :on-remove="handleRemove"
            :file-list="fileList"
            :on-exceed="onExceed"
          >
            <i class="el-icon-plus upload-app-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="检查探针" prop="probeId">
          <el-select
            v-model="formData.probeId"
            style="width: 100%"
            placeholder="请输入检查探针"
            @change="probeIdChange"
          >
            <el-option
              v-for="probe of probeList"
              :key="probe.id"
              :label="probe.name"
              :value="probe.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查模板" prop="templateId">
          <el-select
            v-model="formData.templateId"
            placeholder="请输入检查模板"
            style="width: 100%"
          >
            <el-option
              v-for="template of templateList"
              :key="template.id"
              :label="template.name"
              :value="template.id"
            ></el-option>
          </el-select>
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
export default {
  name: "NewMonitor",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectedId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      formData: {
        name: "",
        appName: "",
        appType: "",
        file: "",
        businessSysId: "",
        probeId: "",
        templateId: "",

        deptName: [],
      },
      rules: {
        name: [
          {
            required: true,
            message: "任务名称必填",
          },
        ],
        probeId: [
          {
            required: true,
            message: "检查探针必填",
          },
        ],
        file: [
          {
            required: true,
            message: "APP文件必填",
          },
        ],
        templateId: [
          {
            required: true,
            message: "检查模板必填",
          },
        ],
        businessSysId: [
          {
            required: true,
            message: "归属业务系统必填",
          },
        ],
        deptName: [
          {
            validator: (rule, value, callback) => {
              this.$nextTick(() => {
                if (
                  Array.isArray(this.formData.deptName) &&
                  this.formData.deptName.length > 0
                ) {
                  callback();
                } else {
                  callback(new Error("所属部门必填"));
                }
              });
            },
          },
        ],
      },

      probeList: [],
      templateList: [],
      businessList: [],

      // 部门树型结构数据
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },

      loading: false,
      loadingDetail: false,

      // 编辑的时候需要的(文件替换时: fileId和file; 文件不做操作: fileId)
      fileId: null,

      fileList: [],
    };
  },
  computed: {
    dialogTitle() {
      if (this.selectedId) {
        return "编辑任务";
      } else {
        return "新建任务";
      }
    },
  },
  created() {
    this.getProbeList();
    // this.getBusinessSys();
    this.getDeptList();

    this.getDetail();
  },
  methods: {
    /**
     * 获取任务详情
     */
    async getDetail() {
      const { selectedId } = this;

      if (selectedId) {
        this.loadingDetail = true;
        try {
          const result = await this.$request({
            url: `/gov/api/app/job/detail/${selectedId}`,
            method: "GET",
          });

          if (result) {
            const {
              name,
              appName,
              appType,
              businessSysId,
              probeId,
              templateId,
              fileName,
              fileId,

              deptId,
            } = result;

            this.formData = {
              name,
              appName,
              appType,
              businessSysId,
              probeId,
              templateId,
              // 此处将文件名赋值,是为了保存是防止出现非空校验,编辑任务时,只有重新上传才需要该字段
              file: fileName,

              deptName: [deptId],
            };

            this.fileId = fileId;

            this.fileList.push({
              name: fileName,
            });

            this.getTemplateList(probeId);
          }
        } catch (e) {
        } finally {
          this.loadingDetail = false;
        }
      }
    },
    async getBusinessSys() {
      const result = await this.$request({
        url: "/gov/api/asset/businessSys/select",
        method: "GET",
      });

      if (Array.isArray(result)) {
        this.businessList = result;
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
    async getProbeList() {
      const result = await this.$request({
        url: "/gov/api/app/job/probeList",
        method: "GET",
      });

      if (result) {
        const { data } = result;

        if (Array.isArray(data)) {
          this.probeList = data;
        }
      }
    },
    async getTemplateList(val) {
      const result = await this.$request({
        url: `/gov/api/app/job/templateList/${val}`,
        method: "GET",
      });

      if (result) {
        const { data } = result;

        if (Array.isArray(data)) {
          this.templateList = data;
        }
      }
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
    uploadFile(param) {
      this.formData.file = param.file;
      param.onSuccess();
    },
    onExceed(files) {
      this.fileList = [{ name: files[0].name }];
      this.formData.file = files[0];
    },
    handleRemove() {
      this.formData.file = "";
    },
    probeIdChange(val) {
      this.formData.templateId = "";
      if (val) {
        this.getTemplateList(val);
      }
    },
    handleSaveForm() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          const { name: templateName } = this.templateList.find(
            ({ id }) => id === this.formData.templateId
          );

          const formData = new FormData();

          for (const key in this.formData) {
            if (key === "deptName") {
              formData.append("deptId", this.formData[key][0]);
            } else {
              formData.append(key, this.formData[key]);
            }
          }

          formData.append("templateName", templateName);

          let url = "/gov/api/app/job/create";

          if (this.selectedId) {
            url = "/gov/api/app/job/update";

            formData.append("id", this.selectedId);

            const { file } = this.formData;
            if (typeof file === "string" && file !== "") {
              // 如果是字符串并且不是空,说明没有编辑任务时,没有对APP文件做任何修改,此时只需要参数中有fileId即可
              formData.delete("file");
              // formData.append("file", null);
            } else {
              // 说明重新上传了APP文件, 不做任何操作
            }
            formData.append("fileId", this.fileId);
          }

          this.loading = true;
          try {
            await this.$request({
              url,
              method: "POST",
              data: formData,
            });

            this.$emit("after-close", true);

            this.$message.success(
              `任务${this.selectedId ? "编辑" : "创建"}成功`
            );
          } catch (e) {
          } finally {
            this.loading = false;
          }
        }
      });
    },
    checkChange({ code }) {
      this.formData.deptName = [code];
      this.$refs["deptTree"].setCheckedKeys([code]);
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit("update:visible");

      this.$emit("after-close", false);
    },
  },
};
</script>

<style lang="postcss">
.new-monitor-box {
  .upload-app {
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      &:hover {
        border-color: #193857;
      }
      .upload-app-icon {
        font-size: 28px;
        color: #8c939d;
        width: 130px;
        height: 130px;
        line-height: 130px;
        text-align: center;
      }
    }
  }

  .dept-tree-box {
    max-height: 200px;
    overflow: auto;
  }
}

.dept-tree {
  .el-checkbox {
    &.is-disabled {
      display: none;
    }
  }
}
</style>
