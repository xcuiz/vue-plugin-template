<template>
  <el-card>
    <div slot="header">
      <h2>各资产检查进度</h2>
    </div>
    <el-table
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
      <el-table-column label="资产名" prop="assetName" show-overflow-tooltip />
      <el-table-column label="ip" prop="ip" show-overflow-tooltip />
      <el-table-column
        label="资源类型"
        prop="assetType"
        show-overflow-tooltip
      />
      <el-table-column label="探针" prop="probeName" show-overflow-tooltip />
      <el-table-column
        label="开始时间"
        prop="startTime"
        show-overflow-tooltip
      />
      <el-table-column label="结束时间" prop="endTime" show-overflow-tooltip />
      <el-table-column label="进度" prop="runProcess" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-progress :percentage="Number(scope.row.runProcess)"></el-progress>
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
  </el-card>
</template>
<script>
import globalMixins from "@/mixins/globalMixins.js";
import { getDaqTaskRunProcess } from "../api";
export default {
  mixins: [globalMixins],
  props: {
    taskId: {
      type: [Number, String],
    },
  },
  data() {
    return {
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
        table: true,
      },
    };
  },
  computed: {
    filterFormData() {
      const global = _.pick(this.tableData, [
        "pageSize",
        "pageNum",
        "orderField",
        "orderType",
      ]);
      return {
        global,
        param: {},
      };
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading.table = true;
      getDaqTaskRunProcess(this.taskId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
  },
};
</script>
