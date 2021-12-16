/* eslint-disable handle-callback-err */
<template>
  <div class="container">
    <div class="content">
      <h4 class="idss-font--title idss-container-header">资源同步</h4>
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
                <el-button size="mini" type="primary" @click="addSync">
                  +新建
                </el-button>
              </div>

              <div style="margin-right: 10px">
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  class="operate-button"
                  @click="open"
                >
                  开启
                </el-button>
              </div>

              <div style="margin-right: 10px">
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  class="operate-button"
                  @click="close"
                >
                  关闭
                </el-button>
              </div>

              <div>
                <el-button
                  size="mini"
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
        <div class="table-area">
          <el-table
            v-loading="loading['getData']"
            :data="tableData.data"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            max-height="700"
            size="mini"
            stripe
            fit
            highlight-current-row
            style="width: 95%"
            :default-sort="{
              prop: tableData.orderField,
              order: tableData.orderType === 'desc' ? 'descending' : 'asc',
            }"
            @selection-change="handleSelectionChange"
            @sort-change="abnormalDataChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column width="60px" align="center" label="序号">
              <template slot-scope="scope">
                <span>{{
                  scope.$index +
                  1 +
                  (tableData.pageNum - 1) * tableData.pageSize
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  custom
                  class="link-type"
                  @click="handleDetail(scope.row)"
                >
                  {{ scope.row.syncName }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column label="描述" prop="syncDesc" />
            <el-table-column
              label="执行方式"
              prop="isCycleJob"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.isCycleJob ? "周期执行" : "立即执行" }}
              </template>
            </el-table-column>
            <el-table-column
              label="最后一次执行时间"
              prop="startTime"
              sortable="custom"
            />
            <!-- <el-table-column
              label="结束时间"
              prop="endTime"
              sortable="custom"
            /> -->
            <el-table-column align="left" label="开关" width="150">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  :title="scope.row.switch"
                  active-color="rgba(74, 144, 234, 1)"
                  inactive-color="rgba(211, 211, 211, 1)"
                  active-value="1"
                  inactive-value="0"
                  @change="(value) => switchOperation(value, scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  :disabled="scope.row.taskStatus != null"
                  type="text"
                  custom
                  size="mini"
                  @click="handleDetail(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="goToRecord(scope.row.id)"
                  >运行记录</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
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

    <!-- 详情弹窗 -->
    <list-detail
      v-if="detailDialog.visible"
      :id="detailDialog.id"
      :visible.sync="detailDialog.visible"
    />

    <!-- 详情 -->
    <edit-dialog
      v-if="editObj.visible"
      v-bind="editObj"
      :visible.sync="editObj.visible"
      @success="getTableData"
    >
    </edit-dialog>
  </div>
</template>

<script>
import globalMixins from "@/mixins/globalMixins.js";
import { getSyncPage, operateSync } from "./api";
import MyFilter from "@/fusion-components/Filter";
import ListDetail from "./listDetail.vue";
import EditDialog from "./components/newSynchronize.vue";

export default {
  components: {
    MyFilter,
    ListDetail,
    EditDialog,
  },
  mixins: [globalMixins],
  data() {
    return {
      editObj: {
        visible: "",
        id: "",
        type: "add",
      },

      // 主下拉框字典项
      filterOptions: [
        {
          value: "名称",
          key: "syncName",
          stype: "input",
        },
        {
          value: "描述",
          key: "syncDesc",
          stype: "input",
        },
        {
          value: "状态",
          key: "statusList",
          stype: "select",
          multiple: true,
          selOptions: [
            {
              key: "1",
              value: "开启",
            },
            {
              key: "0",
              value: "关闭",
            },
          ],
        },
        {
          value: "执行方式",
          key: "executeCycle",
          stype: "select",
          selOptions: [
            {
              key: "01",
              value: "立即执行",
            },
            {
              key: "02",
              value: "周期执行",
            },
          ],
        },
        {
          value: "最后执行时间",
          key: "startTimeList",
          stype: "datetime",
        },
      ],
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "startTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {},
      // 筛选项
      form: {
        type: "syncName", // 一级下拉框值
        value: "", // 联动的二级值
      },
      // 查看详情弹窗
      detailDialog: {
        visible: false,
        // 当前选中的条目(详情)
        id: "",
      },
    };
  },
  computed: {
    filterFormData() {
      const { pageSize, pageNum, orderField, orderType } = this.tableData;
      return {
        global: {
          pageSize,
          pageNum,
          orderField,
          orderType,
        },
        param: { [this.form.type]: this.form.value },
      };
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
      getSyncPage(this.filterFormData)
        .then((res) => {
          const tableData = { ...this.tableData, ...res };
          tableData.data = tableData.data.map((item) => {
            item.isCycleJob = item.executeCycle === "02";
            return item;
          });
          this.tableData = tableData;
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    goToRecord(id) {
      this.$router.push({
        name: "collection-sql-record",
        params: {
          id,
        },
      });
    },
    addSync() {
      Object.assign(this.editObj, {
        id: "",
        visible: true,
        type: "add",
      });
    },
    /**
     * @param {string} type 区分列表更新模式
     */
    getTableData() {
      this.tableChange({}, this.tableData, this.getList);
    },
    /**
     * 排序
     * @param {object} column
     */
    abnormalDataChange(column) {
      this.tableData.orderField = column.prop || "updateDate";
      this.tableData.orderType = column.order === "descending" ? "desc" : "asc";
      this.getTableData("submit");
    },
    /**
     * 获取当前选中的id,多选
     * @returns {Array} ids 要删除的用户组
     */
    getMultipleSelection() {
      let arr = [...this.tableData.multipleSelection];
      let ids = [];
      arr &&
        arr.length &&
        arr.forEach((item) => {
          // 取相反，相同的不需要传后端
          ids.push(item.id);
        });
      return ids;
    },
    handleDelete() {
      // 获取选中的id
      const ids = this.getMultipleSelection();
      if (!ids || !ids.length) {
        return this.$message({
          type: "error",
          message: "请选择有效的对象",
        });
      }
      this.$confirm("此操作将永久删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          operateSync({
            idList: ids,
            operateType: "delete",
          }).then(() => {
            this.$message.success("删除成功");
            this.getList();
          });
        })
        .catch(() => {});
    },
    open() {
      // 获取选中的id
      const ids = this.getMultipleSelection();
      if (!ids || !ids.length) {
        return this.$message({
          type: "error",
          message: "请选择有效的对象",
        });
      }
      operateSync({
        idList: ids,
        operateType: "open",
      }).then(() => {
        this.$message.success("开启同步成功");
        this.getList();
      });
    },
    close() {
      // 获取选中的id
      const ids = this.getMultipleSelection();
      if (!ids || !ids.length) {
        return this.$message({
          type: "error",
          message: "请选择有效的对象",
        });
      }
      operateSync({
        idList: ids,
        operateType: "close",
      }).then(() => {
        this.$message.success("关闭同步成功");
        this.getList();
      });
    },
    handleSelect() {
      this.handleDelete();
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
    handleDetail(row) {
      Object.assign(this.editObj, {
        id: row.id,
        visible: true,
        type: "edit",
      });
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    switchOperation(value, row) {
      const types = {
        0: "close",
        1: "open",
      };
      operateSync({
        idList: [row.id],
        operateType: types[value],
      }).then(() => {
        this.$message.success("操作成功");
        this.getList();
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.table-area {
  display: flex;
}
.select-table-column:hover {
  cursor: pointer;
}
>>> .el-input__inner {
  height: 28px;
}
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
