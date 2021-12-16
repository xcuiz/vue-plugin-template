<template>
  <div class="idss-error-page">
    <img src="./../../assets/images/403.png" />
    <div>
      <h1>您无权访问此页面</h1>
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
  name: "Permission403",
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
