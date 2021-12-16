<template>
  <div class="progress-bar-container">
    <el-progress
      :percentage="percentage"
      :stroke-width="14"
      color="#4a90e2"
    ></el-progress>
  </div>
</template>

<script>
export default {
  name: "ProgressBar",
  props: {
    percentage: {
      type: Number,
      default: 0,
      validator(val) {
        return val >= 0 && val <= 100;
      },
    },
  },
};
</script>

<style scoped lang="postcss">
.progress-bar-container {
  >>> .el-progress {
    .el-progress-bar {
      padding: 0 !important;

      .el-progress-bar__outer {
        border-radius: 0;

        .el-progress-bar__inner {
          border-radius: 0;

          &:hover {
            background-color: #409eff !important;
          }
        }
      }
    }

    .el-progress__text {
      display: none;
    }
  }
}
</style>
