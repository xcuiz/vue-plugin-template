<template>
  <el-dialog
    custom
    title="选择资产"
    :visible="visible"
    append-to-body
    width="780px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div style="display: flex">
            <MyFilter
              :init-value.sync="searchForm.value"
              :init-type.sync="searchForm.type"
              :filter-options="filterOptions"
              style="width: unset; margin: 0"
              @type-change="handleSearchFormTypeChange"
            />
            <el-input
              v-model="searchIp"
              size="mini"
              placeholder="ip地址"
              style="width: 170px"
              @keyup.enter.native="searchForm.ip = searchIp"
              @blur="searchForm.ip = searchIp"
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column label="资产名称" prop="name" />
          <el-table-column label="ip" prop="ip" />
          <el-table-column label="端口" prop="port" />
          <el-table-column label="资产类型" prop="assetType" />
          <el-table-column label="业务系统" prop="businessSysName" />
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
      </el-card>
    </el-row>
    <span slot="footer">
      <el-button
        size="mini"
        type="primary"
        :loading="loading.submit"
        @click="handleSubmit"
        >确 定</el-button
      >
      <el-button size="mini" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getAssetStorageMode, getAssetTypes, getAssets } from "../api";
import _ from "lodash";
import MyFilter from "@/fusion-components/Filter";
import globalMixins from "@/mixins/globalMixins.js";

export default {
  components: {
    MyFilter,
  },
  mixins: [globalMixins],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    assets: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
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
      searchForm: {
        ip: "",
        type: "", // 一级下拉框值
        value: [], // 联动的二级值
      },
      filterOptions: [],
      searchIp: "",
    };
  },
  computed: {
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
          assetTypeList: this.searchForm.value,
          storageMode: this.searchForm.type,
          ip: this.searchForm.ip,
        },
      };
    },
  },
  watch: {
    searchForm: {
      handler() {
        this.tableChange(this.filterFormData, this.tableData, this.getList);
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.getFilters();
    this.getList();
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleSubmit() {
      this.$emit("submit", this.tableData.multipleSelection, this.tableData);
      this.handleClose();
    },
    async getFilters() {
      const assetStorageModes = await getAssetStorageMode();
      this.filterOptions = assetStorageModes.map((mode) => ({
        key: mode.code,
        value: mode.name,
        stype: "select",
        multiple: true,
        selOptions: [],
      }));
      assetStorageModes.forEach((mode, index) => {
        getAssetTypes(mode.code).then((res) => {
          this.filterOptions[index].selOptions = res.map((item) => ({
            key: item.code,
            value: item.name,
          }));
        });
      });
    },
    getList() {
      this.loading.table = true;
      getAssets(this.filterFormData)
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
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    handleSearchFormTypeChange(val) {
      this.searchForm.type = val;
      this.searchForm.value = [];
    },
  },
};
</script>
<style lang="postcss" scoped>
.el-form[primary] >>> {
  .el-input {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
