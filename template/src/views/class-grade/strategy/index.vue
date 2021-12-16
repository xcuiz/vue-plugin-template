<template>
  <div class="event-classify-container">
    <div class="event-classify-box">
      <div class="event-classify-header">
        <div class="header-title">敏感策略管理</div>
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
                +新增
              </el-button>
              <el-button size="mini" @click="handleStatus(1)">启用</el-button>
              <el-button size="mini" @click="handleStatus(0)">停用</el-button>
              <el-button size="mini" @click="operateChange('delete')">
                删除
              </el-button>
            </div>
          </template>
        </myFilter>
      </div>
      <div>
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
            width="42"
            :selectable="getSelectable"
          >
          </el-table-column>
          <el-table-column width="30" align="center" label="#">
            <template slot-scope="scope">
              <span>{{
                scope.$index + 1 + (tableData.pageNum - 1) * tableData.pageSize
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="策略名称" show-overflow-tooltip prop="name">
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
            label="适用范围"
            show-overflow-tooltip
            prop="rangeAreaName"
            width="76"
          >
          </el-table-column>
          <el-table-column
            label="所属分类"
            show-overflow-tooltip
            prop="classifyName"
          >
          </el-table-column>
          <el-table-column
            label="所属分级"
            show-overflow-tooltip
            prop="gradeName"
          >
          </el-table-column>
          <el-table-column
            label="元素组合方式"
            show-overflow-tooltip
            prop="elmgroupTypeName"
            width="105"
          >
          </el-table-column>
          <el-table-column
            label="敏感元素(可选)"
            show-overflow-tooltip
            prop="listSensitiveElementChoosableNames"
          >
          </el-table-column>
          <el-table-column
            label="敏感元素(必选)"
            show-overflow-tooltip
            prop="listSensitiveElementRequiredNames"
          >
          </el-table-column>
          <el-table-column
            label="策略归属"
            show-overflow-tooltip
            prop="sensitiveFromName"
            width="76"
          >
          </el-table-column>
          <el-table-column
            label="启用开关"
            show-overflow-tooltip
            prop="status"
            width="76"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                :disabled="scope.row.sensitiveFrom === 2"
                :active-value="0"
                :inactive-value="1"
                @change="(value) => statusChange([scope.row.id], value)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作人员"
            show-overflow-tooltip
            prop="createUser"
            width="78"
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
              <span>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="88">
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
import Dialog from "./dialog.vue";
import MyFilter from "@/fusion-components/Filter";
export default {
  name: "EventClassify",
  components: {
    MyFilter,
    Dialog,
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
          value: "名称",
          key: "name",
          stype: "input",
        },
        {
          value: "适用范围",
          key: "rangeAreas",
          stype: "select",
          multiple: true,
          selOptions: [
            {
              key: 1,
              value: "通用",
            },
            {
              key: 2,
              value: "非结构化",
            },
            {
              key: 3,
              value: "结构化",
            },
          ],
        },
        {
          value: "策略归属",
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
    },
    async getTableData() {
      this.tableLoading = true;
      const result = await this.$request({
        url: "/gov/api/strategy/sensitiveConfig/page",
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
              url: "/gov/api/strategy/sensitiveConfig/delete",
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
      this.getList();
    },
    async statusChange(ids, status) {
      await this.$request({
        url: "/gov/api/strategy/sensitiveConfig/changeStatus",
        method: "POST",
        data: {
          ids,
          status,
        },
      });

      this.getTableData();
    },
    operateChange(val) {
      if (val === "delete") {
        // 批量删除
        this.toDelete();
      }
    },
    handleStatus(status) {
      const statusText = {
        0: "禁用",
        1: "启用",
      }[status];
      if (this.ids.length === 0) {
        this.$message({
          type: "warn",
          message: `请选择需要${statusText}的策略`,
        });

        return;
      }
      this.$confirm(`选中的策略将被${statusText},是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.statusChange(this.ids, status);
        })
        .catch(() => {});
    },
    getSensitiveFrom() {
      this.$request({
        method: "get",
        url: "/gov/api/strategy/common/getSensitiveFrom",
      }).then((res) => {
        this.filterOptions[2].selOptions = res.map((item) => ({
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
  .event-classify-box {
    padding: 10px 15px;

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
