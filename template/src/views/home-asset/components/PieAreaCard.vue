<template>
  <el-card shadow="hover">
    <div class="pie-area-card-title">敏感数据特征统计TOP10</div>
    <div
      v-show="!loading && serieData.length !== 0"
      ref="pieArea"
      class="pie-area-card"
      :style="{ height: `${chartHeight}px` }"
    ></div>
    <div
      v-show="loading && serieData.length === 0"
      :style="{ height: `${chartHeight}px` }"
      class="pie-area-skeleton"
    >
      <Skeleton round width="150px" height="150px" custom-class="pie" />
      <div class="pie-area-right">
        <Skeleton width="100%" height="20px" gap="20px" />
        <Skeleton width="100%" height="20px" gap="20px" />
        <Skeleton width="100%" height="20px" gap="20px" />
        <Skeleton width="100%" height="20px" gap="20px" />
        <Skeleton width="100%" height="20px" gap="20px" />
        <Skeleton width="100%" height="20px" gap="15px" />
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
  name: "PieArea",
  components: {
    Skeleton,
  },
  props: {
    uuKey: {
      type: String,
      default: "",
    },
    legendInfo: {
      type: Object,
      default: () => ({}),
    },
    serieData: {
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
        this.chart = echarts.init(this.$refs["pieArea"]);

        window.addEventListener("resize", this.resize);
      }
      this.chart.setOption({
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
          formatter: (name) => {
            const value = this.legendInfo[name];
            return `${name}: ${value}`;
          },
        },
        tooltip: {
          hideDelay: 300,
          trigger: "item",
          triggerOn: "click",
          formatter: (params) => {
            const { color, data } = params;
            const { name, fileCount, fieldCount, value, proportion } = data;

            const paramsStr = encodeURIComponent(JSON.stringify(params));

            return `<span style="display:inline-block;
            margin-right:5px;
            border-radius:10px;
            width:10px;height:10px;
            background-color: ${color};
          "></span>
          ${name}: ${value}(${proportion})
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
        color: [
          "#2e96ce",
          "#0bc0d3",
          "#c280ff",
          "#70aee0",
          "#b6d553",
          "#f278a9",
          "#cfa472",
          "#aab3c2",
          "#c9ced8",
        ],
        series: [
          {
            name: "面积模式",
            type: "pie",
            radius: [0, 100],
            center: ["30%", "50%"],
            roseType: "area",
            labelLine: {
              show: false,
            },
            label: {
              show: false,
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
.pie-area-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #000;
}
.pie-area-card {
  width: 100%;
}

.pie-area-skeleton {
  overflow: hidden;
  display: flex;
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
