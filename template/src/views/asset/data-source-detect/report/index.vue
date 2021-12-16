<template>
  <div class="container">
    <div class="content">
      <h4 class="idss-font--title idss-container-header">合规分析稽核报表</h4>
      <el-row>
        <div class="flex-sb-box">
          <FilterBar
            v-model="filterValue"
            :fields="filterFields"
            module-code="report"
          />
          <!-- 筛选条件 -->
          <div class="filter-items">
            <div style="margin-right: 10px">
              <el-button size="mini" type="primary" @click="create">
                +新建
              </el-button>
            </div>

            <div>
              <el-button
                size="mini"
                class="operate-button"
                @click="handleDelete"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          v-loading="loading.table"
          :data="tableData.data"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          size="mini"
          stripe
          fit
          highlight-current-row
          row-key="id"
          :expand-row-keys="[]"
          style="width: 100%"
          :default-sort="{
            prop: tableData.orderField,
            order: tableData.orderType === 'desc' ? 'descending' : 'ascending',
          }"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column type="index" label="序号" />
          <el-table-column type="expand" label="展开">
            <template slot-scope="scope">
              <ChildTable
                :report-id="scope.row.id"
                :send-type="getSendTypeFromConfig(scope.row.sendConfig)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="报表名称"
            prop="reportName"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                custom
                class="link-type"
                @click="handleEdit(scope.row)"
              >
                {{ scope.row.reportName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="所有者" prop="createUser" />
          <el-table-column
            width="160"
            label="创建时间"
            prop="createTime"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            width="160"
            label="最近更新时间"
            prop="updateTime"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
            label="状态"
            prop="reportResult"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.reportResult == 2">
                <span
                  class="health-type warning"
                  @click="showStatusDesc(scope.row.sendResultDesc)"
                  ><i class="el-icon-warning"></i>
                  {{ reportStatusMap[scope.row.reportResult] }}</span
                >
              </template>
              <template v-else>
                <span class="health-type running">
                  {{ reportStatusMap[scope.row.reportResult] }}</span
                >
              </template>
            </template>
          </el-table-column>
          <el-table-column label="计划任务" prop="executeCycleDesc" />
          <el-table-column label="启停">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="0"
                @change="
                  (value) => {
                    handleChangeStatus(value, scope.row);
                  }
                "
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                custom
                class="link-type"
                :disabled="scope.row.status === 0"
                @click="runNow(scope.row)"
              >
                立即执行
              </el-button>
              <el-button
                type="text"
                size="mini"
                custom
                class="link-type"
                @click="showLog(scope.row)"
              >
                报表日志
              </el-button>
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
    </div>
    <LogDialog v-bind="logDialog" :visible.sync="logDialog.visible" />
  </div>
</template>

<script>
import {
  getReportConfigList,
  deleteReportConfig,
  updateReportConfigStatus,
  executeNow,
} from "./api";
import globalMixins from "@/mixins/globalMixins.js";
import ChildTable from "./components/child-table";
import LogDialog from "./components/log-dialog";
import FilterBar from "@/components/filter-bar";

export default {
  name: "ReportManage",
  components: {
    FilterBar,
    ChildTable,
    LogDialog,
  },
  mixins: [globalMixins],
  data() {
    return {
      filterValue: {},
      filterFields: [
        {
          code: "filter",
          name: "过滤",
          type: null,
          isDefault: null,
          children: [
            {
              code: "reportName",
              name: "报表名称",
              type: "input",
              isDefault: "1",
            },
            {
              code: "createUser",
              name: "所有者",
              type: "input",
            },
            {
              name: "创建时间",
              code: "createTimeList",
              type: "date",
            },
            {
              name: "最近更新时间",
              code: "updateTimeList",
              type: "date",
            },
            {
              code: "reportResultList",
              name: "状态",
              type: "select",
              options: [
                { code: "1", name: "成功" },
                { code: "2", name: "失败" },
                { code: "3", name: "执行中" },
                { code: "4", name: "未执行" },
              ],
            },
            {
              code: "status",
              name: "启停",
              type: "select",
              multiple: false,
              options: [
                { code: 1, name: "开启" },
                { code: 0, name: "关闭" },
              ],
            },
          ],
        },
      ],
      reportStatusMap: {
        1: "成功",
        2: "失败",
        3: "执行中",
        4: "未执行",
      },
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 10, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "updateTime", // 排序字段
        orderType: "desc", // 排序方式 asc正序 desc 倒序
        // orderField: 'updateDate', // 排序字段 updateDate(创建时间) updateDate(更新时间)
        // orderType: 'desc' // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: false,
      },
      // 筛选项
      form: {
        type: "reportName", // 一级下拉框值
        value: "", // 联动的二级值
      },
      logDialog: {
        visible: false,
        reportId: null,
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
        param: this.filterValue,
      };
    },
    selectIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
  },
  watch: {
    // 筛选条件变化时候，请求接口
    filterValue: {
      handler() {
        this.tableChange(this.filterFormData, this.tableData, this.getList);
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // 由此数据时,则说明来自数据集管理页面
    if (this.$route.params.gplText) {
      this.create();
    }
  },
  methods: {
    getList() {
      this.loading.table = true;
      getReportConfigList(this.filterFormData)
        .then((res) => {
          this.tableData = Object.assign(this.tableData, res);
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    create() {
      this.$router.push({
        name: "add-report",
      });
    },
    /**
     * @param {string} type 区分列表更新模式
     */
    getTableData() {
      this.tableChange({}, this.tableData, this.getList);
    },
    handleDelete() {
      if (!this.selectIds.length) {
        this.$message({
          type: "warning",
          message: "请选择需要删除的数据",
        });
        return;
      }
      this.$confirm(
        "删除报表后，该报表任务下的所有报表将被删除，是否确认？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading.del = true;
          deleteReportConfig({ idList: this.selectIds })
            .then(() => {
              this.$message.success("删除成功！");
              this.getList();
            })
            .finally(() => {
              this.loading.del = false;
            });
        })
        .catch(() => {});
    },
    /**
     * table多选操作
     * @param {object} val 当前选中的条目
     */
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    /**
     * 查看详情-编辑页面
     */
    handleEdit({ id }) {
      this.$router.push({
        name: "edit-report",
        params: {
          id,
        },
      });
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    handleChangeStatus(value, { id }) {
      updateReportConfigStatus({
        idList: [id],
        operateType: value == 1 ? "open" : "close",
      }).then(() => {
        this.$message.success("操作成功");
      });
    },
    showLog({ id }) {
      this.logDialog = {
        visible: true,
        reportId: id,
      };
    },
    getSendTypeFromConfig(configString) {
      try {
        const config = JSON.parse(configString);
        return Object.keys(config);
      } catch (error) {
        return [];
      }
    },
    handleSortChange({ order, prop }) {
      this.tableData.orderField = prop;
      this.tableData.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },
    runNow({ id }) {
      this.$confirm("是否立即执行一次报表任务?", "立即执行", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          executeNow(id).then(() => {
            this.$message.success("执行成功");
            this.getList();
          });
        })
        .catch(() => {});
    },
    showStatusDesc(text) {
      this.$alert(text, "任务状态", {
        showConfirmButton: false,
      });
    },
  },
};
</script>

<style scoped lang="postcss">
/* @import url("base.css"); */
.filter-items {
  display: flex;
  flex-direction: initial;
}
.container {
  .content {
    padding: 10px 15px;
    .idss-font--title {
      font-size: var(--font-size-16);
      margin-bottom: 10px;
    }

    .flex-sb-box {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
  .el-button + .el-select {
    margin-left: 10px;
  }
  .filter-items {
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
  .health-type.running {
    color: #68d279;
  }
  .health-type.warning {
    color: #f89d06;
    cursor: pointer;
  }
  .health-type.error {
    color: #d81e06;
    cursor: pointer;
  }
}
</style>
