<template>
  <el-dialog
    :close-on-click-modal="false"
    class="account-permission-dialog-container"
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
        label-width="80px"
      >
        <article>
          <el-row>
            <el-col :span="12">
              <el-form-item label="名称" prop="userName">
                <el-input
                  v-model="formData.userName"
                  :disabled="type !== 'newly'"
                  minlength="4"
                  maxlength="100"
                  @keyup.native="inputUserName($event)"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属组织" prop="deptName">
                <el-select
                  v-model="formData.deptId"
                  stretch
                  clearable
                  size="mini"
                  :popper-append-to-body="false"
                  popper-class="dept-class"
                >
                  <el-option
                    v-for="item in depts"
                    :key="item.code"
                    v-idss-tooltip="item.label"
                    :value="item.code"
                    :label="item.label"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="全称" prop="realName">
                <el-input
                  v-model="formData.realName"
                  maxlength="100"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="formData.mobile"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="电话号码" prop="telephone">
                <el-input v-model="formData.telephone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="社交号">
                <el-input
                  v-model="formData.socialAccount"
                  maxlength="30"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="formData.email" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                <el-select
                  v-model="formData.status"
                  stretch
                  placeholder="请选择"
                >
                  <el-option label="锁定" value="1"></el-option>
                  <el-option label="正常" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="type != 'edit'" :span="24">
              <el-form-item label="设置密码" prop="passwordNew">
                <el-input
                  v-model="formData.passwordNew"
                  maxlength="100"
                  show-password
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="type != 'edit'" :span="24">
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input
                  v-model="formData.confirmPassword"
                  maxlength="100"
                  show-password
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="角色设置" prop="roleId">
                <el-select
                  v-model="formData.roleId"
                  stretch
                  @change="reqFunctions"
                >
                  <el-option
                    v-for="item in roleDicts"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="默认应用">
                <div>
                  <el-input
                    v-model="filterText"
                    placeholder="输入关键字进行过滤"
                  >
                  </el-input>
                  <el-tree
                    ref="tree"
                    show-checkbox
                    node-key="code"
                    :check-strictly="true"
                    class="filter-tree"
                    :data="appOptions"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    @check="setSelectedNode"
                  >
                  </el-tree>
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="24" style="display: flex">
              <el-form-item label="有效期" prop="periodFrom">
                <el-date-picker
                  v-model="formData.periodFrom"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptionsStart"
                >
                </el-date-picker
                >&nbsp;-&nbsp;

                <el-form-item
                  prop="periodTo"
                  style="float: right; margin-bottom: 0"
                >
                  <el-date-picker
                    v-model="formData.periodTo"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择日期"
                    :picker-options="pickerOptionsEnd"
                  >
                  </el-date-picker>
                </el-form-item>
              </el-form-item>
            </el-col>
            <el-col v-if="type != 'edit'" :span="24">
              <el-form-item label="">
                <el-checkbox v-model="formData.isNeedUpdatePassword"
                  ><span>首次登录需修改密码</span></el-checkbox
                >
              </el-form-item>
            </el-col>
          </el-row>
        </article>

        <article v-if="type === 'edit'" class="passwordContent">
          <el-row :span="24">
            <el-col :span="24">
              <el-form-item label="当前用户创建的数据集:" label-width="200">
                <el-tag
                  v-for="(item, index) in formData.data"
                  :key="index"
                  type="info"
                  style="margin-right: 5px; margin-bottom: 5px"
                  >{{ item }}
                </el-tag>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :span="24">
            <el-col :span="24">
              <el-form-item label="是否修改密码" label-width="200">
                <el-switch
                  v-model="changePWD"
                  active-color="rgba(74, 144, 234, 1)"
                  inactive-color="rgba(211, 211, 211, 1)"
                  active-value="1"
                  inactive-value="0"
                  @change="switchOperation"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <section v-if="changePWD === '1'" class="passwordContainer">
            <el-row>
              <el-col :span="12">
                <el-form-item label="新密码" prop="passwordNew">
                  <el-input
                    v-model="formData.passwordNew"
                    show-password
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="formData.confirmPassword"
                    show-password
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </section>
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
import { checkEmail, checkTel, checkMob } from "@/utils/rules";
import service from "./editPageServe";
import { aesEncrypt } from "@/util/password";

