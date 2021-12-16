<template>
  <div
    v-loading="loading['login']"
    class="idss-login"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="login-title">
      <img :src="projectIcon$$.logo" />
      <span>{{ projectIcon$$.title }}</span>
    </div>
    <div ref="login" class="idss-login-box">
      <h4 class="idss-login-box-title">修改密码</h4>
      <h6 class="idss-login-box-title-tips">
        {{ tips }}
      </h6>
      <el-form
        ref="loginForm"
        class="idss-login-forms"
        :rules="resetPwdRules"
        :model="loginForm"
        @submit.native.prevent
      >
        <template>
          <div>
            <el-form-item
              prop="oldPwd"
              :rules="{ required: true, message: '原密码不能为空' }"
            >
              <el-input
                v-model.trim="loginForm.oldPwd"
                show-password
                placeholder="原密码"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="newPwd">
              <el-input
                v-model="loginForm.newPwd"
                show-password
                placeholder="新密码"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="confirmPwd">
              <el-input
                v-model="loginForm.confirmPwd"
                show-password
                placeholder="确认密码"
              ></el-input>
            </el-form-item>
            <el-form-item class="login-button-container">
              <el-button class="login-button" @click.enter="resetPwd"
                >确 认
              </el-button>
            </el-form-item>
          </div>
        </template>
      </el-form>
    </div>
    <div class="idss-footer">版权所有©上海观安信息技术股份有限公司</div>
  </div>
</template>
<script>
import { aesEncrypt } from "@/util/password";
import { mapGetters } from "vuex";
const API = {
  RESET_PASSWORD: {
    url: "/gov/api/sys/user/password",
    method: "post",
    tag: "auth-code",
  },
  GET_ALERT_MESSAGE: {
    url: "/gov/api/sys/user/message",
    method: "get",
  },
};

export default {
  name: "PasswordReset",
  data() {
    // 效验密码和
    var checkPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.loginForm.confirmPwd !== "") {
          this.$refs["loginForm"].validateField("confirmPwd");
        }
        callback();
      }
    };
    var checkConfirmPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.loginForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: {},
      // 用户登录 - 表单
      loginForm: {
        userName: "",
        password: "",
        authCode: "",
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      resetPwdRules: {
        // 密码效验
        newPwd: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            validator: checkPwd,
            trigger: "blur",
          },
        ],
        // 确认密码
        confirmPwd: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur",
          },
          {
            validator: checkConfirmPwd,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters("base", ["projectIcon$$"]),
    // 提示语，区分首次登陆和密码过期
    tips() {
      return this.$route.query.userName
        ? "密码已过期，请修改密码！"
        : "首次登录成功,为了保证您的账户安全,请修改密码!";
    },
  },
  methods: {
    /**
     * 密码重置
     */
    resetPwd() {
      this.$refs["loginForm"].validate(async (valid) => {
        if (valid) {
          let requestData = {
            passwordOld: aesEncrypt(this.loginForm.oldPwd),
            password: aesEncrypt(this.loginForm.newPwd),
            passwordConfirm: aesEncrypt(this.loginForm.confirmPwd),
          };
          const { userName, routePage } = this.$route.query;
          let res = await this.$requestAll({
            ...API.RESET_PASSWORD,
            method: "post",
            data: {
              ...requestData,
              userName,
            },
          });
          if (res.status === "success") {
            // 有useName：密码过期，跳转到登陆页面
            // 无userName：初次登陆，跳转到系统首页
            // todo ，跳转到默认登陆页面
            userName
              ? this.$router.push({ name: "login" })
              : this.$router.push({ name: routePage });
          }
        }
      });
    },
  },
};
</script>
<style scoped>
@import "./login.css";
.success-button {
  width: 50px;
  height: 50px;
  fill: #6cf58a80;
}
</style>
