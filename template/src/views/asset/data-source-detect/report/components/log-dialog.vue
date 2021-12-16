<template>
  <el-dialog :visible="visible" custom title="日志" @close="handleCancel">
    <el-row>
      <!-- 筛选条件 -->
      <myFilter
        :init-value.sync="form.value"
        :init-type.sync="form.type"
        :filter-options="filterOptions"
      >
      </myFilter>
      <!-- 列表 -->
      <el-table
        v-loading="loading.table"
        :data="tableData.data"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        max-height="700"
        size="mini"
        stripe
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="时间" prop="executeTime" width="180px">
        </el-table-column>
        <el-table-column label="状态" prop="executeStatus" width="80px">
        </el-table-column>
        <el-table-column
          label="详细信息"
          prop="executeStatusDesc"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <idss-pagination
        background
        :table-data="tableData"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, prev, pager, next,sizes, jumper"
        @page-change="tTableChange"
        @size-change="tTableChange"
      />
    </el-row>
  </el-dialog>
</template>
<script>
import { getReportLogList } from "../api";
import globalMixins from "@/mixins/globalMixins.js";
import MyFilter from "@/components/Filter/index.vue";

export default {
  components: {
    MyFilter,
    // Record
  },
  mixins: [globalMixins],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    reportId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      // 主下拉框字典项
      filterOptions: [
        {
          value: "时间",
          key: 1,
          stype: "datetime",
        },
        {
          value: "状态",
          key: 2,
          multiple: true,
          stype: "select",
          selOptions: [
            { key: "1", value: "成功" },
            { key: "2", value: "失败" },
            { key: "0", value: "执行中" },
          ],
        },
      ],
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 10, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
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
        type: 1, // 一级下拉框值
        value: [], // 联动的二级值
      },
      // 查看详情弹窗
      detailDialog: {
        visible: false,
        // 当前选中的条目(详情)
        selectId: "",
        name: "",
      },
      checkAll: false,
      checked: [],
      checkboxOptions: [
        {
          code: "mail",
          name: "邮件列表",
        },
        {
          code: "local",
          name: "本地服务器",
        },
        {
          code: "sftp",
          name: "ftp/sftp",
        },
      ],
      isIndeterminate: false,
    };
  },
  computed: {
    // 筛选条件整合（左侧一级、二级选项）
    filterFormData() {
      const { pageSize, pageNum } = this.tableData;
      return {
        pageSize,
        pageNum,
        ...this.form,
      };
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.tableData = {
          data: [],
          pageSize: 10,
          pageNum: 1,
          total: 0,
        };
        this.getList();
      }
    },
    // 筛选条件变化时候，请求接口
    form: {
      handler() {
        this.tableChange(this.filterFormData, this.tableData, this.getList);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleCancel() {
      this.$emit("update:visible", false);
    },
    getList() {
      if (!this.reportId) {
        return;
      }
      this.loading.table = true;
      getReportLogList(this.reportId, this.filterFormData)
        .then((res) => {
          this.tableData = res;
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    /**
     * @param {string} type 区分列表更新模式
     */
    getTableData() {
      this.tableChange({}, this.tableData, this.getList);
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
  },
};
</script>

<style scoped lang="postcss">
/* @import url("base.css"); */
.el-dialog__wrapper[custom] >>> .el-dialog {
  width: 760px;
}
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
