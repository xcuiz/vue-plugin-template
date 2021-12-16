<template>
  <div class="event-classify-container">
    <div class="event-classify-box">
      <div class="event-classify-header">
        <div class="header-title">敏感分类管理</div>
      </div>
      <div class="event-classify-filter-box">
        <!-- 筛选条件 -->
        <myFilter
          :init-value.sync="form.value"
          :init-type.sync="form.type"
          :filter-options="filterOptions"
        >
          <template slot="left">
            <div class="filter-items">
              <el-button size="mini" type="primary" @click="toAdd">
                +新增分类
              </el-button>
              <div style="margin-left: 10px; display: inline-block">
                <el-select
                  v-model="operateModel"
                  size="mini"
                  placeholder="操作"
                  style="width: 100px"
                >
                  <el-option
                    value="delete"
                    label="删除"
                    @click.native="operateChange('delete')"
                  ></el-option>
                </el-select>
              </div>
            </div>
          </template>
        </myFilter>
      </div>
      <div class="toggle-icon" @click="toggleAside">
        <i
          :class="[
            toggleActive ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left',
          ]"
        ></i>
      </div>
      <div class="event-classify-content">
        <div class="event-classify-agg" :class="{ active: toggleActive }">
          <div class="aside-box">
            <div v-loading="asideLoading" class="aside-box-list">
              <div
                v-for="(item, index) of asideFilterList"
                :key="item.name"
                class="filter-item"
                :class="{
                  active: currentAgg === item.classLevel,
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
        <div class="event-classify-table">
          <el-table
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
            :default-sort="{ prop: 'updateTime', order: 'descending' }"
            @sort-change="sortChange"
            @selection-change="selectionChange"
          >
            <el-table-column
              type="selection"
              width="55"
              :selectable="getSelectable"
            >
            </el-table-column>
            <el-table-column width="60px" align="center" label="#">
              <template slot-scope="scope">
                <span>{{
                  scope.$index +
                  1 +
                  (tableData.pageNum - 1) * tableData.pageSize
                }}</span>
              </template>
            </el-table-column>
            <el-table-column label="分类名称" show-overflow-tooltip prop="name">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="mini"
                  custom
                  class="link-type"
                  @click="toExamine(scope.row)"
                >
                  {{ scope.row.name || "-" }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column
              label="分类级别"
              show-overflow-tooltip
              prop="classLevelName"
            >
            </el-table-column>
            <el-table-column
              label="所属分类"
              show-overflow-tooltip
              prop="parentName"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.parentName || "-" }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="分类归属"
              show-overflow-tooltip
              prop="sensitiveFromName"
            >
            </el-table-column>
            <el-table-column
              label="操作人员"
              show-overflow-tooltip
              prop="createUser"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createUser }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="更新时间"
              show-overflow-tooltip
              sortable="custom"
              prop="updateTime"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime | formatterDate }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column
              label="启用开关"
              show-overflow-tooltip
              prop="enableStatus"
            >
              <template slot-scope="scope">
                <el-switch
                  :value="scope.row.enableStatus === 1"
                  @change="
                    () => statusChange([scope.row.id], scope.row.enableStatus)
                  "
                ></el-switch>
              </template>
            </el-table-column> -->
            <el-table-column label="操作" width="100">
              <template slot-scope="scope">
                <template v-if="scope.row.sensitiveFrom === 1">
                  <el-button
                    type="text"
                    custom
                    size="mini"
                    @click="toEdit(scope.row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="text"
                    custom
                    size="mini"
                    @click="toDeleteOne(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
                <template v-else-if="scope.row.sensitiveFrom === 2">
                  <el-button
                    type="text"
                    custom
                    size="mini"
                    @click="toExamine(scope.row)"
                  >
                    查看
                  </el-button>
                </template>
              </template>
            </el-table-column>
          </el-table>
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
    <Dialog
      v-if="detailDialog.visible"
      :visible.sync="detailDialog.visible"
      :type.sync="detailDialog.type"
      :select-id="detailDialog.selectId"
      @update-list="getList"
    />
  </div>
</template>

