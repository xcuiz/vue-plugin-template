<template>
  <div class="control-common-page-container">
    <div class="common-page-box">
      <div class="header-box">
        <PageHeader :title="title" />
        <div class="flex-sb-box">
          <FilterBar
            v-model="filterValue"
            :fields="filterFields"
            :module-code="moduleCode"
          />
          <div class="filter-items">
            <div v-for="(batch, index) of batchOperates" :key="index">
              <el-button
                v-if="Object.keys(batch).length > 0"
                style="margin-left: 10px"
                size="mini"
                plain
                type="primary"
                class="operate-button"
                @click="() => batch.handler(selectedIds, updateAggAndList)"
              >
                {{ batch.title }}
              </el-button>
            </div>
            <div class="filter-item">
              <el-button
                size="mini"
                plain
                type="primary"
                class="operate-button"
                @click="toExport"
              >
                导出
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="name-list-content">
          <div class="name-list-aside" :class="{ active: toggleActive }">
            <div class="aside-box">
              <div class="aside-box-select">
                <el-select
                  v-model="asideSelectModel"
                  size="mini"
                  @change="asideSelectChange"
                >
                  <el-option-group
                    v-for="group in asideSelectList"
                    :key="group.code"
                    :label="group.name"
                  >
                    <el-option
                      v-for="item in group.children"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-option-group>
                </el-select>
              </div>
              <div v-loading="asideLoading" class="aside-box-list">
                <div
                  v-for="(item, index) of asideFilterList"
                  :key="item.aggName"
                  class="filter-item"
                  :class="{
                    active: currentAgg === item.aggValue,
                    disabled: item.num === 0,
                  }"
                  @click="filterChange(item, index)"
                >
                  <div class="item-left">{{ item.aggName }}</div>
                  <div class="item-right">{{ item.num | thousand }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="toggle-icon" @click="toggleAside">
            <i
              :class="[
                toggleActive ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left',
              ]"
            ></i>
          </div>
          <div class="name-list-table">
            <el-table
              ref="nameListTable"
              v-loading="tableLoading"
              :data="tableData.data"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              max-height="700"
              size="mini"
              stripe
              fit
              highlight-current-row
              style="width: 100%"
              :default-sort="{
                prop: orderField,
                order: orderType === 'desc' ? 'descending' : 'asc',
              }"
              @selection-change="selectionChange"
              @sort-change="sortChange"
            >
              <el-table-column type="selection" width="45" />
              <el-table-column
                v-for="column of checkedColumns"
                :key="column.code"
                :label="column.name"
                :show-overflow-tooltip="true"
                :sortable="column.sortable"
                :prop="column.code"
                :width="column.width"
                :fixed="column.isFixed"
              >
                <template slot-scope="scope">
                  {{
                    column.formatter
                      ? column.formatter(scope.row[column.code])
                      : formatter(scope.row[column.code])
                  }}
                </template>
              </el-table-column>
              <el-table-column
                v-if="btnOperates"
                label="操作"
                :width="operateWidth"
                :fixed="operateFixed"
              >
                <template slot-scope="scope">
                  <span v-for="(btn, index) of btnOperates" :key="index">
                    <el-button
                      v-if="
                        Object.keys(btn).length > 0 &&
                        (btn.visibleShow ? btn.visibleShow(scope.row) : true)
                      "
                      type="text"
                      custom
                      size="mini"
                      @click="
                        () =>
                          btn.handler &&
                          btn.handler(scope.row, updateAggAndList)
                      "
                    >
                      {{ btn.title }}
                    </el-button>
                  </span>
                </template>
              </el-table-column>
            </el-table>
            <ColumnsSelect v-model="selectColumns" />
            <div class="name-list-pagination">
              <idss-pagination
                background
                :table-data="tableData"
                :page-sizes="[10, 20, 50, 100]"
                layout="total, prev, pager, next,sizes, jumper"
                @page-change="pageNumChange"
                @size-change="pageSizeChange"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-empty */
import _ from "lodash";
import FilterBar from "@/components/filter-bar";
import PageHeader from "@/components/PageHeader";
import ColumnsSelect from "@/components/columns-select";

