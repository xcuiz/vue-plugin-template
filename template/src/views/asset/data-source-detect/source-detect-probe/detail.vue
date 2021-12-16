<template>
  <el-row class="probe-detail-container">
    <el-row class="probe-detail">
      <div class="box">
        <div>
          <i
            class="iconfont"
            :class="`icon${probeIcon}`"
            style="font-size: 60px"
          ></i>
        </div>
        <!-- <img class="probe-icon" src="@/assets/images/probe-icon.png" /> -->
        <div class="probe-text-content">
          <el-row class="probe-title">
            <span>{{ detail.name }}</span>
            <el-button-group style="float: right">
              <el-button size="mini" @click="handleTest">连通测试</el-button>
              <el-button size="mini" @click="handleEdit">修改</el-button>
              <el-button size="mini" @click="handleBack">返回</el-button>
            </el-button-group>
            <FormDialog
              v-bind="formDialog"
              :visible.sync="formDialog.visible"
              @success="getDetail"
            />
          </el-row>
          <el-row class="probe-form-text">
            <el-row>
              <el-col :span="8"> 探针厂商：{{ detail.producer }}</el-col>
              <el-col :span="8"> 探针类型：{{ detail.typeDesc }} </el-col>
              <el-col :span="8"> 探针型号：{{ detail.probeModelDesc }} </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                探针接口地址：{{ detail.ip }}:{{ detail.port }}
              </el-col>
              <el-col :span="8">
                存活状态：
                <template v-if="detail.health === 1">
                  <span class="health-type running"
                    ><i class="el-icon-success"></i> 运行</span
                  >
                </template>
                <template v-else-if="detail.health === 98">
                  <span class="health-type warning"
                    ><i class="el-icon-warning"></i> 异常</span
                  >
                </template>
                <template v-else-if="detail.health === 99">
                  <span class="health-type error"
                    ><i class="el-icon-error"></i> 宕机</span
                  >
                </template>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                所管网络域：{{ detail.netdistrictName }}
              </el-col>
              <el-col :span="8"> 物理位置：{{ detail.locationName }} </el-col>
            </el-row>
            <el-row>
              <el-col :span="8"> 创建人：{{ detail.createUser }} </el-col>
              <el-col :span="8"> 录入时间：{{ detail.joinTime }} </el-col>
              <el-col :span="8"> 最近修改时间：{{ detail.updateTime }} </el-col>
            </el-row>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row class="probe-tab">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="基础信息" name="base">
          <el-row style="padding: 0 18px 18px 18px" :gutter="18">
            <el-col :span="6">
              <el-row style="margin-bottom: 18px">
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span>基础信息</span>
                  </div>
                  <div class="card-content">
                    <p>物理位置：{{ detail.baseInfo.locationName }}</p>
                  </div>
                </el-card>
              </el-row>
              <el-row>
                <el-card class="box-card" shadow="never">
                  <div slot="header" class="clearfix">
                    <span>配置信息</span>
                  </div>
                  <div class="card-content">
                    <p>CPU：{{ detail.configInfo.cpu }}</p>
                    <p>内存：{{ detail.configInfo.memory }}</p>
                    <p>磁盘：{{ detail.configInfo.disk }}</p>
                    <p>操作系统：{{ detail.configInfo.operateSystem }}</p>
                  </div>
                </el-card>
              </el-row>
            </el-col>
            <el-col :span="18">
              <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                  <span>性能监控</span>
                </div>
                <div class="date-container">
                  <el-button
                    v-for="option in timeBtns"
                    :key="option.code"
                    type="text"
                    size="small"
                    @click="setTime(option.code)"
                    >{{ option.name }}</el-button
                  >
                  <el-date-picker
                    v-model="datetimeRange"
                    size="small"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    @change="getChartsData"
                  >
                  </el-date-picker>
                </div>
                <div>
                  <el-row>
                    <el-col :span="4"><h2 class="bold">CPU使用率</h2></el-col>
                    <el-col :span="20"
                      ><h2>
                        当前使用率
                        <span class="bold">{{ lastUseage.cpu }}%</span>
                      </h2></el-col
                    >
                  </el-row>
                  <LineChart v-bind="charts.cpu" />
                </div>
                <div>
                  <el-row>
                    <el-col :span="4"><h2 class="bold">内存使用率</h2></el-col>
                    <el-col :span="20"
                      ><h2>
                        当前使用率
                        <span class="bold">{{ lastUseage.memory }}%</span>
                      </h2></el-col
                    >
                  </el-row>
                  <LineChart v-bind="charts.memory" />
                </div>
                <div>
                  <el-col :span="12">
                    <el-row>
                      <el-col :span="4"
                        ><h2 class="bold">磁盘使用率</h2></el-col
                      >
                    </el-row>
                    <LineChart v-bind="charts.disk" />
                  </el-col>
                  <el-col :span="12">
                    <el-row>
                      <el-col :span="4"
                        ><h2 class="bold">磁盘使用量</h2></el-col
                      >
                    </el-row>
                    <PirChart v-bind="charts.diskSpace" />
                  </el-col>
                </div> </el-card
            ></el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="`扫描任务（${scanTaskNum}）`" name="task">
          <ScanTaskTable
            :probe-id="$route.params.id"
            @getList="handleScanTaskNum"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="detail.type === '03'"
          label="策略模版"
          name="template"
        >
          <PloyTpl :probe-id="$route.params.id" />
        </el-tab-pane>
      </el-tabs>
    </el-row>
  </el-row>
