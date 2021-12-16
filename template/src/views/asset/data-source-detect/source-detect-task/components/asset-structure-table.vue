<!--
 * @Author: yincheng
 * @Date: 2021-05-13 16:11:12
 * @LastEditors: yincheng
 * @LastEditTime: 2021-05-13 16:30:03
-->
<template>
  <el-row>
    <myFilter
      :init-value.sync="searchForm.value"
      :init-type.sync="searchForm.type"
      :filter-options="filterOptions"
    />
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
    >
      <el-table-column label="序号" type="index" />
      <el-table-column label="数据表" prop="tableCode" show-overflow-tooltip />
      <el-table-column label="所属库" prop="dbName" show-overflow-tooltip />
      <el-table-column
        label="表变化类型"
        prop="changeType"
        show-overflow-tooltip
      />
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
import _ from "lodash";
import globalMixins from "@/mixins/globalMixins.js";
import { getdataStructurePage } from "../api";
import MyFilter from "@/fusion-components/Filter";
export default {
  components: {
    MyFilter,
  },
  mixins: [globalMixins],
  props: {
    taskId: {
      type: [Number, String],
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
      // 筛选项
      searchForm: {
        type: "tableCode", // 一级下拉框值
        value: null, // 联动的二级值
      },
      filterOptions: [
        {
          value: "数据表",
          key: "tableCode",
          multiple: true,
          stype: "input",
        },
      ],
      activeName: "1",
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
          taskId: this.taskId,
          [this.searchForm.type]: this.searchForm.value,
        },
      };
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
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    getList() {
      this.loading.table = true;
      getdataStructurePage(this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
          this.$emit("total", res.total);
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
  },
};
</script>
<style lang="postcss" scoped>
.flex-sb-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
