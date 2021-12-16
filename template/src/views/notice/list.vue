<template>
  <div class="container">
    <div class="content">
      <h4 class="idss-font--title idss-container-header">消息中心</h4>
      <el-row>
        <!-- 筛选条件 -->
        <myFilter
          :init-value.sync="form.value"
          :init-type.sync="form.type"
          :filter-options="filterOptions"
        >
          <template slot="left">
            <div class="filter-items">
              <div>
                <el-button
                  size="mini"
                  plain
                  class="operate-button"
                  :loading="loading.del"
                  @click="handleDelete"
                >
                  删除
                </el-button>
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  class="operate-button"
                  :loading="loading.read"
                  @click="setReadStatus"
                >
                  标记为已读
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column label="序号" width="55" show-overflow-tooltip="">
            <template slot-scope="scope">
              <span>{{
                scope.$index + 1 + tableData.pageSize * (tableData.pageNum - 1)
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发送时间" prop="createTime" />
          <el-table-column label="消息类型" prop="messageType">
            <template slot-scope="scope">
              <span>{{ formatMessageType(scope.row.messageType) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="readStatus">
            <template slot-scope="scope">
              <span>{{ formatReadStatus(scope.row.readStatus) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="消息名称" prop="messageName">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                custom
                class="link-type"
                @click="handleClick(scope.row)"
              >
                {{ scope.row.messageName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="摘要"
            prop="messageSummary"
            show-overflow-tooltip
          />
        </el-table>
        <!-- 分页 -->
        <idss-pagination
          background
          hide-on-single-page
          :table-data="tableData"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next,sizes, jumper"
          @page-change="tTableChange"
          @size-change="tTableChange"
        />
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getMessageList, deleteMessage, readMessage } from "./api";
import globalMixins from "@/mixins/globalMixins.js";
import MyFilter from "@/fusion-components/Filter";

export default {
  name: "ReportManage",
  components: {
    MyFilter,
  },
  mixins: [globalMixins],
  data() {
    return {
      // 主下拉框字典项
      filterOptions: [
        {
          value: "消息名称",
          key: "messageName",
          stype: "input",
          maxlength: 42,
        },
        {
          value: "发送时间",
          key: "createTime",
          stype: "datetime",
        },
        {
          value: "消息类型",
          key: "messageType",
          stype: "select",
          multiple: true,
          selOptions: [
            { key: "threat", value: "威胁" },
            { key: "anomaly", value: "异常" },
          ],
        },
        {
          value: "状态",
          key: "readStatus",
          stype: "select",
          multiple: true,
          selOptions: [
            { key: 1, value: "已读" },
            { key: 0, value: "未读" },
          ],
        },
        {
          value: "摘要",
          key: "messageSummary",
          stype: "input",
          maxlength: 42,
        },
      ],
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 10, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "createTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "DESC", // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: false,
        read: false,
        del: false,
      },
      // 筛选项
      form: {
        type: this.$route.query.messageType ? "messageType" : "messageName", // 一级下拉框值
        value: this.$route.query.messageType
          ? [this.$route.query.messageType]
          : [], // 联动的二级值
      },
      permissionDialog: {
        visible: false,
        reportName: null,
        reportId: null,
      },
      logDialog: {
        visible: false,
        reportId: null,
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
      const { pageSize, pageNum } = this.tableData;
      return {
        pageSize,
        pageNum,
        ...this.form,
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
    ...mapActions("system", ["getMessageNum"]),
    getList() {
      // 刷新消息气泡数量
      this.getMessageNum();
      this.loading.table = true;
      const { orderField, orderType } = this.tableData;
      getMessageList({
        ...this.filterFormData,
        orderField,
        orderType,
      })
        .then((res) => {
          this.tableData = Object.assign(this.tableData, res);
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
    handleDelete() {
      if (!this.selectIds.length) {
        this.$message({
          type: "warning",
          message: "请选择需要删除的数据",
        });
        return;
      }
      this.$confirm("此操作就永久删除选择数据，是否确认？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.loading.del = true;
          deleteMessage({ ids: this.selectIds })
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
    setReadStatus() {
      if (!this.selectIds.length) {
        this.$message({
          type: "warning",
          message: "请选择数据",
        });
        return;
      }
      this.loading.read = true;
      readMessage({ ids: this.selectIds })
        .then(() => {
          this.$message.success("操作成功！");
          this.getList();
        })
        .finally(() => {
          this.loading.read = false;
        });
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
    formatMessageType(type) {
      const types = {
        threat: "威胁",
        anomaly: "异常",
      };
      return types[type] || "";
    },
    formatReadStatus(type) {
      const types = {
        0: "未读",
        1: "已读",
      };
      return types[type] || "";
    },
    handleClick({ messageType, linkId }) {
      switch (messageType) {
        case "threat":
          this.$router.push({
            name: "threat-detail",
            params: {
              id: linkId,
            },
          });
          break;
        case "anomaly":
          this.$router.push({
            name: "exception-detail",
            params: {
              id: linkId,
            },
          });
          break;

        default:
          break;
      }
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
