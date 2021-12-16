<template>
  <div class="operation-audit-container">
    <div class="operation-audit-box">
      <div class="box-header">
        <div class="header-title">操作审计</div>
      </div>
      <div class="filter-box">
        <MyFilter
          :init-value.sync="form.value"
          :init-type.sync="form.type"
          :filter-options="filterOptions"
        >
          <template slot="left">
            <div class="filter-items">
              <el-button size="mini" plain type="primary" @click="exportTo">
                导出
              </el-button>
            </div>
          </template>
        </MyFilter>
      </div>
      <div class="box-content">
        <el-table
          v-loading="tableLoading"
          :data="tableData.data"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          max-height="780"
          size="mini"
          stripe
          fit
          highlight-current-row
          style="width: 100%"
          :default-sort="{ prop: 'updateTime', order: 'descending' }"
          @sort-change="sortChange"
          @selection-change="selectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column width="60px" align="center" label="#">
            <template slot-scope="scope">
              <span>{{
                scope.$index + 1 + (tableData.pageNum - 1) * tableData.pageSize
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="账号"
            show-overflow-tooltip
            prop="userName"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.userName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="IP地址"
            show-overflow-tooltip
            prop="loginIp"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.loginIp }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="UA"
            show-overflow-tooltip
            prop="userAgent"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.userAgent }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="时间"
            show-overflow-tooltip
            prop="createTime"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作模块"
            show-overflow-tooltip
            prop="optModule"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ operateModuleFormatter(scope.row.optModule) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作类型"
            show-overflow-tooltip
            prop="optType"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ operateTypeFormatter(scope.row.optType) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作内容"
            show-overflow-tooltip
            prop="logName"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.logName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作结果"
            show-overflow-tooltip
            prop="logResult"
            width="100"
            sortable="custom"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.logResult | opertateResult }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-box">
          <idss-pagination
            background
            hide-on-single-page
            :table-data="tableData"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, prev, pager, next,sizes, jumper"
            @page-change="pageNumChange"
            @size-change="pageSizeChange"
          />
        </div>
      </div>
    </div>
    <div class="dialog-box">
      <el-dialog
        :close-on-click-modal="false"
        custom
        title="导出选项"
        :visible="exportVisible"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        @close="closeExportDialog"
      >
        <el-radio v-model="exportType" label="export-all"
          >导出所有操作审计信息</el-radio
        >
        <div style="margin-top: 10px"></div>
        <el-radio v-model="exportType" label="export-selected"
          >导出勾选操作审计信息</el-radio
        >
        <div slot="footer" class="dialog-footer">
          <el-button size="small" type="primary" @click="exportAudit">
            确 定
          </el-button>
          <el-button size="small" @click="closeExportDialog"> 取 消 </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import MyFilter from "@/fusion-components/Filter";
