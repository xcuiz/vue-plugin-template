<template>
  <el-row>
    <!-- 筛选条件 -->
    <myFilter
      :init-value.sync="form.value"
      :init-type.sync="form.type"
      :filter-options="filterOptions"
    >
      <template slot="left">
        <div class="filter-items">
          <div style="margin-right: 10px">
            <el-button size="mini" type="primary" @click="handleSend">
              发送
            </el-button>
          </div>
          <div>
            <el-button
              size="mini"
              :loading="loading.del"
              plain
              class="operate-button"
              @click="handleDelete"
            >
              删除
            </el-button>
          </div>
          <div></div>
        </div>
      </template>
    </myFilter>
    <!-- 列表 -->
    <el-table
      v-loading="loading.table"
      :data="tableData.data"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      max-height="600"
      size="mini"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
      :default-sort="{
        prop: tableData.orderField,
        order: tableData.orderType === 'desc' ? 'descending' : 'ascending',
      }"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column
        label="报表文件名称"
        prop="fileName"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        prop="createTime"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
      />
      <el-table-column label="大小(K)" prop="fileSize">
        <template slot-scope="scope">
          <!-- 取kb大小 后端返回的b -->
          <span>{{ parseInt((scope.row.fileSize || 0) / 1024) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发送时间" prop="sendTime" />
      <el-table-column
        label="状态"
        sortable="custom"
        :sort-orders="['ascending', 'descending']"
        prop="status"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            custom
            :loading="loading[scope.row.id]"
            class="link-type"
            @click="handleDownload(scope.row.id)"
          >
            {{ loading[scope.row.id] ? "下载中" : "下载" }}
          </el-button>
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
import {
  getReportExecuteList,
  downloadReportFile,
  deleteReportFile,
  sendReportFile,
} from "../api";
import globalMixins from "@/mixins/globalMixins.js";
import MyFilter from "@/fusion-components/Filter";
import { downloadBlob } from "@/util/download";

export default {
  components: {
    MyFilter,
  },
  mixins: [globalMixins],
  props: {
    reportId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      // 主下拉框字典项
      filterOptions: [
        {
          value: "创建时间",
          key: "createTimeList",
          stype: "datetime",
        },
        {
          value: "状态",
          key: "sendResultList",
          multiple: true,
          stype: "select",
          selOptions: [
            { key: "1", value: "成功" },
            { key: "0", value: "失败" },
          ],
        },
      ],
      // 表格数据
      tableData: {
        data: [],
        multipleSelection: [],
        orderField: "createTime", // 排序字段
        orderType: "desc", // 排序方式 asc正序 desc 倒序
        pageSize: 10, // 分页数量
        pageNum: 1, // 当前页面位置
      },
      loading: {
        table: false,
        download: false,
        del: false,
        send: false,
      },
      showSend: false,
      // 筛选项
      form: {
        type: "createTimeList", // 一级下拉框值
        value: [], // 联动的二级值
      },
      isIndeterminate: false,
    };
  },
  computed: {
    selectIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
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
          [this.form.type]: this.form.value,
        },
      };
    },
  },
  watch: {
    // 筛选条件变化时候，请求接口
    form: {
      handler() {
        this.getList();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    getList() {
      this.loading.table = true;
      getReportExecuteList(this.reportId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    handleDownload(id) {
      this.$set(this.loading, id, true);
      downloadReportFile(id)
        .then((blob) => {
          if (blob.data.size) {
            downloadBlob(blob);
          } else {
            this.$message.error("下载失败");
          }
        })
        .catch(() => {
          this.$message.error("下载失败");
        })
        .finally(() => {
          this.$set(this.loading, id, false);
        });
    },
    handleSend() {
      if (!this.selectIds.length) {
        this.$message({
          type: "warning",
          message: "请选择需要发送的数据",
        });
        return;
      }
      this.$confirm("重新发送选中的报表文件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sendReportFile({
            idList: this.selectIds,
          }).then(() => {
            this.$message.success("发送成功！");
            this.getList();
          });
        })
        .catch(() => {});
    },
    /**
     * @param {string} type 区分列表更新模式
     */
    getTableData() {
      this.tableChange({}, this.tableData, this.getList);
    },
    handleDelete() {
      const idList = this.selectIds;
      if (!idList.length) {
        this.$message({
          type: "warning",
          message: "请选择需要删除的数据",
        });
        return;
      }

      this.$confirm("此操作将删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading.del = true;
          deleteReportFile({
            idList,
          })
            .then(() => {
              this.$message.success("删除成功！");
            })
            .finally(() => {
              this.loading.del = false;
              this.getList();
            });
        })
        .catch(() => {});
    },
    /**
     * table多选操作
     * @param {object} val 当前选中的条目
     */
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    handleSortChange({ order, prop }) {
      this.tableData.orderField = prop;
      this.tableData.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },
  },
};
</script>

<style scoped lang="postcss">
/* @import url("base.css"); */
.filter-items {
  display: flex;
  flex-direction: initial;
}
.container {
  .content {
    padding: 10px 15px;
    .idss-font--title {
      font-size: var(--font-size-16);
      margin-bottom: 10px;
    }
  }
  .el-button + .el-select {
    margin-left: 10px;
  }
  .filter-items {
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
.checkbox-group {
  padding: 0 64px;
}
</style>
