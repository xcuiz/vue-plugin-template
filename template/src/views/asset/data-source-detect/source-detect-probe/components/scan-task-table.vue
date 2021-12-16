<template>
  <div class="container">
    <div class="content">
      <el-row style="position: relative">
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
          style="width: 100%"
          :default-sort="{
            prop: tableData.orderField,
            order: tableData.orderType === 'desc' ? 'descending' : 'asc',
          }"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <!-- 资源发现 -->
          <template v-if="taskType === '01'">
            <el-table-column
              label="任务编号"
              prop="taskNo"
              show-overflow-tooltip
            />
            <el-table-column
              label="任务名称"
              prop="taskName"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="goToDetail(scope.row.taskId)"
                >
                  {{ scope.row.taskName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="扫描对象"
              prop="ipSection"
              show-overflow-tooltip
            />
            <el-table-column
              label="部门"
              prop="deptName"
              show-overflow-tooltip
            />
            <el-table-column
              label="业务系统"
              prop="businessSysName"
              show-overflow-tooltip
            />
            <el-table-column
              label="网络域"
              prop="neidistrictName"
              show-overflow-tooltip
            />
            <el-table-column
              label="执行方式"
              prop="executeCycle"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.executeCycle === '02'">周期执行</span>
                <span v-if="scope.row.executeCycle === '01'">立即执行</span>
              </template>
            </el-table-column>
            <el-table-column
              label="执行状态"
              prop="statusDesc"
              show-overflow-tooltip
            />
            <el-table-column
              label="最近执行时间"
              prop="startTime"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              label="扫描完成时间"
              prop="endTime"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              label="任务进度"
              prop="runProcess"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-progress
                  :percentage="Number(scope.row.runProcess)"
                ></el-progress>
              </template>
            </el-table-column>
          </template>
          <!-- 敏感检测 -->
          <template v-else-if="taskType === '02'">
            <el-table-column
              label="任务编号"
              prop="taskNo"
              show-overflow-tooltip
            />
            <el-table-column
              label="任务名称"
              prop="taskName"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="goToDetail(scope.row.taskId)"
                >
                  {{ scope.row.taskName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="扫描对象类型"
              prop="assetType"
              show-overflow-tooltip
            />
            <el-table-column
              label="业务系统"
              prop="businessSysName"
              show-overflow-tooltip
            />
            <el-table-column
              label="执行方式"
              prop="executeCycle"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span v-if="scope.row.executeCycle === '02'">周期执行</span>
                <span v-if="scope.row.executeCycle === '01'">立即执行</span>
              </template>
            </el-table-column>
            <el-table-column
              label="执行状态"
              prop="statusDesc"
              show-overflow-tooltip
            />
            <el-table-column
              label="最近执行时间"
              prop="startTime"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              label="扫描完成时间"
              prop="endTime"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              label="任务进度"
              prop="runProcess"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-progress
                  :percentage="Number(scope.row.runProcess)"
                ></el-progress>
              </template>
            </el-table-column>
          </template>
          <!-- app合规扫描 -->
          <template v-else-if="taskType === '03'">
            <el-table-column
              label="任务编号"
              prop="taskNo"
              show-overflow-tooltip
            />
            <el-table-column
              label="任务名称"
              prop="taskName"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="goToDetail(scope.row.taskId)"
                >
                  {{ scope.row.taskName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="APP名称"
              prop="appName"
              show-overflow-tooltip
            />
            <el-table-column
              label="业务系统"
              prop="businessSysName"
              show-overflow-tooltip
            />
            <el-table-column
              label="检测探针"
              prop="probeName"
              show-overflow-tooltip
            />
            <el-table-column
              label="执行状态"
              prop="statusDesc"
              show-overflow-tooltip
            />
            <el-table-column
              label="开始时间"
              prop="startTime"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              label="结束时间"
              width="160"
              prop="endTime"
              show-overflow-tooltip
            />
            <el-table-column
              label="任务进度"
              prop="runProcess"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-progress
                  :percentage="Number(scope.row.runProcess)"
                ></el-progress>
              </template>
            </el-table-column>
          </template>
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
  </div>
</template>

<script>
import globalMixins from "@/mixins/globalMixins.js";
import { getScanTask } from "../api";
export default {
  components: {},
  mixins: [globalMixins],
  props: {
    probeId: {
      type: [String, Number],
      require: true,
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
        orderField: "joinTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: true,
      },
      // 01-资源发现；02-敏感检测；03-app合规扫描
      taskType: null,
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
    selectedIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading.table = true;
      getScanTask(this.probeId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
          this.taskType = res.type;
          this.$emit("getList", this.tableData);
        })
        .finally(() => {
          this.loading.table = false;
        });
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
    showRunStatusDesc(text) {
      this.$alert(text, "运行状态", {
        showConfirmButton: false,
      });
    },
    /**
     * table多选操作
     * @param {object} val 当前选中的条目
     */
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    handleCheck(id) {
      this.$router.push({
        name: "data-source-detect-detail",
        params: {
          id,
        },
      });
    },
    goToDetail(taskId) {
      switch (this.taskType) {
        case "01":
          this.$router.push({
            name: "scan-task-detail",
            params: {
              taskId,
            },
          });
          break;
        case "02":
          this.$router.push({
            name: "source-detect-task-report",
            params: {
              taskId,
            },
          });
          break;
        case "03":
          // this.$router.push({
          //   name: "scan-task-detail",
          //   params: {
          //     taskId,
          //   },
          // });
          break;

        default:
          break;
      }
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
.probe-test {
  display: flex;
  justify-content: center;
  align-items: center;
  >>> &-icon {
    width: 42px;
    height: 42px;
    margin-right: 28px;
    &.success {
      fill: #68d279;
    }
    &.error {
      fill: #d81e06;
    }
  }
}
</style>
