<template>
  <div class="container">
    <div class="content">
      <PageHeader title="敏感识别任务"> </PageHeader>
      <div class="flex-sb-box">
        <FilterBar
          v-model="filterValue"
          :fields="filterFields"
          module-code="dataJob"
        />
        <div class="filter-items">
          <Timer
            :state.sync="timer.state"
            :value.sync="timer.value"
            :interval="timer.interval"
            @refresh="refresh"
          />
          <div>
            <el-button
              size="mini"
              type="primary"
              plain
              circle
              icon="el-icon-refresh-right"
              @click="refresh"
            >
            </el-button>
          </div>
          <div style="margin-left: 10px">
            <el-button size="mini" type="primary" @click="handleAdd">
              +新增
            </el-button>
          </div>
          <!-- <div style="margin-left: 10px">
            <el-button
              :disabled="multipleStartDisabled"
              size="mini"
              type="primary"
              @click="handleMultipleOperate('start')"
              >批量启动</el-button
            >
          </div>
          <div style="margin-left: 10px">
            <el-button
              :disabled="multipleStopDisabled"
              size="mini"
              type="primary"
              @click="handleMultipleOperate('stop')"
              >批量终止</el-button
            >
          </div>
          <div style="margin-left: 10px">
            <el-button
              :disabled="multipleSuspendDisabled"
              size="mini"
              type="primary"
              @click="handleMultipleOperate('suspend')"
              >批量暂停</el-button
            >
          </div> -->
          <div style="margin-left: 10px">
            <el-button
              size="mini"
              plain
              class="operate-button"
              :disabled="!selectedTaskIds.length"
              @click="handleMultipleDelete"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
      <div style="display: flex; position: relative">
        <!-- 聚合条件 -->
        <AggFilter
          v-model="aggFilter.value"
          :select="aggFilter.select"
          :list="aggFilter.list"
          @select-change="getAggData"
          @list-change="getList"
        />
        <!-- 列表 -->
        <div style="margin-left: 10px; flex: 1; width: 500px">
          <div>
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
              :row-class-name="getRowClass"
              @selection-change="handleSelectionChange"
              @sort-change="handleSortChange"
            >
              <el-table-column type="selection" width="42" />
              <el-table-column type="expand" width="14">
                <template v-if="scope.row.id" slot-scope="scope">
                  <ChildTable
                    :ref="'childTable' + scope.row.id"
                    :job-id="scope.row.id"
                    :child-key="childKey"
                    :multiple-selection="
                      tableData.childMultipleSelection[scope.row.id] || []
                    "
                    @selection-change="handleChildSelectionChange"
                    @show-form="handleCheck"
                  />
                </template>
              </el-table-column>
              <el-table-column label="序号" type="index" />
              <el-table-column
                v-if="showCol('name')"
                label="任务名称"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  {{ scope.row.name }}
                  <!-- <template v-if="scope.row.isCycleJob || !scope.row.taskId">
                    {{ scope.row.name }}
                  </template> -->
                  <!-- <el-button
                    type="text"
                    custom
                    size="mini"
                    @click="handleCheck(scope.row.id)"
                  >
                    {{ scope.row.name }}
                  </el-button> -->
                </template>
              </el-table-column>
              <el-table-column
                v-if="showCol('isCycleJob')"
                label="执行方式"
                prop="executeCycle"
                width="80"
              >
                <template slot-scope="scope">
                  {{ scope.row.isCycleJob ? "周期执行" : "立即执行" }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="showCol('probeName')"
                label="扫描探针"
                prop="probeName"
                show-overflow-tooltip
                width="110"
              />
              <el-table-column
                v-if="showCol('assetType')"
                label="扫描对象类型"
                prop="assetType"
                show-overflow-tooltip
                width="110"
              />
              <!-- <el-table-column
                v-if="showCol('startTime')"
                label="开始时间"
                prop="startTime"
                show-overflow-tooltip
                width="160"
                sortable="custom"
              />
              <el-table-column
                v-if="showCol('endTime')"
                label="结束时间"
                prop="endTime"
                show-overflow-tooltip
                width="160"
                sortable="custom"
              /> -->
              <!-- <el-table-column
                v-if="showCol('runProcess')"
                label="进度"
                width="120"
              >
                <template slot-scope="scope">
                  <template v-if="!scope.row.isCycleJob && scope.row.taskId">
                    <div
                      style="cursor: pointer"
                      @click="handleClickProgress(scope.row.taskId)"
                    >
                      <el-progress
                        :percentage="Number(scope.row.runProcess)"
                      ></el-progress>
                    </div>
                  </template>
                  <template v-else> - </template>
                </template>
              </el-table-column> -->
              <el-table-column label="操作" width="170">
                <template slot-scope="scope">
                  <!-- 立即执行任务 不允许编辑 -->
                  <!-- <el-button
                    v-if="scope.row.taskId"
                    type="text"
                    custom
                    size="mini"
                    @click="handleCheckReport(scope.row.taskId)"
                    >报告</el-button
                  > -->
                  <el-button
                    type="text"
                    custom
                    size="mini"
                    @click="handleEdit(scope.row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    v-if="allowSuspend(scope.row)"
                    type="text"
                    custom
                    size="mini"
                    @click="handleOperate(scope.row.id, 'pauseJob')"
                    >暂停</el-button
                  >
                  <el-button
                    v-if="allowContinue(scope.row)"
                    type="text"
                    custom
                    size="mini"
                    @click="handleOperate(scope.row.id, 'resumeJob')"
                    >继续</el-button
                  >
                  <!-- <el-button
                    v-if="allowStop(scope.row)"
                    type="text"
                    custom
                    size="mini"
                    @click="handleOperate(scope.row.taskId, 'stop')"
                    >停止</el-button
                  > -->
                  <el-button
                    type="text"
                    custom
                    size="mini"
                    @click="handleDelete(scope.row.id)"
                    >删除</el-button
                  >
                  <!-- <el-button
                    v-if="!scope.row.isCycleJob"
                    type="text"
                    custom
                    size="mini"
                    @click="handleDownload(scope.row.id)"
                    >下载</el-button
                  > -->
                </template>
              </el-table-column>
            </el-table>
            <ColumnsSelect v-model="columns" />
            <!-- 分页 -->
            <idss-pagination
              background
              :table-data="tableData"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, prev, pager, next,sizes, jumper"
              @page-change="tTableChange"
              @size-change="tTableChange"
            />
          </div>
        </div>
      </div>
    </div>
    <el-drawer
      ref="drawer"
      :title="drawerTitle"
      :visible.sync="drawer.visible"
      destroy-on-close
      size="640px"
      :wrapper-closable="false"
    >
      <Form v-bind="drawer" :visible.sync="drawer.visible" @success="getList" />
    </el-drawer>
  </div>
</template>

<script>
import globalMixins from "@/mixins/globalMixins.js";
import PageHeader from "@/components/PageHeader";
import FilterBar from "@/components/filter-bar";
import Form from "./components/form";
import ChildTable from "./components/child-table";
import AggFilter from "@/components/agg-filter";
import ColumnsSelect from "@/components/columns-select";
import Timer from "@/components/timer";
import {
  getJobPage,
  getListFilterFields,
  getSelectOptions,
  postJobDelete,
  operateTask,
  operateParentTask,
  getAggFilters,
  getAggData,
  downloadReport,
} from "./api";
import { TASK_STATUS } from "@/constants";
import { downloadBlob } from "@/util/download";

export default {
  components: {
    PageHeader,
    FilterBar,
    Form,
    ChildTable,
    AggFilter,
    ColumnsSelect,
    Timer,
  },
  mixins: [globalMixins],
  data() {
    return {
      drawer: {
        visible: false,
        type: "add",
        id: null,
      },
      timer: {
        state: "play",
        value: 30,
        interval: [5, 30, 60, 300],
      },
      filterValue: {},
      filterFields: [],
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        childMultipleSelection: {}, // 子表格多选
        orderField: "startTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: true,
      },
      aggFilter: {
        value: {
          select: null,
          list: null,
        },
        select: [],
        list: [],
      },
      childKey: 0,

      columns: [
        {
          code: "name",
          name: "任务名称",
          checked: true,
          disabled: true,
        },
        {
          code: "isCycleJob",
          name: "执行方式",
          checked: true,
          disabled: true,
        },
        {
          code: "probeName",
          name: "扫描探针",
          checked: true,
          disabled: true,
        },
        {
          code: "assetType",
          name: "扫描对象类型",
          checked: true,
          disabled: true,
        },
        // {
        //   code: "startTime",
        //   name: "开始时间",
        //   checked: true,
        //   disabled: false,
        // },
        // {
        //   code: "endTime",
        //   name: "结束时间",
        //   checked: true,
        //   disabled: false,
        // },
        // {
        //   code: "runProcess",
        //   name: "进度",
        //   checked: true,
        //   disabled: false,
        // },
      ],
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
        param: {
          ...this.filterValue,
          moduleCode: "dataJob",
          aggCode: this.aggFilter.value.select,
          aggValue: this.aggFilter.value.list,
        },
      };
    },
    selectedIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
    drawerTitle() {
      const obj = {
        add: "新增",
        edit: "编辑",
        check: "查看",
      };
      return (obj[this.drawer.type] || "") + "敏感识别任务";
    },
    multipleStartDisabled() {
      const tasks = this.selectedTasks;
      const notStopedTask = _.find(tasks, (o) => {
        return o._status !== TASK_STATUS.STOPED;
      });
      return !!notStopedTask || !tasks.length;
    },
    multipleStopDisabled() {
      const tasks = this.selectedTasks;
      const notRunningTask = _.find(tasks, (o) => {
        return o._status !== TASK_STATUS.RUNNING;
      });
      return !!notRunningTask || !tasks.length;
    },
    multipleSuspendDisabled() {
      const tasks = this.selectedTasks;
      const notRunningTask = _.find(tasks, (o) => {
        return o._status !== TASK_STATUS.RUNNING;
      });
      return !!notRunningTask || !tasks.length;
    },
    selectedTasks() {
      const result = [];
      // 所有选中的子表格
      Object.keys(this.tableData.childMultipleSelection).forEach((key) => {
        result.push(
          ...this.tableData.childMultipleSelection[key].map((item) => ({
            _id: item.id,
            _status: item.status,
          }))
        );
      });
      // 当前表格的选中task
      result.push(
        ...this.tableData.multipleSelection.map((item) => ({
          _id: item.taskId,
          _status: item.taskStatus,
        }))
      );
      return result;
    },
    selectedTaskIds() {
      return this.selectedTasks.map((item) => item._id);
    },
  },
  watch: {
    filterValue: {
      handler() {
        this.getAggFilter();
      },
      deep: true,
    },
    "drawer.visible": {
      handler(newVal) {
        if (!newVal) {
          this.$refs.drawer?.closeDrawer();
        }
      },
    },
  },
  created() {
    this.getFilterFields();
    this.getAggFilter();
    const { type, assetId } = this.$route.query;
    // 处理从敏感资源管理跳转
    if (type === "add" && assetId) {
      this.drawer = {
        type: "add",
        visible: true,
        id: null,
        assetId,
      };
    }
  },
  methods: {
    showCol(code) {
      return _.find(this.columns, { code })?.checked;
    },
    getList() {
      this.loading.table = true;
      getJobPage(this.filterFormData)
        .then((res) => {
          const tableData = { ...this.tableData, ...res };
          tableData.data = tableData.data.map((item) => {
            item.isCycleJob = item.executeCycle === "02";
            return item;
          });
          this.tableData = tableData;
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    async getFilterFields() {
      const fields = await getListFilterFields();

      for (let i = 0; i < fields.length; i++) {
        for (let n = 0; n < fields[i].children.length; n++) {
          if (
            fields[i].children[n].type === "select" ||
            fields[i].children[n].type === "treeSelect"
          ) {
            try {
              fields[i].children[n].options = await getSelectOptions(
                fields[i].children[n].code
              );
            } catch (error) {
              fields[i].children[n].options = [];
            }
          }
          // if (fields[i].children[n].isDefault) {
          //   this.$set(this.filterValue, fields[i].children[n].code, null);
          // }
        }
      }
      this.filterFields = fields;
    },
    /**
     * @param {string} type 区分列表更新模式
     */
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    /**
     * 排序
     * @param {object} column
     */
    handleSortChange({ prop, order }) {
      this.tableData.orderField = prop;
      this.tableData.orderType = order === "descending" ? "desc" : "asc";
      this.getTableData("submit");
    },
    handleMultipleDelete() {
      if (!this.selectedTaskIds.length) {
        this.$message({
          type: "warning",
          message: "请选择数据",
        });
        return;
      }
      this.$confirm("此操作将永久删除选中任务, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          operateTask({
            idList: this.selectedTaskIds,
            operateType: "delete",
          }).then(() => {
            this.$message.success("操作成功");
            this.getList();
            this.updateChildKey();
          });
        })
        .catch(() => {});
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteJob([id]);
        })
        .catch(() => {});
    },
    deleteJob(idList) {
      postJobDelete({
        idList,
      }).then(() => {
        this.$message.success("删除成功！");
        this.getList();
      });
    },
    /**
     * table多选操作
     * @param {object} val 当前选中的条目
     */
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    handleChildSelectionChange(jobId, val) {
      this.$set(this.tableData.childMultipleSelection, jobId, val);
    },
    // 分页触发
    tTableChange(params) {
      this.tableData.childMultipleSelection = {};
      this.tableChange(params, this.tableData, this.getList);
    },
    handleAdd() {
      this.drawer = {
        visible: true,
        id: null,
        type: "add",
      };
    },
    handleEdit(id) {
      this.drawer = {
        visible: true,
        id,
        type: "edit",
      };
    },
    handleCheck(id) {
      this.drawer = {
        visible: true,
        id,
        type: "check",
      };
    },
    handleCheckReport(taskId) {
      this.$router.push({
        name: "source-detect-task-report",
        params: {
          taskId,
        },
      });
    },
    handleOperate(taskId, operateType) {
      /*
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
      */
      const operates = {
        resumeJob: "继续",
        pauseJob: "暂停",
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
        operateParentTask(taskId, operateType).then(() => {
          this.getList();
        });
      });
    },
    handleMultipleOperate(operateType) {
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
            idList: this.selectedTaskIds,
            operateType,
          }).then(() => {
            this.$message.success("操作成功");
            this.getList();
            this.updateChildKey();
          });
        })
        .catch(() => {});
    },
    allowSuspend({ isCycleJob, executeStatus }) {
      // if (isCycleJob) {
      //   return false;
      // }
      // const { WAITING, RUNNING } = TASK_STATUS;
      // return [WAITING, RUNNING].indexOf(taskStatus) !== -1;

      return isCycleJob && executeStatus !== 3;
    },
    allowContinue({ isCycleJob, executeStatus }) {
      // if (isCycleJob) {
      //   return false;
      // }
      // const { PAUSED } = TASK_STATUS;
      // return taskStatus === PAUSED;

      return isCycleJob && executeStatus === 3;
    },
    allowStop({ isCycleJob, taskStatus }) {
      if (isCycleJob) {
        return false;
      }
      const { WAITING, RUNNING, PAUSED } = TASK_STATUS;
      return [WAITING, RUNNING, PAUSED].indexOf(taskStatus) !== -1;
    },
    getRowClass({ row }) {
      return "cycle-job";
      // return row.isCycleJob ? "cycle-job" : "one-off-job";
    },
    handleClickProgress(taskId) {
      this.$router.push({
        name: "source-detect-task-progress",
        params: {
          taskId,
        },
      });
    },
    async getAggFilter() {
      this.aggFilter.select = await getAggFilters();
      this.aggFilter.value.select = _.get(
        this.aggFilter,
        "select[0].children[0].code",
        ""
      );
      this.getAggData();
    },
    getAggData() {
      getAggData(this.filterFormData).then((res) => {
        this.aggFilter.list = [
          {
            code: null,
            name: res.totalName,
            num: res.totalNum,
          },
          ...res.allCondition.map(({ aggValue, aggName, num }) => ({
            code: aggValue,
            name: aggName,
            num,
          })),
        ];
        this.aggFilter.value.list = null;
        this.getList();
      });
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
    selectable(row) {
      return !row.isCycleJob;
    },
    updateChildKey() {
      this.childKey = this.childKey + 1;
    },
    refresh() {
      this.getList();
      const childTables = [];
      this.tableData.data.forEach((item) => {
        if (item.id && this.$refs["childTable" + item.id]) {
          childTables.push(this.$refs["childTable" + item.id]);
        }
      });
      childTables.forEach((child) => {
        if (typeof child?.getList === "function") {
          child.getList();
        }
      });
    },
  },
};
</script>

<style scoped lang="postcss">
/* @import url("base.css"); */
.container {
  .content {
    padding: 10px 15px;
    .idss-font--title {
      font-size: var(--font-size-16);
      margin-bottom: 10px;
    }

    >>> .page-header .title {
      min-width: 112px;
    }
  }
  .el-button + .el-select {
    margin-left: 10px;
  }
  .filter-items {
    display: flex;
    .select.el-select {
      width: 85px;
    }
  }
  .el-table {
    margin-bottom: 10px;
    >>> .cell {
      white-space: nowrap;
    }
  }
}
.flex-sb-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

>>> .one-off-job {
  .el-table__expand-icon {
    display: none;
  }
}
</style>
