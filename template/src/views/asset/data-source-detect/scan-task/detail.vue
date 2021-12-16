<template>
  <div class="container">
    <el-card style="margin-bottom: 15px">
      <div slot="header" class="flex-sb-box">
        <PageHeader
          :title="taskData.taskName + ' 任务编号：' + taskData.taskNo"
        />
        <el-button-group>
          <el-button size="mini" :disabled="!allowStop" @click="handleStop"
            >停止</el-button
          >
          <el-button size="mini" @click="handleDownload">下载报告</el-button>
          <el-button size="mini" @click="toScanDetail">扫描详情</el-button>
        </el-button-group>
      </div>
      <el-form size="mini" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="扫描模版：">
                  <pre>
                  {{ taskData.ipSectionName }}
                  </pre>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="IP地址范围：">
                  <div v-for="ip in taskData.ipSection.split(',')" :key="ip">
                    {{ ip }}
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="端口范围：">{{
                  taskData.portGroup
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="探测资源类型：">{{
                  taskData.assetType
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="所属网络域：">{{
                  taskData.netdistrictName
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="扫描探针：">{{
                  taskData.probeName
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="执行方式：">{{
                  taskData.executeCycle === "02" ? "周期执行" : "立即执行"
                }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="创建人：">{{
                  taskData.createUser
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="创建时间：">{{
                  taskData.createTime
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="修改人：">{{
                  taskData.updateUser
                }}</el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="最近修改时间：">{{
                  taskData.updateTime
                }}</el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <!-- <el-col :span="6" :offset="6">
            <el-col :span="12">
              <el-form-item label="执行状态"></el-form-item>
              <p class="bold-item">
                {{ taskData.executeStatusDesc }}
              </p>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行时长"></el-form-item>
              <p class="bold-item">
                {{ formatSecond(taskData.executeTimeLong) }}
              </p>
            </el-col>
          </el-col> -->
        </el-row>
      </el-form>
    </el-card>
    <ProgressCard
      :task-id="taskId"
      style="margin-bottom: 15px"
      :data="taskData"
      @operate="getTask"
    />
    <el-card>
      <div slot="header">
        <PageHeader title="扫描结果" />
      </div>
      <!-- <p style="margin-bottom: 12px">2个IP地址。3个数据资源类型 ，2个新发现</p> -->
      <el-row style="position: relative">
        <!-- 筛选条件 -->

        <!-- 列表 -->
        <el-table
          v-loading="loading.table"
          row-key="id"
          :data="tableData.data"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          size="mini"
          stripe
          fit
          highlight-current-row
          style="width: 100%"
          :default-sort="{
            prop: tableData.orderField,
            order: tableData.orderType === 'desc' ? 'descending' : 'asc',
          }"
          :span-method="cellMerge"
          @sort-change="handleSortChange"
        >
          <el-table-column label="IP地址" prop="ip" />
          <el-table-column label="端口号" prop="port" />
          <el-table-column label="数据资源类型" prop="assetType" />
          <el-table-column label="扫描发现时间" prop="executeTime" />
          <el-table-column label="是否新发现" prop="isNew">
            <template slot-scope="scope">
              <span v-if="scope.row.isNew === '1'">
                <img
                  style="width: 28px; height: 28px"
                  src="~@/assets/images/new.svg"
                />
              </span>
              <span v-else> - </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <idss-pagination
          background
          :table-data="tableData"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next,sizes, jumper"
          @page-change="tTableChange"
          @size-change="tTableChange"
        />
      </el-row>
    </el-card>
    <div v-if="scanDetailVisible">
      <scan-detail :visible.sync="scanDetailVisible" :task-id="taskId" />
    </div>
  </div>
</template>
<script>
import globalMixins from "@/mixins/globalMixins.js";
import { getTask, getTaskAssetPage, downloadReport, operateTask } from "./api";
import PageHeader from "@/components/PageHeader";
import ProgressCard from "./components/progress-card";
import { pick } from "lodash";
import { downloadBlob } from "@/util/download";
import { TASK_STATUS } from "@/constants";
import { formatSecond } from "@/util/format";
import ScanDetail from "./components/ScanDetail.vue";

export default {
  components: {
    PageHeader,
    ProgressCard,
    ScanDetail,
  },
  mixins: [globalMixins],
  props: {
    taskId: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: false,
      },
      taskData: {
        ipSection: "",
      },
      spanArr: [],
      formatSecond,

      scanDetailVisible: false,
    };
  },
  computed: {
    // 筛选条件整合（左侧一级、二级选项）
    filterFormData() {
      const global = pick(this.tableData, [
        "pageSize",
        "pageNum",
        "orderField",
        "orderType",
      ]);
      return {
        global,
        param: {
          taskId: this.taskId,
        },
      };
    },
    allowStop() {
      const status = this.taskData.executeStatus;
      const { WAITING, RUNNING, PAUSED } = TASK_STATUS;
      return [WAITING, RUNNING, PAUSED].indexOf(status) !== -1;
    },
  },
  created() {
    this.getTask();
    this.getList();
  },
  methods: {
    getList() {
      this.loading.table = true;
      getTaskAssetPage(this.filterFormData)
        .then((res) => {
          this.tableData = res;
          this.getSpanArr(res.data);
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    handleSortChange({ prop, order }) {
      this.tableData.orderField = prop;
      this.tableData.orderType = order === "descending" ? "desc" : "asc";
      this.getTableData("submit");
    },
    getTask() {
      getTask(this.taskId).then((res) => {
        this.taskData = { ...this.taskData, ...res };
      });
    },
    getSpanArr(data) {
      let pos = 0;
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].ip === data[i - 1].ip) {
            this.spanArr[pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            pos = i;
          }
        }
      }
    },
    cellMerge({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    handleDownload() {
      downloadReport(this.taskId)
        .then((blob) => {
          if (blob.data.size) {
            downloadBlob(blob);
          } else {
            this.$message.error("下载失败");
          }
        })
        .catch(() => {
          this.$message.error("下载失败");
        });
    },
    handleOperate(taskId, operateType) {
      const operates = {
        continue: "继续",
        suspend: "暂停",
        stop: "停止",
        delete: "删除",
        scan: "重新扫描",
      };
      const currentOperateText = operates[operateType];
      this.$confirm(
        `此操作将${currentOperateText}选中任务, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        operateTask(taskId, {
          operateType,
        }).then(() => {
          this.getList();
        });
      });
    },
    handleStop() {
      this.handleOperate(this.taskId, "stop");
    },
    toScanDetail() {
      this.scanDetailVisible = true;
    },
  },
};
</script>
<style scoped lang="postcss">
.container {
  padding: 10px 15px;
  .idss-font--title {
    font-size: var(--font-size-16);
    margin-bottom: 10px;
  }
  .el-form-item {
    margin-bottom: 6px;
  }
  .bold-item {
    font-weight: 500;
    font-size: 20px;
  }
}
>>> .page-header {
  padding-top: 6px;
  padding-bottom: 6px;
}
</style>
