<template>
  <el-row>
    <div class="box-card">
      <div slot="header" class="clearfix">
        <div class="flex-sb-box">
          <FilterBar
            v-model="filterValue"
            :fields="filterFields"
            module-code="dataResourceFile"
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
        <!-- <el-table-column
        type="selection"
        width="45"
        :selectable="checkSelectable"
      /> -->
        <el-table-column label="序号" type="index" />
        <el-table-column
          label="文件目录"
          prop="fileDir"
          show-overflow-tooltip
        />
        <el-table-column
          label="文件名称"
          prop="fileName"
          show-overflow-tooltip
        />
        <el-table-column
          label="敏感分类"
          prop="senType"
          show-overflow-tooltip
        />
        <el-table-column label="敏感级别" prop="senLevel" />
        <el-table-column label="敏感特征" prop="senFeature" />
        <el-table-column
          label="是否涉敏"
          prop="isSensitive"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.isSensitive === "1" ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="样例数据" prop="sampleData" />
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
import globalMixins from "@/mixins/globalMixins.js";
import {
  getDetailFile,
  getDetailDataFilter,
  getDetailDataFilterCode,
} from "../api";
export default {
  components: {
    FilterBar,
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
      let fields = await getDetailDataFilter("assetInfoFile");
      for (let i = 0; i < fields.length; i++) {
        for (let n = 0; n < fields[i].children?.length; n++) {
          if (
            fields[i].children[n].type === "select" ||
            fields[i].children[n].type === "treeSelect"
          ) {
            try {
              fields[i].children[n].options = await getDetailDataFilterCode(
                "assetInfoFile",
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
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    getList() {
      this.loading.table = true;
      getDetailFile(this.filterFormData, this.id)
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
