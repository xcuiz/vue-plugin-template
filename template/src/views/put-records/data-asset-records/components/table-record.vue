<template>
  <div class="table-record-container">
    <div class="table-record-box">
      <div class="box-header" style="display: flex; margin-bottom: 10px">
        <!-- <FilterBar
          v-model="filterValue"
          :fields="filterFields"
          module-code="tableRecord"
        /> -->
        <div style="text-align: right; flex: 1">
          <el-button size="mini" @click="toMultpleRecord"
            >批量{{ statusTitle }}</el-button
          >
        </div>
      </div>
      <div class="box-content">
        <el-table
          :data="tableData.data"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          max-height="700"
          size="mini"
          stripe
          fit
          highlight-current-row
          style="width: 100%"
          :default-sort="{
            prop: orderField,
            order: orderType === 'desc' ? 'descending' : 'asc',
          }"
          @selection-change="selectionChange"
          @sort-change="sortChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column width="60" label="序号">
            <template slot-scope="scope">
              {{
                (tableData.pageNum - 1) * tableData.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column label="表名称">
            <template slot-scope="scope" prop="tableName">
              {{ scope.row.tableName || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="用途" prop="useInfo">
            <template slot-scope="scope">
              {{ scope.row.useInfo || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            :label="`首次${statusTitle}时间`"
            prop="fillingFirstTime"
          >
            <template slot-scope="scope">
              {{ scope.row.fillingFirstTime || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button custom type="text" @click="toRecord(scope.row)">{{
                statusTitle
              }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-record-list-pagination">
          <idss-pagination
            background
            :table-data="tableData"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, prev, pager, next,sizes, jumper"
            @page-change="pageNumChange"
            @size-change="pageSizeChange"
          />
        </div>
      </div>
    </div>
    <div class="dialog-box">
      <table-record-dialog
        :visible.sync="visible"
        :selected-ids="selectedIds"
        :table-names="tableNames"
        :use-info="useInfo"
        :status-title="statusTitle"
        :filing-state="filingState"
        @update-list="refreshData"
      />
    </div>
  </div>
</template>

<script>
/* eslint-disable no-empty */
// import FilterBar from "@/components/filter-bar";
import TableRecordDialog from "./table-record-dialog.vue";
export default {
  name: "TableRecord",
  components: {
    TableRecordDialog,
    // FilterBar,
  },
  props: {
    assetId: {
      type: [String, Number],
      default: "",
    },
    filingState: {
      type: [String, Number],
    },
    statusTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      filterValue: {},
      filterFields: [],

      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
      },
      // 排序字段
      orderField: "",
      // 排序方式 asc正序 desc 倒序
      orderType: "desc",
      selectedIds: [],
      tableNames: [],
      useInfo: "",

      visible: false,
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      try {
        const { pageSize, pageNum } = this.tableData;
        const { filterValue, moduleCode, orderField, orderType } = this;
        const result = await this.$request({
          url: "/gov/api/asset/filing/filingTableList",
          method: "POST",
          data: {
            global: {
              orderField,
              orderType,
              pageSize,
              pageNum,
            },
            param: {
              assetId: this.assetId,
              moduleCode,
              ...filterValue,
              filingState: this.filingState,
            },
          },
        });

        if (result) {
          const { data, total } = result;
          this.tableData.data = data;
          this.tableData.total = total;
        }
      } catch (e) {}
    },
    refreshData() {
      this.selectedIds = [];
      this.tableNames = [];
      this.getTableData();
    },
    // 排序
    sortChange({ order, prop }) {
      this.orderField = prop;
      // 排序方式 asc正序 desc 倒序
      this.orderType = order === "ascending" ? "asc" : "desc";

      // 排序后重新获取数据
      this.getTableData();
    },
    // 多选
    selectionChange(selected) {
      this.selectedIds = Array.isArray(selected)
        ? selected.map(({ id }) => id)
        : [];
      this.tableNames = Array.isArray(selected)
        ? selected.map(({ tableName }) => tableName)
        : [];

      if (Array.isArray(selected) && selected.length > 0) {
        this.useInfo = selected[0].useInfo;
      }
    },
    pageNumChange({ pageNum }) {
      this.tableData.pageNum = pageNum;

      this.getTableData();
    },
    // 页的大小改变
    pageSizeChange({ pageSize }) {
      this.tableData.pageSize = pageSize;

      this.getTableData();
    },
    toMultpleRecord() {
      if (this.selectedIds.length === 0) {
        this.$message.warning("请选择数据");
        return;
      }

      this.visible = true;
    },
    toRecord({ id, tableName, useInfo }) {
      this.selectedIds = [id];
      this.tableNames = [tableName];
      this.useInfo = useInfo;
      this.visible = true;
    },
  },
};
</script>

<style lang="postcss">
.table-record-container {
  padding: 10px;
  .table-record-list-pagination {
  }
}
</style>
