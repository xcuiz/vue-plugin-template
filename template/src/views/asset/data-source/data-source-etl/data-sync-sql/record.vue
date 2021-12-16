<!--
 * @Author: yincheng
 * @Date: 2021-04-28 15:50:51
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-11-24 10:05:11
-->
<template>
  <div class="container">
    <div class="content">
      <PageHeader title="运行记录" />
      <myFilter
        :init-value.sync="searchForm.value"
        :init-type.sync="searchForm.type"
        :filter-options="filterOptions"
      >
      </myFilter>
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
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column label="序号" type="index" />
          <el-table-column label="名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="checkLog(scope.row.id)"
              >
                {{ scope.row.syncName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="运行时间" prop="executeTime" />
          <el-table-column label="结束时间" prop="endTime" />
          <el-table-column label="运行状态" prop="executeStatusDesc" />
          <el-table-column label="运行结果" prop="executeResult">
            <template slot-scope="scope">
              {{ scope.row.executeResult | resultFormatter }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="160">
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleRerun(scope.row.sqlId)"
                >重新运行</el-button
              >
              <el-button
                type="text"
                custom
                size="mini"
                @click="checkLog(scope.row.id)"
                >查看日志</el-button
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
      <RecordDialog v-bind="record" :visible.sync="record.visible" />
    </div>
  </div>
</template>
<script>
import { pick } from "lodash";
import MyFilter from "@/fusion-components/Filter";
import globalMixins from "@/mixins/globalMixins.js";
import PageHeader from "@/components/PageHeader";
import { getRecordPage, executeAgain, getLog } from "./api";
import RecordDialog from "./components/record-dialog";
export default {
  components: {
    PageHeader,
    MyFilter,
    RecordDialog,
  },
  filters: {
    resultFormatter(val) {
      if (val) {
        const resultMap = {
          0: "失败",
          1: "成功",
        };

        return resultMap[val];
      }

      return val;
    },
  },
  mixins: [globalMixins],
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      record: {
        visible: false,
        params: "add",
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
        orderField: "", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: false,
      },
      filterOptions: [
        {
          value: "名称",
          key: "etlName",
          stype: "input",
          maxlength: 85,
        },
        {
          value: "状态",
          key: "statusList",
          stype: "select",
          multiple: true,
          selOptions: [
            {
              key: "1",
              value: "开启",
            },
            {
              key: "0",
              value: "关闭",
            },
          ],
        },
        {
          value: "执行方式",
          key: "executeCycleList",
          stype: "select",
          multiple: true,
          selOptions: [
            {
              key: "01",
              value: "立即执行",
            },
            {
              key: "02",
              value: "周期执行",
            },
          ],
        },
        {
          value: "创建时间",
          key: "createTimeList",
          stype: "datetime",
        },
      ],
      searchForm: {
        type: "etlName", // 一级下拉框值
        value: "", // 联动的二级值
      },
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
          [this.searchForm.type]: this.searchForm.value,
        },
      };
    },
    selectedIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
  },
  watch: {
    searchForm: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
  created() {
    this.getList();
  },
  methods: {
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
    getList() {
      this.loading.table = true;
      getRecordPage(this.id, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    handleRerun(sqlId) {
      this.$confirm(`此操作将重新运行选中任务, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        executeAgain(sqlId).then(() => {
          this.getList();
        });
      });
    },
    checkLog(id) {
      getLog(id).then((res) => {
        this.record = {
          visible: true,
          params: res.log,
        };
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