</template>
<script>
import echarts from "echarts";

import { getProbeDetail, getProbeMonitor, getProbeStatus } from "./api";
import LineChart from "./components/line-chart";
import PirChart from "./components/pie-chart";
import ScanTaskTable from "./components/scan-task-table";
import FormDialog from "./components/form-dialog";
import PloyTpl from "./components/ploy-tpl";
export default {
  components: {
    LineChart,
    PirChart,
    ScanTaskTable,
    FormDialog,
    PloyTpl,
  },
  data() {
    return {
      loading: {
        detail: false,
      },
      detail: {
        baseInfo: {},
        configInfo: {},
        scanTask: [],
      },
      activeTab: "base",
      datetimeRange: this.getTimeRange(12),
      timeBtns: [
        {
          code: 1,
          name: "1小时",
        },
        {
          code: 6,
          name: "6小时",
        },
        {
          code: 12,
          name: "12小时",
        },
        {
          code: 24,
          name: "24小时",
        },
      ],
      selectedTime: 12,
      charts: {
        cpu: {
          series: [
            {
              name: "CPU使用率",
              type: "line",
              lineStyle: { width: 1 },
              showSymbol: false,
              data: [],
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#4A90E2",
                  },
                  {
                    offset: 1,
                    color: "#fff",
                  },
                ]),
              },
            },
          ],
          xAxisData: [],
        },
        memory: {
          series: [
            {
              name: "内存使用率",
              type: "line",
              lineStyle: { width: 1 },
              showSymbol: false,
              data: [],
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#4A90E2",
                  },
                  {
                    offset: 1,
                    color: "#fff",
                  },
                ]),
              },
            },
          ],
          xAxisData: [],
        },
        disk: {
          legendData: ["写入速度", "读取速度"],
          series: [
            {
              name: "读取速度",
              type: "line",
              lineStyle: { width: 1 },
              showSymbol: false,
              data: [],
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#4A90E2",
                  },
                  {
                    offset: 1,
                    color: "#fff",
                  },
                ]),
              },
            },
            {
              name: "写入速度",
              type: "line",
              lineStyle: { width: 1 },
              showSymbol: false,
              data: [],
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#96BD19",
                  },
                  {
                    offset: 1,
                    color: "#fff",
                  },
                ]),
              },
            },
          ],
          xAxisData: [],
        },
        diskSpace: {
          legend: {
            data: ["已用空间", "可用空间"],
            left: "left",
            top: "middle",
            orient: "vertical",
          },
          tooltip: {
            trigger: "item",
            formatter: "{b} : {c} ({d}%)",
          },
          series: [
            {
              type: "pie",
              center: ["65%", "50%"],
              radius: "65%",
              label: {
                show: false,
              },
              labelLine: {
                show: false,
              },
              data: [],
            },
          ],
          xAxisData: [],
        },
      },
      lastUseage: {
        cpu: null,
        memory: null,
      },
      formDialog: {
        visible: false,
        type: "edit",
        id: this.$route.params.id,
      },
      scanTaskNum: "",
    };
  },
  computed: {
    probeIcon() {
      const map = {
        "01": "dbprobe",
        "02": "mgtanzhen",
        "03": "appprobe",
      };

      return map[this.detail.type];
    },
  },
  created() {
    this.getDetail();
    this.getChartsData();
  },
  methods: {
    getDetail() {
      this.loading.detail = true;
      getProbeDetail(this.$route.params.id)
        .then((res) => {
          this.detail = res;
          this.detail.scanTask = this.detail.scanTask || [];
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
    setTime(hours) {
      this.selectedTime = hours;
      this.datetimeRange = this.getTimeRange(hours);
      this.getChartsData();
    },
    getTimeRange(hours) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * hours);
      return [start, end];
    },
    getChartsData() {
      getProbeMonitor(this.$route.params.id, {
        startTime: this.$formatDate(this.datetimeRange[0]),
        endTime: this.$formatDate(this.datetimeRange[1]),
      }).then((res) => {
        let data = {
          cpu: {
            data: [],
            xAxisData: [],
          },
          memory: {
            data: [],
            xAxisData: [],
          },
          disk: {
            readData: [],
            writeData: [],
            xAxisData: [],
          },
        };
        res.cpuUsage.record.forEach((item) => {
          data.cpu.data.push(item.usage);
          data.cpu.xAxisData.push(item.timestamp);
        });
        res.memoryUsage.record.forEach((item) => {
          data.memory.data.push(item.usage);
          data.memory.xAxisData.push(item.timestamp);
        });
        res.diskReadAndWrite.forEach((item) => {
          data.disk.readData.push(item.read);
          data.disk.writeData.push(item.write);
          data.disk.xAxisData.push(item.timestamp);
        });
        this.charts.cpu.series[0].data = data.cpu.data;
        this.charts.cpu.xAxisData = data.cpu.xAxisData;

        this.charts.memory.series[0].data = data.memory.data;
        this.charts.memory.xAxisData = data.memory.xAxisData;

        this.charts.disk.series[0].data = data.disk.readData;
        this.charts.disk.series[1].data = data.disk.writeData;
        this.charts.disk.xAxisData = data.disk.xAxisData;

        this.charts.diskSpace.series[0].data = [
          {
            name:
              "已用空间：" +
              res.diskUsage.usedCapacity.capacity +
              " " +
              res.diskUsage.usedCapacity.unit,
            value: res.diskUsage.usedCapacity.capacity,
          },
          {
            name:
              "可用空间：" +
              res.diskUsage.unUsedCapacity.capacity +
              " " +
              res.diskUsage.unUsedCapacity.unit,
            value: res.diskUsage.unUsedCapacity.capacity,
          },
        ];
        this.charts.diskSpace.tooltip.formatter = `{b} ({d}%)`;
        this.charts.diskSpace.legend.data = this.charts.diskSpace.series[0].data.map(
          (item) => item.name
        );

        this.lastUseage = {
          cpu: res.cpuUsage.now,
          memory: res.memoryUsage.now,
        };
      });
    },
    handleTest() {
      getProbeStatus(this.$route.params.id)
        .then((res) => {
          const isSuccess = res.data.status === "success";
          const h = this.$createElement;

          this.$msgbox({
            title: "",
            message: h(
              "p",
              {
                class: "probe-test",
              },
              [
                h("idss-icon-svg", {
                  props: { name: isSuccess ? "chengong" : "shibai" },
                  class: {
                    "probe-test-icon": true,
                    success: isSuccess,
                    error: !isSuccess,
                  },
                }),
                h(
                  "span",
                  null,
                  isSuccess ? "联通测试成功！" : "联通测试失败！请核查配置项。"
                ),
              ]
            ),
            showConfirmButton: false,
          });
        })
        .catch(() => {
          this.$message.error("测试失败！");
        });
    },
    handleEdit() {
      this.formDialog.visible = true;
    },
    handleBack() {
      this.$router.back();
    },
    handleScanTaskNum(data) {
      this.scanTaskNum = data.total;
    },
  },
};
</script>
<style lang="postcss" scoped>
.probe-detail-container {
  margin-top: 12px;
}
.probe-detail {
  background: #fff;
  padding: 24px;

  .box {
    display: flex;
  }

  .probe-icon {
    width: 60px;
    height: 60px;
  }

  .probe-text-content {
    margin-left: 24px;
    width: 100%;

    .probe-title {
      font-size: 16px;
      font-weight: 700;
      color: #333333;
      margin-bottom: 10px;
    }

    .probe-form-text {
      line-height: 34px;
    }
  }
}

.probe-tab {
  background: #fff;
  margin: 16px;

  >>> .el-tabs__item {
    font-size: 16px;
    font-weight: 700;
    color: #6d6d6d;
    line-height: 46px;
    height: 46px;
    text-align: center;
    width: 118px;
    padding: 0;
  }

  >>> .el-tabs__active-bar {
    height: 3px;
  }

  >>> .el-card__header {
    background-color: #f4f5f7;
    font-size: 14px;
    font-weight: 700;
    color: #3f3f3f;
    line-height: 28px;
    padding: 10px 24px;
  }
}

.health-type.running {
  color: #68d279;
}
.health-type.warning {
  color: #f89d06;
}
.health-type.error {
  color: #d81e06;
}

.card-content {
  line-height: 34px;
}

.date-container {
  display: flex;
  justify-content: flex-end;
}

.bold {
  font-weight: 700;
}
</style>
