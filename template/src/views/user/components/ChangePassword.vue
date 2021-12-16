<!--
 * @Author: your name
 * @Date: 2020-07-31 15:13:59
 * @LastEditTime: 2020-08-05 11:26:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/user/components/ChangePassword.vue
-->
<template>
  <div>
    <el-form
      ref="loginForm"
      primary
      label-width="130px"
      size="mini"
      :rules="resetPwdRules"
      :model="loginForm"
      @submit.native.prevent
    >
      <el-form-item
        label="原密码"
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
      <el-form-item label="新密码" prop="newPwd">
        <el-input v-model="loginForm.newPwd" show-password placeholder="新密码">
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input
          v-model="loginForm.confirmPwd"
          show-password
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item class="login-button-container">
        <el-button  class="login-button" @click.enter="resetPwd">确  认 </el-button>
      </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { aesEncrypt } from "@/util/password";
export default {
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
  methods: {
    resetPwd() {
      return new Promise((resolve, reject) => {
        this.$refs["loginForm"].validate(async (valid) => {
          if (valid) {
            let requestData = {
              passwordOld: aesEncrypt(this.loginForm.oldPwd),
              password: aesEncrypt(this.loginForm.newPwd),
              passwordConfirm: aesEncrypt(this.loginForm.confirmPwd),
            };
            try {
              const res = await this.$requestAll({
                url: "/gov/api/sys/user/password",
                method: "post",
                data: {
                  ...requestData,
                },
              });
              if (res.status === "success") {
                this.$message.success(res.message || "密码修改成功！");
                resolve(true);
              } else {
                resolve(false);
              }
            } catch (error) {
              reject(error);
            }
          }
        });
      });
    },
  },
};
</script>

<style></style>
