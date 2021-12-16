<!--
 * @Author: your name
 * @Date: 2020-10-30 14:00:49
 * @LastEditTime: 2020-11-11 17:02:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/insight/components/PageHeader.vue
-->
<template>
  <header class="page-header">
    <h3 class="title">
      {{ title }}
      <el-popover
        placement="left-start"
        title="帮助"
        width="600"
        trigger="hover"
      >
        <idss-icon-svg v-if="!!tips" slot="reference" class="" name="help" />
        <!-- eslint-disable-next-line vue/no-v-html -->
        <section style="white-space: pre-wrap" v-html="tips"></section>
      </el-popover>
    </h3>
    <slot></slot>
  </header>
</template>

<script>
export default {
  name: "PageHeader",
  props: {
    title: {
      type: String,
      required: true,
    },
    // 帮助信息
    tips: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="postcss">
.page-header {
  display: flex;
  padding-top: 10px;
  padding-bottom: 20px;
  font-size: var(--font-size-16);
  font-weight: 700;
  .title {
    font-size: var(--font-size-16);
    color: #5e6b7a;
    font-weight: bold;
    line-height: 1;
    height: 16px;
    span {
      vertical-align: text-bottom;
    }
  }
}
</style>
