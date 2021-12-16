<!--
 * @Author: your name
 * @Date: 2020-07-31 14:54:36
 * @LastEditTime: 2020-09-07 16:37:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/user/components/EditUserInfoDialog.vue
-->
<template>
  <el-dialog
    class="edit-user-info-dialog"
    custom
    :close-on-click-modal="false"
    title="编辑账号信息"
    :visible="visible"
    @close="closeDialog"
  >
    <article
      v-loading="loading['init']"
      class="editPage"
      element-loading-text="保存中"
      element-loading-spinner="el-icon-loading"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="rules"
        primary
        label-width="120px"
        size="small"
        plain
        type="text"
      >
        <el-row>
          <el-form-item label="账号名：">
            <el-input v-model.trim="formData.userName" disabled size="mini" />
          </el-form-item>
          <el-form-item label="角色：">
            <el-input v-model.trim="formData.roleName" disabled size="mini" />
          </el-form-item>
          <el-form-item label="账号有效期：">
            <el-input v-model.trim="periodTime" disabled size="mini" />
          </el-form-item>
          <el-form-item label="所属组织：">
            <el-input v-model.trim="formData.orgName" disabled size="mini" />
          </el-form-item>
          <!-- <el-form-item label="部门：">
            <el-input disabled size="mini" v-model="data.ss" />
          </el-form-item> -->
          <el-form-item label="全称：" prop="realName">
            <el-input v-model.trim="formData.realName" size="mini" />
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model.trim="formData.email" size="mini" />
          </el-form-item>
          <el-form-item label="手机号码：" prop="mobile">
            <el-input v-model.trim="formData.mobile" size="mini" />
          </el-form-item>
          <el-form-item label="电话号码：" prop="telephone">
            <el-input v-model.trim="formData.telephone" size="mini" />
          </el-form-item>
        </el-row>
      </el-form>
    </article>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="handleSaveForm">
        保 存
      </el-button>
      <el-button size="small" @click="closeDialog"> 取 消 </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { checkTel, checkEmail, checkMob } from "@/utils/rules.js";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      loading: {},
      formData: {
        userName: "",
        roleName: "",
        orgName: "",
        realName: "",
        email: "",
        mobile: "",
        telephone: "",
        periodFrom: "",
        periodTo: "",
      },
      rules: {
        realName: [
          {
            required: false,
            pattern: /(^$)|(^[\u4E00-\u9FA5a-zA-Z0-9,，]{1,250}$)/,
            message: "请输入正确全称",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: false,
            pattern: checkEmail,
            message: "请输入正确的邮箱",
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
      },
      periodTime: "",
    };
  },
  watch: {
    data: {
      handler(val) {
        this.formData = Object.assign(this.formData, val);
        this.periodTime =
          this.formData.periodFrom + " -  " + this.formData.periodTo;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
    },
    handleSaveForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          try {
            const res = await this.$requestAll({
              url: `/gov/api/sys/user/myself`,
              method: "put",
              tag: "init",
              data: this.formData,
            });
            if (res.status === "success") {
              // 修改vuex值
              this.$store.commit("base/userInfo$$", this.formData);
              this.$message.success(res.message || "保存成功！");
              return this.closeDialog();
            }
          } catch (error) {
            //
          }
        }
      });
    },
  },
};
</script>
