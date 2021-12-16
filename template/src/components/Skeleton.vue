<template>
  <div class="skeleton" :style="style" :class="customClass"></div>
</template>

<script>
export default {
  name: "Skeleton",
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "16px",
    },
    gap: {
      type: String,
      default: "10px",
    },
    round: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
    },
  },
  computed: {
    style() {
      let width = this.width;
      let height = this.height;
      let marginTop = this.gap;
      let borderRadius = "0";
      if (this.round) {
        borderRadius = "50%";
      }
      return {
        width,
        height,
        marginTop,
        borderRadius,
      };
    },
  },
};
</script>

<style scoped lang="postcss">
@keyframes shimmer {
  0% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0 50%;
  }
}

.skeleton {
  margin-top: 10px;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
  background: #f6f7f8;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 37%, #f2f2f2 63%);
  background-size: 400% 100%;
}
</style>
