<template>
  <div class="sensitive-template-container">
    <div class="sensitive-template-box">
      <div class="header-box">
        <PageHeader title="特征模板"> </PageHeader>
        <div class="flex-sb-box">
          <!-- <FilterBar v-model="filterValue" :fields="filterFields" />
            <div class="filter-items">
              <div>
                <el-button size="mini" type="primary" @click="toAdd">
                  添加特征模板
                </el-button>
              </div>
            </div> -->
          <HeaderFilter
            :init-value.sync="form.value"
            :init-type.sync="form.type"
            :filter-options="filterOptions"
          >
            <template slot="left">
              <div class="filter-items">
                <div>
                  <el-button size="mini" type="primary" @click="toAdd">
                    添加特征模板
                  </el-button>
                </div>
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
          <el-table-column type="index" width="80" label="序号" />
          <el-table-column
            label="模板名称"
            show-overflow-tooltip
            prop="templateName"
          >
            <template slot-scope="scope">
              {{ scope.row.templateName || "-" }}
            </template>
          </el-table-column>
          <el-table-column label="模板标识" show-overflow-tooltip prop="code">
            <template slot-scope="scope">
              {{ scope.row.code || "-" }}
            </template>
          </el-table-column>
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
              <el-button type="text" size="mini" @click="toDelete(scope.row.id)"
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
      <new-sensitive-template
        v-if="addVisible"
        :selected-id="selectedId"
        :visible.sync="addVisible"
        :type="type"
        @after-close="afterClose"
      ></new-sensitive-template>
    </div>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import HeaderFilter from "@/components/Filter/index.vue";
import NewSensitiveTemplate from "./NewSensitiveTemplate.vue";
export default {
  name: "SensitiveFeat",
  components: {
    PageHeader,
    HeaderFilter,
    NewSensitiveTemplate,
  },
  data() {
    return {
      filterValue: {},
      filterFields: [],

      filterOptions: [
        {
          value: "特征名称",
          key: "templateName",
          stype: "input",
        },
        {
          value: "特征标识",
          key: "code",
          stype: "input",
        },
      ],
      form: {
        type: "templateName",
        value: "",
      },

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
      const { orderType, orderField, pageSize, pageNum } = this.tableData;
      const { type, value } = this.form;

      const param = {};
      param[type] = value;
      try {
        const result = await this.$request({
          url: "/gov/api/strategy/feature/template/page",
          method: "POST",
          data: {
            global: {
              orderType,
              orderField,
              pageSize,
              pageNum,
            },
            param,
          },
        });

        if (result) {
          const { data, total } = result;
          this.tableData.data = data;
          this.tableData.total = total;
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
      this.addVisible = true;
      this.selectedId = id;
      this.type = "edit";
    },
    toDetail(id) {
      this.type = "detail";

      this.addVisible = true;
      this.selectedId = id;
    },
    toDelete(id) {
      this.$confirm("确定删除所选数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$request({
              url: `/gov/api/strategy/feature/template/delete/${id}`,
              method: "GET",
            });

            this.$message({
              type: "success",
              message: "删除成功!",
            });

            this.getList();
          } catch (e) {
            //
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
    afterClose() {
      this.addVisible = false;
      this.getList();
    },
  },
};
</script>

<style lang="postcss">
.sensitive-template-container {
  height: 100%;
  &.hidden {
    overflow: hidden;
  }
  .sensitive-template-box {
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
