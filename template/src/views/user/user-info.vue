<template>
  <el-dialog
    :visible.sync="dialogVisible"
    title="个人详情"
    append-to-body
    custom
    class="idss-dialog__info"
    :close-on-click-modal="false"
    width="850px"
  >
    <!-- 用户信息列表 start -->
    <el-form label-width="130px" size="small" plain type="text">
      <el-row>
        <el-col :span="8" :offset="3">
          <el-form-item label="用户账号：">
            {{ data.saltKey }}
          </el-form-item>
          <el-form-item label="用户工号：">
            {{ data.userNumber }}
          </el-form-item>
          <el-form-item label="联系电话：">
            {{ data.telephone }}
          </el-form-item>
          <el-form-item label="部门：">
            {{ data.sysDepart }}
          </el-form-item>
          <el-form-item label="角色：">
            {{ data.sysRole }}
          </el-form-item>
          <el-form-item label="账号使用开始日：">
            {{ data.createTime }}
          </el-form-item>
          <el-form-item label="最后登录IP：">
            {{ data.finalLoginIp }}
          </el-form-item>
          <el-form-item label="最后登录时间：">
            {{ data.finalLoginDate }}
          </el-form-item>
          <el-form-item>
            <el-button
              class="pass-button"
              :class="{ 'is-reverse': passwordCollapse }"
              size="medium"
              type="text"
              @click="passwordCollapse = !passwordCollapse"
            >
              修改密码
              <idss-icon-svg name="arrow-botton"></idss-icon-svg>
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8" :push="2">
          <el-form-item label="用户姓名：">
            {{ data.name }}
          </el-form-item>
          <el-form-item label="用户性别：">
            {{ USER_SEX[data.sex] }}
          </el-form-item>
          <el-form-item label="电子邮箱：">
            {{ data.email }}
          </el-form-item>
          <el-form-item label="直属领导：">
            {{ data.leader }}
          </el-form-item>
          <el-form-item label="账号使用结束日：" style="margin-top: 42px">
            {{ data.expiredTime }}
          </el-form-item>
          <!-- <el-form-item label="状态：">
            {{USER_STATUS[data.status]}}
          </el-form-item> -->
        </el-col>
      </el-row>
    </el-form>
    <!-- 用户信息列表 end -->
    <!-- 修改密码 - 表单 start -->
    <idss-collapse
      v-loading="loading['changePass']"
      :collapse.sync="passwordCollapse"
      hide-header
      style="margin: 0 -20px"
    >
      <el-form
        ref="pwdForm"
        :model="pwdForm"
        label-width="130px"
        size="small"
        class="idss-form-special"
      >
        <el-row>
          <el-col :span="20" :offset="4">
            <el-form-item
              prop="passwordOld"
              :rules="pwdRules.passwordOld"
              label="原密码："
              :error="pwdFormError.passwordOld"
            >
              <el-col :span="12">
                <el-input
                  v-model="pwdForm.passwordOld"
                  type="password"
                  size="small"
                  placeholder="长度8-32位，不能为空"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              prop="password"
              :rules="pwdRules.password"
              label="新密码："
              :error="pwdFormError.password"
            >
              <el-col :span="12">
                <el-input
                  v-model="pwdForm.password"
                  type="password"
                  size="small"
                  placeholder="长度8-32位，不能为空"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item
              prop="passwordConfirm"
              :rules="pwdRules.passwordConfirm"
              label="确认密码："
              :error="pwdFormError.passwordConfirm"
            >
              <el-col :span="12">
                <el-input
                  v-model="pwdForm.passwordConfirm"
                  type="password"
                  size="small"
                  placeholder="长度8-32位，不能为空，和新密码相同"
                ></el-input>
              </el-col>
            </el-form-item>
            <el-form-item>
              <el-button size="medium" custom @click.enter="changePassword"
                >保存</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </idss-collapse>
    <!-- 修改密码 - 表单 end -->
    <div class="id-s-txt--center idss-layout--marginT">
      <el-button size="medium" custom @click="dialogVisible = false"
        >关闭</el-button
      >
    </div>
  </el-dialog>
