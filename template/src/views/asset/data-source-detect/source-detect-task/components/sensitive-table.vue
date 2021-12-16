<template>
  <el-row>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div class="flex-sb-box">
          <!-- <span>检查敏感信息</span> -->
          <MyFilter
            :init-value.sync="searchForm.value"
            :init-type.sync="searchForm.type"
            :filter-options="filterOptions"
            style="width: unset; margin: 0"
          />
        </div>
      </div>
      <div style="position: relative">
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
        >
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column
            v-if="showCol('ip')"
            label="ip地址"
            prop="ip"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleCheck(scope.row)"
              >
                {{ scope.row.ip }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showCol('dbType')"
            label="环境类型"
            prop="dbType"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-tag
                v-if="scope.row.dbType"
                :type="scope.row.dbType === '生产库' ? undefined : 'success'"
                size="small"
                >{{ scope.row.dbType }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            v-if="showCol('storageMode')"
            label="资源类型"
            prop="storageMode"
            show-overflow-tooltip
          >
            <template slot-scope="scope">{{
              scope.row.storageMode | formatStorageMode
            }}</template>
          </el-table-column>
          <el-table-column
            v-if="showCol('assetType')"
            label="存储子类型"
            prop="assetType"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showCol('businessSysName')"
            label="所属业务系统"
            prop="businessSysName"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showCol('countDbOrFile')"
            label="表/文件数"
            prop="countDbOrFile"
          />
          <el-table-column
            v-if="showCol('changeTable')"
            label="变更表"
            prop="changeTable"
          />
          <el-table-column
            v-if="showCol('level')"
            label="涉敏级别"
            prop="level"
            width="500"
          >
            <template slot-scope="scope">
              <span v-for="item in scope.row.level.split(',')" :key="item">
                {{ item.split(" ")[0] }}
                <el-tag size="mini" style="margin-right: 6px">{{
                  item.split(" ")[1]
                }}</el-tag>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <ColumnsSelect v-model="columns" />
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
    </el-card>
  </el-row>
</template>
<script>
import _ from "lodash";
import MyFilter from "@/fusion-components/Filter";
import ColumnsSelect from "@/components/columns-select";
import globalMixins from "@/mixins/globalMixins.js";
import { getAssetCheckPage } from "../api";
export default {
  components: {
    MyFilter,
    ColumnsSelect,
  },
  filters: {
    formatStorageMode(storageMode) {
      const storageModeMap = {
        DataBase: "数据库类型",
        BigData: "大数据类型",
        File: "文件类型",
      };

      return storageModeMap[storageMode];
    },
  },
  mixins: [globalMixins],
  props: {
    taskId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 表格数据
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
        table: false,
      },
      // 筛选项
      searchForm: {
        type: "ip", // 一级下拉框值
        value: "", // 联动的二级值
      },
      filterOptions: [
        {
          value: "ip",
          key: "ip",
          stype: "input",
          maxlength: 85,
        },
      ],
      columns: [
        {
          code: "ip",
          name: "ip地址",
          checked: true,
          disabled: true,
        },
        {
          code: "dbType",
          name: "环境类型",
          checked: true,
          disabled: false,
        },
        {
          code: "storageMode",
          name: "资源类型",
          checked: true,
          disabled: false,
        },
        {
          code: "assetType",
          name: "存储子类型",
          checked: true,
          disabled: false,
        },
        {
          code: "businessSysName",
          name: "所属业务系统",
          checked: true,
        },
        {
          code: "countDbOrFile",
          name: "表/文件数",
          checked: true,
        },
        {
          code: "changeTable",
          name: "变更表",
          checked: true,
        },
        {
          code: "level",
          name: "涉敏级别",
          checked: true,
        },
      ],
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
          [this.searchForm.type]: this.searchForm.value,
        },
      };
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
    showCol(code) {
      return _.find(this.columns, { code })?.checked;
    },
    handleCheck({ assetId, storageMode }) {
      this.$router.push({
        name: "source-detect-asset-report",
        params: {
          assetId,
          storageMode,
          taskId: this.taskId,
        },
      });
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    getList() {
      this.loading.table = true;
      getAssetCheckPage(this.taskId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
  },
};
</script>
<style lang="postcss" scoped>
.policy-level {
  &.low {
    .icon {
      color: #68d279;
    }
  }
  &.medium {
    .icon {
      color: #f89d06;
    }
  }
  &.high {
    .icon {
      color: #d81e06;
    }
  }
  &.extremely-high {
    .icon {
      color: #d81e06;
    }
  }
}
.flex-sb-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
