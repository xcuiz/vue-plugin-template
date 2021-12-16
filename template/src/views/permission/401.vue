<template>
  <div class="idss-error-page">
    <img src="./../../assets/images/401.png" />
    <div>
      <h1>登录失效或登录信息已失效，即将返回登录页面 {{ count }}</h1>
      <button @click="handleLogout">重新登录</button>
    </div>
  </div>
</template>
<script>
import userMixins from "@/mixins/userMixins";

export default {
  name: "Permission401",
  mixins: [userMixins],
  data() {
    return {
      count: 5,
    };
  },
  mounted() {
    this.countDown();
  },
  methods: {
    // 退出系统
    handleLogout() {
      this.logout();
    },
    // 倒计时
    countDown() {
      this.interval = setInterval(() => {
        this.count--;
        if (this.count === 1) {
          clearInterval(this.interval);
          this.handleLogout();
        }
      }, 1000);
    },
  },
};
</script>

<style scoped>
@import "permission.css";
</style>
