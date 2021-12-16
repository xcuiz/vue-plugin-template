<template>
  <el-card shadow="hover">
    <div class="scatter-card-title">{{ title }}</div>
    <div
      v-show="!loading && series.length !== 0"
      ref="scatterCard"
      class="scatter-card-card"
      :style="{ height: `${chartHeight}px` }"
    ></div>
    <div
      v-show="loading && series.length === 0"
      :style="{ height: `${chartHeight}px` }"
      class="card-skeleton-wrapper"
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
  name: "ScatterCard",
  components: {
    Skeleton,
  },
  props: {
    uuKey: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    series: {
      type: Array,
      default: () => [],
    },
    xAxisData: {
      type: Array,
      default: () => [],
    },
    yAxisData: {
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
    maxValue: {
      type: Number,
      default: 0,
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
        this.chart = echarts.init(this.$refs["scatterCard"]);

        this.chart.on("click", (params) => {
          const { data } = params;

          if (Array.isArray(data)) {
            const [, senLevel, , , , senType] = data;

            this.$emit("sen-type-change", senType, senLevel);
          }
        });

        window.addEventListener("resize", this.resize);
      }
      this.chart.setOption({
        grid: {
          top: 20,
          right: 20,
          bottom: 60,
        },
        xAxis: {
          type: "category",
          data: this.xAxisData,
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
          type: "category",
          data: this.yAxisData,
          splitLine: {
            show: true,
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
        },
        tooltip: {
          hideDelay: 300,
          trigger: "item",
          formatter: (params) => {
            const { color, data } = params;
            const [, senLevel, , fieldCount, fileCount, senType] = data;

            const paramsStr = encodeURIComponent(JSON.stringify(params));

            return `
                <span style="display:inline-block;
                  margin-right:5px;
                  border-radius:10px;
                  width:10px;height:10px;
                  background-color: ${color};
                "></span>
                ${senType}
                <br/>
                敏感分级类型: ${senLevel}
                <br/>
                <a class="tooltip-to-page-btn" onclick="window.toOtherPageInChart('${this.uuKey}', 'field', '${paramsStr}')">字段数：${fieldCount}</a>
                <br/>
                <a class="tooltip-to-page-btn" onclick="window.toOtherPageInChart('${this.uuKey}', 'file', '${paramsStr}')">文件数：${fileCount}</a>`;
          },
          enterable: true,
          // position: (point) => {
          //   return [point[0] + 10, point[1] - 20];
          // },
        },
        legend: {
          bottom: 2,
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            color: "#777",
          },
        },
        color: [
          "#3597cc",
          "#23c0d2",
          "#c391e0",
          "#cfa472",
          "#7c8ba1",
          "#47bb91",
          "#f178a8",
          "#7ab3fd",
        ],
        series: this.series.map(({ name, data }) => ({
          type: "scatter",
          emphasis: {
            focus: "series",
          },
          symbolSize: (data) => {
            const [, , total] = data;
            return this.maxValue === 0 ? 30 : (total / this.maxValue) * 40 + 20;
          },
          name,
          data,
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
.scatter-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #000;
  text-align: center;
}
.scatter-card-card {
  width: 100%;
}

.card-skeleton-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  letter-spacing: 2px;
}
</style>
