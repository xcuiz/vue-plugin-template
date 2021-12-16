<template>
  <div class="container">
    <div class="content">
      <PageHeader title="模板列表" />
      <!-- 筛选条件 -->
      <MyFilter
        :init-value.sync="searchForm.value"
        :init-type.sync="searchForm.type"
        :filter-options="filterOptions"
      >
        <template slot="left">
          <div class="filter-items">
            <el-button
              size="small"
              type="primary"
              :loading="loading.sync"
              @click="handleSync"
              >同步模版</el-button
            >
          </div>
        </template>
      </MyFilter>

      <el-row v-loading="loading.table" :gutter="12">
        <el-col
          v-for="(item, index) in tableData.data"
          :key="index + item.tempName"
          :span="8"
          style="margin-bottom: 12px"
        >
          <TplCard v-bind="item" />
        </el-col>
        <div
          v-if="!tableData.data.length"
          class="el-table__empty-block"
          style="width: 100%; height: 100%"
        >
          <span class="el-table__empty-text">暂无数据</span>
        </div>
        <!-- <span v-if="!tableData.data.length" class="el-table__empty-text"
          >暂无数据</span
        > -->
      </el-row>
      <idss-pagination
        background
        :table-data="tableData"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, prev, pager, next,sizes, jumper"
        @page-change="tTableChange"
        @size-change="tTableChange"
      />
    </div>
  </div>
</template>
<script>
import MyFilter from "fusion-components/Filter";
import PageHeader from "@/components/PageHeader";
import TplCard from "./tpl-card";
import { getTplPage, syncTpl } from "../api";
import globalMixins from "@/mixins/globalMixins.js";
export default {
  components: {
    PageHeader,
    TplCard,
    MyFilter,
  },
  mixins: [globalMixins],
  props: {
    probeId: {
      type: [String, Number],
    },
  },
  data() {
    return {
      filterOptions: [
        {
          value: "模版名称",
          key: "tempName",
          stype: "input",
          maxlength: 85,
        },
        {
          value: "状态",
          key: "status",
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
      ],
      searchForm: {
        type: "tempName", // 一级下拉框值
        value: "", // 联动的二级值
      },
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
        sync: false,
        table: false,
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
    handleSync() {
      this.loading.sync = true;
      syncTpl(this.probeId)
        .then(() => {
          this.$message.success("同步成功");
          this.getList();
        })
        .finally(() => {
          this.loading.sync = false;
        });
    },
    getList() {
      this.loading.table = true;
      getTplPage(this.probeId, this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
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
  }
}
</style>
