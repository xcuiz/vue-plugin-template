<template>
  <div class="container">
    <div class="content">
      <h4 class="idss-font--title idss-container-header">账号</h4>
      <el-row>
        <!-- 筛选条件 -->
        <myFilter
          :init-value.sync="form.value"
          :init-type.sync="form.type"
          :filter-options="filterOptions"
        >
          <template slot="left">
            <div class="filter-items">
              <el-button size="mini" type="primary" @click="addAccount">
                +新增账号
              </el-button>

              <div style="margin-left: 10px; margin-right: 10px">
                <el-upload
                  :headers="myHeaders"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload"
                  action="/gov/api/base/common/fileUpload"
                  :show-file-list="false"
                >
                  <el-button
                    size="mini"
                    plain
                    type="primary"
                    class="operate-button"
                  >
                    导入
                  </el-button>
                </el-upload>
              </div>

              <el-button
                size="mini"
                class="operate-button"
                plain
                type="primary"
                @click="reqRownload"
              >
                导出
              </el-button>

              <div style="margin-left: 10px">
                <el-button
                  size="mini"
                  plain
                  class="operate-button"
                  @click="handleDelete"
                >
                  删除
                </el-button>
              </div>
            </div>
          </template>
        </myFilter>
        <!-- 列表 -->
        <el-table
          v-loading="loading['getData']"
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
          @selection-change="handleSelectionChange"
          @sort-change="abnormalDataChange"
        >
          <el-table-column type="selection" width="45" />
          <el-table-column width="60px" align="center" label="#">
            <template slot-scope="scope">
              <span>{{
                scope.$index + 1 + (tableData.pageNum - 1) * tableData.pageSize
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleEditClick(scope.row)"
              >
                {{ scope.row.userName | formateTableData }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="全称" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.realName | formateTableData }}
            </template>
          </el-table-column>
          <el-table-column label="手机号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.mobile | formateTableData }}
            </template>
          </el-table-column>
          <el-table-column label="电子邮箱" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.email | formateTableData }}
            </template>
          </el-table-column>
          <el-table-column label="用户状态" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.status | filterStatus }}
            </template>
          </el-table-column>
          <el-table-column label="所属角色" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.roleName | formateTableData }}
            </template>
          </el-table-column>
          <el-table-column label="所属组织" show-overflow-tooltip>
            <template slot-scope="scope">
              {{ scope.row.deptName | formateTableData }}
            </template>
          </el-table-column>
          <!--          <el-table-column-->
          <!--            label="操作"-->
          <!--            width="100">-->
          <!--            <template slot-scope="scope">-->
          <!--              <el-button-->
          <!--                @click="handleEditClick(scope.row)"-->
          <!--                type="text"-->
          <!--                custom-->
          <!--                size="mini">-->
          <!--                编辑-->
          <!--              </el-button>-->
          <!--              <span >|</span>-->
          <!--              <el-button-->
          <!--                @click="handleDeleteCurrent(scope.row)"-->
          <!--                type="text"-->
          <!--                custom-->
          <!--                size="mini">-->
          <!--                删除-->
          <!--              </el-button>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
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
      </el-row>
    </div>
    <!-- 详情弹窗 -->
    <edit-page-component
      v-if="detailDialog.visible"
      :visible.sync="detailDialog.visible"
      :type.sync="detailDialog.type"
      :select-id="detailDialog.selectId"
      @handleGetTableData="getTableData"
    />
  </div>
</template>

