<!--
 * @Author: your name
 * @Date: 2020-07-31 15:28:51
 * @LastEditTime: 2020-08-04 11:24:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/user/components/ChangePassDialog.vue
-->
<template>
  <el-dialog
    custom
    append-to-body
    :close-on-click-modal="false"
    title="修改密码"
    :visible="visible"
    @close="closeDialog"
  >
    <article>
      <change-password ref="password" />
    </article>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="small" @click="handleSave">
        确定
      </el-button>
      <el-button size="small" @click="closeDialog"> 取消 </el-button>
    </span>
  </el-dialog>
</template>

<script>
import ChangePassword from "@/views/user/components/ChangePassword.vue";
export default {
  components: {
    ChangePassword,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
    },
    async handleSave() {
      try {
        const res = await this.$refs["password"].resetPwd();
        res && this.closeDialog();
      } catch (error) {
        //
      }
    },
  },
};
</script>

<style></style>
