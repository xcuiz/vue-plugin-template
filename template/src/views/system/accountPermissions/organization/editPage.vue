<template>
  <el-dialog
    :close-on-click-modal="false"
    class="organization-container"
    custom
    :title="currentTitle"
    :visible="visible"
    @close="closeDialog"
  >
    <article
      v-loading="loading['init']"
      class="editPage"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <!-- 编辑 -->
      <el-form
        v-if="isEdit"
        ref="form"
        size="mini"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <article>
          <el-row :gutter="40">
            <el-col :span="24" :offset="0">
              <el-form-item label="" label-width="0">
                <div class="tips-info">
                  该所属关系设置将影响相关系统账号对异常，威胁和用户列表等功能的数据浏览
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="24">
              <el-form-item label="组织名称" prop="orgName">
                <el-input
                  v-model.trim="formData.orgName"
                  minlength="4"
                  maxlength="100"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="全称" prop="orgFullName">
                <el-input
                  v-model.trim="formData.orgFullName"
                  maxlength="100"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="管辖部门">
                <el-select
                  v-model="formData.depts"
                  filterable
                  multiple
                  collapse-tags
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </article>
      </el-form>
    </article>
    <!-- 确定按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button
        v-if="isEdit"
        size="mini"
        type="primary"
        @click="handleSaveForm"
      >
        保 存
      </el-button>
      <el-button v-else size="mini" type="primary" @click="handleEdit">
        编辑
      </el-button>
      <el-button size="mini" @click="closeDialog"> 取 消 </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import service from "./editPageServe";
// import { checkChar } from '@/utils/rules'

export default {
  filters: {
    // 状态映射
    filterStatus(val) {
      return val === "0" ? "正常" : "锁定";
    },
  },
  mixins: [service],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 信件id
    selectId: {
      type: [String, Number],
      default: "",
    },
    // 页面类型（新增、编辑、查看）newly,edit,examine
    type: {
      type: String,
      default: "newly",
    },
  },
  data() {
    var checkOrgName = (rule, value, callback) => {
      if (value) {
        let newv = value.replace(/\s/g, "");
        if (
          /^[\u4E00-\u9FA50-9a-zA-Z_]+$/.test(newv) === false ||
          newv.length < 4 ||
          newv.length > 100
        ) {
          this.$message.error(
            "名称只能由汉字、字母、数字和下划线组成，长度为4-100个中英文字符"
          );
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checkOrgFullName = (rule, value, callback) => {
      if (value) {
        // debugger
        let newv = value.replace(/\s/g, "");
        if (
          /(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,，]{1,250}$)/.test(newv) === false
        ) {
          callback(new Error("请输入正确全称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      options: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      isEditPassword: false,
      loading: {},
      formData: {
        orgName: "",
        orgFullName: "",
        depts: [],
      },
      rules: {
        orgName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
          {
            validator: checkOrgName,
            trigger: "blur",
          },
        ],
        orgFullName: [
          {
            required: true,
            message: "请输入全称",
            trigger: "blur",
          },
          {
            validator: checkOrgFullName,
            trigger: "blur",
          },
        ],
      },
      // 时间只能选择今天及之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
    };
  },
  computed: {
    ...mapState("system", ["roleDicts"]),
    // 当前页面的title，新增用户，编辑用户，用户信息，根据主页来源而定
    // newly,edit,examine
    currentTitle() {
      let title = "";
      switch (this.type) {
        case "newly":
          title = "新增组织";
          break;
        case "edit":
          title = "编辑组织";
          break;
        default:
          title = "组织信息";
      }
      return title;
    },
    // 判断是否为编辑页面
    isEdit() {
      return this.type === "newly" || this.type === "edit";
    },
  },
  watch: {
    selectId: {
      handler(val) {
        val && this.getData(val);
      },
      immediate: true,
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.getDepts().then(
      (content) => {
        this.options = content;
      },
      () => {}
    );
  },
  methods: {
    /**
     * 编辑页面-修改密码，切换展示
     */
    handleSwitchPassContent() {
      this.isEditPassword = !this.isEditPassword;
    },
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit("update:visible");
    },
    /**
     * 编辑
     */
    handleEdit() {
      this.$emit("update:type", "edit");
    },
    /**
     * 保存表单
     */
    handleSaveForm() {
      this.$refs.form.validate((res) => {
        if (res) {
          if (this.type !== "newly") {
            this.formData = Object.assign(this.formData, { id: this.selectId });
          }
          this.addOrganization();
        }
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.organization-container {
  >>> .el-tree {
    height: 200px;
    overflow-y: auto;
    margin-top: 10px;
  }

  >>> .el-dialog__body {
    .editPage {
      color: #3f3f3f;

      >>> .el-form-item__label,
      .el-radio {
        color: #3f3f3f;
      }

      .passwordContent {
        .header {
          width: 90px;
          padding-right: 12px;
          text-align: right;
          color: #4a90ea;
          font-size: 12px;
          margin-bottom: 5px;
          cursor: pointer;

          >>> .idss-svg-icon {
            fill: var(--color-primary);
          }
        }

        .passwordContainer {
          background: rgb(241, 244, 246);
          padding-top: 20px;
        }
      }
    }
  }

  .tips-info {
    background-color: #f4fafe;
    border: 1px solid #dee3e8;
    padding: 6px 14px;
    line-height: 20px;
  }
}
</style>
