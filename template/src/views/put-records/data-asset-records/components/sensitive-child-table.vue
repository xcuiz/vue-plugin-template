<template>
  <el-row>
    <!-- <FilterBar v-model="filterValue" :fields="filterFields" /> -->
    <el-table
      v-loading="loading.table"
      row-key="id"
      :data="subtableData.data"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      size="mini"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" />
      <el-table-column label="字段名" prop="fieldName" show-overflow-tooltip />
      <el-table-column label="注释" prop="" show-overflow-tooltip />
      <el-table-column label="敏感特征" prop="element" show-overflow-tooltip />
    </el-table>
    <!-- 分页 -->
    <idss-pagination
      background
      :table-data="subtableData"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, prev, pager, next,sizes, jumper"
      @page-change="tTableChange"
      @size-change="tTableChange"
    />
  </el-row>
</template>
<script>
import globalMixins from "@/mixins/globalMixins.js";
import { getSensitiveField } from "../api";
// import FilterBar from "@/components/filter-bar";
export default {
  components: {
    // FilterBar,
  },
  mixins: [globalMixins],
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      // 表格数据
      subtableData: {
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
      data: [],
      filterValue: {},
      filterFields: [],
    };
  },
  computed: {
    // filterFormData() {
    //   const global = _.pick(this.subtableData, [
    //     "pageSize",
    //     "pageNum",
    //     "orderField",
    //     "orderType",
    //   ]);
    //   return {
    //     global,
    //     param: {
    //       ...this.filterValue,
    //     },
    //   };
    // },
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
    // this.getFilterFields();
    this.getList();
  },
  methods: {
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.subtableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.subtableData, this.getList);
    },
    getList() {
      this.loading.table = true;
      getSensitiveField(this.id)
        .then((res) => {
          // this.subtableData = { ...this.subtableData, ...res };
          // this.data = res;
          this.subtableData.data = res;
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    // async getFilterFields() {
    //   const result = await getDBColFilterFields();
    //   const fields = [
    //     {
    //       code: "filter",
    //       name: "过滤",
    //       children: result,
    //     },
    //   ];

    //   for (let i = 0; i < fields.length; i++) {
    //     for (let n = 0; n < fields[i].children.length; n++) {
    //       if (
    //         fields[i].children[n].type === "select" ||
    //         fields[i].children[n].type === "treeSelect"
    //       ) {
    //         try {
    //           fields[i].children[n].options = await getDBColSelectOptions(
    //             fields[i].children[n].code
    //           );
    //         } catch (error) {
    //           fields[i].children[n].options = [];
    //         }
    //       }
    //     }
    //   }
    //   this.filterFields = fields;
    // },
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
