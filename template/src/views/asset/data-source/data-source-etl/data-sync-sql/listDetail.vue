<template>
  <el-dialog
    custom
    title="运行记录"
    :visible="visible"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <!-- 表格 -->
    <article>
      <idss-widget>
        <!-- 表格 -->
        <el-table
          v-loading="loading['getData']"
          :data="tableData.data"
          fit
          stripe
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          size="mini"
          max-height="500"
          highlight-current-row
          style="width: 100%; margin-top: 16px"
          :default-sort="{ prop: 'date', order: 'descending' }"
        >
          <el-table-column width="60px" align="center" label="序号">
            <template slot-scope="scope">
              <span>{{
                scope.$index + 1 + (tableData.pageNum - 1) * tableData.pageSize
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运行时间" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{
                scope.row.excuLong | filterExcuLong | formateTableData
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="运行结果" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{
                scope.row.excuResult | filterExcuResult | formateTableData
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="详情" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.excuDetail | formateTableData }}</span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!--        <template slot="footer">-->
        <!--          <idss-pagination-->
        <!--            background-->
        <!--            hide-on-single-page-->
        <!--            :table-data="tableData"-->
        <!--            :page-sizes="[10, 20, 50, 100]"-->
        <!--            layout="total, prev, pager, next,sizes, jumper"-->
        <!--            @page-change="tTableChange"-->
        <!--            @size-change="tTableChange"-->
        <!--          />-->
        <!--        </template>-->
      </idss-widget>
    </article>
    <!-- 确定按钮 -->
    <span slot="footer" class="dialog-footer">
      <el-button size="small" type="primary" @click="closeDialog"
        >确 定</el-button
      >
      <el-button size="small" @click="closeDialog">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import service from "./listDetail.js";
import globalMixins from "@/mixins/globalMixins.js";
// import sync from "./api";

export default {
  filters: {
    filterExcuResult(val) {
      if (val === "0") {
        return "失败";
      } else {
        return val === "1" ? "成功" : "运行中";
      }
    },
    filterExcuLong(val) {
      if (val) {
        return val / 1000 + "s";
      }
    },
  },
  mixins: [service, globalMixins],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      searchForm: {
        value: "",
        type: "filter_EQI_runStatus",
      },
      loading: {},
      tableData: {
        pageSize: 10,
        pageNum: 1,
        data: [],
        total: 0,
      },
    };
  },
  computed: {
    // 筛选条件整合（左侧一级、二级选项）
    filterFormData() {
      return {
        // pageSize: this.tableData.pageSize,
        // pageNum: this.tableData.pageNum
      };
    },
  },
  watch: {
    visible: {
      handler(val) {
        val && this.getList(this.id);
      },
      immediate: true,
    },
    // 筛选条件变化时候，请求接口
    searchForm: {
      handler() {
        this.tableChange(this.filterFormData, this.tableData, this.getList);
      },
      deep: true,
    },
  },
  methods: {
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit("update:visible");
    },
    /**
     * 分页,globalmixin方法
     */
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
  },
};
</script>

<style scoped lang="postcss">
.el-table {
  margin-bottom: 10px;
}
</style>
