<template>
  <el-row>
    <el-card class="box-card">
      <FilterBar
        v-model="filterValue"
        :fields="filterFields"
        module-code="putDbTable"
      />

      <el-table
        v-loading="loading.table"
        row-key="tableId"
        :data="tableData.data"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        size="mini"
        stripe
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column type="expand" width="15">
          <template slot-scope="scope">
            <ChildTable :table-id="scope.row.tableId" :asset-id="filingId" />
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" />
        <el-table-column
          label="数据表"
          prop="tableName"
          show-overflow-tooltip
        />
        <el-table-column label="所属库" prop="dbName" show-overflow-tooltip />
        <el-table-column
          label="数据库类型"
          prop="dbType"
          show-overflow-tooltip
        />
        <el-table-column
          label="是否涉敏"
          prop="isSensitive"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isSensitive === "1" ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="涉敏字段数" prop="senColNum" />
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
    </el-card>
  </el-row>
</template>
<script>
import _ from "lodash";
import globalMixins from "@/mixins/globalMixins.js";
import {
  getFilingDbListPage,
  getDBPageFilterFields,
  getDBPageSelectOptions,
} from "../api";
import ChildTable from "./db-child-table";
import FilterBar from "@/components/filter-bar";
export default {
  components: {
    ChildTable,
    FilterBar,
  },
  mixins: [globalMixins],
  props: {
    filingId: {
      type: Number,
      required: true,
    },
    assetId: {
      type: Number,
      required: true,
    },
    storageMode: {
      type: String,
      required: true,
    },
  },
  data() {
    const policyLevels = [
      { key: "low", value: "低敏感级" },
      { key: "medium", value: "较敏感级" },
      { key: "high", value: "敏感级" },
      { key: "extremely-high", value: "极敏感级" },
    ];
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
      policyLevels,
      // 筛选项
      searchForm: {
        type: "isSensitiveList", // 一级下拉框值
        value: [], // 联动的二级值
      },
      filterOptions: [
        {
          value: "是否涉敏",
          key: "isSensitiveList",
          multiple: true,
          stype: "select",
          selOptions: [
            {
              key: "0",
              value: "不涉敏",
            },
            {
              key: "1",
              value: "涉敏",
            },
          ],
        },
      ],
      filterValue: {},
      filterFields: [],
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
    title() {
      const t = {
        DataBase: "数据库结果",
        BigData: "大数据结果",
      };
      return t[this.storageMode] || "结果";
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
    this.getList();
    this.getFilterFields();
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
      getFilingDbListPage(this.assetId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    async getFilterFields() {
      const fields = await getDBPageFilterFields();
      for (let i = 0; i < fields.length; i++) {
        for (let n = 0; n < fields[i].children.length; n++) {
          if (
            fields[i].children[n].type === "select" ||
            fields[i].children[n].type === "treeSelect"
          ) {
            try {
              fields[i].children[n].options = await getDBPageSelectOptions(
                fields[i].children[n].code
              );
            } catch (error) {
              fields[i].children[n].options = [];
            }
          }
        }
      }
      this.filterFields = fields;
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
