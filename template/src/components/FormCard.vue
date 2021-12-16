<!--
 * @Author: your name
 * @Date: 2020-08-13 17:49:02
 * @LastEditTime: 2020-12-10 09:51:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/model/components/FormCard.vue
-->
<template>
  <div class="form-card-container">
    <header>
      <span>{{ title }}</span>
    </header>
    <section>
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String,
      default: "标题",
    },
  },
};
</script>

<style scoped lang="postcss">
.form-card-container {
  & > header {
    position: relative;

    font-size: 18px;
    padding-left: 10px;
    font-weight: 650;
    margin-bottom: 20px;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 3px;
      height: 18px;
      width: 4px;
      background: #4592de;
    }
  }
  & > section {
    padding: 0 10px;
  }
}
</style>
