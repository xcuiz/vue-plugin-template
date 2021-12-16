<template>
  <el-row>
    <el-card class="box-card">
      <!-- <FilterBar v-model="filterValue" :fields="filterFields" /> -->
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
        <!-- DataBase(数据库)  BigData(大数据) File(文件) -->
        <el-table-column type="expand" width="15">
          <template slot-scope="scope">
            <ChildTable :id="scope.row.id" />
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" />
        <template v-if="mode !== 'File'">
          <el-table-column
            label="表名"
            prop="tableCode"
            show-overflow-tooltip
          />
          <el-table-column label="所属库" prop="dbName" show-overflow-tooltip />

          <el-table-column label="涉敏字段数" prop="fieldsQty" />
        </template>
        <template v-else>
          <el-table-column
            label="文件目录"
            prop="fileDir"
            show-overflow-tooltip
          />
          <el-table-column
            label="文件名称"
            prop="fileName"
            show-overflow-tooltip
          />
        </template>
        <el-table-column
          label="是否涉敏"
          prop="isSensitive"
          show-overflow-tooltip
        />
        <el-table-column
          label="敏感特征"
          prop="elementName"
          show-overflow-tooltip
        />
        <el-table-column
          label="敏感分类"
          prop="senType"
          show-overflow-tooltip
        />
        <el-table-column
          label="敏感分级"
          prop="senLevel"
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
    </el-card>
  </el-row>
</template>
<script>
import _ from "lodash";
import globalMixins from "@/mixins/globalMixins.js";
import ChildTable from "./sensitive-child-table";
// import FilterBar from "@/components/filter-bar";
export default {
  components: {
    ChildTable,
    // FilterBar,
  },
  mixins: [globalMixins],
  props: {
    tableData: {
      type: Object,
      required: true,
    },
    mode: {
      type: String,
      require: true,
    },
  },
  data() {
    return {
      loading: {
        table: false,
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
        param: {
          ...this.filterValue,
          // storageMode: this.storageMode,
        },
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
    // 过滤暂且留着用到时放开
    // this.getFilterFields();
  },
  methods: {
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    //   async getFilterFields() {
    //     const result = await getDBPageFilterFields();
    //     const fields = [
    //       {
    //         code: "filter",
    //         name: "过滤",
    //         children: result,
    //       },
    //     ];

    //     for (let i = 0; i < fields.length; i++) {
    //       for (let n = 0; n < fields[i].children.length; n++) {
    //         if (
    //           fields[i].children[n].type === "select" ||
    //           fields[i].children[n].type === "treeSelect"
    //         ) {
    //           try {
    //             fields[i].children[n].options = await getDBPageSelectOptions(
    //               fields[i].children[n].code
    //             );
    //           } catch (error) {
    //             fields[i].children[n].options = [];
    //           }
    //         }
    //       }
    //     }
    //     this.filterFields = fields;
    //   },
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
