<template>
  <div class="progress-container">
    <div class="progress-start-text">
      <div class="text-label"><slot name="start"></slot></div>
    </div>
    <div class="status-text" :style="{ left: value + '%' }">
      执行进度: {{ value }}%
    </div>
    <div class="progress-line">
      <div class="progress-percent" :style="{ width: value + '%' }">
        <div class="progress-dot start"></div>
        <div class="progress-dot end" :style="{ left: value + '%' }"></div>
      </div>
    </div>
    <div class="progress-end-text">
      <div class="text-label">
        <slot name="end"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0,
    },
  },
};
</script>
<style lang="postcss" scoped>
.progress-container {
  position: relative;
  margin: 0 50px;
  padding-top: 40px;
  padding-bottom: 50px;
  .progress-start-text {
    position: absolute;
    left: 0;
    top: 50px;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    color: #888;
    font-size: 14px;

    .text-label {
      margin-bottom: 5px;
    }
  }

  .status-text {
    position: absolute;
    top: 10px;
    color: #888;
    font-size: 14px;
    transform: translateX(-50%);
    transition: left 300ms ease;
    min-width: 110px;
  }

  .progress-line {
    height: 2px;
    background-color: #ebeef5;
    position: relative;
    .progress-percent {
      height: 100%;
      background-color: #409eff;
      transition: width 300ms ease;

      .progress-dot {
        width: 5px;
        height: 5px;
        top: -2px;
        border-radius: 50%;
        background-color: #409eff;
        position: absolute;
      }
    }

    .dot-box {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      height: 5px;

      .dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #409eff;
        position: absolute;
      }
    }
  }

  .progress-end-text {
    position: absolute;
    right: 0;
    top: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    color: #888;
    font-size: 14px;

    .text-label {
      margin-bottom: 5px;
    }
  }
}
</style>
