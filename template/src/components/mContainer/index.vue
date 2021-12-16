<!--
 * @Author: your name
 * @Date: 2020-06-22 09:54:16
 * @LastEditTime: 2020-07-09 14:15:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/insight/components/mContainer/index.vue
-->
<template>
  <div class="m-container">
    <header v-if="title">
      <h4>{{ title }}</h4>
    </header>
    <section>
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    // 标题
    title: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped lang="postcss">
.m-container {
  background: var(--white);
  box-shadow: var(--shadow-dark);
  margin-bottom: 10px;
  > header {
    padding: 12px 0 6px;
    /* border-bottom: 2px solid #f6f6f6; */
    h4 {
      font-size: 14px;
      font-weight: 700;
      color: #3f3f3f;
      padding-left: 16px;
    }
  }
  > section {
    padding: 12px 23px;
  }
}
</style>
