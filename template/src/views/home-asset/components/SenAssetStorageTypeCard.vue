<template>
  <el-card shadow="hover">
    <div class="sen-asset-storage-type-card-title">
      敏感资产存储类型统计TOP10
    </div>
    <div
      v-show="!loading && serieData.length !== 0"
      ref="typeCard"
      class="sen-asset-storage-type-card"
      :style="{ height: `${chartHeight}px` }"
    ></div>
    <div
      v-show="loading && serieData.length === 0"
      :style="{ height: `${chartHeight}px` }"
      class="card-skeleton-wrapper"
    >
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="20px" />
      <Skeleton width="100%" height="20px" gap="20px" />
    </div>
    <div
      v-show="!loading && serieData.length === 0"
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
  name: "SenAssetPercentCard",
  components: {
    Skeleton,
  },
  props: {
    serieData: {
      type: Array,
      default: () => [],
    },
    yAxisData: {
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
    serieData: {
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
      if (this.loading && this.initCount > 1) {
        this.loading = false;
      }

      if (this.serieData.length === 0) {
        return;
      }

      await this.$nextTick();

      if (!this.chart) {
        this.chart = echarts.init(this.$refs["typeCard"]);

        this.chart.on("click", (params) => {
          this.$emit("click-change", params);
        });

        window.addEventListener("resize", this.resize);
      }
      this.chart.setOption({
        color: ["rgba(53, 151, 204, 1)"],
        grid: {
          top: 20,
          left: 80,
          right: 40,
          bottom: 0,
        },
        tooltip: {
          trigger: "item",
        },
        xAxis: {
          type: "value",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        yAxis: {
          type: "category",
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          data: this.yAxisData,
        },
        series: [
          {
            name: "敏感资产存储类型统计TOP10",
            type: "bar",
            barMaxWidth: 48,
            label: {
              show: true,
              position: "right",
              color: "#777",
            },
            data: this.serieData,
          },
        ],
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
.sen-asset-storage-type-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #000;
}
.sen-asset-storage-type-card {
  width: 100%;
}

.card-skeleton-wrapper {
  overflow: hidden;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  letter-spacing: 2px;
}
</style>