export default {
  name: "OperationAudit",
  components: { MyFilter },
  filters: {
    opertateResult(val) {
      const dict = {
        success: "成功",
        error: "失败",
      };

      return dict[val];
    },
  },
  data() {
    return {
      form: {
        type: "filter_BTWL_createTime",
        value: "",
      },
      filterOptions: [
        {
          value: "时间",
          key: "filter_BTWL_createTime",
          stype: "datetime",
        },
        {
          value: "账号",
          key: "filter_LIKES_userName",
          stype: "input",
        },
        {
          value: "IP地址",
          key: "filter_LIKES_loginIp",
          stype: "input",
        },
        {
          value: "UA",
          key: "filter_LIKES_userAgent",
          stype: "input",
        },
        {
          value: "操作模块",
          key: "filter_INS_optModule",
          stype: "select-tree",
          selOptions: [],
        },
        {
          value: "操作类型",
          key: "filter_INS_optType",
          stype: "select",
          multiple: true,
          selOptions: [],
        },
        {
          value: "操作内容",
          key: "filter_LIKES_logName",
          stype: "input",
        },
        {
          value: "操作结果",
          key: "filter_INS_logResult",
          stype: "select",
          multiple: true,
          selOptions: [
            {
              key: "success",
              value: "成功",
            },
            {
              key: "error",
              value: "失败",
            },
          ],
        },
      ],

      tableData: {
        data: [],
        total: 0,
        pageNum: 1,
        pageSize: 20,
      },
      orderField: "createTime",
      orderType: "desc",
      tableLoading: false,

      exportVisible: false,
      exportType: "export-all",

      ids: [],

      operateTypeList: {},
      operateModuleList: {},
    };
  },
  watch: {
    form: {
      handler() {
        this.tableData.pageNum = 1;
        this.getTableData();
      },
      deep: true,
    },
  },
  created() {
    this.getTableData();

    this.queryOptType();
    this.queryOptModule();
  },
  methods: {
    async getTableData() {
      this.tableLoading = true;
      const { type, value } = this.form;
      const { pageNum, pageSize } = this.tableData;
      const { orderField, orderType } = this;
      try {
        const result = await this.$request({
          url: "/gov/api/sys/log/pagequery",
          method: "POST",
          data: {
            type,
            value: value.toString(),
            pageNum,
            pageSize,
            orderField,
            orderType,
          },
        });
        if (result) {
          const { total, data } = result;

          this.tableData.data = data;
          this.tableData.total = total;

          this.tableLoading = false;
        }
      } catch (e) {
        this.tableLoading = false;
      }
    },
    // 操作类型
    async queryOptType() {
      const result = await this.$request({
        url: "/gov/api/sys/log/queryOptType",
        method: "GET",
      });

      if (result) {
        this.operateTypeList = result;

        const selOptions = [];
        for (let k in result) {
          selOptions.push({
            key: k,
            value: result[k],
          });
        }

        this.$set(this.filterOptions, 5, {
          ...this.filterOptions[5],
          selOptions,
        });
      }
    },
    // 操作模块
    async queryOptModule() {
      const result = await this.$request({
        url: "/gov/api/sys/log/queryOptModule",
        method: "GET",
      });

      if (Array.isArray(result)) {
        const OptModuleTree = [];
        const OptModuleMap = {};
        result.forEach((item) => {
          const optModule = {};
          const { children, name, meta } = item;

          let label = "";

          if (meta) {
            const { manageFree, title } = meta;

            if (manageFree || !title) {
              return;
            }

            label = title;
          }
          optModule.label = label;
          optModule.name = name;

          if (Array.isArray(children) && children.length !== 0) {
            optModule.children = [];
            children.forEach((child) => {
              const { name, meta } = child;

              let label = "";

              if (meta) {
                const { manageFree, title } = meta;

                if (manageFree || !title) {
                  return;
                }

                label = title;
              }

              optModule.children.push({
                label,
                name,
              });

              OptModuleMap[name] = label;
            });
          } else {
            OptModuleMap[name] = label;
          }

          OptModuleTree.push(optModule);
        });

        this.operateModuleList = OptModuleMap;

        // const selOptions = []
        // for (let k in result) {
        //   selOptions.push({
        //     key: k,
        //     value: result[k]
        //   })
        // }

        this.$set(this.filterOptions, 4, {
          ...this.filterOptions[4],
          selOptions: OptModuleTree,
        });
      }
    },
    exportTo() {
      this.exportVisible = true;
    },
    sortChange({ order, prop }) {
      this.orderField = prop;
      // 排序方式 asc正序 desc 倒序
      this.orderType = order === "ascending" ? "asc" : "desc";

      // 排序后重新获取数据
      this.getTableData();
    },
    selectionChange(selection) {
      this.ids = selection.map(({ id }) => id);
    },
    pageSizeChange({ pageSize }) {
      this.tableData.pageSize = pageSize;

      this.getTableData();
    },
    pageNumChange({ pageNum }) {
      this.tableData.pageNum = pageNum;

      this.getTableData();
    },
    closeExportDialog() {
      this.exportType = "export-all";
      this.exportVisible = false;
    },
    async exportAudit() {
      const { type, value } = this.form;

      let body = {
        [type]: value,
      };

      if (this.exportType === "export-selected") {
        // 导出勾选的

        if (this.ids.length === 0) {
          this.$message({
            type: "warn",
            message: "请选择需要导出的数据",
          });

          return;
        }

        body = {
          ids: this.ids,
        };
      }

      this.closeExportDialog();
      this.$message.info("正在导出,请稍后...");

      const { data } = await this.$request(
        {
          url: "/gov/api/sys/log/export",
          method: "POST",
          data: body,
        },
        {
          responseType: "blob",
        }
      );

      if (data) {
        let blob = new Blob([data], {
          type: "application/csv",
        });
        let fileName = "";
        fileName = "导出.csv";
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        // 释放内存
        window.URL.revokeObjectURL(link.href);

        this.$message.success("导出成功");
      }
    },
    operateTypeFormatter(val) {
      return this.operateTypeList[val] || val;
    },
    operateModuleFormatter(val) {
      return this.operateModuleList[val] || val;
    },
  },
};
</script>

<style lang="postcss">
.operation-audit-container {
  padding: 10px 15px;
  height: 100%;
  .operation-audit-box {
    .box-header {
      .header-title {
        padding-top: 10px;
        padding-bottom: 20px;
        font-size: var(--font-size-16);
        font-weight: bold;
        line-height: 1;
      }
    }

    .pagination-box {
      margin-top: 10px;

      .el-input--mini {
        .el-input__icon {
          line-height: 22px;
        }
      }
    }
  }

  .dialog-box {
    .el-dialog__wrapper[custom] .el-dialog {
      width: 420px;
    }
  }
}
</style>
