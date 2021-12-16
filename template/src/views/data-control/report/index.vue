<template>
  <div class="container">
    <div class="content">
      <h4 class="idss-font--title idss-container-header">监控报表配置</h4>
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
                <el-button size="mini" type="primary" @click="create">
                  +新建
                </el-button>
              </div>

              <div>
                <el-button
                  size="mini"
                  plain
                  class="operate-button"
                  @click="handleMultipleDelete"
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
          size="mini"
          stripe
          fit
          highlight-current-row
          row-key="id"
          :expand-row-keys="[]"
          style="width: 100%"
          :default-sort="{
            prop: tableData.orderField,
            order: tableData.orderType === 'desc' ? 'descending' : 'ascending',
          }"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column type="expand" width="15">
            <template slot-scope="scope">
              <ChildTable
                :report-id="scope.row.id"
                :send-type="getSendTypeFromConfig(scope.row.sendConfig)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="报表名称"
            prop="reportName"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                custom
                class="link-type"
                @click="handleEdit(scope.row)"
              >
                {{ scope.row.reportName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="创建人" prop="createUser" />
          <el-table-column
            width="160"
            label="创建时间"
            prop="createTime"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column
            width="160"
            label="最近更新时间"
            prop="updateTime"
            sortable="custom"
            :sort-orders="['ascending', 'descending']"
          />
          <el-table-column label="计划任务" prop="executeCycleDesc" />
          <el-table-column label="状态" width="60">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="1"
                inactive-value="0"
                @change="
                  (type) => {
                    handleChangeStatus(type, scope.row);
                  }
                "
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleDelete(scope.row.id)"
                >删除</el-button
              >
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
    </div>
    <DetailDialog
      v-bind="detailDialog"
      :visible.sync="detailDialog.visible"
      @success="getList"
    />
  </div>
</template>

<script>
import { getReportConfigList, operateReport } from "./api";
import globalMixins from "@/mixins/globalMixins.js";
import MyFilter from "@/fusion-components/Filter";
import ChildTable from "./components/child-table";
import DetailDialog from "./components/detail-dialog";

export default {
  name: "ReportManage",
  components: {
    MyFilter,
    ChildTable,
    DetailDialog,
  },
  mixins: [globalMixins],
  data() {
    return {
      // 主下拉框字典项
      filterOptions: [
        {
          value: "报表名称",
          key: "reportName",
          stype: "input",
          maxlength: 42,
        },
        {
          value: "创建时间",
          key: "createTimeList",
          stype: "datetime",
        },
      ],
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 10, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "updateTime", // 排序字段
        orderType: "desc", // 排序方式 asc正序 desc 倒序
        // orderField: 'updateDate', // 排序字段 updateDate(创建时间) updateDate(更新时间)
        // orderType: 'desc' // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: false,
        del: false,
      },
      // 筛选项
      form: {
        type: "reportName", // 一级下拉框值
        value: "", // 联动的二级值
      },
      detailDialog: {
        visible: false,
        type: "add",
        reportId: null,
      },
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
          [this.form.type]: this.form.value,
        },
      };
    },
    selectIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
  },
  watch: {
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
    getList() {
      this.loading.table = true;
      getReportConfigList(this.filterFormData)
        .then((res) => {
          this.tableData = Object.assign(this.tableData, res);
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    create() {
      this.detailDialog = {
        visible: true,
        type: "add",
        reportId: null,
      };
    },
    /**
     * @param {string} type 区分列表更新模式
     */
    getTableData() {
      this.tableChange({}, this.tableData, this.getList);
    },
    handleDelete(id) {
      this.$confirm(
        "删除报表后，该报表任务下的所有报表将被删除，是否确认？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          operateReport({
            operateType: "delete",
            idList: [id],
          }).then(() => {
            this.$message.success("删除成功！");
            this.getList();
          });
        })
        .catch(() => {});
    },
    handleMultipleDelete() {
      if (!this.selectIds.length) {
        this.$message({
          type: "warning",
          message: "请选择需要删除的数据",
        });
        return;
      }
      this.$confirm(
        "删除报表后，该报表任务下的所有报表将被删除，是否确认？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.loading.del = true;
          operateReport({
            operateType: "delete",
            idList: this.selectIds,
          })
            .then(() => {
              this.$message.success("删除成功！");
              this.getList();
            })
            .finally(() => {
              this.loading.del = false;
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
    /**
     * 查看详情-编辑页面
     */
    handleEdit({ id }) {
      this.detailDialog = {
        visible: true,
        type: "edit",
        reportId: id,
      };
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    handleChangeStatus(type, { id }) {
      operateReport({
        idList: [id],
        operateType: type === "1" ? "open" : "close",
      }).then(() => {
        this.$message.success("操作成功");
      });
    },
    getSendTypeFromConfig(configString) {
      try {
        const config = JSON.parse(configString);
        return Object.keys(config);
      } catch (error) {
        return [];
      }
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
</style>
