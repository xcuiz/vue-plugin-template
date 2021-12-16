<template>
  <div class="idss-error-page">
    <img src="./../../assets/images/500.png" />
    <div>
      <h1>服务器发生未知错误</h1>
      <button>
        <router-link :to="{ name: 'index' }" tag="span"
          >返回系统首页</router-link
        >
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Permission500",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
@import "permission.css";
</style>
