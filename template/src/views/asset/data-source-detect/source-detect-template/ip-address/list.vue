<template>
  <div class="container">
    <div class="content">
      <PageHeader title="扫描模版管理"> </PageHeader>
      <div class="flex-sb-box">
        <FilterBar
          v-model="filterValue"
          :fields="filterFields"
          module-code="scanMange"
        />
        <div class="filter-items">
          <div>
            <el-button type="primary" size="mini" @click="handleAdd">
              +新增
            </el-button>
          </div>
          <div style="margin-left: 10px">
            <el-button size="mini" plain @click="handleMultipleDelete">
              删除
            </el-button>
          </div>
          <!-- <el-dropdown style="margin-left: 10px" @command="handleCommand">
              <el-button size="mini">
                操作<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="import">导入</el-dropdown-item>
                <el-dropdown-item command="export">导出</el-dropdown-item>
                <el-dropdown-item command="delete">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> -->
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
            row-key="id"
            :data="tableData.data"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            size="mini"
            stripe
            fit
            highlight-current-row
            :default-sort="{
              prop: tableData.orderField,
              order: tableData.orderType === 'desc' ? 'descending' : 'asc',
            }"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <el-table-column type="selection" width="45" />
            <el-table-column type="index" label="序号" />
            <el-table-column
              v-if="showCol('name')"
              label="模版名称"
              prop="name"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="handleEdit(scope.row.id)"
                >
                  {{ scope.row.name }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('ip')"
              label="IP地址"
              show-overflow-tooltip
              prop="ip"
            >
            </el-table-column>
            <el-table-column
              v-if="showCol('netdistrictName')"
              label="网络域"
              prop="netdistrictName"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('deptName')"
              label="部门"
              prop="deptName"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('assetType')"
              label="扫描类型"
              prop="assetType"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('businessSysName')"
              label="业务系统"
              prop="businessSysName"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('createTime')"
              label="创建时间"
              prop="createTime"
              show-overflow-tooltip
              width="160"
              sortable="custom"
            />
            <el-table-column label="操作" width="160">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="handleScan(scope.row.id)"
                  >扫描</el-button
                >
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="handleEdit(scope.row.id)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
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
    <AddDialog
      v-bind="addDialog"
      :visible.sync="addDialog.visible"
      @success="handleAddSuccess"
    />
    <ScanDialog
      ref="ScanDialog"
      v-bind="scanDialog"
      show-ip-select
      :visible.sync="scanDialog.visible"
    />
  </div>
</template>

<script>
import globalMixins from "@/mixins/globalMixins.js";
import PageHeader from "@/components/PageHeader";
import FilterBar from "@/components/filter-bar";
import AddDialog from "./components/add-dialog";
import ScanDialog from "@/views/asset/data-source-detect/scan-task/components/form-dialog.vue";
import AggFilter from "@/components/agg-filter";
import ColumnsSelect from "@/components/columns-select";
import {
  getIpPage,
  deleteIp,
  getListFilterFields,
  getFilterOptions,
  getAggFilters,
  getAggData,
} from "./api";

export default {
  components: {
    PageHeader,
    FilterBar,
    AddDialog,
    ScanDialog,
    AggFilter,
    ColumnsSelect,
  },
  mixins: [globalMixins],
  data() {
    return {
      addDialog: {
        visible: false,
        type: "add",
        id: null,
      },
      scanDialog: {
        type: "add",
        visible: false,
        ipId: null,
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
        orderField: "createTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: false,
      },
      aggData: {},
      aggFilter: {
        value: {
          select: null,
          list: null,
        },
        select: [],
        list: [],
      },

      columns: [
        {
          code: "name",
          name: "模版名称",
          checked: true,
          disabled: true,
        },
        {
          code: "ip",
          name: "IP地址",
          checked: true,
          disabled: true,
        },
        {
          code: "netdistrictName",
          name: "网络域",
          checked: true,
          disabled: true,
        },
        {
          code: "deptName",
          name: "部门",
          checked: true,
          disabled: false,
        },
        {
          code: "assetType",
          name: "扫描类型",
          checked: true,
          disabled: false,
        },
        {
          code: "businessSysName",
          name: "业务系统",
          checked: true,
          disabled: false,
        },
        {
          code: "createTime",
          name: "创建时间",
          checked: true,
          disabled: false,
        },
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
          aggType: this.aggFilter.value.select,
          customId: this.aggFilter.value.list,
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
      getIpPage(this.filterFormData)
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
      const result = await getListFilterFields();
      const fields = [
        {
          code: "filter",
          name: "过滤条件",
          children: result,
        },
      ];

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
      this.$confirm("此操作将永久删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteData(this.selectedIds);
        })
        .catch(() => {});
    },
    handleDelete({ name, id }) {
      this.$confirm(`<p>${name}</p><p>是否删除该条记录？</p>`, "删除扫描模版", {
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true,
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.deleteData([id]);
        })
        .catch(() => {});
    },
    deleteData(idList) {
      deleteIp({
        idList,
      }).then(() => {
        this.$message.success("删除成功！");
        this.getList();
      });
    },
    handleScan(id) {
      this.scanDialog = {
        type: "add",
        visible: true,
        ipId: id,
      };
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
      this.addDialog = {
        visible: true,
        id: null,
        type: "add",
      };
    },
    handleEdit(id) {
      this.addDialog = {
        visible: true,
        id,
        type: "edit",
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
    handleCommand(command) {
      switch (command) {
        case "import":
          this.handleImport();
          break;
        case "export":
          this.handleExport();
          break;
        case "delete":
          this.handleMultipleDelete();
          break;
      }
    },
    handleImport() {
      this.$refs.upload?.$refs?.["upload-inner"]?.handleClick?.();
    },
    handleExport() {},
    handleAggChange(data) {
      this.aggData = data;
      this.getList();
    },
    async getAggFilter() {
      const result = await getAggFilters();
      this.aggFilter.select = [
        {
          code: "filter",
          name: "过滤",
          children: result,
        },
      ];
      this.aggFilter.value.select = _.get(
        this.aggFilter,
        "select[0].children[0].code",
        ""
      );
      // this.aggFilter.value.select = this.aggFilter.select[0]?.code || "";
      this.getAggData();
    },
    getAggData() {
      getAggData(this.aggFilter.value.select, this.filterFormData).then(
        (res) => {
          this.aggFilter.list = [
            {
              code: null,
              name: res.totalName,
              num: res.totalNum,
            },
            ...res.allCondition.map(({ id, name, num }) => ({
              code: id,
              name,
              num,
            })),
          ];
          this.aggFilter.value.list = null;
          this.getList();
        }
      );
    },
    handleAddSuccess() {
      this.getList();
      // 添加成功时，需要更新扫描任务里的模版，否则会导致无法立即创建扫描任务 fix #25127
      this.$refs.ScanDialog.getTpl();
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
