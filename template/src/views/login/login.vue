<template>
  <div
    v-loading="loading['login']"
    class="idss-login"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <!-- <img class="login-title"  :src="loginTitle" @click="isResetPwd = false"/> -->
    <div class="login-title">
      <!-- <img :src="projectIcon$$.logo" />
      <span>{{ projectIcon$$.title }}</span> -->
      <idss-icon-svg class="logo" name="ChinaMobile-2"></idss-icon-svg>
      <span class="title">浙江移动数据治理中心</span>
    </div>
    <div ref="login" class="idss-login-box">
      <h4 class="idss-login-box-title">欢迎登录</h4>
      <el-form
        ref="loginForm"
        class="idss-login-forms"
        :model="loginForm"
        @submit.native.prevent
      >
        <!-- 用户名或密码 错误提示 -->
        <transition name="el-zoom-in-top">
          <p
            v-if="loginFormError.userName"
            class="idss-login--error idss-txt--center"
          >
            {{ loginFormError.userName }}
          </p>
        </transition>
        <template>
          <el-form-item
            prop="userName"
            :rules="{ required: true, message: '用户名不能为空' }"
          >
            <el-input
              v-model.trim="loginForm.userName"
              placeholder="用户名"
              @blur="handleBlur"
            >
              <template slot="prefix">
                <idss-icon-svg name="user"></idss-icon-svg>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="{ required: true, message: '用户密码不能为空' }"
          >
            <el-input
              v-model.trim="loginForm.password"
              type="password"
              placeholder="密码"
              maxlength="32"
              @blur="handleBlur"
            >
              <template slot="prefix">
                <idss-icon-svg name="clock"></idss-icon-svg>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item
            class="idss-login-code"
            prop="authCode"
            :rules="{ required: true, message: '验证码不能为空' }"
            :error="loginFormError.authCode"
          >
            <el-input
              v-model="loginForm.authCode"
              prop="code"
              placeholder="验证码"
              maxlength="4"
              @keyup.enter.native="login"
            >
              <template slot="prefix">
                <idss-icon-svg name="fengxian"></idss-icon-svg>
              </template>
              <template slot="append">
                <span
                  v-if="authCodeSrc"
                  v-loading="loading['auth-code']"
                  @click="getAuthCode"
                >
                  <img :src="authCodeSrc" alt="authCode" />
                </span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="login-button-container">
            <el-button class="login-button" @click.enter="login"
              >登 录
            </el-button>
          </el-form-item>
          <el-form-item class="idss-login-link" size="small">
            <a @click="changeMode('loginForm')">忘记密码？</a>
          </el-form-item>
        </template>
      </el-form>

      <!--      重置密码-->
      <!--      <el-form-->
      <!--        v-if = "isResetPwd && !isResetPwdSuccess"-->
      <!--        class="idss-login-forms"-->
      <!--        ref="resetPwdForm"-->
      <!--        :rules="resetPwdRules"-->
      <!--        :model="resetPwdForm">-->
      <!--        <el-form-item prop="oldPwd" :rules="{required: true, message: '原密码不能为空'}">-->
      <!--          <el-input v-model.trim="loginForm.oldPwd" show-password placeholder="原密码">-->
      <!--          </el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item prop="newPwd">-->
      <!--          <el-input v-model="loginForm.newPwd" show-password placeholder="新密码">-->
      <!--          </el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item  prop="confirmPwd">-->
      <!--          <el-input v-model="loginForm.confirmPwd" show-password placeholder="确认密码"></el-input>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item class="login-button-container">-->
      <!--          <el-button  class="login-button" @click.enter="resetPwd">确  认 </el-button>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->

      <!--      重置成功提示-->
      <!--      <el-form-->
      <!--        v-if = "isResetPwdSuccess && !isResetPwd"-->
      <!--        class="idss-login-forms"-->
      <!--        ref="resetPwdForm"-->
      <!--        :model="resetPwdSuccessForm"-->
      <!--        @submit.native.prevent>-->
      <!--        &lt;!&ndash; 用户名或密码 错误提示 &ndash;&gt;-->
      <!--        <div style="font-size: 14px; font-weight: normal; color: ##5d87dd;margin-top: 12px;margin-right: 20px;text-align: center">-->
      <!--          <idss-icon-svg  class="success-button" name="success" ></idss-icon-svg>-->
      <!--        </div>-->
      <!--        <el-form-item class="login-button-container">-->
      <!--          <span></span>-->
      <!--        </el-form-item>-->
      <!--        <el-form-item class="login-button-container">-->
      <!--          <el-button  class="login-button" @click.enter="reLogin">重新登陆 </el-button>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
    </div>
    <div class="idss-footer">版权所有©上海观安信息技术股份有限公司</div>
  </div>
</template>
<script>
import { getErrorMsgByEnd } from "@/util/base";
// import { aesEncrypt } from "@/util/password";
import { mapGetters } from "vuex";
const API = {
  LOGIN: {
    url: "/gov/api/login",
    method: "post",
    tag: "login",
  },
  FORGOT_PWD: {
    url: "/gov/api/password-find",
    method: "post",
    tag: "login",
  },
  AUTH_CODE: {
    url: "/gov/api/authcode",
    method: "get",
    tag: "auth-code",
  },
  GET_ALERT_MESSAGE: {
    url: "/gov/api/sys/user/message",
    method: "get",
  },
};