<script>
import globalMixins from "@/mixins/globalMixins.js";
import service from "./indexServe.js";
import { mapState, mapActions } from "vuex";
import { SYSTEM } from "@/store/type";
export default {
  components: {
    myFilter: () => import("@/fusion-components/Filter"),
    editPageComponent: () => import("./editPage.vue"),
  },
  filters: {
    // 状态映射
    filterStatus(val) {
      return val === "0" ? "正常" : "锁定";
    },
  },
  mixins: [globalMixins, service],
  data() {
    return {
      // 主下拉框字典项
      filterOptions: [
        {
          value: "账号名称",
          key: "1",
          stype: "input",
          maxlength: 33,
        },
        {
          value: "邮箱",
          key: "2",
          stype: "input",
          maxlength: 33,
        },
        {
          value: "所属组织",
          key: "3",
          stype: "input",
          maxlength: 33,
        },
      ],
      configOptions: [
        {
          key: 1,
          value: "删除",
        },
      ],
      // 配置默认值，配置、导出配置、导入配置
      configVal: "",
      size: "mini",
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "createDate", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {},
      // 筛选项
      form: {
        type: "1", // 一级下拉框值
        value: "", // 联动的二级值
      },
      // 查看详情弹窗
      detailDialog: {
        visible: false,
        // 当前选中的条目(详情)
        selectId: "",
        type: "newly",
      },
    };
  },
  computed: {
    ...mapState("system", ["roleDicts"]),
    // 筛选条件整合（左侧一级、二级选项）
    filterFormData() {
      const { pageSize, pageNum, orderField, orderType } = this.tableData;
      return {
        pageSize,
        pageNum,
        orderField,
        orderType,
        ...this.form,
      };
    },
    myHeaders() {
      return {
        authToken: window.localStorage.getItem(`base/token$$`),
        authType: window.localStorage.getItem(`base/authType$$`),
      };
    },
  },
  watch: {
    // 筛选条件变化时候，请求接口
    form: {
      handler() {
        this.tableChange(this.filterFormData, this.tableData, this.getList);
      },
      deep: true,
      immediate: true,
    },
    // 监听角色字典项
    roleDicts: {
      handler(val) {
        val &&
          val.length &&
          this.$set(this.filterOptions[1], "selOptions", val);
      },
      immediate: true,
    },
  },
  created() {
    // 获取角色列表
    this.getRoleDicts();
  },
  methods: {
    ...mapActions("system", {
      getRoleDicts: SYSTEM.ROLE_DICTS,
    }),
    handleSuccess(response) {
      if (response.status !== "success") {
        this.$message.error(response.message);
      } else {
        this.importFile({ fileName: response.content.fileName })
          .then(() => {
            this.getList();
            this.$message.success("上传成功！");
          })
          .catch(() => {
            this.$message.error("上传失败！");
          });
      }
    },
    beforeUpload(file) {
      const testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "xlsx";
      const extension2 = testmsg === "xls";
      if (!extension && !extension2) {
        this.$message.error("上传文件格式不正确!");
      }
      return extension || extension2;
    },
    async reqRownload() {
      let ids = "";
      this.tableData.multipleSelection.forEach((item) => {
        ids = ids + "," + item.userId;
      });
      if (!ids || !ids.length) {
        return this.$message({
          type: "error",
          message: "请选择有效的对象",
        });
      }
      await this.$request(
        {
          url: "/gov/api/sys/user/download?ids=" + ids,
          method: "get",
        },
        {
          responseType: "blob",
        }
      ).then(
        (content) => {
          let blob = new Blob([content.data], {
            type: "application/vnd.ms-excel",
          });
          let fileName = "";
          fileName = "user.xls";
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          // 释放内存
          window.URL.revokeObjectURL(link.href);
        },
        () => {
          this.showMessage("下载失败!", "error");
        }
      );
    },
    /**
     * @param {string} type 区分列表更新模式
     */
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    /**
     * 排序
     * @param {object} column
     */
    abnormalDataChange(column) {
      this.tableData.orderField = column.prop || "updateDate";
      this.tableData.orderType = column.order === "descending" ? "desc" : "asc";
      this.getTableData("submit");
    },
    /**
     * 获取当前选中的id,多选
     * @returns {Array} ids 要删除的用户组
     */
    getMultipleSelection() {
      let arr = [...this.tableData.multipleSelection];
      let ids = [];
      arr &&
        arr.length &&
        arr.forEach((item) => {
          // 取相反，相同的不需要传后端
          ids.push(item.userId);
        });
      return ids;
    },
    /**
     * 删除多个用户
     */
    handleDelete() {
      // 获取选中的id
      const ids = this.getMultipleSelection();
      if (!ids || !ids.length) {
        return this.$message({
          type: "error",
          message: "请选择有效的对象",
        });
      }
      this.deleteUsers(ids);
    },
    /**
     * 删除单个用户
     */
    handleDeleteCurrent(item) {
      this.deleteUsers([item.userId]);
    },
    handleSelect() {
      this.handleDelete();
    },
    /**
     * table多选操作
     * @param {object} val 当前选中的条目
     */
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    /**
     * 查看详情-编辑页面
     */
    handleDetail(row) {
      this.detailDialog = {
        visible: true,
        selectId: row.userId,
        type: "examine",
      };
    },
    /**
     * 打开详情弹窗
     * @param {object} row 当前展示的弹窗数据
     */
    handleEditClick(row) {
      this.detailDialog = {
        visible: true,
        selectId: row.userId,
        type: "edit",
      };
    },
    /**
     * 数据接入
     */
    addAccount() {
      this.detailDialog = {
        visible: true,
        selectId: "",
        type: "newly",
      };
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
    .idss-font--title {
      font-size: var(--font-size-16);
      margin-bottom: 10px;
    }
  }
  .el-button + .el-select {
    margin-left: 10px;
  }
  .filter-items {
    display: flex;
    .select.el-select {
      width: 85px;
    }
  }
  .el-table {
    margin-bottom: 10px;
    >>> .cell {
      white-space: nowrap;
    }
  }
}
</style>
