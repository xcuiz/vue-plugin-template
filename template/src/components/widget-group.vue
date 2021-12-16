<template>
  <div class="widget-group" :class="{ is_shadow: !hideShadow }">
    <header v-if="title">
      <span class="title">
        {{ title }}
      </span>
    </header>
    <main :style="{ padding: padding }">
      <slot></slot>
    </main>
    <footer :style="{ 'padding-bottom': footerPadding }">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
export default {
  name: "WidgetGroup",
  props: {
    hideShadow: {
      type: Boolean,
      default: false,
    },
    padding: {
      type: String,
      default: "0",
    },
    footerPadding: {
      type: String,
      default: "0",
    },
    title: String,
  },
};
</script>

<style scoped>
.widget-group {
  position: relative;
  background: #ffffff;
  padding: 0 20px;
  &.is_shadow {
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.14), 0 3px 4px 0 rgba(0, 0, 0, 0.12),
      0 1px 5px 0 rgba(0, 0, 0, 0.2);
  }
  & header {
    line-height: 1.1;
    padding: 15px 0;
    .title {
      font-size: 16px;
      color: #353940;
      padding-left: 12px;
      border-left: 5px solid #22a5f7;
      font-weight: 700;
    }
  }
}
</style>
