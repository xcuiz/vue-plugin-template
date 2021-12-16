<template>
  <el-row>
    <!-- <div slot="header" class="clearfix">
        <div class="flex-sb-box">
          <span>文件存储结果</span>
          <MyFilter
            :init-value.sync="searchForm.value"
            :init-type.sync="searchForm.type"
            :filter-options="filterOptions"
            style="width: unset; margin: 0"
          />
        </div>
      </div> -->
    <FilterBar
      v-model="filterValue"
      :fields="filterFields"
      module-code="putDbChild"
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
      <el-table-column label="字段名" prop="fieldName" show-overflow-tooltip />
      <el-table-column label="注释" show-overflow-tooltip />
      <el-table-column
        label="敏感特征"
        prop="senFeature"
        show-overflow-tooltip
      />
      <el-table-column
        label="敏感数据分类"
        prop="senType"
        show-overflow-tooltip
      />
      <el-table-column
        label="敏感数据分级"
        prop="senLevel"
        show-overflow-tooltip
      />
      <!-- <el-table-column label="样本" prop="" show-overflow-tooltip /> -->
      <el-table-column
        label="是否涉敏"
        prop="isSensitive"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.isSensitive === "1" ? "是" : "否" }}</span>
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
</template>
<script>
import _ from "lodash";
// import MyFilter from "@/fusion-components/Filter";
import globalMixins from "@/mixins/globalMixins.js";
import {
  getDBFields,
  getDBColFilterFields,
  getDBColSelectOptions,
} from "../api";
import FilterBar from "@/components/filter-bar";
export default {
  components: {
    FilterBar,
  },
  mixins: [globalMixins],
  props: {
    tableId: {
      type: Number,
      required: true,
    },
    filingId: {
      type: Number,
      required: true,
    },
    storageMode: {
      type: String,
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
        type: "isSensitive", // 一级下拉框值
        value: "", // 联动的二级值
      },
      filterOptions: [
        {
          value: "是否涉敏",
          key: "isSensitive",
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
        param: {
          ...this.filterValue,
        },
        // param: {
        //   [this.searchForm.type]: this.searchForm.value,
        //   storageMode: this.storageMode,
        // },
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
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    getList() {
      this.loading.table = true;
      getDBFields(this.tableId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    async getFilterFields() {
      const result = await getDBColFilterFields();
      const fields = [
        {
          code: "filter",
          name: "过滤",
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
              fields[i].children[n].options = await getDBColSelectOptions(
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
