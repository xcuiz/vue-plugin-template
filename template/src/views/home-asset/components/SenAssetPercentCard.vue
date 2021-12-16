<template>
  <el-card shadow="hover">
    <div class="sen-percent-card-title">{{ title }}</div>
    <div
      v-show="!loading && serieData.length !== 0"
      ref="percentCard"
      class="sen-asset-percent-card"
      :style="{ width: canvasWidth, height: `${chartHeight}px` }"
    ></div>
    <div
      v-show="loading && serieData.length === 0"
      :style="{ height: `${chartHeight}px` }"
      class="card-skeleton-wrapper"
    >
      <Skeleton round width="150px" height="150px" custom-class="pie" />
      <div class="pie-area-right">
        <Skeleton
          v-for="c of skeletonCount"
          :key="c"
          width="100%"
          height="20px"
          gap="20px"
        />
      </div>
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
    canvasWidth: {
      type: String,
      default: "100%",
    },
    color: {
      type: Array,
      default: () => [
        "#2e96ce",
        "#0bc0d3",
        "#c48ee2",
        "#70b603",
        "#f278a9",
        "#cfa472",
        "#aab3c2",
      ],
    },
    formatter: {
      type: Function,
      default: null,
    },
    uuKey: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
    serieData: {
      type: Array,
      default: () => [],
    },
    chartHeight: {
      type: Number,
      default: 200,
    },
    left: {
      type: String,
      default: "35%",
    },
    skeletonCount: {
      type: Number,
      default: 6,
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
        this.chart = echarts.init(this.$refs["percentCard"]);

        this.chart.on("click", (params) => {
          this.$emit("click-change", params);
        });

        window.addEventListener("resize", this.resize);
      }

      const formatter = (params) => {
        const { color, data } = params;
        const { title, value, proportion, fileCount, fieldCount } = data;

        const paramsStr = encodeURIComponent(JSON.stringify(params));

        return `<span style="display:inline-block;
            margin-right:5px;
            border-radius:10px;
            width:10px;height:10px;
            background-color: ${color};
          "></span>
          ${title}
          <br/>${value}(${proportion})
          <br/>
          <a class="tooltip-to-page-btn" onclick="window.toOtherPageInChart('${this.uuKey}', 'field', '${paramsStr}')">字段数：${fieldCount}</a>
          <br/>
          <a class="tooltip-to-page-btn" onclick="window.toOtherPageInChart('${this.uuKey}', 'file', '${paramsStr}')">文件数：${fileCount}</a>`;
      };

      this.chart.setOption({
        tooltip: {
          trigger: "item",
          triggerOn: this.formatter ? "mousemove" : "click",
          formatter: this.formatter || formatter,
          enterable: true,
          // position: (point) => {
          //   return [point[0] + 10, point[1] - 20];
          // },
        },
        legend: {
          type: "scroll",
          top: "center",
          right: 0,
          orient: "vertical",
          itemWidth: 14,
          itemHeight: 14,
          textStyle: {
            color: "#777",
          },
        },
        color: this.color,
        series: [
          {
            name: "senAsset",
            type: "pie",
            radius: ["40%", "65%"],
            center: [this.left, "50%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            labelLine: {
              show: false,
            },
            data: this.serieData,
          },
        ],
      });
    },
    clearChart() {
      if (this.chart) {
        this.chart.setOption({
          series: [],
        });
      }
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
.sen-percent-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #000;
}
.sen-asset-percent-card {
  width: 100%;
}

.card-skeleton-wrapper {
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  .pie-area-right {
    flex: 1;
    margin-left: 18px;
  }
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  letter-spacing: 2px;
}
</style>