export default {
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
    // 效验密码和
    var checkPassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.formData.confirmPassword !== "") {
          this.$refs.form.validateField("confirmPassword");
        }
        callback();
      }
    };
    var checkUserPassWord = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.formData.passwordNew) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var checkUserName = (rule, value, callback) => {
      if (value) {
        let newv = value.replace(/\s/g, "");
        if (/^[a-zA-Z]\w{3,99}$/.test(newv) === false) {
          this.$message.error(
            "账号只能由字母、数字和下划线组成，且必须以字母开头，长度为4-100个中英文字符"
          );
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checkRealName = (rule, value, callback) => {
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
      roleIds: [],
      changePWD: 0,
      appOptions: [],
      depts: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      filterText: "",
      isEditPassword: false,
      loading: {},
      formData: {
        data: [],
        deptId: "",
        mobile: "",
        socialAccount: "",
        userName: "", // 账户名
        realName: "", // 姓名
        passwordNew: "", // 密码
        confirmPassword: "", // 确认密码，保存时去除
        email: "", // 邮件
        telephone: "", // 手机号码
        code: "", // 工号
        deptName: "", // 部门
        remark: "", // 备注
        roleId: "", // 角色
        status: "0", // 状态
        isNeedUpdatePassword: true,
        periodFrom: "",
        periodTo: "",
        defaultRouterId: "",
        defaultRouterName: "",
      },
      rules: {
        // 账户名效验
        userName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
          {
            validator: checkUserName,
            trigger: "blur",
          },
        ],
        realName: [
          {
            validator: checkRealName,
            trigger: "blur",
          },
        ],
        // 密码效验
        passwordNew: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            validator: checkPassword,
            trigger: "blur",
          },
        ],
        // 确认密码
        confirmPassword: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur",
          },
          {
            validator: checkUserPassWord,
            trigger: "blur",
          },
        ],
        // 手机号码效验
        mobile: [
          {
            required: false,
            pattern: checkTel,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        telephone: [
          {
            required: false,
            pattern: checkMob,
            message: "请输入正确的电话号码",
            trigger: "blur",
          },
        ],
        // 邮箱效验
        email: [
          {
            required: false,
            pattern: checkEmail,
            message: "请输入正确的邮箱",
            trigger: "blur",
          },
        ],
        // 角色效验
        roleId: [
          {
            required: true,
            message: "请选择角色",
            trigger: "change",
          },
        ],
        // 状态效验
        status: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
        // 账户有效期效验
        periodTo: [
          {
            required: true,
            message: " ",
            trigger: "change",
          },
        ],
        periodFrom: [
          {
            required: true,
            message: "请选择账号有效期",
            trigger: "change",
          },
        ],
      },
      // 时间只能选择今天及之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      pickerOptionsStart: {
        // 限制开始时间
        disabledDate: (time) => {
          if (this.formData.periodTo) {
            // 如果结束时间不为空，则小于结束时间
            return new Date(this.formData.periodTo).getTime() < time.getTime();
          } else {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            );
          }
        },
      },
      pickerOptionsEnd: {
        // 限制开始时间
        disabledDate: (time) => {
          if (this.formData.periodFrom) {
            // 如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(this.formData.periodFrom).getTime() > time.getTime()
            );
          } else {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            );
          }
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
          title = "新增账号";
          break;
        case "edit":
          title = "编辑账号";
          break;
        default:
          title = "账号信息";
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
    this.queryAllOrg().then((content) => {
      this.depts = content;
    });
    this.getFunctionList().then((content) => {
      this.appOptions = this.dealFunctionList(content, this.roleIds);
    });
  },
  methods: {
    inputUserName() {
      this.formData.userName = this.formData.userName.replace(" ", "");
    },
    reqFunctions(id) {
      // 默认应用置空
      this.$refs.tree.setCheckedKeys([]);
      this.queryFunctionByIds({ idList: [id] }).then(
        (content) => {
          this.roleIds = content;
          this.appOptions = this.dealFunctionList(
            this.appOptions,
            this.roleIds
          );
        },
        () => {}
      );
    },
    dealFunctionList(content, roleIds) {
      for (let item of content) {
        if (item.children.length > 0) {
          item.disabled = true;
          this.dealFunctionList(item.children, this.roleIds);
        } else {
          if (roleIds.length > 0) {
            if (!roleIds.includes(item.code)) {
              // debugger
              this.$set(item, "disabled", true);
              // item.disabled = true
            } else {
              this.$set(item, "disabled", false);
            }
          }
        }
      }
      return content;
    },
    setSelectedNode(data) {
      this.$refs.tree.setCheckedNodes([data]);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    switchOperation() {},
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
          // 编辑修改密码
          if (this.changePWD.toString() === "1" && this.type !== "newly") {
            Object.assign(this.formData, {
              passwordNew: aesEncrypt(this.formData.passwordNew),
              password: aesEncrypt(this.formData.passwordNew),
            });
            // 编辑不修改密码
          } else if (
            this.changePWD.toString() === "0" &&
            this.type !== "newly"
          ) {
            delete this.formData.passwordNew;
            // 新建
          } else if (this.type === "newly") {
            Object.assign(this.formData, {
              passwordNew: aesEncrypt(this.formData.passwordNew),
              password: aesEncrypt(this.formData.passwordNew),
            });
            if (this.formData.isNeedUpdatePassword) {
              Object.assign(this.formData, {
                isNeedUpdatePassword: 1,
              });
            } else {
              Object.assign(this.formData, {
                isNeedUpdatePassword: 0,
              });
            }
          }
          Object.assign(this.formData, {
            defaultRouterId: this.$refs.tree.getCheckedKeys()[0]
              ? this.$refs.tree.getCheckedKeys()[0]
              : "",
            defaultRouterName: this.$refs.tree.getCheckedKeys()[0]
              ? this.$refs.tree.getCheckedNodes()[0].label
              : "",
          });
          this.type === "newly" ? this.addUser() : this.addUser(this.selectId);
        }
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.account-permission-dialog-container {
  >>> .dept-class {
    /* max-width: 200px; */
    width: 180px;
    /* .el-select-dropdown__item {
      span {
        color: red;
      }
    } */
  }

  .filter-tree {
    height: 280px;
    overflow-y: auto;
    margin-top: 5px;
    border: 1px solid #cecece;
  }

  >>> .el-dialog__body {
    max-height: 420px;
    overflow-y: auto;
    overflow-x: hidden;

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
}
</style>
