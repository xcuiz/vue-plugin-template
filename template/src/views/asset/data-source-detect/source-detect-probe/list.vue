<template>
  <div class="container">
    <div class="content">
      <PageHeader title="探针管理"> </PageHeader>
      <div class="flex-sb-box">
        <FilterBar
          v-model="filterValue"
          :fields="filterFields"
          module-code="probe"
        />
        <div class="filter-items">
          <div>
            <el-button size="mini" type="primary" @click="handleAdd">
              +新增
            </el-button>
          </div>
          <div style="margin-left: 10px">
            <el-button
              size="mini"
              plain
              class="operate-button"
              :disabled="!selectedIds.length"
              @click="handleMultipleDelete"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
      <el-row style="display: flex; position: relative">
        <!-- 聚合条件 -->
        <AggFilter
          v-model="aggFilter.value"
          :select="aggFilter.select"
          :list="aggFilter.list"
          @select-change="getAggData"
          @list-change="getList"
        />
        <!-- 列表 -->
        <div style="margin-left: 10px; width: 500px; flex: 1">
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
            <el-table-column type="selection" width="45" />
            <el-table-column
              v-if="showCol('name')"
              label="探针名称"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="handleCheck(scope.row.id)"
                >
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('ip')"
              label="IP&端口"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.ip + ":" + scope.row.port }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('type')"
              prop="type"
              label="探针类型"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              v-if="showCol('netDistrictName')"
              label="管辖网络域"
              prop="netDistrictName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              v-if="showCol('health')"
              label="连通状态"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="scope.row.health === 1">
                  <span class="health-type running"
                    ><i class="el-icon-success"></i> 运行</span
                  >
                </template>
                <template v-else-if="scope.row.health === 98">
                  <span
                    class="health-type warning"
                    @click="showRunStatusDesc(scope.row.runStatusDesc)"
                    ><i class="el-icon-warning"></i> 异常</span
                  >
                </template>
                <template v-else-if="scope.row.health === 99">
                  <span
                    class="health-type error"
                    @click="showRunStatusDesc(scope.row.runStatusDesc)"
                    ><i class="el-icon-error"></i> 宕机</span
                  >
                </template>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('joinTime')"
              label="接入时间"
              prop="joinTime"
              show-overflow-tooltip
              sortable="custom"
            >
            </el-table-column>
            <el-table-column
              v-if="showCol('executeTaskNumber')"
              label="执行任务数"
              prop="executeTaskNumber"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              v-if="showCol('producer')"
              label="探针厂商"
              prop="producer"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              v-if="showCol('locationName')"
              label="物理位置"
              prop="locationName"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column label="操作" width="180px">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="handleCheck(scope.row.id)"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="handleEdit(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  v-if="scope.row.health !== 1"
                  type="text"
                  custom
                  size="mini"
                  @click="handleDelete(scope.row.id)"
                  >删除</el-button
                >
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="handleTestProbe(scope.row.id)"
                  >测试</el-button
                >
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
      </el-row>
    </div>
    <FormDialog
      v-bind="formDialog"
      :visible.sync="formDialog.visible"
      @success="getList"
    />
  </div>
</template>

<script>
import globalMixins from "@/mixins/globalMixins.js";
import PageHeader from "@/components/PageHeader";
import FilterBar from "@/components/filter-bar";
import FormDialog from "./components/form-dialog";
import ColumnsSelect from "@/components/columns-select";
import AggFilter from "@/components/agg-filter";
import _ from "lodash";
import {
  getProbePage,
  getListFilterFields,
  getFilterOptions,
  postProbeDelete,
  getProbeStatus,
  getAggFilters,
  getAggData,
} from "./api";
export default {
  components: {
    PageHeader,
    FilterBar,
    FormDialog,
    ColumnsSelect,
    AggFilter,
  },
  filters: {
    // 状态映射
    filterStatus(val) {
      return val === "0" ? "正常" : "锁定";
    },
  },
  mixins: [globalMixins],
  data() {
    return {
      filterValue: {},
      filterFields: [],
      formDialog: {
        visible: false,
        type: "add",
        id: null,
      },
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
      columns: [
        {
          code: "name",
          name: "探针名称",
          checked: true,
          disabled: true,
        },
        {
          code: "ip",
          name: "IP&端口",
          checked: true,
          disabled: true,
        },
        {
          code: "type",
          name: "探针类型",
          checked: true,
          disabled: true,
        },
        {
          code: "netDistrictName",
          name: "管辖网络域",
          checked: true,
          disabled: true,
        },
        {
          code: "health",
          name: "存活状态",
          checked: true,
          disabled: true,
        },
        {
          code: "joinTime",
          name: "接入时间",
          checked: true,
        },
        {
          code: "executeTaskNumber",
          name: "执行任务数",
          checked: true,
        },
        {
          code: "producer",
          name: "探针厂商",
          checked: false,
        },
        {
          code: "locationName",
          name: "物理位置",
          checked: false,
        },
      ],
      aggFilter: {
        value: {
          select: null,
          list: null,
        },
        select: [],
        list: [],
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
        param: {
          ...this.filterValue,
          moduleCode: "probe",
          aggCode: this.aggFilter.value.select,
          aggValue: this.aggFilter.value.list,
        },
      };
    },
    selectedIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
  },
  watch: {
    filterValue: {
      handler() {
        this.getAggFilter();
      },
      deep: true,
    },
  },
  created() {
    this.getFilterFields();
    this.getAggFilter();
  },
  methods: {
    showCol(code) {
      return _.find(this.columns, { code })?.checked;
    },
    getList() {
      this.loading.table = true;
      getProbePage(this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
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
      if (!this.selectedIds.length) {
        this.$message({
          type: "warning",
          message: "请选择数据",
        });
        return;
      }
      if (
        this.tableData.multipleSelection.filter((item) => item === 1).length
      ) {
        this.$message({
          type: "error",
          message: "无法删除正在运行的探针，请重新选择",
        });
        return;
      }
      this.$confirm("此操作将永久删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteProbe(this.selectedIds);
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
          this.deleteProbe([id]);
        })
        .catch(() => {});
    },
    deleteProbe(idList) {
      postProbeDelete({
        idList,
      }).then(() => {
        this.$message.success("删除成功！");
        this.getList();
      });
    },
    showRunStatusDesc(text) {
      this.$alert(text, "运行状态", {
        showConfirmButton: false,
      });
    },
    handleTestProbe(id) {
      getProbeStatus(id)
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
    handleAdd() {
      this.formDialog = {
        visible: true,
        id: null,
        type: "add",
      };
    },
    handleEdit(id) {
      this.formDialog = {
        visible: true,
        id,
        type: "edit",
      };
    },
    handleCheck(id) {
      this.$router.push({
        name: "data-source-detect-detail",
        params: {
          id,
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
          ...res.data.map(({ aggValue, aggName, num }) => ({
            code: aggValue,
            name: aggName,
            num,
          })),
        ];
        this.aggFilter.value.list = null;
        this.getList();
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
