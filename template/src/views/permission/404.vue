<template>
  <div class="idss-error-page">
    <img src="./../../assets/images/404.png" />
    <div>
      <h1>您当前的账号,没有访问当前页面的权限!</h1>
      <button @click="backToLogin">返回登录页</button>
    </div>
  </div>
</template>
<script>
import userMixins from "@/mixins/userMixins.js";
export default {
  name: "Permission404",
  mixins: [userMixins],
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    backToLogin() {
      this.logout();
    },
  },
};
</script>

<style scoped>
@import "permission.css";
</style>
