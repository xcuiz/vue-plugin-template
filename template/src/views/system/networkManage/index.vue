<template>
  <div class="network-manage-container">
    <div class="network-manage-box">
      <div class="header-box">
        <div class="header-title">网络域管理</div>
        <PageHeader title="">
          <div class="flex-sb-box">
            <HeaderFilter
              :init-value.sync="form.value"
              :init-type.sync="form.type"
              :filter-options="filterOptions"
            >
              <template slot="left">
                <div class="filter-items">
                  <div class="filter-items-btn">
                    <el-button size="mini" type="primary" @click="toAdd">
                      + 新增
                    </el-button>
                  </div>
                  <div class="filter-items-btn">
                    <el-button
                      size="mini"
                      type="primary"
                      plain
                      @click="toDownload"
                    >
                      模板下载
                    </el-button>
                  </div>
                  <div class="filter-items-btn">
                    <el-upload
                      action=""
                      :auto-upload="false"
                      :show-file-list="false"
                      :on-change="uploadFileChange"
                    >
                      <el-button size="mini" type="primary" plain>
                        导入
                      </el-button>
                    </el-upload>
                  </div>
                  <div class="filter-items-btn">
                    <el-button size="mini" plain @click="toMultiDelete">
                      删除
                    </el-button>
                  </div>
                </div>
              </template>
            </HeaderFilter>
          </div>
        </PageHeader>
      </div>
      <div class="content-box">
        <div class="name-list-content">
          <!-- <div class="name-list-aside" :class="{ active: toggleActive }">
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
          </div> -->
          <!-- <div class="toggle-icon" @click="toggleAside">
            <i
              class="iconfont"
              :class="[toggleActive ? 'iconarrowright' : 'iconarrowleft']"
            ></i>
          </div> -->
          <div v-loading="tableLoading" class="name-list-table">
            <el-table
              ref="nameListTable"
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
              <el-table-column width="80" label="序号">
                <template slot-scope="scope">
                  {{
                    scope.$index +
                    1 +
                    (tableData.pageNum - 1) * tableData.pageSize
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="网络域名称"
                show-overflow-tooltip
                prop="name"
              >
                <template slot-scope="scope">
                  <el-button
                    custom
                    type="text"
                    size="mini"
                    @click="toDetail(scope.row.id)"
                    >{{ scope.row.name || "-" }}</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                label="物理位置"
                show-overflow-tooltip
                prop="ipLocationName"
              >
                <template slot-scope="scope">
                  {{ scope.row.ipLocationName || "-" }}
                </template>
              </el-table-column>
              <el-table-column
                label="ip范围"
                show-overflow-tooltip
                prop="ipSection"
              >
                <template slot-scope="scope">
                  {{ scope.row.ipSection || "-" }}
                </template>
              </el-table-column>
              <el-table-column
                label="描述"
                show-overflow-tooltip
                prop="netDescribe"
              >
                <template slot-scope="scope">
                  {{ scope.row.netDescribe || "-" }}
                </template>
              </el-table-column>
              <el-table-column
                label="创建人"
                show-overflow-tooltip
                sortable="custom"
                prop="createUser"
              >
                <template slot-scope="scope">
                  {{ scope.row.createUser || "-" }}
                </template>
              </el-table-column>
              <el-table-column
                label="创建时间"
                show-overflow-tooltip
                sortable="custom"
                prop="createTime"
              >
                <template slot-scope="scope">
                  {{ scope.row.createTime || "-" }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    custom
                    type="text"
                    size="mini"
                    @click="toEdit(scope.row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    custom
                    type="text"
                    size="mini"
                    @click="toDelete([scope.row.id])"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
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
    <div class="dialog-box">
      <new-form
        v-if="addVisible"
        :type="dialogType"
        :visible.sync="addVisible"
        :selected-id="selectedId"
        @after-close="afterClose"
      ></new-form>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-empty */
import { downloadBlob } from "@/util/download";
import PageHeader from "@/components/PageHeader";
import HeaderFilter from "@/components/Filter/index.vue";
import NewForm from "./newForm.vue";

export default {
  name: "ApplicationManage",
  components: {
    HeaderFilter,
    PageHeader,
    NewForm,
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
  data() {
    return {
      filterValue: {},
      filterFields: [],

      addVisible: false,
      dialogType: null,

      filterOptions: [
        {
          value: "网络域名称",
          key: "name",
          stype: "input",
        },
        {
          value: "创建时间",
          key: "createTimeList",
          stype: "datetime",
        },
      ],
      form: {
        type: "name",
        value: "",
      },

      selectedIds: [],

      selectedId: null,

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
      orderField: "createTime",
      // 排序方式 asc正序 desc 倒序
      orderType: "desc",

      asideSelectModel: "",
      asideFilterList: [],
      toggleActive: false,
      currentAgg: null,
      asideSelectList: [],

      // 获取筛选条件的url
      probeFilterUrl: "/gov/api/common/page/filter/businessSys",
      // 获取筛选条件option的url
      filterOptionUrl: "/gov/api/common/filter/value/businessSys/{code}",
      // 聚合下拉框获取数据url
      aggFilterUrl: "/gov/api/common/agg/filter/businessSys",
      // 获取聚合数的url
      aggCountUrl: "/gov/api/data/businessSys/agg",
      // 获取列表数据的url
      listUrl: "/gov/api/asset/netdistrict/page",
      // 模块名
      moduleCode: "businessSys",
    };
  },
  watch: {
    form: {
      handler() {
        this.getTableData();
      },
      deep: true,
    },
  },
  created() {
    // this.initData();

    this.getTableData();
  },
  methods: {
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
        const { asideSelectModel, filterValue, moduleCode } = this;

        const result = await this.$request({
          url: this.aggCountUrl,
          method: "POST",
          data: {
            global: {},
            param: {
              moduleCode,

              aggCode: asideSelectModel,
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
      try {
        const { pageSize, pageNum } = this.tableData;
        const { form, orderField, orderType } = this;
        const { type, value } = form;
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
              [type]: value,
            },
          },
        });

        if (result) {
          const { data, total } = result;
          this.tableData.data = data;
          this.tableData.total = total;
        }
      } catch (e) {}
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
    toAdd() {
      this.addVisible = true;
      this.dialogType = "add";
      this.selectedId = null;
    },
    async uploadFileChange(file) {
      try {
        const formData = new FormData();

        formData.append("file", file.raw);
        const content = await this.$request({
          url: "/gov/api/common/upload",
          method: "POST",
          data: formData,
        });

        if (Array.isArray(content) && content[0]) {
          const { fileName } = content[0];

          this.toLeakIn([fileName]);
        }
      } catch (e) {}
    },
    async toLeakIn(fileNames) {
      try {
        await this.$request({
          url: "/gov/api/common/import",
          method: "POST",
          data: {
            fileNames,
            moduleCode: "netDistrict",
          },
        });

        this.$message.success("导入成功");

        this.getTableData();
      } catch (e) {}
    },
    toMultiDelete() {
      if (this.selectedIds.length === 0) {
        this.$message.warning("请选择需要删除的数据");
      } else {
        this.toDelete(this.selectedIds);
      }
    },
    toDelete(ids) {
      this.$confirm("确定删除所选数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        try {
          await this.$request({
            url: "/gov/api/asset/netdistrict/delete",
            method: "POST",
            data: {
              idList: ids,
            },
          });

          this.$message.success("删除成功");

          this.getTableData();
        } catch (e) {}
      });
    },
    toDetail(id) {
      this.addVisible = true;
      this.dialogType = "detail";
      this.selectedId = id;
    },
    toEdit(id) {
      this.addVisible = true;
      this.dialogType = "edit";
      this.selectedId = id;
    },
    afterClose() {
      this.addVisible = false;
      this.dialogType = null;
      this.selectedId = null;

      this.getTableData();
    },
    async toDownload() {
      this.$message.info("正在下载模板,请稍后...");
      try {
        const result = await this.$request(
          {
            url: "/gov/api/common/downloadTemp/netDistrict",
            method: "GET",
          },
          {
            responseType: "blob",
          }
        );

        downloadBlob(result);
      } catch (e) {}
    },
  },
};
</script>

<style lang="postcss">
.network-manage-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  .network-manage-box {
    padding: 10px 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header-box {
      margin-top: 10px;
      .flex-sb-box {
        width: 100%;
      }

      .header-title {
        font-size: var(--font-size-16);
        color: #5e6b7a;
        font-weight: bold;
        line-height: 1;
        flex: 1;
        height: 16px;
        margin-bottom: 20px;
      }

      .page-header {
        padding: 0;
      }

      .filter-items {
        display: flex;

        .filter-items-btn {
          margin-left: 10px;
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
          left: -20px;
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