export default {
  name: "Login",
  data() {
    return {
      loading: {},
      currentMode: "login", // 当前状态：默认登录 login ，forgotPwd：忘记密码
      // 用户登录 - 表单
      loginForm: {
        userName: "",
        password: "",
        authCode: "",
        oldPwd: "",
        newPwd: "",
        confirmPwd: "",
      },
      loginFormError: {}, // 错误提示
      authCodeSrc: "", // 验证码
      authToken: "", // 验证验证码 token
      authType: "", // 区分缓存方式
      // 忘记密码 - 表单
      forgotPwdForm: {
        userName: "",
        email: "",
      },
      forgotPwdFormError: {}, // 错误提示
      // loginTitle: require('@/assets/images/logo.svg')
    };
  },
  computed: {
    ...mapGetters("base", ["projectIcon$$"]),
  },
  created() {
    // 获取验证码
    this.getAuthCode();
  },
  methods: {
    /**
     * 改变当前视图模式
     * @params type: 要更改的模式类型
     */
    changeMode(type) {
      this.$refs[type].clearValidate();
      this.currentMode = this.currentMode === "login" ? "forgotPwd" : "login";
    },
    /**
     * **************** 登录相关方法 ****************
     */
    /**
     * 获取验证码
     */
    async getAuthCode() {
      let content = await this.$request(
        {
          ...API.AUTH_CODE,
        },
        {
          responseType: "blob",
        }
      );
      const { authtoken, authType } = content.headers;
      // token存储，用于非验证码接口以外 的接口 headers
      this.$store.commit("base/token$$", authtoken);
      this.$store.commit("base/authType$$", authType);

      // 保留，因token优先取headers的值，headers的值为空，再去body中值
      this.authToken = content.headers.authtoken;
      this.authType = content.headers.authType;
      this.authCodeSrc = URL.createObjectURL(new Blob([content.data]));
    },

    /**
     * 登录 - 用户名和密码失去焦点事件
     */
    handleBlur() {
      this.loginFormError = {};
    },

    /**
     * 用户登录
     */
    login() {
      this.$refs["loginForm"].validate(async (valid) => {
        if (valid) {
          // 记录userName，便于后续 重置密码、密码有效期过期 时使用，入参
          // sessionStorage.setItem('userNameTemple', this.)
          this.loginFormError = {};
          // let requestData = Object.assign({}, this.loginForm, {
          //   password: aesEncrypt(this.loginForm.password),
          // });
          try {
            // LOGIN COMMENTS
            // let {
            //   token,
            //   authType,
            //   isNeedUpdatePaddword,
            //   defaultRouterId,
            // } = await this.$request({
            //   ...API.LOGIN,
            //   data: {
            //     ...requestData,
            //     authToken: this.authToken,
            //     authType: this.authType,
            //   },
            // });
            let {
              token,
              authType,
              isNeedUpdatePaddword,
              defaultRouterId,
            } = require("../../../mock/login.json").content;
            // 存储 token
            this.$store.commit("base/token$$", token);
            this.$store.commit("base/authType$$", authType);
            // 请求用户信息
            this.$store.dispatch("base/userInfo$$");
            // 路由跳转
            // debugger
            let { redirect } = this.$route.query;
            if (redirect) {
              delete this.$route.query.redirect;
              this.$router.push({
                path: redirect,
              });
            } else {
              if (isNeedUpdatePaddword === "1") {
                this.$router.push({
                  name: "password-reset",
                  query: {
                    routePage: defaultRouterId,
                  },
                });
              } else {
                this.$router.push({ name: defaultRouterId || "index" });
                // 登陆成功，提示语，主要是提示密码多久到期
                // setTimeout(() => {
                this.getMessageAlert();
                // }, 2000)
              }
            }
          } catch (error) {
            const { errorCode } = error;
            // 根据错误码判断业务逻辑
            switch (errorCode) {
              case "001":
                return this.$router.push({
                  name: "licence",
                });
              case "002":
                return this.$router.push({
                  name: "password-reset",
                  query: {
                    userName: this.loginForm.userName,
                  },
                });
              default:
            }
            // 错误提示
            this.getAuthCode();
            this.loginFormError = getErrorMsgByEnd(error);
          }
        } else {
          return false;
        }
      });
    },
    // 密码有效期提示语
    async getMessageAlert() {
      const res = await this.$request({
        url: `/gov/api/sys/user/message`,
      });
      // if (res.status !== 'success') {
      Array.isArray(res) &&
        res.length &&
        this.$message({
          showClose: true,
          type: "warning",
          message: Array.isArray(res) ? res[0].message : "异常",
          duration: 6000,
        });
      // }
    },
    /**
     * **************** 忘记密码相关方法 ****************
     */
    /**
     * 忘记密码 - 用户名和email时区焦点事件
     */
    HandleBlurForgotPwd() {
      this.forgotPwdFormError = {};
    },

    /**
     * 找回密码
     */
    findPassword() {
      this.$refs["forgotPwdForm"].validate(async (valid) => {
        if (valid) {
          let resetPwdHref = this.$router.resolve({ name: "password-reset" })
            .href;
          this.forgotPwdFormError = {};
          try {
            await this.$request({
              ...API.FORGOT_PWD,
              data: {
                ...this.forgotPwdForm,
                locationHref: `${location.origin}${resetPwdHref}`,
              },
            });
            // 找回密码成功
            this.$message({
              type: "success",
              message: "验证成功，请前往邮箱继续找回密码操作",
              duration: 6000,
            });
            this.$refs["forgotPwdForm"].resetFields();
          } catch (error) {
            // 错误提示
            this.forgotPwdFormError = getErrorMsgByEnd(error);
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
.logo {
  width: 102px;
  height: 28px;
  margin: 0 6px 0 16px;
  vertical-align: inherit;
  color: #fff;
  fill: #fff;
}
</style>
