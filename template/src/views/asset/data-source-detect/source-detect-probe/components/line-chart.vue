<template>
  <div class="line-chart-container">
    <div ref="chart" class="line-chart-box"></div>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  props: {
    legendData: {
      type: Array,
      default: () => [],
    },
    xAxisData: {
      type: Array,
      default: () => [],
    },
    series: {
      type: [Array, Object],
      default: () => [],
    },
    yLabelFormatter: {
      type: [String, Function],
      default: "{value}",
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
        legend: {
          data: this.legendData,
        },
        tooltip: {
          trigger: "axis",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          nameRotate: 90,
          axisLine: {
            lineStyle: {
              // 更改坐标轴颜色
              color: "#f0f0f0",
            },
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: "#9c9c9c",
            },
          },
          data: this.xAxisData,
        },
        yAxis: {
          type: "value",
          axisLine: {
            lineStyle: {
              // 更改坐标轴颜色
              color: "#f0f0f0",
            },
          },
          axisLabel: {
            formatter: this.yLabelFormatter,
            textStyle: {
              fontSize: 12,
              color: "#9c9c9c",
            },
          },
          splitLine: {
            color: "#f0f0f0",
          },
        },
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
.line-chart-container {
  width: 100%;
  height: 300px;
  .line-chart-box {
    width: 100%;
    height: 100%;
  }
}
</style>
