<template>
  <div class="app-monitor-container" :class="{ hidden: detailVisible }">
    <div class="app-monitor-box">
      <div class="header-box">
        <PageHeader title="APP合规检查"> </PageHeader>
        <div class="flex-sb-box">
          <FilterBar
            v-model="filterValue"
            :fields="filterFields"
            module-code="app-monitor"
          />
          <div class="filter-items">
            <div>
              <el-button size="mini" type="primary" @click="toAdd">
                + 新建
              </el-button>
            </div>
            <div style="margin-left: 10px">
              <el-button
                size="mini"
                plain
                type="primary"
                @click="toMultipleScan"
                >重新扫描</el-button
              >
            </div>
            <div style="margin-left: 10px">
              <el-button
                size="mini"
                plain
                class="operate-button"
                @click="toMultipleDelete"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="content-box">
        <div class="toggle-icon" @click="toggleAside">
          <i
            :class="[
              toggleActive ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left',
            ]"
          ></i>
        </div>
        <div class="slide-agg" :class="{ active: toggleActive }">
          <div class="aside-box">
            <div v-loading="asideLoading" class="aside-box-list">
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
              <div
                v-for="(item, index) of asideFilterList"
                :key="item.code"
                class="filter-item"
                :class="{
                  active: currentAgg === item.code,
                  disabled: item.num === 0,
                }"
                @click="aggChange(item, index)"
              >
                <div class="item-left">{{ item.name }}</div>
                <div class="item-right">{{ item.num | thousand }}</div>
              </div>
            </div>
            <!-- <div class="aside-box-empty" v-show="asideFilterList.length === 0">
            暂无数据
          </div> -->
          </div>
        </div>
        <div class="table-box">
          <el-table
            :data="tableData.data"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            max-height="700"
            size="mini"
            stripe
            fit
            highlight-current-row
            style="width: 100%"
            @selection-change="selectionChange"
            @sort-change="sortChange"
          >
            <el-table-column type="selection" width="45" />
            <el-table-column width="60" label="序号">
              <template slot-scope="scope">
                {{
                  (tableData.pageNum - 1) * tableData.pageSize +
                  scope.$index +
                  1
                }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('name')"
              label="任务名称"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  @click="toDetail(scope.row.id)"
                  >{{ scope.row.name || "-" }}</el-button
                >
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('appName')"
              label="APP名称"
              show-overflow-tooltip
              prop="appName"
            >
              <template slot-scope="scope">
                {{ scope.row.appName || "-" }}
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="归属业务系统"
              show-overflow-tooltip
              prop="businessName"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.businessName || "-" }}
              </template>
            </el-table-column> -->
            <el-table-column
              v-if="showCol('dept')"
              label="归属部门"
              show-overflow-tooltip
              prop="dept"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.dept || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('probeName')"
              label="检测探针"
              show-overflow-tooltip
              prop="probeName"
              sortable="custom"
              min-width="110"
            >
              <template slot-scope="scope">
                {{ scope.row.probeName || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('executeStatus')"
              label="执行状态"
              show-overflow-tooltip
              prop="executeStatus"
              sortable="custom"
              min-width="110"
            >
              <template slot-scope="scope">
                {{ scope.row.executeStatus | statusFormatter }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('startTime')"
              label="开始时间"
              show-overflow-tooltip
              prop="startTime"
              sortable="custom"
              width="160"
            >
              <template slot-scope="scope">
                {{ scope.row.startTime | dateFormatter }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('endTime')"
              label="结束时间"
              show-overflow-tooltip
              prop="endTime"
              sortable="custom"
              width="160"
            >
              <template slot-scope="scope">
                {{ scope.row.endTime | dateFormatter }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('runProcess')"
              label="进度"
              show-overflow-tooltip
              prop="runProcess"
              sortable="custom"
              width="140"
            >
              <template slot-scope="scope">
                <el-progress
                  :percentage="stringToNumber(scope.row.runProcess)"
                ></el-progress>
              </template>
            </el-table-column>
            <el-table-column label="操作" :width="operateCellWidth">
              <template slot-scope="scope">
                <div class="operate-btn">
                  <el-button
                    v-show="btnsVisible('delete', scope.row.executeStatus)"
                    type="text"
                    size="mini"
                    @click="toDelete([scope.row.id])"
                    >删除
                  </el-button>
                  <el-button
                    v-show="btnsVisible('rescan', scope.row.executeStatus)"
                    type="text"
                    size="mini"
                    @click="toScan([scope.row.id])"
                    >重新扫描
                  </el-button>
                  <el-button
                    v-show="btnsVisible('download', scope.row.executeStatus)"
                    type="text"
                    size="mini"
                    @click="toDownload(scope.row)"
                    >下载
                  </el-button>
                  <el-button
                    v-show="btnsVisible('edit', scope.row.executeStatus)"
                    type="text"
                    size="mini"
                    @click="toEditDetail(scope.row.id)"
                    >编辑
                  </el-button>
                  <el-button
                    v-show="btnsVisible('stop', scope.row.executeStatus)"
                    type="text"
                    size="mini"
                    @click="toStop(scope.row)"
                    >停止
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <ColumnsSelect v-model="columns" />

          <div class="pagination-box">
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
    <div class="dialog-box">
      <new-monitor
        v-if="addVisible"
        :selected-id="editDetailId"
        :visible.sync="addVisible"
        @after-close="afterAddClose"
      />
    </div>
    <!-- <monitor-detail v-if="detailVisible" :selected-id="detailId" /> -->
  </div>
</template>

<script>
/* eslint-disable no-empty */
import Day from "dayjs";
import PageHeader from "@/components/PageHeader";
import FilterBar from "@/components/filter-bar";
import ColumnsSelect from "@/components/columns-select";
import NewMonitor from "./NewMonitor.vue";

const map = {
  delete: [1, 4, 5, 6],
  rescan: [4, 5, 6],
  download: [4],
  edit: [1, 4, 5, 6],
  stop: [2],
};

export default {
  name: "AppMonitor",
  components: {
    FilterBar,
    PageHeader,
    NewMonitor,
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
    dateFormatter(val) {
      if (val) {
        return Day(val).format("YYYY-MM-DD HH:mm:ss");
      }

      return "-";
    },
    statusFormatter(val) {
      if (val) {
        const statusMap = {
          1: "待执行",
          2: "执行中",
          3: "暂停",
          4: "扫描完成",
          5: "停止",
          6: "任务结束",
        };
        return statusMap[val];
      }

      return "-";
    },
  },
  data() {
    return {
      addVisible: false,
      editDetailId: null,

      detailVisible: false,
      detailId: null,

      filterValue: {},
      filterFields: [],
      selectedIds: [],
      toggleActive: false,
      asideLoading: false,
      asideFilterList: [],
      currentAgg: null,
      tableData: {
        total: 0,
        data: [],
        pageSize: 10,
        pageNum: 1,
        orderType: "desc",
        orderField: "start_time",
      },
      asideSelectModel: "",
      asideSelectList: [],

      columns: [
        {
          code: "name",
          name: "任务名称",
          checked: true,
          disabled: true,
        },
        {
          code: "appName",
          name: "APP名称",
          checked: true,
          disabled: true,
        },
        {
          code: "dept",
          name: "归属部门",
          checked: true,
          disabled: false,
        },
        {
          code: "probeName",
          name: "检测探针",
          checked: true,
          disabled: true,
        },
        {
          code: "executeStatus",
          name: "执行状态",
          checked: true,
          disabled: false,
        },
        {
          code: "startTime",
          name: "开始时间",
          checked: true,
          disabled: false,
        },
        {
          code: "endTime",
          name: "结束时间",
          checked: true,
          disabled: false,
        },
        {
          code: "runProcess",
          name: "进度",
          checked: true,
          disabled: false,
        },
      ],
    };
  },
  computed: {
    operateCellWidth() {
      const { data } = this.tableData;

      if (Array.isArray(data) && data.length > 0) {
        let count = 0;
        data.forEach(({ executeStatus }) => {
          let currentCount = 0;
          for (let key in map) {
            if (map[key].includes(executeStatus)) {
              currentCount++;
            }
          }

          if (currentCount > count) {
            count = currentCount;
          }
        });

        return 50 * count;
      }

      return 100;
    },
  },
  watch: {
    filterValue: {
      async handler() {
        await this.getAgg();
        this.getTableData();
      },
      deep: true,
    },
  },
  created() {
    this.initFilter();
    this.initAgg();
    this.getList();
  },
  methods: {
    showCol(code) {
      return _.find(this.columns, { code })?.checked;
    },
    getList() {
      this.getTableData();
    },
    async initFilter() {
      // 此处需要等待筛选条件获取到
      await this.getFilterFields();
      this.getFilterOption();
    },
    async initAgg() {
      await this.getAggSelect();
      this.getAgg();
    },
    async getTableData() {
      const { pageNum, pageSize, orderType, orderField } = this.tableData;
      const { filterValue, asideSelectModel, currentAgg } = this;

      try {
        const param = {
          ...filterValue,
        };

        if (currentAgg) {
          param.aggCode = asideSelectModel;
          param.aggValue = currentAgg;
        }

        const result = await this.$request({
          url: "/gov/api/app/job/page",
          method: "POST",
          data: {
            global: {
              pageNum,
              pageSize,
              orderType,
              orderField,
            },
            param,
          },
        });

        if (result) {
          const { total, data } = result;

          this.tableData.total = total;

          if (Array.isArray(data)) {
            this.tableData.data = data;
          }
        }
      } catch (e) {}
    },
    async getFilterFields() {
      try {
        const result = await this.$request({
          url: "/gov/api/common/page/filter/appJob",
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
    async getFilterOption() {
      const { filterFields } = this;

      if (filterFields.length > 0) {
        filterFields.forEach(({ children }, outerIndex) => {
          if (Array.isArray(children)) {
            children.forEach(async ({ code }, innerIndex) => {
              try {
                const result = await this.$request({
                  url: `/gov/api/common/filter/value/appJob/${code}`,
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
    async getAgg() {
      const { asideSelectModel, filterValue } = this;

      this.asideLoading = true;
      try {
        const result = await this.$request({
          url: `/gov/api/app/job/agg/${asideSelectModel}`,
          method: "POST",
          data: {
            global: {},
            param: {
              ...filterValue,
            },
          },
        });

        if (result) {
          const { allConditon } = result;

          if (Array.isArray(allConditon)) {
            const asideFilterList = [];

            let totalNum = 0;
            let totalName = "";

            if (Array.isArray(allConditon)) {
              allConditon.forEach(({ cnt, name, value }) => {
                asideFilterList.push({
                  code: value,
                  name,
                  num: cnt,
                });

                totalNum += cnt;
              });
            }

            this.asideSelectList.forEach(({ children }) => {
              if (Array.isArray(children)) {
                children.forEach(({ code, name }) => {
                  if (code === asideSelectModel) {
                    totalName = name;
                  }
                });
              }
            });

            asideFilterList.unshift({
              code: null,
              name: totalName,
              num: totalNum,
            });

            this.currentAgg = null;
            this.asideFilterList = asideFilterList;
          }
        }
      } catch (e) {
      } finally {
        this.asideLoading = false;
      }
    },
    async getAggSelect() {
      try {
        const result = await this.$request({
          url: "/gov/api/common/agg/filter/appJob",
          method: "GET",
        });

        if (Array.isArray(result)) {
          this.asideSelectList = result;

          // 设置默认值
          this.asideSelectModel = result?.[0]?.children?.[0]?.code;
        }
      } catch (e) {}
    },
    afterAddClose(isAfterSave) {
      this.addVisible = false;
      this.editDetailId = null;
      if (isAfterSave) {
        this.getList();
      }
    },
    stringToNumber(val) {
      if (typeof val === "string" && val) {
        return parseFloat(val);
      }

      return val;
    },
    toEditDetail(id) {
      this.editDetailId = id;
      this.addVisible = true;
    },
    toDetail(id) {
      this.$router.push(`/compliance/app-monitor-detail?id=${id}`);
      // this.detailId = id;
      // this.detailVisible = true;
    },
    toAdd() {
      this.addVisible = true;
    },
    toMultipleScan() {
      if (this.selectedIds.length === 0) {
        this.$message({
          type: "warn",
          message: "请选择需要扫描的数据",
        });

        return;
      }
      this.toScan(this.selectedIds);
    },
    toScan(ids) {
      this.$confirm("选中的数据将被重新扫描,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$request({
              url: "/gov/api/app/job/rescan",
              method: "POST",
              data: {
                jobIds: ids,
              },
            });
            this.$message.success("重新扫描成功");

            this.getList();
          } catch (e) {
            // this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已重新扫描",
          });
        });
    },
    async toDownload({ id, name }) {
      try {
        const { data } = await this.$request(
          {
            url: `/gov/api/app/job/report/download/${id}`,
            method: "GET",
          },
          {
            responseType: "blob",
          }
        );

        if (data) {
          const blob = new Blob([data], {
            type: "application/pdf",
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `${name}.pdf`;
          link.click();
          // 释放内存
          window.URL.revokeObjectURL(link.href);
        }
      } catch (e) {
        // this.$message.error("下载失败");
      }
    },
    toMultipleDelete() {
      if (this.selectedIds.length === 0) {
        this.$message({
          type: "warn",
          message: "请选择需要删除的数据",
        });

        return;
      }

      this.toDelete(this.selectedIds);
    },
    toDelete(ids) {
      this.$confirm("选中的数据将被删除,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$request({
              url: "/gov/api/app/job/delete",
              method: "POST",
              data: {
                jobIds: ids,
              },
            });
            this.$message.success("删除成功");

            this.getList();
          } catch (e) {
            // this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async toStop({ id, taskId }) {
      try {
        await this.$request({
          url: "/gov/api/app/job/stop",
          method: "POST",
          data: {
            jobId: id,
            taskId,
          },
        });

        this.$message.success("停止成功");

        this.getList();
      } catch (e) {}
    },
    aggChange(item) {
      if (item.num === 0) {
        return;
      }

      this.tableData.pageNum = 1;

      this.currentAgg = item.code;

      this.getTableData();
    },
    selectionChange(selected) {
      this.selectedIds = selected.map(({ id }) => id);
    },
    sortChange({ prop, order }) {
      this.tableData.orderField = prop || "start_time";
      this.tableData.orderType = order === "descending" ? "desc" : "asc";

      this.getTableData();
    },
    // 当前页改变
    pageNumChange({ pageNum }) {
      this.tableData.pageNum = pageNum;

      this.getTableData();
    },
    // 页的大小改变
    pageSizeChange({ pageSize }) {
      this.tableData.pageSize = pageSize;

      this.getTableData();
    },
    asideSelectChange() {
      this.currentAgg = null;
      this.getAgg();
    },
    btnsVisible(btnType, status) {
      return map[btnType].includes(status);
    },
    toggleAside() {
      this.toggleActive = !this.toggleActive;
    },
  },
};
</script>

<style lang="postcss">
.app-monitor-container {
  height: 100%;
  &.hidden {
    overflow: hidden;
  }
  .app-monitor-box {
    padding: 10px 15px;
    display: flex;
    height: 100%;
    flex-direction: column;

    .header-box {
      .flex-sb-box {
        display: flex;
        width: 100%;
        justify-content: space-between;

        .filter-items {
          display: flex;
        }
      }
    }

    .content-box {
      flex: 1;
      display: flex;
      position: relative;

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

      .slide-agg {
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
          overflow: auto;

          &::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }

          /*滚动条滑块*/

          &::-webkit-scrollbar-thumb {
            /*滚动条里面小方块*/
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.2);
          }

          /*滚动条轨道*/

          &::-webkit-scrollbar-track {
            /*滚动条里面轨道*/
            background: transparent;
          }

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

              &.disabled {
                color: #a6acb2;
              }

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
            }
          }

          .aside-box-empty {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #999;
            height: 100%;
          }
        }
      }

      .table-box {
        flex: 1;
        overflow: hidden;

        .operate-btn {
          .el-button {
            margin-left: 0;
            margin-right: 10px;
          }
        }

        .pagination-box {
          margin: 10px 0;

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
</style>
