<template>
  <div class="container">
    <div class="content">
      <PageHeader title="数据资源发现" />
      <CardInfo style="margin-bottom: 12px" />
      <div class="flex-sb-box">
        <FilterBar
          v-model="filterValue"
          :fields="filterFields"
          module-code="dataAssetDiscover"
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
          <div v-auth="'button.add'" style="margin-left: 10px">
            <el-button size="mini" type="primary" @click="handleAdd">
              +新建
            </el-button>
          </div>
          <div v-auth="'button.delete'" style="margin-left: 10px">
            <el-button size="mini" plain> 删除 </el-button>
          </div>
        </div>
      </div>
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
          :row-class-name="getRowClass"
          :default-sort="{
            prop: tableData.orderField,
            order: tableData.orderType === 'desc' ? 'descending' : 'asc',
          }"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column type="expand" width="15">
            <template v-if="scope.row.id" slot-scope="scope">
              <ChildTable
                :ref="'childTable' + scope.row.id"
                :job-id="scope.row.id"
              />
            </template>
          </el-table-column>
          <el-table-column
            v-if="showCol('name')"
            label="任务名称"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
            <!-- <template v-if="scope.row.isCycleJob || !scope.row.taskId">
                {{ scope.row.name }}
              </template>
              <el-button
                v-else
                type="text"
                custom
                size="mini"
                @click="handleCheckReport(scope.row.taskId)"
              >
                {{ scope.row.name }}
              </el-button>
            </template> -->
          </el-table-column>
          <el-table-column v-if="showCol('ip')" label="扫描对象" prop="ip">
            <template slot-scope="scope">
              <div>
                {{ scope.row.ip[0] || "" }}
                <el-popover
                  v-if="scope.row.ip.length"
                  placement="right"
                  width="300"
                  trigger="hover"
                >
                  <template>
                    <p v-for="item in scope.row.ip" :key="item">{{ item }}</p>
                  </template>
                  <el-tag
                    v-if="scope.row.ip.length > 1"
                    slot="reference"
                    size="small"
                    >{{ scope.row.ip.length }}</el-tag
                  >
                </el-popover>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showCol('netdistrictName')"
            label="所属网络域"
            prop="netdistrictName"
          />
          <el-table-column
            v-if="showCol('probeName')"
            label="扫描探针"
            prop="probeName"
          />
          <el-table-column
            v-if="showCol('isCycleJob')"
            label="执行方式"
            prop="isCycleJob"
            width="80"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{ scope.row.isCycleJob ? "周期执行" : "立即执行" }}
            </template>
          </el-table-column>
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
            label="任务进度"
            width="140"
          >
            <template v-if="!scope.row.isCycleJob" slot-scope="scope">
              <el-progress
                :percentage="Number(scope.row.runProcess)"
              ></el-progress>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" width="180">
            <template slot-scope="scope">
              <!-- <el-button
                v-if="!scope.row.isCycleJob && scope.row.taskId"
                type="text"
                custom
                size="mini"
                @click="handleDownload(scope.row.taskId)"
                >下载</el-button
              > -->
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleEdit(scope.row.id)"
                >编辑</el-button
              >

              <el-button
                v-if="allowContinue(scope.row)"
                type="text"
                custom
                size="mini"
                @click="handleOperate(scope.row.id, 'resumeJob')"
                >继续</el-button
              >
              <el-button
                v-if="allowSuspend(scope.row)"
                type="text"
                custom
                size="mini"
                @click="handleOperate(scope.row.id, 'pauseJob')"
                >暂停</el-button
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
                v-if="allowRescan(scope.row)"
                type="text"
                custom
                size="mini"
                @click="handleOperate(scope.row.taskId, 'scan')"
                >重新扫描</el-button
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
      </el-row>
      <FormDialog
        v-bind.sync="formDialog"
        :visible.sync="formDialog.visible"
        @success="getList"
      />
    </div>
  </div>
</template>
<script>
import { pick } from "lodash";
import FilterBar from "@/components/filter-bar";
import globalMixins from "@/mixins/globalMixins.js";
import PageHeader from "@/components/PageHeader";
import ColumnsSelect from "@/components/columns-select";
import Timer from "@/components/timer";
import CardInfo from "./components/card-info";
import ChildTable from "./components/child-table";
import FormDialog from "./components/form-dialog.vue";
import {
  getJobPage,
  operateParentTask,
  getFilterOptions,
  getFilters,
  deleteJob,
  downloadReport,
} from "./api";
import { TASK_STATUS } from "@/constants";
import { downloadBlob } from "@/util/download";
export default {
  components: {
    PageHeader,
    CardInfo,
    ChildTable,
    FilterBar,
    FormDialog,
    ColumnsSelect,
    Timer,
  },
  mixins: [globalMixins],
  data() {
    return {
      filterValue: {},
      filterFields: [],
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
      formDialog: {
        visible: false,
        type: "add",
        id: null,
      },
      timer: {
        state: "play",
        value: 30,
        interval: [5, 30, 60, 300],
      },

      columns: [
        {
          code: "name",
          name: "任务名称",
          checked: true,
          disabled: true,
        },
        {
          code: "ip",
          name: "扫描对象",
          checked: true,
          disabled: true,
        },
        {
          code: "netdistrictName",
          name: "所属网络域",
          checked: true,
          disabled: false,
        },
        {
          code: "probeName",
          name: "扫描探针",
          checked: true,
          disabled: true,
        },
        {
          code: "isCycleJob",
          name: "执行方式",
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
        //   name: "任务进度",
        //   checked: true,
        //   disabled: false,
        // },
      ],
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
        param: this.filterValue,
      };
    },
  },
  watch: {
    filterValue: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
  created() {
    this.getFilterFields();
    this.getList();
  },
  methods: {
    showCol(code) {
      return _.find(this.columns, { code })?.checked;
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
      this.getList();
    },
    handleAdd() {
      this.formDialog = {
        type: "add",
        id: null,
        visible: true,
      };
    },
    handleEdit(id) {
      this.formDialog = {
        type: "edit",
        id,
        visible: true,
      };
    },
    getList() {
      this.loading.table = true;
      getJobPage(this.filterFormData)
        .then((res) => {
          const tableData = { ...this.tableData, ...res };
          tableData.data = tableData.data.map((item) => {
            item.isCycleJob = item.executeCycle === "02";
            item.ip = item.ip?.split(",") || [];
            return item;
          });
          this.tableData = tableData;
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
    handleOperate(jobId, operateType) {
      /*
      if (!jobId) {
        this.$message.warning("暂未生成任务，稍后再试");
        return;
      }
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
        operateTask(jobId, {
          operateType,
        }).then(() => {
          this.getList();
        });
      });
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
        operateParentTask(jobId, operateType).then(() => {
          this.getList();
        });
      });
    },
    handleDelete(id) {
      this.$confirm(`此操作将删除选中数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteJob({
          idList: [id],
        }).then(() => {
          this.$message.success("删除成功");
          this.getList();
        });
      });
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
    allowRescan(isCycleJob) {
      return !isCycleJob;
    },
    getRowClass({ row }) {
      return "cycle-job";
      // return row.isCycleJob ? : "one-off-job";
    },
    async getFilterFields() {
      const fields = await getFilters();

      for (let i = 0; i < fields.length; i++) {
        for (let n = 0; n < fields[i].children.length; n++) {
          if (
            fields[i].children[n].type === "select" ||
            fields[i].children[n].type === "treeSelect"
          ) {
            try {
              fields[i].children[n].options = await getFilterOptions(
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
