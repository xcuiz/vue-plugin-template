<template>
  <el-row>
    <div class="box-card">
      <div slot="header" class="clearfix">
        <div class="flex-sb-box">
          <FilterBar
            v-model="filterValue"
            :fields="filterFields"
            module-code="dataResource"
          />
        </div>
      </div>
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
        <el-table-column type="expand" width="15">
          <template slot-scope="scope">
            <ChildTable :table-id="scope.row.id" />
          </template>
        </el-table-column>
        <el-table-column label="序号" type="index" />
        <el-table-column label="数据表" show-overflow-tooltip>
          <template slot-scope="scope">
            <template>
              {{ scope.row.tableName }}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="所属库" prop="dbName" />
        <el-table-column label="数据库类型" prop="dbType">
          <template slot-scope="scope">
            <template>
              {{ scope.row.dbType === "1" ? "生产库" : "非生产库" }}
            </template>
          </template>
        </el-table-column>
        <!-- <el-table-column label="字段名" prop="fieldName" /> -->
        <el-table-column label="注释" prop="fieldComment" />
        <el-table-column label="是否涉敏" prop="isSensitive">
          <template slot-scope="scope">
            {{ scope.row.isSensitive === "1" ? "是" : "否" }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="敏感特征" prop="aimStrategys" /> -->
        <el-table-column label="敏感数据分类" prop="senType" />
        <el-table-column label="敏感数据分级" prop="senLevel" />
        <!-- <el-table-column label="样本数据" prop="sampleData" /> -->
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
    </div>
  </el-row>
</template>
<script>
import _ from "lodash";
import FilterBar from "@/components/filter-bar";
import ChildTable from "./form-detail-table";
import globalMixins from "@/mixins/globalMixins.js";
import {
  getDetailData,
  getDetailDataFilter,
  getDetailDataFilterCode,
} from "../api";
export default {
  components: {
    FilterBar,
    ChildTable,
  },
  mixins: [globalMixins],
  props: {
    id: {
      type: [Number, String],
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
      filterFields: [],
      loading: {
        table: false,
      },
      title: "",
      filterValue: {},
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
          ...this.filterValue,
        },
      };
    },
  },
  watch: {
    filterValue: {
      handler() {
        this.filterFormData.param = this.filterValue;
        this.getList();
      },
      deep: true,
    },
  },
  created() {
    this.getList();
    this.getFilterFields();
  },
  methods: {
    async getFilterFields() {
      let fields = await getDetailDataFilter("assetInfoData");
      for (let i = 0; i < fields.length; i++) {
        for (let n = 0; n < fields[i].children?.length; n++) {
          if (
            fields[i].children[n].type === "select" ||
            fields[i].children[n].type === "treeSelect"
          ) {
            try {
              fields[i].children[n].options = await getDetailDataFilterCode(
                "assetInfoData",
                fields[i].children[n].code
              );
            } catch (error) {
              fields[i].children[n].options = [];
            }
          }
        }
      }
      this.filterFields = fields;
    },
    pageNumChange({ pageNum }) {
      this.tableData.pageNum = pageNum;
      this.getList();
    },
    pageSizeChange({ pageSize }) {
      this.tableData.pageSize = pageSize;
      this.getList();
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
      getDetailData(this.filterFormData, this.id)
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
.result-title {
  font-size: 12px;
  font-weight: 900;
  margin-bottom: 15px;
}
</style>
