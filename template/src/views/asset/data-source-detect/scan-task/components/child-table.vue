<template>
  <el-row style="position: relative">
    <!-- 列表 -->
    <el-table
      v-loading="loading.table"
      row-key="id"
      :data="tableData.data || []"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      size="mini"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
    >
      <!-- <el-table-column
        type="selection"
        width="45"
        :selectable="checkSelectable"
      /> -->
      <el-table-column label="任务名称" prop="taskName">
        <template slot-scope="scope">
          <el-button
            type="text"
            custom
            size="mini"
            @click="handleCheckReport(scope.row.id)"
          >
            {{ scope.row.taskName }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="任务编号" prop="taskNo" />
      <el-table-column
        label="开始时间"
        prop="startTime"
        show-overflow-tooltip
      />
      <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip />
      <el-table-column label="任务进度">
        <template slot-scope="scope">
          <el-progress :percentage="Number(scope.row.runProcess)"></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            v-if="allowContinue(scope.row)"
            type="text"
            custom
            size="mini"
            @click="handleOperate(scope.row.id, 'continue')"
            >继续</el-button
          >
          <el-button
            v-if="allowSuspend(scope.row)"
            type="text"
            custom
            size="mini"
            @click="handleOperate(scope.row.id, 'suspend')"
            >暂停</el-button
          >
          <el-button
            v-if="allowStop(scope.row)"
            type="text"
            custom
            size="mini"
            @click="handleOperate(scope.row.id, 'stop')"
            >停止</el-button
          >
          <el-button
            type="text"
            custom
            size="mini"
            @click="handleOperate(scope.row.id, 'delete')"
            >删除</el-button
          >
          <el-button
            type="text"
            custom
            size="mini"
            @click="handleDownload(scope.row.id)"
            >下载</el-button
          >
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
</template>
<script>
import globalMixins from "@/mixins/globalMixins.js";
import { getTaskPage, operateTask, downloadReport } from "../api";
import _ from "lodash";
import { TASK_STATUS } from "@/constants";
import { downloadBlob } from "@/util/download";

export default {
  mixins: [globalMixins],
  props: {
    jobId: {
      type: Number,
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
    };
  },
  computed: {
    // 筛选条件整合（左侧一级、二级选项）
    filterFormData() {
      const global = _.pick(this.tableData, [
        "pageSize",
        "pageNum",
        "orderField",
        "orderType",
      ]);
      return {
        global,
        param: {},
      };
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    // 父组件../list.vue会调用此方法，修改此方法及方法名时需先坚持父组件调用情况
    getList() {
      this.loading.table = true;
      getTaskPage(this.jobId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    handleCheckReport(taskId) {
      this.$router.push({
        name: "scan-task-detail",
        params: {
          taskId,
        },
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
    allowSuspend({ isCycleJob, taskStatus }) {
      if (isCycleJob) {
        return false;
      }
      const { WAITING, RUNNING } = TASK_STATUS;
      return [WAITING, RUNNING].indexOf(taskStatus) !== -1;
    },
    allowContinue({ isCycleJob, taskStatus }) {
      if (isCycleJob) {
        return false;
      }
      const { PAUSED } = TASK_STATUS;
      return taskStatus === PAUSED;
    },
    allowStop({ isCycleJob, taskStatus }) {
      if (isCycleJob) {
        return false;
      }
      const { WAITING, RUNNING, PAUSED } = TASK_STATUS;
      return [WAITING, RUNNING, PAUSED].indexOf(taskStatus) !== -1;
    },
    handleDownload(id) {
      downloadReport(id)
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
  },
};
</script>