export default {
  name: "CommonPage",
  components: {
    FilterBar,
    PageHeader,
    ColumnsSelect,
  },
  filters: {
    // 大于1000的数字使用K单位表示(如: 2500 -> 2.5K)
    thousand(val) {
      if (typeof val === "number" && val >= 1000) {
        const num = val / 1000;
        return num.toFixed(1) + "K";
      }

      return val;
    },
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    // 获取筛选条件的url
    probeFilterUrl: {
      type: String,
      default: "",
      required: true,
    },
    // 获取筛选条件option的url
    filterOptionUrl: {
      type: String,
      default: "",
      required: true,
    },
    // 聚合下拉框获取数据url
    aggFilterUrl: {
      type: String,
      default: "",
      required: true,
    },
    // 获取聚合数的url
    aggCountUrl: {
      type: String,
      default: "",
      required: true,
    },
    // 获取列表数据的url
    listUrl: {
      type: String,
      default: "",
      required: true,
    },
    // 导出的url
    exportUrl: {
      type: String,
      default: "",
      required: true,
    },
    // 表格字段
    columns: {
      type: Array,
      default: () => [],
      required: true,
    },
    // 模块名
    moduleCode: {
      type: String,
      default: "",
      required: true,
    },
    order: {
      type: Object,
      default: () => ({
        orderType: "",
        orderField: "",
      }),
    },
    btnOperates: {
      type: Array,
      default: null,
    },
    operateFixed: {
      type: String,
      default: "",
    },
    operateWidth: {
      type: Number,
      default: null,
    },
    batchOperates: {
      type: Array,
      default: null,
    },

    listParam: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      filterValue: {},
      filterFields: [],

      selectedIds: [],

      // 侧边栏的加载动画
      asideLoading: false,

      tableLoading: false,
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
      },
      // 排序字段
      orderField: this.order.orderField,
      // 排序方式 asc正序 desc 倒序
      orderType: this.order.orderType || "desc",

      asideSelectModel: "",
      asideFilterList: [],
      toggleActive: false,
      currentAgg: null,
      asideSelectList: [],

      selectColumns: [],
      parseDefaultFilter: null,
    };
  },
  computed: {
    checkedColumns() {
      const { selectColumns } = this;

      if (Array.isArray(selectColumns)) {
        return selectColumns.filter(({ checked }) => checked);
      }

      return [];
    },
  },
  watch: {
    filterValue: {
      handler() {
        this.updateAggAndList();
      },
      deep: true,
    },
    columns: {
      handler(val) {
        this.selectColumns = _.cloneDeep(val);
      },
      immediate: true,
    },
  },
  created() {
    this.tableLoading = true;
    this.initDefaultFilter();
    this.initData();
  },
  methods: {
    initDefaultFilter() {
      const { defaultFilter } = this.$route.query;

      if (defaultFilter) {
        this.parseDefaultFilter = JSON.parse(defaultFilter);

        for (const key in this.parseDefaultFilter) {
          this.$set(this.filterValue, key, this.parseDefaultFilter[key]);
        }
      }
    },
    initData() {
      this.initFilter();
      this.initAggAndList();
    },
    async initAggAndList() {
      await this.initAgg();
      this.getTableData();
    },
    async initFilter() {
      // 此处需要等待筛选条件获取到
      await this.getProbeFilterByUrl();
      this.getProbeFilterOptionsByUrl();
    },
    async initAgg() {
      await this.getAggSelectByUrl();
      this.getAggCountByAggFilter();
    },
    /**
     * 筛选条件修改后更新聚合和列表数据
     */
    updateAggAndList() {
      this.getAggCountByAggFilter();
      this.getTableData();
    },
    /**
     * 通过接口获取聚合下拉框数据
     */
    async getAggSelectByUrl() {
      try {
        const result = await this.$request({
          url: this.aggFilterUrl,
          method: "GET",
        });

        if (result) {
          this.asideSelectList = result;

          // 设置默认值
          this.asideSelectModel = result?.[0]?.children?.[0]?.code;
        }
      } catch (e) {}
    },
    /**
     * 通过聚合以及过滤条件获取聚合数
     */
    async getAggCountByAggFilter() {
      try {
        const { asideSelectModel, filterValue, moduleCode, listParam } = this;
        if (!asideSelectModel) {
          return;
        }

        const result = await this.$request({
          url: this.aggCountUrl,
          method: "POST",
          data: {
            global: {},
            param: {
              moduleCode,

              aggCode: asideSelectModel,
              ...listParam,
              ...filterValue,
            },
          },
        });

        if (result) {
          const { totalName, totalNum, data } = result;

          const asideFilterList = [];

          asideFilterList.push({
            aggName: totalName,
            aggValue: null,
            num: totalNum,
          });

          if (Array.isArray(data)) {
            asideFilterList.push(...data);
          }

          this.asideFilterList = asideFilterList;
        }
      } catch (e) {}
    },
    /**
     * 通过接口获取筛选条件
     */
    async getProbeFilterByUrl() {
      try {
        const result = await this.$request({
          url: this.probeFilterUrl,
          method: "GET",
        });

        if (result) {
          result.forEach(({ children }) => {
            if (Array.isArray(children)) {
              children.forEach(async (item) => {
                if (this.parseDefaultFilter) {
                  if (item.code in this.parseDefaultFilter) {
                    item.isDefault = "1";
                  } else {
                    item.isDefault = null;
                  }
                }
              });
            }
          });

          this.filterFields = result;
        }
      } catch (e) {}
    },
    /**
     * 通过接口获取筛选条件对应的选择(select等)
     */
    async getProbeFilterOptionsByUrl() {
      const { filterFields, filterOptionUrl } = this;

      if (filterFields.length > 0) {
        filterFields.forEach(({ children }, outerIndex) => {
          if (Array.isArray(children)) {
            children.forEach(async ({ code }, innerIndex) => {
              try {
                const result = await this.$request({
                  url: filterOptionUrl.replace("{code}", code),
                  method: "GET",
                });

                if (result) {
                  const target = this.filterFields[outerIndex].children;
                  this.$set(
                    this.filterFields[outerIndex].children,
                    innerIndex,
                    {
                      ...target[innerIndex],
                      options: result,
                    }
                  );
                }
              } catch (e) {}
            });
          }
        });
      }
    },
    async getTableData() {
      this.tableLoading = true;
      try {
        const { pageSize, pageNum } = this.tableData;
        const {
          asideSelectModel,
          currentAgg,
          filterValue,
          moduleCode,
          orderField,
          orderType,
          listParam,
        } = this;

        if (!asideSelectModel) {
          return;
        }

        const result = await this.$request({
          url: this.listUrl,
          method: "POST",
          data: {
            global: {
              orderField,
              orderType,
              pageSize,
              pageNum,
            },
            param: {
              moduleCode,

              aggCode: asideSelectModel,
              aggValue: currentAgg,
              ...listParam,
              ...filterValue,
            },
          },
        });

        if (result) {
          const { data, total } = result;
          this.tableData.data = data;
          this.tableData.total = total;
        }
      } catch (e) {
      } finally {
        this.tableLoading = false;
      }
    },
    /**
     * 导出
     */
    async toExport() {
      try {
        this.$message.info("正在下载,请稍后...");

        const { pageSize, pageNum } = this.tableData;
        const {
          asideSelectModel,
          currentAgg,
          filterValue,
          moduleCode,
          orderField,
          orderType,
          selectedIds,

          listParam,
        } = this;

        const global = {
          orderField,
          orderType,
          pageSize,
          pageNum,
        };

        const param = {
          moduleCode,

          aggCode: asideSelectModel,
          aggValue: currentAgg,
          ...listParam,
          ...filterValue,
        };

        if (selectedIds.length > 0) {
          param.idList = selectedIds;
        }

        const { data } = await this.$request(
          {
            url: this.exportUrl,
            method: "post",
            data: {
              global,
              param,
            },
          },
          {
            responseType: "blob",
          }
        );

        if (data) {
          const blob = new Blob([data], {
            type: "application/csv",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = "导出.csv";
          link.click();
          // 释放内存
          window.URL.revokeObjectURL(link.href);
        }
      } catch (e) {
        this.$message.error("下载失败");
      }
    },
    toggleAside() {
      this.toggleActive = !this.toggleActive;
    },
    async asideSelectChange() {
      this.currentAgg = null;
      this.tableData.pageNum = 1;
      try {
        await this.getAggCountByAggFilter();
        this.getTableData();
      } catch (e) {}
    },
    pageNumChange({ pageNum }) {
      this.tableData.pageNum = pageNum;

      this.getTableData();
    },
    // 页的大小改变
    pageSizeChange({ pageSize }) {
      this.tableData.pageSize = pageSize;

      this.getTableData();
    },
    // 多选
    selectionChange(selected) {
      this.selectedIds = Array.isArray(selected)
        ? selected.map(({ id }) => id)
        : [];
    },
    // 排序
    sortChange({ order, prop }) {
      this.orderField = prop;
      // 排序方式 asc正序 desc 倒序
      this.orderType = order === "ascending" ? "asc" : "desc";

      // 排序后重新获取数据
      this.getTableData();
    },
    filterChange({ aggValue, num }) {
      if (num === 0) {
        return;
      }

      this.currentAgg = aggValue;
      this.tableData.pageNum = 1;

      this.getTableData();
    },
    formatter(v) {
      return v || "-";
    },
  },
};
</script>

<style lang="postcss">
.control-common-page-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .common-page-box {
    padding: 10px 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header-box {
      .flex-sb-box {
        width: 100%;

        .filter-items {
          display: flex;

          .filter-item {
            margin-left: 10px;
          }
        }
      }
    }

    .content-box {
      min-height: 80vh;
      display: flex;
      flex-direction: column;
      .content-header {
        padding-bottom: 12px;
        padding-top: 5px;
        flex-shrink: 0;
        font-size: var(--font-size-14);
        font-weight: 700;
        color: #6b6b6b;
      }

      .name-list-content {
        display: flex;
        flex: 1;
        position: relative;

        .name-list-aside {
          flex-shrink: 0;
          width: 234px;
          transition: width 300ms ease;
          overflow: hidden;
          margin-right: 10px;

          &.active {
            width: 0;
            margin-right: 0;
          }

          .aside-box {
            background-color: rgba(244, 245, 247, 1);
            color: #333;
            border: 1px solid #e0e0e0;
            width: 234px;
            height: 100%;
            display: flex;
            flex-direction: column;

            .aside-box-select {
              padding: 13px 10px;

              .el-select {
                width: 100%;
              }
            }

            .aside-box-list {
              flex: 1;
              position: relative;
              .filter-item {
                display: flex;
                justify-content: space-between;
                border-left: 4px solid transparent;
                height: 32px;
                line-height: 32px;
                padding-left: 12px;
                padding-right: 9px;
                font-size: var(--font-size-12);
                border-bottom: 1px solid #e0e5ea;
                cursor: pointer;

                .item-left {
                  flex: 1;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  word-break: break-all;
                  position: relative;

                  .aside-tooltip {
                    display: inline-block;
                    width: 100%;
                    height: auto;
                    background-color: transparent;
                    border: none;
                  }
                }

                .item-right {
                  flex-shrink: 0;
                }

                &.active {
                  border-left-color: #4a90e2;
                  font-weight: 700;
                }

                &.disabled {
                  color: #999;
                }
              }
            }
          }
        }

        .toggle-icon {
          position: absolute;
          z-index: 10;
          left: -12px;
          top: 0;
          width: 20px;
          height: 23px;
          line-height: 23px;
          border-radius: 2px;
          text-align: center;
          box-shadow: 0 0 2px rgba(120, 120, 120, 0.5);
          border-left: none;
          cursor: pointer;
          background-color: #fff;
          .iconfont {
            font-size: var(--font-size-12);
          }
        }

        .name-list-table {
          flex: 1;
          width: 500px;
          position: relative;

          .link-type {
            cursor: pointer;
            color: var(--button-text-color);

            &:hover {
              text-decoration: underline;
            }
          }

          .name-list-pagination {
            margin-top: 10px;

            .el-input--mini {
              .el-input__icon {
                line-height: 22px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
