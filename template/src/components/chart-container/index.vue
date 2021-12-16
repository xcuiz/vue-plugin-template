<template>
  <div class="chart-container">
    <div ref="chart" class="chart-box"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    options: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    options: {
      handler() {
        this.initChart();
      },
      deep: true,
    },
  },
  mounted() {
    this.initChart();
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
      if (!this.chart) {
        this.chart = echarts.init(this.$refs["chart"]);

        window.addEventListener("resize", this.resize);
      }
      this.chart.setOption(this.options);
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
.chart-container {
  width: 100%;
  height: 300px;
  .chart-box {
    width: 100%;
    height: 100%;
  }
}
</style>
