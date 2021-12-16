<!--
 * @Author: yincheng
 * @Date: 2021-04-23 15:53:40
 * @LastEditors: yincheng
 * @LastEditTime: 2021-04-26 13:55:53
-->
<template>
  <el-card shadow="hover" class="info-card">
    <img class="card-icon" src="@/assets/images/u14.png" />
    <div>
      <div class="title">
        {{ title }}
        <el-popover v-if="tips" :title="tips" trigger="hover">
          <i slot="reference" class="el-icon-warning-outline"></i>
          <!-- eslint-disable-next-line vue/no-v-html -->
        </el-popover>
      </div>
      <div class="content">
        {{ content }}
      </div>
    </div>
  </el-card>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
    },
    tips: {
      type: String,
    },
    content: {
      type: String,
    },
  },
};
</script>
<style lang="postcss" scoped>
.info-card {
  >>> .el-card__body {
    display: flex;
    height: 99px;
  }
  .card-icon {
    width: 56px;
    height: 56px;
    margin-right: 20px;
  }

  .title {
    color: #777;
    font-size: 14px;
    line-height: 22px;
  }

  .content {
    font-size: 26px;
  }

  .normal-style {
    font-size: 16px;
    line-height: 28px;
  }
}
</style>
