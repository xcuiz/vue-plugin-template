<template>
  <div v-loading="loading" class="container"></div>
</template>
<script>
const API = {
  SMP_LOGIN: {
    url: "/gov/api/smp-login",
    method: "post",
  },
  SSO_LOGIN: {
    url: "/gov/api/sso-login",
    method: "post",
  },
};
export default {
  name: "Redirect",
  data() {
    return {
      loading: true,
      redirectRouterParam: this.$route.query.type,
    };
  },
  created() {
    this.login();
  },
  methods: {
    async login() {
      let index = this.$route.fullPath.indexOf("?") + 1;
      let ssoParam = { redirectParams: this.$route.fullPath.substr(index) };
      let redirectType = {
        smp: API.SMP_LOGIN,
        sso: API.SSO_LOGIN,
      };
      let redirectData = {
        sso: ssoParam,
      };
      let isIncludeType = Object.keys(redirectType).includes(
        this.redirectRouterParam
      );
      if (!isIncludeType) {
        this.$message.error("请输入正确地址！");
        this.loading = false;
        return;
      }
      try {
        let { token } = await this.$request({
          ...redirectType[this.redirectRouterParam],
          data: redirectData[this.redirectRouterParam],
        });
        if (token) {
          this.loading = false;
          // 存储 token
          this.$store.commit("base/token$$", token);
          this.$router.push({ name: "index" });
        } else {
          this.$message.error("无token！");
        }
      } catch (error) {
        this.$message.error(error.message[0].message);
      }
    },
  },
};
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #434343, #333, #242424);
}
</style>
