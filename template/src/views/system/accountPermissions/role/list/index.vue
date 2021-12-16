<template>
  <div class="container">
    <div class="content">
      <h3 class="idss-font--title idss-container-header">角色</h3>
      <el-row>
        <!-- 筛选条件 -->
        <myFilter
          :init-value.sync="searchForm.value"
          :init-type.sync="searchForm.type"
          :filter-options="filterOptions"
        >
          <template slot="left">
            <div class="filter-items">
              <el-button size="mini" type="primary" @click="addRole">
                +新建角色
              </el-button>
              <el-button
                size="mini"
                class="operate-button"
                plain
                @click="handleDelete"
              >
                删除
              </el-button>
            </div>
          </template>
        </myFilter>
        <!-- 列表 -->
        <el-table
          v-loading="loading['getData']"
          :data="tableData.data"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          max-height="700"
          size="mini"
          fit
          stripe
          highlight-current-row
          style="width: 100%"
          :default-sort="{
            prop: tableData.orderField,
            order: tableData.orderType === 'desc' ? 'descending' : 'asc',
          }"
          @selection-change="handleSelectionChange"
          @sort-change="abnormalDataChange"
        >
          <el-table-column
            type="selection"
            :selectable="selectableRow"
            width="45"
          />
          <el-table-column width="60px" align="left" label="#">
            <template slot-scope="scope">
              <span>{{
                scope.$index + 1 + (tableData.pageNum - 1) * tableData.pageSize
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="角色名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                custom
                class="link-type"
                @click="handleDetail(scope.row)"
              >
                {{ scope.row.roleName | formateTableData }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="描述" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.roleDescribe | formateTableData }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建账号" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.createUser | formateTableData }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            sortable="custom"
            prop="updateDate"
            align="left"
            label="修改时间"
          >
            <template slot-scope="scope">
              <span>{{
                scope.row.updateDate | formatDate | formateTableData
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                custom
                class="link-type"
                @click="handleClick(scope.row)"
              >
                编辑
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
    </div>
    <!-- 新增弹窗 -->
    <create-dialog
      v-if="createDialogVisible"
      :id="dialogData.selectId"
      :is-detail="dialogData.isDetail"
      :title="dialogData.title"
      :visible.sync="createDialogVisible"
      @refresh="getTableData"
    >
    </create-dialog>
  </div>
</template>

<script>
import globalMixins from "@/mixins/globalMixins.js";
import service from "./indexServe.js";
export default {
  components: {
    myFilter: () => import("@/fusion-components/Filter"),
    createDialog: () => import("@/views/system/accountPermissions/role/create"),
  },
  mixins: [globalMixins, service],
  data() {
    return {
      // 主下拉框字典项
      filterOptions: [
        {
          value: "角色名称",
          key: "1",
          stype: "input",
          maxlength: 100,
        },
      ],
      // 配置默认值，配置、导出配置、导入配置
      configVal: "",
      size: "mini",
      // 表格数据
      tableData: {
        orderField: "updateDate",
        orderType: "desc",
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
      },
      // 筛选项
      searchForm: {
        type: "1", // 一级下拉框值
        value: "", // 联动的二级值
      },
      // 新增弹窗标识
      createDialogVisible: false,
      selectId: "",
      dialogData: {
        selectId: "",
        isDetail: false,
        title: "",
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
        ...this.searchForm,
      };
    },
  },
  watch: {
    // 筛选条件变化时候，请求接口
    searchForm: {
      handler() {
        this.tableChange(this.filterFormData, this.tableData, this.getList);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    /**
     * @param {Object} row 行数据
     * @returns {Boolean} true 可选，false禁止选中
     */
    selectableRow(row) {
      return row.builtin !== "0";
    },
    /**
     * @param {string} type 区分列表更新模式
     */
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    /**
     * 查看详情-编辑页面
     */
    handleDetail(row) {
      this.dialogData = {
        selectId: row.roleId,
        isDetail: true,
        title: row.roleName + " 信息",
      };
      this.createDialogVisible = true;
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
     * table多选操作
     * @param {object} val 当前选中的条目
     */
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    /**
     * 打开详情弹窗
     * @param {object} row 当前展示的弹窗数据
     */
    handleClick(row) {
      this.dialogData = {
        selectId: row.roleId,
        isDetail: row.builtin === "0",
        title: "",
      };
      this.createDialogVisible = true;
    },
    /**
     * 数据接入
     */
    addRole() {
      this.dialogData = {
        selectId: "",
        isDetail: false,
        title: "",
      };
      this.createDialogVisible = true;
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
  .el-table {
    margin-bottom: 10px;
    >>> .cell {
      white-space: nowrap;
    }
  }
  .link-type {
    color: rgb(74, 144, 234);
  }
  .filter-button {
    color: #3c5679;
  }
}
</style>
