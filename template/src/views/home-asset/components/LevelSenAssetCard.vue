<template>
  <el-card shadow="hover">
    <div class="level-sen-card-title">各级敏感资产占比</div>
    <div
      v-show="!loading && series.length !== 0"
      ref="levelSenCard"
      class="level-sen-percent-card"
      :style="{ height: `${chartHeight}px` }"
    ></div>
    <div
      v-show="loading && series.length === 0"
      :style="{ height: `${chartHeight}px`, overflow: 'hidden' }"
    >
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="15px" />
    </div>
    <div
      v-show="!loading && series.length === 0"
      class="chart-empty"
      :style="{ height: `${chartHeight}px` }"
    >
      暂无数据
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
import Skeleton from "@/components/Skeleton.vue";
export default {
  name: "LevelSenAssetCard",
  components: {
    Skeleton,
  },
  props: {
    series: {
      type: Array,
      default: () => [],
    },
    xAxis: {
      type: Array,
      default: () => [],
    },
    legend: {
      type: Array,
      default: () => [],
    },
    chartHeight: {
      type: Number,
      default: 170,
    },
  },
  data() {
    return {
      loading: true,
      initCount: 0,
    };
  },
  watch: {
    series: {
      handler() {
        this.initCount++;
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
      if (this.loading && this.initCount > 1) {
        this.loading = false;
      }

      if (this.series.length === 0) {
        return;
      }

      await this.$nextTick();

      if (!this.chart) {
        this.chart = echarts.init(this.$refs["levelSenCard"]);

        this.chart.on("click", (params) => {
          this.$emit("click-change", params);
        });

        window.addEventListener("resize", this.resize);
      }
      this.chart.setOption({
        grid: {
          left: 45,
          top: 20,
          right: 140,
          bottom: 20,
        },
        xAxis: {
          type: "category",
          data: this.xAxis,
          axisLabel: {
            color: "#777",
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          nameTextStyle: {
            color: "#777",
          },
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              color: ["#f1f1f1"],
            },
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          data: [0, 20, 40, 60, 80, 100],
          interval: 20,
          min: 0,
          max: 100,
          axisLabel: {
            formatter: (v) => {
              return v + "%";
            },
          },
        },
        tooltip: {
          hideDelay: 300,
          trigger: "item",
          formatter: (params) => {
            const { color, data, seriesName } = params;
            const { count, proportion } = data;
            return `<span style="display:inline-block;
            margin-right:5px;
            border-radius:10px;
            width:10px;height:10px;
            background-color: ${color};
          "></span>
          ${seriesName}: ${count}
          <br/>
          (${proportion})`;
          },
          enterable: true,
          // position: (point) => {
          //   return [point[0] + 10, point[1] - 20];
          // },
        },
        legend: {
          top: "center",
          right: "20",
          orient: "vertical",
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            color: "#777",
          },
          data: this.legend,
        },
        // 红色 -> 黄色
        // color: ["#e12134", "#f03763", "#f5a351", "#fad737"],
        color: ["#B6D553", "#0BC0D3", "#FAD737", "#F03763"],
        series: this.series.map((serie) => ({
          type: "bar",
          stack: "total",
          label: {
            show: true,
            formatter: (params) => {
              const { data } = params;
              const { value, proportion } = data;

              return value ? proportion : "";
            },
          },
          barMaxWidth: 80,
          ...serie,
        })),
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

<style lang="postcss" scoped>
.level-sen-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #000;
}
.level-sen-percent-card {
  width: 100%;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  letter-spacing: 2px;
  background-color: #f03763;
}
</style>