</template>
<script>
import { getErrorMsgByEnd } from "@/util/base";
import globalMixins from "@/mixins/globalMixins";
import { aesEncrypt, validatePwd } from "@/util/password";
import { USER_SEX, USER_STATUS } from "@/util/const";

const API = {
  CHANGE_PASSWORD: {
    url: "/gov/api/sys/sys-user/password",
    method: "post",
    tag: "changePass",
  },
};

export default {
  name: "IdssUserInfo",
  mixins: [globalMixins],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      passwordCollapse: true, // 修改密码展开收起控制
      USER_SEX: USER_SEX, // 性别列表
      USER_STATUS: USER_STATUS, // 用户状态列表
      // 修改秘密表单
      pwdForm: {
        passwordOld: "",
        password: "",
        passwordConfirm: "",
      },
      // 修改密码验证规则
      pwdRules: {
        passwordOld: [
          { required: true, message: "请输入原密码", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
          { validator: this.checkNewPasswordRepeat, trigger: "blur" },
        ],
        passwordConfirm: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
          { validator: this.checkPasswordRepeat, trigger: "blur" },
        ],
      },
      pwdFormError: {}, // 修改秘密错误提示
    };
  },
  computed: {
    // 用户信息
    data() {
      return this.$store.getters["base/userInfo$$"];
    },
    // 弹窗显示隐藏控制
    dialogVisible: {
      get() {
        // 获取用户信息
        if (this.visible) {
          this.$store.dispatch("base/userInfo$$");
        }
        return this.visible;
      },
      set(newVal) {
        if (!newVal) this.init();
        this.$emit("update:visible", newVal);
      },
    },
  },
  methods: {
    /**
     * 密码校验 - 新密码与原密码重复性校验
     */
    checkNewPasswordRepeat(rule, value, callback) {
      if (value === this.pwdForm.passwordOld) {
        callback(new Error("新密码和原密码不能相同"));
      } else {
        callback();
      }
    },

    /**
     * 密码校验 - 新密码一致性校验
     */
    checkPasswordRepeat(rule, value, callback) {
      if (value !== this.pwdForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    },

    /**
     * 修改密码
     */
    changePassword() {
      this.$refs["pwdForm"].validate(async (valid) => {
        if (valid) {
          // 重置错误提示
          this.pwdFormError = {};
          // 秘密加密处理
          let requestData = {
            passwordOld: aesEncrypt(this.pwdForm.passwordOld),
            password: aesEncrypt(this.pwdForm.password),
            passwordConfirm: aesEncrypt(this.pwdForm.passwordConfirm),
          };
          try {
            await this.$request({
              ...API.CHANGE_PASSWORD,
              data: { ...requestData },
            });
            // 成功提示
            this.showMessage("密码修改成功", "success");
            this.$refs["pwdForm"].resetFields();
            this.$router.push({
              name: "login",
            });
          } catch (error) {
            // 错误提示
            this.pwdFormError = getErrorMsgByEnd(error);
          }
        }
      });
    },

    /**
     * 初始化
     */
    init() {
      this.$refs["pwdForm"].resetFields();
      this.passwordCollapse = true;
    },
  },
};
</script>
<style scoped>
.idss-dialog__info {
  .idss-form-special {
    background-color: var(--switch-border-color);
    padding-top: 20px;
    border-top: var(--border-default);
    border-bottom: var(--border-default);
  }

  .pass-button {
    position: relative;
    left: -71px;
    /* 反转 */
    &.is-reverse {
      & .idss-svg-icon {
        transform: rotate(180deg);
      }
    }
    .idss-svg-icon {
      width: 1.2em;
      height: 1.2em;
      margin-left: 10px;
    }
  }
}
</style>