<script>
import dayjs from "dayjs";
import Dialog from "./dialog.vue";
import MyFilter from "@/fusion-components/Filter";
export default {
  name: "EventClassify",
  components: {
    MyFilter,
    Dialog,
  },
  filters: {
    formatterDate(val) {
      if (val) {
        return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
      }
      return "-";
    },
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
      operateModel: "",
      form: {
        type: "name",
        value: "",
      },
      filterOptions: [
        {
          value: "分类名称",
          key: "name",
          stype: "input",
        },
        {
          value: "分类归属",
          key: "sensitiveFroms",
          stype: "select",
          multiple: true,
          selOptions: [],
        },
      ],
      tableData: {
        data: [],
        total: 0,
        pageNum: 1,
        pageSize: 20,
      },
      orderField: "updateTime",
      orderType: "desc",
      ids: [],

      toggleActive: false,
      // 侧边栏的加载动画
      asideLoading: false,
      asideFilterList: [],
      currentAgg: "",

      // 查看详情弹窗
      detailDialog: {
        visible: false,
        // 当前选中的条目(详情)
        selectId: "",
        type: "newly",
      },
      tableLoading: false,
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
          classLevel: this.currentAgg,
          [this.form.type]: this.form.value,
        },
      };
    },
  },
  watch: {
    form: {
      handler(val) {
        this.filterChange(val);
      },
      deep: true,
    },
  },
  created() {
    this.getList();
    this.getSensitiveFrom();
  },
  methods: {
    getList() {
      this.getTableData();
      this.getAgg();
    },
    async getAgg() {
      this.asideLoading = true;
      const result = await this.$request({
        url: "/gov/api/strategy/sensitiveClassify/groupByClassLevel",
        method: "post",
        data: {
          [this.form.type]: this.form.value,
        },
      });

      this.asideFilterList = result;
      this.asideLoading = false;
    },
    async getTableData() {
      const result = await this.$request({
        url: "/gov/api/strategy/sensitiveClassify/page",
        method: "POST",
        data: this.filterFormData,
      });

      if (result) {
        const { total, data } = result;
        this.tableData.total = total;
        this.tableData.data = data;
      }
      this.tableLoading = false;
    },
    pageNumChange({ pageNum }) {
      this.tableData.pageNum = pageNum;

      this.getTableData();
    },
    pageSizeChange({ pageSize }) {
      this.tableData.pageSize = pageSize;

      this.getTableData();
    },
    sortChange({ prop, order }) {
      this.orderField = prop || "updateTime";
      this.orderType = order === "descending" ? "desc" : "asc";

      this.getTableData();
    },
    selectionChange(selected) {
      this.ids = selected.map(({ id }) => id);
    },
    getSelectable(row) {
      return row.sensitiveFrom !== 2;
    },
    toDeleteOne(selectedOne) {
      this.ids = [selectedOne.id];
      this.toDelete();
    },
    toAdd() {
      this.detailDialog = {
        visible: true,
        selectId: "",
        type: "newly",
      };
    },
    toEdit({ id }) {
      this.detailDialog = {
        visible: true,
        selectId: id,
        type: "edit",
      };
    },
    toExamine({ id }) {
      this.detailDialog = {
        visible: true,
        selectId: id,
        type: "examine",
      };
    },
    toDelete() {
      if (this.ids.length === 0) {
        this.$message({
          type: "warn",
          message: "请选择需要删除的数据",
        });

        return;
      }

      this.$confirm("选中的数据将被删除,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$request({
              url: "/gov/api/strategy/sensitiveClassify/delete",
              method: "POST",
              data: {
                ids: this.ids,
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
            message: "已取消删除 ",
          });
        });
    },
    filterChange() {
      this.tableData.pageNum = 1;
      this.currentAgg = "";
      this.getList();
    },
    async statusChange(ids, status) {
      await this.$request({
        url: "/gov/api/sys/dictionary/event/enable",
        method: "POST",
        data: {
          idList: ids,
          enableStatus: status === 1 ? 0 : 1,
        },
      });

      this.getTableData();
    },
    aggChange(item) {
      if (item.num === 0) {
        return;
      }

      this.tableData.pageNum = 1;

      this.currentAgg = item.classLevel;

      this.getTableData();
    },
    operateChange(val) {
      if (val === "delete") {
        // 批量删除
        this.toDelete();
      }
    },
    toggleAside() {
      this.toggleActive = !this.toggleActive;
    },
    getSensitiveFrom() {
      this.$request({
        method: "get",
        url: "/gov/api/strategy/common/getSensitiveFrom",
      }).then((res) => {
        this.filterOptions[1].selOptions = res.map((item) => ({
          key: item.code,
          value: item.name,
        }));
      });
    },
  },
};
</script>

<style lang="postcss">
.event-classify-container {
  height: 100%;
  .event-classify-box {
    padding: 10px 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .event-classify-header {
      .header-title {
        padding-top: 10px;
        padding-bottom: 20px;
        font-size: var(--font-size-16);
        font-weight: bold;
        line-height: 1;
      }
    }
  }

  .toggle-icon {
    position: absolute;
    left: 5px;
    top: 105px;
    width: 20px;
    height: 23px;
    line-height: 23px;
    border-radius: 2px;
    text-align: center;
    box-shadow: 0 0 2px rgba(120, 120, 120, 0.5);
    border-left: none;
    cursor: pointer;
    background-color: #fff;
    z-index: 5;
    .iconfont {
      font-size: var(--font-size-12);
    }
  }

  .event-classify-content {
    display: flex;
    flex: 1;
    overflow: hidden;
    .event-classify-agg {
      flex-shrink: 0;
      width: 234px;
      transition: width 300ms ease;
      overflow: hidden;
      margin-right: 10px;
      position: relative;

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
        position: relative;

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

    .event-classify-table {
      flex: 1;
      overflow: auto;
    }
  }

  .pagination-box {
    margin-top: 10px;

    .el-input--mini {
      .el-input__icon {
        line-height: 22px;
      }
    }
  }
}
</style>
