<template>
  <el-row :gutter="15">
    <el-col :span="18">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>敏感数据资产排名TOP10</span>
        </div>
        <ChartContainer :options="options" />
      </el-card>
    </el-col>
    <el-col :span="6" style="height: 399px">
      <el-form size="mini">
        <el-card style="height: 123px; margin-bottom: 15px">
          <el-form-item label="数据总资产数"></el-form-item>
          <p class="bold-item">
            {{ dataNums.assetTotal | thousand }}
          </p>
        </el-card>
        <el-card style="height: 123px; margin-bottom: 15px">
          <el-form-item label="敏感数据资产数"></el-form-item>
          <p class="bold-item">
            {{ dataNums.assetSensitiveTotal | thousand }}
          </p>
        </el-card>
        <el-card style="height: 123px; margin-bottom: 15px">
          <el-form-item label="敏感数据字段数"></el-form-item>
          <p class="bold-item">
            {{ dataNums.fieldsTotal | thousand }}
          </p>
        </el-card>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
import ChartContainer from "@/components/chart-container";
import { getSensitiveDataTop, getStatistics } from "../api";
import { find } from "lodash";
export default {
  components: {
    ChartContainer,
  },
  filters: {
    thousand(val) {
      return val?.toLocaleString();
    },
  },
  props: {
    taskId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      options: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // Use axis to trigger tooltip
            type: "shadow", // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        legend: {
          bottom: 6,
          data: ["S1-低敏感级", "S2-较敏感级", "S3-敏感级", "S4-极敏感级"],
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [],
      },
      dataNums: {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getSensitiveDataTop(this.taskId).then((res) => {
        const barColors = ["#FCE165", "#F5A351", "#ED3C59", "#CF0E2E"];
        const xAxisData = Array.from(new Set(res.map((item) => item.ip)));
        const seriesData = this.options.legend.data.map(
          (levelName, levelIndex) => {
            const data = xAxisData.map(
              (ip) => find(res, { ip, level: levelName })?.count || 0
            );
            const result = {
              name: levelName,
              type: "bar",
              stack: "total",
              barMaxWidth: 40,
              emphasis: {
                focus: "series",
              },
              itemStyle: {
                color: barColors[levelIndex],
              },
              data,
            };
            return result;
          }
        );
        this.options.xAxis.data = xAxisData;
        this.options.series = seriesData;
      });
      getStatistics(this.taskId).then((res) => {
        this.dataNums = res;
      });
    },
  },
};
</script>
<style lang="postcss" scoped>
.bold-item {
  font-weight: 500;
  font-size: 30px;
}
.el-form-item {
  margin-bottom: 10px;

  >>> &__label {
    font-size: 16px;
  }
}
</style>
