<template>
  <el-row style="position: relative">
    <!-- 列表 -->
    <el-table
      ref="table"
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
      :default-sort="{
        prop: tableData.orderField,
        order: tableData.orderType === 'desc' ? 'descending' : 'asc',
      }"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column label="任务名称" show-overflow-tooltip prop="name">
        <template slot-scope="scope">
          <el-button type="text" custom size="mini" @click="handleCheckConfig">
            {{ scope.row.name }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="任务编号"
        prop="taskNo"
        show-overflow-tooltip
        width="160"
      />
      <el-table-column
        label="开始时间"
        prop="startTime"
        show-overflow-tooltip
        width="160"
        sortable="custom"
      />
      <el-table-column
        label="结束时间"
        prop="endTime"
        show-overflow-tooltip
        width="160"
        sortable="custom"
      />
      <el-table-column label="进度" width="140">
        <template slot-scope="scope">
          <template>
            <div style="cursor: pointer">
              <el-progress
                :percentage="Number(scope.row.runProcess)"
              ></el-progress>
            </div>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="170">
        <template slot-scope="scope">
          <el-button
            type="text"
            custom
            size="mini"
            @click="handleCheck(scope.row.id)"
            >报告</el-button
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
            v-if="allowContinue(scope.row)"
            type="text"
            custom
            size="mini"
            @click="handleOperate(scope.row.id, 'continue')"
            >继续</el-button
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
          <!-- <el-button
            type="text"
            custom
            size="mini"
            @click="handleDownload(scope.row.id)"
            >下载</el-button
          > -->
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
    childKey: {
      type: Number,
      required: true,
    },
    multipleSelection: {
      type: Array,
      default: () => [],
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
        orderField: "startTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
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
  watch: {
    childKey() {
      this.getList();
    },
  },
  mounted() {
    this.getList("init");
  },
  methods: {
    handleCheck(taskId) {
      this.$router.push({
        name: "source-detect-task-report",
        params: {
          taskId,
        },
      });
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    handleSortChange({ prop, order }) {
      this.tableData.orderField = prop;
      this.tableData.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },
    // 父组件../list.vue会调用此方法，修改此方法及方法名时需先坚持父组件调用情况
    getList(type) {
      this.loading.table = true;
      getTaskPage(this.jobId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
          if (type === "init" && this.multipleSelection.length) {
            this.$nextTick(() => {
              this.multipleSelection.forEach((row) => {
                // 数据必须从 this.tableData.data 里重新取，否则 toggleRowSelection 不认此条数据
                const rowFromTable = _.find(this.tableData.data, {
                  id: row.id,
                });
                this.$refs.table.toggleRowSelection(rowFromTable, true);
              });
            });
          }
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    handleClickProgress(taskId) {
      this.$router.push({
        name: "source-detect-task-progress",
        params: {
          taskId,
        },
      });
    },
    handleOperate(taskId, operateType) {
      const actionText = {
        suspend: "暂停",
        continue: "继续",
        stop: "停止",
        delete: "删除",
      };
      const text = actionText[operateType];
      this.$confirm(`确认将${text}选中任务, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          operateTask({
            idList: [taskId],
            operateType,
          }).then(() => {
            this.$message.success("操作成功");
            this.getList();
          });
        })
        .catch(() => {});
    },
    allowSuspend({ status }) {
      const { WAITING, RUNNING } = TASK_STATUS;
      return [WAITING, RUNNING].includes(status);
    },
    allowContinue({ status }) {
      const { PAUSED } = TASK_STATUS;
      return status === PAUSED;
    },
    allowStop({ status }) {
      const { WAITING, RUNNING, PAUSED } = TASK_STATUS;
      return [WAITING, RUNNING, PAUSED].includes(status);
    },
    handleSelectionChange(value) {
      this.$emit("selection-change", this.jobId, value);
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
    handleCheckConfig() {
      this.$emit("show-form", this.jobId);
    },
  },
};
</script>
