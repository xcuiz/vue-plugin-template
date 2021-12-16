<template>
  <div class="monitor-detail-container">
    <div class="monitor-detail-box">
      <div class="base-info">
        <div class="base-info-title">
          app漏洞分析-dds (任务编号: cvs202102262349001)
        </div>
        <div class="base-info-content">
          <div class="content-item">
            <div class="content-item-label">app名称:</div>
            <div class="content-item-value">{{ baseInfo.appName }}</div>
          </div>
          <div class="content-item">
            <div class="content-item-label">app类型:</div>
            <div class="content-item-value">{{ baseInfo.appType }}</div>
          </div>
          <div class="content-item">
            <!-- <div class="content-item-label">归属业务系统:</div>
            <div class="content-item-value">{{ baseInfo.businessName }}</div> -->
            <div class="content-item-label">归属部门:</div>
            <div class="content-item-value">{{ baseInfo.dept }}</div>
          </div>
          <div class="content-item">
            <div class="content-item-label">app文件:</div>
            <div class="content-item-value">{{ baseInfo.fileName }}</div>
          </div>
          <div class="content-item">
            <div class="content-item-label">检查探针:</div>
            <div class="content-item-value">{{ baseInfo.probeName }}</div>
          </div>
          <div class="content-item">
            <div class="content-item-label">检查模板:</div>
            <div class="content-item-value">{{ baseInfo.templateName }}</div>
          </div>
          <div class="content-item">
            <div class="content-item-label">创建人:</div>
            <div class="content-item-value">{{ baseInfo.createUser }}</div>
          </div>
          <div class="content-item">
            <div class="content-item-label">创建时间:</div>
            <div class="content-item-value">{{ baseInfo.createTime }}</div>
          </div>
          <div class="content-item">
            <div class="content-item-label">修改人:</div>
            <div class="content-item-value">{{ baseInfo.updateUser }}</div>
          </div>
          <div class="content-item">
            <div class="content-item-label">最近修改时间:</div>
            <div class="content-item-value">{{ baseInfo.updateTimeime }}</div>
          </div>
          <div class="content-item">
            <div class="content-item-label">执行状态:</div>
            <div class="content-item-value">
              {{ baseInfo.executeStatus | statusFormatter }}
            </div>
          </div>
          <div class="content-item">
            <div class="content-item-label">执行结果:</div>
            <div class="content-item-value">
              {{ baseInfo.executeResult | resultFormatter }}
            </div>
          </div>
        </div>
      </div>
      <div class="progress-info">
        <div class="progress-info-title">任务进度</div>
        <div class="progress-container">
          <div class="progress-start-text">
            <div class="text-label">开始时间</div>
            <div>{{ baseInfo.startTime | dateFormatter }}</div>
          </div>
          <div class="status-text" :style="{ left: baseInfo.runProcess + '%' }">
            执行中{{ baseInfo.runProcess }}%
          </div>
          <div class="progress-line">
            <div
              class="progress-percent"
              :style="{ width: baseInfo.runProcess + '%' }"
            ></div>
            <div v-if="dots.length > 0" class="dot-box">
              <div
                v-for="dot of dots"
                :key="dot"
                class="dot"
                :style="{ left: dot + '%' }"
              ></div>
            </div>
          </div>
          <div v-show="baseInfo.endTime" class="progress-end-text">
            <div class="text-label">结束时间</div>
            <div>{{ baseInfo.endTime | dateFormatter }}</div>
          </div>
        </div>
      </div>
      <div class="result-info">
        <div class="result-info-title">检查结果</div>
        <div class="result-content">
          <div class="result-content-item leak-info">
            <el-collapse v-model="collapseActive">
              <el-collapse-item title="漏洞分析" name="leak-info">
                <el-table
                  :data="leakInfo"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  max-height="700"
                  size="mini"
                  stripe
                  fit
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column type="expand" width="15">
                    <template slot-scope="scope">
                      <div
                        v-for="detail of leakDetailMap"
                        :key="detail.field"
                        class="more-detail"
                      >
                        <div class="detail-label">{{ detail.label }}:</div>
                        <div class="detail-text">
                          {{ scope.row[detail.field] }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    label="漏洞名称"
                    show-overflow-tooltip
                    prop="vulName"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.vulName || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="风险等级"
                    show-overflow-tooltip
                    prop="level"
                    sortable
                  >
                    <template slot-scope="scope">
                      {{ scope.row.level || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="描述"
                    show-overflow-tooltip
                    prop="description"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.description || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="是否存在危害"
                    show-overflow-tooltip
                    prop="vulResult"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.vulResult || "-" }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <el-collapse-item title="事件分析" name="event-info">
                <el-table
                  :data="eventInfo"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  max-height="700"
                  size="mini"
                  stripe
                  fit
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号"></el-table-column>
                  <el-table-column
                    label="事件名称"
                    show-overflow-tooltip
                    prop="description"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.description || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="时间类型"
                    show-overflow-tooltip
                    prop="type"
                    sortable
                  >
                    <template slot-scope="scope">
                      {{ scope.row.type || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="发生时间"
                    show-overflow-tooltip
                    prop="happenTime"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.happenTime || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="运行方式"
                    show-overflow-tooltip
                    prop="phase"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.phase || "-" }}
                    </template>
                  </el-table-column>
                  <el-table-column
                    label="是否合规"
                    show-overflow-tooltip
                    prop="isIllegal"
                  >
                    <template slot-scope="scope">
                      {{ scope.row.isIllegal || "-" }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-collapse-item>
              <!-- <el-collapse-item title="行为分析" name="action-info">
                <el-table
                  :data="actionInfo"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  max-height="700"
                  size="mini"
                  stripe
                  fit
                  highlight-current-row
                  style="width: 100%"
                >
                  <el-table-column type="index" label="序号"></el-table-column>
                </el-table>
              </el-collapse-item> -->
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Day from "dayjs";
/* eslint-disable no-empty */
export default {
  name: "MonitorDetail",
  filters: {
    dateFormatter(val) {
      if (val) {
        return Day(val).format("YYYY-MM-DD HH:mm:ss");
      }

      return "-";
    },
    statusFormatter(val) {
      if (val) {
        const statusMap = {
          1: "待执行",
          2: "执行中",
          3: "暂停",
          4: "扫描完成",
          5: "停止",
          6: "任务结束",
        };
        return statusMap[val];
      }

      return "-";
    },
    resultFormatter(val) {
      if (val) {
        const resultMap = {
          0: "失败",
          1: "成功",
        };

        return resultMap[val];
      }

      return val;
    },
  },
  data() {
    return {
      loading: false,
      dots: [0, 25, 50, 75, 100],

      selectedId: null,

      baseInfo: {
        // app名称
        appName: "",
        // app类型
        appType: "",
        // 归属业务系统
        businessName: "",
        // 归属部门
        dept: "",
        // app文件
        fileName: "",
        // 检查探针
        probeName: "",
        // 检查模板
        templateName: "",
        // 创建人
        createUser: "",
        // 创建时间
        createTime: "",
        // 修改人
        updateUser: "",
        // 最近修改时间
        updateTime: "",
        executeStatus: "",
        executeResult: "",

        percent: 0,
        startTimeValue: "",
        endTimeValue: "",
      },

      collapseActive: ["leak-info", "event-info", "action-info"],

      leakDetailMap: [
        {
          label: "漏洞危害",
          field: "harm",
        },
        {
          label: "标准规范",
          field: "standard",
        },
        {
          label: "解决方案",
          field: "solution",
        },
      ],

      leakInfo: [],
      eventInfo: [],
      actionInfo: [],
    };
  },
  created() {
    this.selectedId = this.$route.query.id;

    this.getTetail();
    this.getResult();
  },
  methods: {
    async getTetail() {
      this.loading = true;
      try {
        const result = await this.$request({
          url: `/gov/api/app/job/detail/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          this.baseInfo = result;
        }
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    async getResult() {
      try {
        const result = await this.$request({
          url: `/gov/api/app/job/result/${this.selectedId}`,
          method: "GET",
        });

        if (result) {
          const { vulList, eventList } = result;

          if (Array.isArray(vulList)) {
            this.leakInfo = vulList;
          }

          if (Array.isArray(eventList)) {
            this.eventInfo = eventList;
          }
        }
      } catch (e) {}
    },
  },
};
</script>

<style lang="postcss">
.monitor-detail-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100%;
  background-color: #f0f2f5;
  z-index: 100;

  .monitor-detail-box {
    padding: 10px 15px;
    .base-info {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      border-radius: 4px;

      .base-info-title {
        padding: 20px;
        border-bottom: 1px solid #ebeef5;
        font-size: var(--font-size-16);
        color: #5e6b7a;
        font-weight: bold;
      }

      .base-info-content {
        display: flex;
        flex-wrap: wrap;
        padding: 20px;
        .content-item {
          width: 25%;
          padding: 8px 0;
          display: flex;
          .content-item-label {
            color: #606266;
          }
          .content-item-value {
            margin-left: 10px;
            color: #303133;
          }
        }
      }
    }

    .progress-info {
      border: 1px solid #ddd;
      background-color: #fff;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      border-radius: 4px;
      margin-top: 15px;
      padding-bottom: 20px;

      .progress-info-title {
        padding: 20px;
        border-bottom: 1px solid #ebeef5;
        font-size: var(--font-size-16);
        color: #5e6b7a;
        font-weight: bold;
      }

      .progress-container {
        position: relative;
        margin: 0 50px;
        padding-top: 40px;
        padding-bottom: 50px;
        .progress-start-text {
          position: absolute;
          left: 0;
          top: 50px;
          display: flex;
          align-items: center;
          flex-direction: column;
          justify-content: center;
          color: #888;
          font-size: 14px;

          .text-label {
            margin-bottom: 5px;
          }
        }

        .status-text {
          position: absolute;
          top: 10px;
          color: #888;
          font-size: 14px;
          transform: translateX(-50%);
          transition: left 300ms ease;
          min-width: 80px;
        }

        .progress-line {
          height: 2px;
          background-color: #ebeef5;
          position: relative;
          .progress-percent {
            height: 100%;
            background-color: #409eff;
            transition: width 300ms ease;
          }

          .dot-box {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            height: 5px;

            .dot {
              width: 5px;
              height: 5px;
              border-radius: 50%;
              background-color: #409eff;
              position: absolute;
            }
          }
        }

        .progress-end-text {
          position: absolute;
          right: 0;
          top: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: #888;
          font-size: 14px;

          .text-label {
            margin-bottom: 5px;
          }
        }
      }
    }

    .result-info {
      border: 1px solid #ddd;
      background-color: #fff;
      margin-top: 15px;
      box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
      border-radius: 4px;

      .result-info-title {
        padding: 20px;
        border-bottom: 1px solid #ebeef5;
        font-size: var(--font-size-16);
        color: #5e6b7a;
        font-weight: bold;
      }

      .result-content {
        .el-collapse {
          border-top: none;
        }

        .result-content-item {
          .more-detail {
            display: flex;
            align-items: center;

            .detail-label {
              width: 80px;
              font-size: 14px;
              color: #333;
              flex-shrink: 0;
              align-self: flex-start;
            }

            .detail-text {
              color: #666;
              line-height: 24px;
            }
          }
        }
      }
    }
  }
}
</style>
