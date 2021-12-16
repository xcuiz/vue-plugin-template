<template>
  <div class="container">
    <div class="content">
      <PageHeader title="同步脚本" />
      <myFilter
        :init-value.sync="searchForm.value"
        :init-type.sync="searchForm.type"
        :filter-options="filterOptions"
      >
        <template slot="left">
          <div class="filter-items">
            <el-button size="mini" type="primary" @click="handleAdd">
              +新建同步脚本
            </el-button>
            <el-button
              size="mini"
              :disabled="!selectedIds.length"
              type="primary"
              plain
              @click="handleOperate('open')"
            >
              开启
            </el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              :disabled="!selectedIds.length"
              @click="handleOperate('close')"
            >
              关闭
            </el-button>
            <el-button
              size="mini"
              plain
              :disabled="!selectedIds.length"
              @click="handleOperate('delete')"
            >
              删除
            </el-button>
          </div>
        </template>
      </myFilter>
      <el-row style="position: relative">
        <!-- 筛选条件 -->

        <!-- 列表 -->
        <el-table
          v-loading="loading.table"
          row-key="id"
          :data="tableData.data"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          size="mini"
          stripe
          fit
          highlight-current-row
          style="width: 100%"
          :default-sort="{
            prop: tableData.orderField,
            order: tableData.orderType === 'desc' ? 'descending' : 'asc',
          }"
          @selection-change="handleSelectionChange"
          @sort-change="handleSortChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column type="index" />
          <el-table-column label="脚本名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleEdit(scope.row.id)"
              >
                {{ scope.row.scriptName }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="描述" prop="scriptDesc" />
          <el-table-column
            label="创建时间"
            prop="createTime"
            width="160"
            sortable="custom"
          />
          <el-table-column
            label="更新时间"
            prop="updateTime"
            width="160"
            sortable="custom"
          />
          <el-table-column label="创建者" prop="createUser" />
          <el-table-column label="操作" width="60">
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleEdit(scope.row.id)"
                >编辑</el-button
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
  </div>
</template>
<script>
import { pick } from "lodash";
import MyFilter from "@/fusion-components/Filter";
import globalMixins from "@/mixins/globalMixins.js";
import PageHeader from "@/components/PageHeader";
import { getPage, operateScript } from "./api";
export default {
  components: {
    PageHeader,
    MyFilter,
  },
  mixins: [globalMixins],
  data() {
    return {
      drawer: {
        visible: false,
        type: "add",
        id: null,
      },
      filterValue: {},
      filterFields: [],
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "createTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: false,
      },
      filterOptions: [
        {
          value: "名称",
          key: "scriptName",
          stype: "input",
          maxlength: 85,
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
          key: "executeCycleList",
          stype: "select",
          multiple: true,
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
          value: "创建时间",
          key: "createTimeList",
          stype: "datetime",
        },
      ],
      searchForm: {
        type: "scriptName", // 一级下拉框值
        value: "", // 联动的二级值
      },
    };
  },
  computed: {
    // 筛选条件整合（左侧一级、二级选项）
    filterFormData() {
      const global = pick(this.tableData, [
        "pageSize",
        "pageNum",
        "orderField",
        "orderType",
      ]);
      return {
        global,
        param: {
          [this.searchForm.type]: this.searchForm.value,
        },
      };
    },
    selectedIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
  },
  watch: {
    searchForm: {
      handler() {
        this.getList();
      },
      deep: true,
    },
  },
  created() {
    this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    handleSortChange({ prop, order }) {
      this.tableData.orderField = prop;
      this.tableData.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },
    handleAdd() {
      this.$router.push({
        name: "add-collection-script",
      });
    },
    getList() {
      this.loading.table = true;
      getPage(this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    handleEdit(id) {
      this.$router.push({
        name: "edit-collection-script",
        params: {
          id,
        },
      });
    },
    handleOperate(operateType) {
      const operates = {
        open: "开启",
        close: "关闭",
        delete: "删除",
      };
      const currentOperateText = operates[operateType];
      this.$confirm(
        `此操作将${currentOperateText}选中任务, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).then(() => {
        operateScript({
          idList: this.selectedIds,
          operateType,
        }).then(() => {
          this.getList();
        });
      });
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

    >>> .page-header .title {
      min-width: 112px;
    }
  }
  .el-button + .el-select {
    margin-left: 10px;
  }
  .filter-items {
    display: flex;
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
.flex-sb-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

>>> .one-off-job {
  .el-table__expand-icon {
    display: none;
  }
}
</style>
