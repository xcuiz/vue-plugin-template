<template>
  <div class="pie-chart-container">
    <div ref="chart" class="pie-chart-box"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    legend: {
      type: Object,
      default: () => ({}),
    },
    series: {
      type: [Array, Object],
      default: () => [],
    },
    tooltip: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    series: {
      handler() {
        this.initChart();
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.chart = null;
  },
  beforeDestroy() {
    // 销毁chart的实例
    if (this.chart) {
      window.removeEventListener("resize", this.resize);
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    async initChart() {
      await this.$nextTick();

      if (!this.chart) {
        this.chart = echarts.init(this.$refs["chart"]);

        window.addEventListener("resize", this.resize);
      }
      this.chart.setOption({
        color: ["#4A90E2", "#96BD19"],
        legend: this.legend,
        tooltip: this.tooltip,
        series: this.series,
      });
    },
    resize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
};
</script>

<style lang="postcss">
.pie-chart-container {
  width: 100%;
  height: 300px;
  .pie-chart-box {
    width: 100%;
    height: 100%;
  }
}
</style>
