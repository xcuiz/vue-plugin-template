<template>
  <el-row>
    <el-card class="box-card">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="敏感结果" name="1">
          <FilterBar
            v-model="filterValue"
            :fields="filterFields"
            module-code="assetDb"
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
            <el-table-column
              label="数据表"
              prop="tableName"
              show-overflow-tooltip
            />
            <el-table-column
              label="所属库"
              prop="dbName"
              show-overflow-tooltip
            />
            <el-table-column
              label="字段名"
              prop="fieldCode"
              show-overflow-tooltip
            />
            <el-table-column
              label="注释"
              prop="fieldName"
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
            <el-table-column
              label="敏感特征"
              prop="element"
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
            <el-table-column
              label="样本数据"
              prop="samples"
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
        </el-tab-pane>
        <el-tab-pane name="2">
          <template slot="label">
            库表变化
            <template v-if="structureTotal">({{ structureTotal }})</template>
          </template>
          <AssetStructureTable
            :task-id="taskId"
            @total="handleStructureTotalChange"
          />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </el-row>
</template>
<script>
import _ from "lodash";
import globalMixins from "@/mixins/globalMixins.js";
import {
  getAssetDBListPage,
  getDBPageFilterFields,
  getDBPageSelectOptions,
} from "../api";
// import ChildTable from "./asset-db-child-table";
import FilterBar from "@/components/filter-bar";
import AssetStructureTable from "./asset-structure-table";
export default {
  components: {
    // ChildTable,
    FilterBar,
    AssetStructureTable,
  },
  mixins: [globalMixins],
  props: {
    taskId: {
      type: [Number, String],
      required: true,
    },
    assetId: {
      type: [Number, String],
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
      activeName: "1",
      structureTotal: null,
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
      getAssetDBListPage(this.taskId, this.assetId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    async getFilterFields() {
      const result = await getDBPageFilterFields();
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
    handleStructureTotalChange(value) {
      this.structureTotal = value;
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
