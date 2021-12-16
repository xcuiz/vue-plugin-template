<template>
  <div class="sensitive-feat-container">
    <div class="sensitive-feat-box">
      <div class="header-box">
        <PageHeader title="敏感特征"> </PageHeader>
        <div class="flex-sb-box">
          <!-- <FilterBar v-model="filterValue" :fields="filterFields" /> -->
          <HeaderFilter
            :init-value.sync="form.value"
            :init-type.sync="form.type"
            :filter-options="filterOptions"
          >
            <template slot="left">
              <div class="filter-items">
                <div>
                  <el-button size="mini" type="primary" @click="toAdd">
                    添加特征
                  </el-button>
                </div>
                <!-- <div style="margin-left: 10px">
                  <el-button size="mini" type="primary">特征导入</el-button>
                </div>
                <div style="margin-left: 10px">
                  <el-button size="mini" class="operate-button">
                    特征同步
                  </el-button>
                </div> -->
              </div>
            </template>
          </HeaderFilter>
        </div>
      </div>
      <div class="content-box">
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
          :default-sort="{
            prop: tableData.orderField,
            order: tableData.orderType === 'desc' ? 'descending' : 'asc',
          }"
          @sort-change="handleSortChange"
        >
          <el-table-column width="60" label="序号">
            <template slot-scope="scope">
              {{
                (tableData.pageNum - 1) * tableData.pageSize + scope.$index + 1
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="特征名称"
            show-overflow-tooltip
            prop="featureName"
          >
            <template slot-scope="scope">
              {{ scope.row.featureName || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="特征标识" show-overflow-tooltip prop="code">
            <template slot-scope="scope">
              {{ scope.row.code || "-" }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="特征类型" show-overflow-tooltip prop="type">
            <template slot-scope="scope">
              {{ scope.row.type || "-" }}
            </template>
          </el-table-column> -->
          <el-table-column
            label="创建人"
            show-overflow-tooltip
            prop="createUser"
          >
            <template slot-scope="scope">
              {{ scope.row.createUser || "-" }}
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            show-overflow-tooltip
            prop="createTime"
            width="160"
            sortable="custom"
          >
            <template slot-scope="scope">
              {{ scope.row.createTime || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="toEdit(scope.row.id)"
                >编辑</el-button
              >
              <el-button type="text" size="mini" @click="toDetail(scope.row.id)"
                >查看</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="toDelete([scope.row.id])"
                >删除</el-button
              >
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
    <div class="dialog-box">
      <new-sensitive-feat
        v-if="addVisible"
        :selected-id="selectedId"
        :visible.sync="addVisible"
        :type="type"
        @after-save="afterSave"
      ></new-sensitive-feat>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import HeaderFilter from "@/components/Filter/index.vue";
import NewSensitiveFeat from "./NewSensitiveFeat.vue";

export default {
  name: "SensitiveFeat",
  components: {
    PageHeader,
    HeaderFilter,
    NewSensitiveFeat,
  },
  data() {
    return {
      filterValue: {},
      filterFields: [],

      addVisible: false,
      selectedId: null,

      type: "",

      tableData: {
        total: 0,
        data: [],
        pageSize: 20,
        pageNum: 1,
        orderType: "desc",
        orderField: "createTime",
      },

      filterOptions: [
        {
          value: "特征名称",
          key: "featureName",
          stype: "input",
        },
        {
          value: "特征标识",
          key: "code",
          stype: "input",
        },
      ],
      form: {
        type: "featureName",
        value: "",
      },
    };
  },
  watch: {
    form: {
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
    async getList() {
      try {
        const { pageSize, pageNum, orderType, orderField } = this.tableData;
        const { type, value } = this.form;

        const param = {};
        param[type] = value;

        const result = await this.$request({
          url: "/gov/api/strategy/feature/page",
          method: "POST",
          data: {
            global: {
              pageSize,
              pageNum,
              orderType,
              orderField,
            },
            // { featureName: "", code: "" }
            param,
          },
        });

        if (result) {
          const { total, data } = result;

          this.tableData.total = total;
          this.tableData.data = data;
        }
      } catch (e) {
        //
      }
    },
    toAdd() {
      this.addVisible = true;
      this.selectedId = null;

      this.type = "add";
    },
    toEdit(id) {
      this.type = "edit";
      this.addVisible = true;
      this.selectedId = id;
    },
    toDetail(id) {
      this.type = "detail";
      this.selectedId = id;
      this.addVisible = true;
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
              url: "/gov/api/strategy/feature/delete",
              method: "POST",
              data: {
                idList: ids,
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
    afterSave() {
      this.addVisible = false;
      this.selectedId = null;
      this.getList();
    },
    pageNumChange({ pageNum }) {
      this.tableData.pageNum = pageNum;

      this.getList();
    },
    // 页的大小改变
    pageSizeChange({ pageSize }) {
      this.tableData.pageSize = pageSize;

      this.getList();
    },
    handleSortChange({ prop, order }) {
      this.tableData.orderField = prop;
      this.tableData.orderType = order === "descending" ? "desc" : "asc";
      this.getList();
    },
  },
};
</script>

<style lang="postcss">
.sensitive-feat-container {
  height: 100%;
  &.hidden {
    overflow: hidden;
  }
  .sensitive-feat-box {
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
      .pagination-box {
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
</style>
