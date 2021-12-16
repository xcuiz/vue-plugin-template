<!--
 * @Author: your name
 * @Date: 2020-03-19 20:41:47
 * @LastEditTime: 2021-05-24 15:14:37
 * @LastEditors: yincheng
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/fusion-components/Breadcrumb/index.vue
 -->
<template>
  <!-- 首页不显示 -->
  <el-breadcrumb class="app-breadcrumb" separator=">" v-show="breadcrumb && breadcrumb.length">
  <el-breadcrumb-item class="home">
    <idss-icon-svg name="home" :to="{ name: '/' }"/>
  </el-breadcrumb-item>
  <el-breadcrumb-item
    v-for="item in breadcrumb"
    :to="item.path?{name: item.path}:''"
    :key="item.name">
    {{item.name}}
  </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  export default {
    computed:{
      breadcrumb(){
        return  this.$route.meta.breadcrumb;
      }
    },
  }
</script>

<style lang="postcss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: flex;
  align-items: center;
  font-size: var(--font-size-12);
  height: 32px;
  padding: 0 16px;
  background: var(--white);
  z-index: 1;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
  >>> .el-breadcrumb__separator {
    margin: 0 4px;
  }
  .home {
    margin-right: 7px;
    cursor: pointer;
    >>> .el-breadcrumb__separator {
      display: none;
    }
    >>> .idss-svg-icon {
      /* width: 14px; */
      height: 12px;
      vertical-align: text-top;
    }
  }
  >>> .el-breadcrumb__item:nth-of-type(2) {
    .el-breadcrumb__inner {
      color: #3c5679;
    }
  }
  /* >>> .el-breadcrumb__item:nth-of-type(3) {
    .el-breadcrumb__inner {
      color: #9dabbc;
    }
  } */
}
</style>
