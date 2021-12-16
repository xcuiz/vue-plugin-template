<!--
 * @Author: your name
 * @Date: 2021-02-25 10:38:32
 * @LastEditTime: 2021-11-29 17:10:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\sensitive\data-resource-manage\list.vue
-->
<template>
  <div class="sinsitive-resource-page">
    <div class="sinsitive-page-header">
      <PageHeader title="数据资源清单管理"> </PageHeader>
      <div class="flex-sb-box">
        <FilterBar
          v-model="filterValue"
          :fields="filterFields"
          module-code="sinsitivePage"
        />
        <div class="filter-items">
          <template>
            <el-button size="mini" type="primary" @click="handleAdd">
              +新建
            </el-button>
            <el-button
              plain
              type="primary"
              size="mini"
              @click="openImportDialog"
            >
              导入
            </el-button>
            <!--  -->
            <el-button plain type="primary" size="mini" @click="toExport">
              导出
            </el-button>
            <el-button
              size="mini"
              plain
              class="operate-button"
              :disabled="!selectedIds.length"
              @click="handleMultipleDelete"
            >
              删除
            </el-button>
          </template>
        </div>
      </div>
    </div>
    <el-container class="el-container">
      <el-aside style="width: 230px">
        <el-tabs v-model="activeTab" type="border-card">
          <el-tab-pane
            label="资源管理"
            name="resourceType"
            size="mini"
            clss="mytree"
          >
            <!-- icon-class="el-icon-circle-plus-outline" -->
            <el-tree
              :data="resourceOptions"
              class="tree-line"
              :props="defaultProps"
              current-node-key="1"
              :indent="0"
              default-expand-all
              @node-click="handleNodeClick"
            >
            </el-tree>
          </el-tab-pane>
          <!-- <el-tab-pane label="组分类" name="groupClassfiy">组分类</el-tab-pane> -->
          <el-tab-pane label="业务系统" name="operationSystem">
            <side-list v-model="clickFilter" :params="businessSysTemType" />
          </el-tab-pane>
        </el-tabs>
      </el-aside>
      <el-main style="position: relative">
        <el-table
          v-loading="loading.table"
          :data="tableData.data"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
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
          @sort-change="sortChange"
        >
          <el-table-column type="selection" />
          <el-table-column fixed label="序号" type="index"> </el-table-column>
          <el-table-column
            v-if="showCol('name')"
            fixed
            label="资源名称"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleCheck(scope.row.id)"
              >
                {{ scope.row.name }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="showCol('storageMode')"
            label="存储类型"
            prop="storageMode"
            show-overflow-tooltip
          >
            <template> </template>
          </el-table-column>
          <el-table-column
            v-if="showCol('assetType')"
            label="存储子类型"
            width="100"
            prop="assetType"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            v-if="showCol('ip')"
            label="业务地址"
            prop="ip"
            show-overflow-tooltip
            width="100px"
          >
            <template> </template>
          </el-table-column>
          <el-table-column
            v-if="showCol('dept')"
            label="所属部门"
            prop="dept"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            v-if="showCol('netDistrict')"
            label="所属网络域"
            prop="netDistrict"
            show-overflow-tooltip
            width="100px"
          >
          </el-table-column>
          <el-table-column
            v-if="showCol('businessSys')"
            label="所属应用"
            prop="businessSys"
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- <el-table-column
            v-if="showCol('status')"
            label="状态"
            prop="status"
            width="60"
            show-overflow-tooltip
          >
          </el-table-column> -->
          <!-- <el-table-column
            v-if="showCol('isSensitive')"
            label="是否涉敏"
            prop="isSensitive"
            show-overflow-tooltip
          >
          </el-table-column> -->
          <el-table-column
            v-if="showCol('createTime')"
            label="录入时间"
            prop="createTime"
            show-overflow-tooltip
            width="150px"
            sortable="custom"
          />
          <el-table-column
            v-if="showCol('port')"
            label="业务端口"
            prop="port"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showCol('resourcePool')"
            label="所属资源池"
            prop="resourcePool"
            show-overflow-tooltip
            width="100px"
          />
          <el-table-column
            v-if="showCol('pod')"
            label="所属POD"
            prop="pod"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showCol('owner')"
            label="责任人"
            prop="owner"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            v-if="showCol('dbType')"
            label="环境类型"
            prop="dbType"
            width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            v-if="showCol('claimTime')"
            label="认领时间"
            prop="claimTime"
            width="150px"
            show-overflow-tooltip
            sortable="custom"
          >
          </el-table-column>
          <el-table-column
            v-if="showCol('isScan')"
            label="敏感识别状态"
            prop="isScan"
            width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            v-if="showCol('isSensitive')"
            label="是否涉敏"
            prop="isSensitive"
            width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            v-if="showCol('senTime')"
            label="敏感识别时间"
            prop="senTime"
            width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150px">
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="doScan(scope.row.id)"
                >执行扫描</el-button
              >
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleEdit(scope.row.id, scope.row.name)"
                >编辑</el-button
              >
              <el-button
                type="text"
                size="mini"
                @click="handleDelete(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <ColumnsSelect v-model="columns" />
        <!-- 分页 -->
        <idss-pagination
          background
          :table-data="tableData"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, prev, pager, next,sizes, jumper"
          @page-change="pageNumChange"
          @size-change="pageSizeChange"
        />
      </el-main>
    </el-container>
    <el-drawer
      ref="drawer"
      :title="title"
      :visible.sync="drawer.visible"
      destroy-on-close
      size="800px"
      :wrapper-closable="false"
    >
      <div v-if="drawer.visible">
        <Form
          ref="drawerForm"
          v-bind="drawer"
          :visible.sync="drawer.visible"
          @success="getList"
        />
      </div>
    </el-drawer>
    <el-dialog
      :close-on-click-modal="false"
      custom
      title="导入数据资源"
      :visible.sync="isShowImportDialog"
      :modal-append-to-body="false"
      @close="isShowImportDialog = false"
    >
      <el-form ref="importForm" :model="importForm" label-width="100px">
        <el-alert type="info" :closable="false" class="import-tip-bg">
          <div style="font-size: 14px; margin-bottom: 10px">
            请按照数据模板的格式精确的导入数据，模板中的表头名称不可更改，表头行不能删除。
          </div>
        </el-alert>
        <el-form-item label="导入数据资源:">
          <el-radio-group v-model="importForm.dataBase">
            <el-radio label="DataBase">数据库存储</el-radio>
            <el-radio label="BigData">大数据存储</el-radio>
            <el-radio label="File">文件存储</el-radio> </el-radio-group
          >&nbsp;
          <el-button plain size="mini" type="primary" @click="downloadTemp"
            >下载模板</el-button
          >
        </el-form-item>
        <el-alert type="info" :closable="false" class="import-tip-bg">
          <div style="font-size: 14px; margin-bottom: 10px">
            仅支持模板格式的excel文件格式数据
          </div>
        </el-alert>
        <el-form-item label="上传导入文件:" class="form-upload">
          <el-radio-group v-model="importForm.importFile">
            <el-radio label="DataBase">数据库存储</el-radio>
            <el-radio label="BigData">大数据存储</el-radio>
            <el-radio label="File">文件存储</el-radio>
          </el-radio-group>
          <!-- :on-success="handleSuccess" -->
          <!-- action="/gov/api/asset/list/upload" -->
          <div class="upload-wrap">
            <el-upload
              :before-upload="beforeUpload"
              :on-success="handleSuccess"
              :file-list="fileList"
              :on-change="handleChange"
              action="/gov/api/asset/list/upload"
            >
              <el-button
                size="mini"
                plain
                type="primary"
                class="operate-button"
              >
                上传数据
              </el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="重复数据处理:" class="upload-mode">
          <el-radio-group v-model="importForm.isCover">
            <el-radio label="true">直接覆盖</el-radio>
            <el-radio label="false">跳过处理</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="export-button">
        <el-button
          size="small"
          type="primary"
          class="operate-button"
          @click="submitUpload"
        >
          导入
        </el-button>
        <el-button size="small" @click="isShowImportDialog = false"
          >取消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageHeader from "@/components/PageHeader";
import FilterBar from "@/components/filter-bar";
import Form from "./components/form-dialog";
import SideList from "./components/side-list.vue";
import {
  getDataResourceList,
  getListFilterFields,
  getFilterValue,
  getResourceType,
  getBusinessSystem,
  deleteResourceList,
  ImportFile,
  downloadTemplate,
} from "./api";
import ColumnsSelect from "@/components/columns-select";
export default {
  components: {
    PageHeader,
    Form,
    FilterBar,
    ColumnsSelect,
    SideList,
  },
  data() {
    return {
      activeTab: "resourceType",
      searchForm: {
        type: "1", // 一级下拉框值
        value: "", // 联动的二级值
      },
      fileList: [],
      drawer: {
        visible: false,
        type: "add",
        id: null,
      },
      isShowImportDialog: false,
      filterValue: {},
      clickFilter: {},
      filterFields: [],
      // 表格数据
      tableData: {
        data: [
          {
            name: "11",
          },
        ], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "createTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      columns: [
        {
          code: "name",
          name: "资源名称",
          checked: true,
          disabled: true,
        },
        {
          code: "storageMode",
          name: "存储类型",
          checked: true,
          disabled: true,
        },
        {
          code: "assetType",
          name: "存储子类型",
          checked: true,
          disabled: true,
        },
        {
          code: "ip",
          name: "业务地址",
          checked: true,
          disabled: true,
        },
        {
          code: "dept",
          name: "所属部门",
          checked: true,
          disabled: true,
        },
        {
          code: "netDistrict",
          name: "所属网络域",
          checked: true,
          disabled: true,
        },
        {
          code: "businessSys",
          name: "所属应用",
          checked: true,
          disabled: true,
        },
        // {
        //   code: "status",
        //   name: "状态",
        //   checked: true,
        //   disabled: true,
        // },
        {
          code: "createTime",
          name: "录入时间",
          checked: true,
          disabled: true,
        },
        {
          code: "port",
          name: "业务端口",
          checked: false,
        },
        {
          code: "resourcePool",
          name: "所属资源池",
          checked: false,
        },
        {
          code: "pod",
          name: "所属POD",
          checked: true,
          disabled: true,
        },
        {
          code: "owner",
          name: "责任人",
          checked: false,
        },
        {
          code: "dbType",
          name: "环境类型",
          checked: true,
          disabled: false,
        },
        {
          code: "claimTime",
          name: "认领时间",
          checked: true,
          disabled: false,
        },
        {
          code: "isScan",
          name: "敏感识别状态",
          checked: true,
          disabled: true,
        },
        {
          code: "isSensitive",
          name: "是否涉敏",
          checked: true,
          disabled: true,
        },
        {
          code: "senTime",
          name: "敏感识别时间",
          checked: false,
        },
      ],
      loading: {
        table: true,
      },
      backFilePath: "",
      resourceOptions: [],
      businessSysTemType: null,
      defaultProps: {
        children: "children",
        label: function (a) {
          return a.name + "    " + (a.count ? a.count : "0");
        },
      },
      importForm: {
        dataBase: "DataBase",
        importFile: "DataBase",
        isCover: "true",
      },
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
        param: this.filterValue,
      };
    },
    title() {
      const obj = {
        add: "新增",
        edit: "编辑",
        check: "查看",
      };
      return (obj[this.drawer.type] || "") + "数据资源";
    },
    cover() {
      return this.importForm.isCover === "true" ? true : false;
    },
    selectedIds() {
      return this.tableData.multipleSelection.map((item) => item.id);
    },
  },
  watch: {
    filterValue: {
      handler() {
        this.filterFormData.param = this.filterValue;
        this.getList();
        this.loadLeftMenuList(this.filterValue);
      },
      deep: true,
    },
    clickFilter: {
      handler() {
        this.tableData.pageNum = 1;
        this.filterFormData.param = this.clickFilter;
        this.getList();
      },
      deep: true,
    },
    "drawer.visible"(val) {
      if (!val) {
        this.$refs.drawerForm.resetFormFields();
      }
    },
  },
  created() {
    this.getList();
    this.getFilterFields();
  },
  mounted() {
    this.loadLeftMenuList(this.filterValue);
  },
  methods: {
    showCol(code) {
      return _.find(this.columns, { code })?.checked;
    },
    getList() {
      this.loading.table = true;
      getDataResourceList(this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    handleNodeClick(data) {
      this.tableData.pageNum = 1;
      if (data.code === "root") {
        this.clickFilter = {};
      } else {
        this.clickFilter = { [data.aliasCode]: [data.code] };
        this.filterFormData.param = this.clickFilter;
      }
    },
    doScan(id) {
      //跳转敏感发现任务
      this.$router.push({
        name: "source-detect-task-list",
        query: {
          assetId: id,
          type: "add",
        },
      });
    },
    async toExport() {
      let param = {};

      if (Object.keys(this.clickFilter).length > 0) {
        const [key] = Object.keys(this.clickFilter);
        const [value] = Object.values(this.clickFilter);

        param[key] = value;
      }

      if (Object.keys(this.filterValue).length > 0) {
        param = {
          ...this.filterValue,
          ...param,
        };
      }

      if (this.selectedIds.length > 0) {
        param.idList = this.selectedIds;
      }

      try {
        const { data } = await this.$request(
          {
            url: `/gov/api/asset/list/export`,
            method: "POST",
            data: {
              param: param,
            },
          },
          {
            responseType: "blob",
          }
        );
        if (data) {
          let blob = new Blob([data], {
            type: "blob",
          });
          let fileName = "";
          fileName = "导出.zip";
          let link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
          // 释放内存
          window.URL.revokeObjectURL(link.href);

          this.$message.success("导出成功");
        }
      } catch (e) {
        this.$message.error("导出失败");
      }
    },
    //上传文件让第二次覆盖第一的文件
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
      }
    },
    handleSuccess(response) {
      if (response.status != "success") {
        this.$message.error(response.message);
      } else {
        this.backFilePath = response.content.filePath;
      }
    },
    openImportDialog() {
      this.fileList = [];
      this.backFilePath = "";
      this.isShowImportDialog = true;
    },
    submitUpload() {
      // this.$refs.importForm.submit();
      if (this.backFilePath) {
        let data = {
          filePath: this.backFilePath,
          type: this.importForm.importFile,
          convert: this.cover,
        };
        ImportFile(data).then(() => {
          this.$message.success("导入成功");
          this.isShowImportDialog = false;
          this.getList();
          // }
        });
      } else {
        this.$message.error("请上传文件");
      }
    },

    async downloadTemp() {
      await downloadTemplate(this.importForm.dataBase).then((res) => {
        let blob = new Blob([res.data], {
          type: "application/vnd.ms-excel",
        });
        let fileName = "";
        fileName = `${this.importForm.dataBase}模板.xls`;
        let link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
        // 释放内存
        window.URL.revokeObjectURL(link.href);
      });
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
    handleCheck(id) {
      this.$router.push({
        name: "data-resource-detail",
        params: {
          id,
        },
      });
    },
    loadLeftMenuList(params) {
      getResourceType({ param: params }).then((res) => {
        this.resourceOptions = res.data;
      });
      getBusinessSystem({ param: params }).then((res) => {
        this.businessSysTemType = res.data;
      });
    },
    handleDelete(id) {
      this.$confirm("此操作将永久删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteResourceList({ idList: [id] }).then(() => {
            this.$message.success("删除成功！");
            this.getList();
          });
        })
        .catch(() => {});
    },
    handleMultipleDelete() {
      if (!this.selectedIds.length) {
        this.$message({
          type: "warning",
          message: "请选择数据",
        });
        return;
      }
      this.$confirm("此操作将永久删除选中数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteResourceList({ idList: this.selectedIds }).then(() => {
            this.$message.success("删除成功！");
            this.getList();
          });
        })
        .catch(() => {});
    },
    async getFilterFields() {
      let fields = await getListFilterFields();
      for (let i = 0; i < fields.length; i++) {
        for (let n = 0; n < fields[i].children?.length; n++) {
          if (
            fields[i].children[n].type === "select" ||
            fields[i].children[n].type === "treeSelect"
          ) {
            try {
              fields[i].children[n].options = await getFilterValue(
                fields[i].children[n].code
              );
            } catch (error) {
              fields[i].children[n].options = [];
            }
          }
        }
      }
      this.filterFields = fields;
    },
    /**
     * table多选操作
     * @param {object} val 当前选中的条目
     */
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
    },
    // 排序
    sortChange({ order, prop }) {
      this.tableData.orderField = prop;
      // 排序方式 asc正序 desc 倒序
      this.tableData.orderType = order === "ascending" ? "asc" : "desc";

      // 排序后重新获取数据
      this.getList();
    },
    pageNumChange({ pageNum }) {
      this.tableData.pageNum = pageNum;
      this.getList();
    },
    pageSizeChange({ pageSize }) {
      this.tableData.pageSize = pageSize;
      this.getList();
    },
    handleAdd() {
      this.drawer = {
        visible: true,
        id: null,
        type: "add",
      };
    },
    handleEdit(id, name) {
      this.drawer = {
        visible: true,
        id,
        name,
        type: "edit",
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.sinsitive-resource-page {
  margin: 10px;
  box-sizing: border-box;
  /* background: #fff; */
  >>> .el-drawer__header {
    margin-bottom: 0;
  }
}
.sinsitive-page-header {
  >>> .title {
    min-width: 115px;
  }
  .filter-bar-container {
    width: 75%;
  }
}
.flex-sb-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.el-container {
  /* background: #fff; */
  /* padding: 10px 0 10px 10px; */
  >>> .el-tabs--border-card {
    box-shadow: none;
  }
  >>> .el-tree-node__label {
    font-size: 12px;
  }
  >>> .el-main {
    padding: 10px;
    padding-top: 0;
  }
  .operate-columns-container {
    right: 10px;
    z-index: 99;
  }
  .import-tip {
    font-size: 12px;
    color: #999;
  }
}

.tree-line /deep/ {
  .el-tree-node {
    position: relative;
    padding-left: 10px;
    /* // 缩进量 */
  }
  .el-tree-node__label {
    margin-left: 6px;
  }
  .el-tree-node__children {
    padding-left: 16px;
    /* // 缩进量 */
  }
  .el-tree-node::before {
    content: "";
    height: 100%;
    width: 1px;
    position: absolute;
    left: -3px;
    top: -26px;
    border-width: 1px;
    border-left: 1px dashed #c4c4c4;
  }
  /* // 当前层最后一个节点的竖线高度固定 */
  .el-tree-node:last-child::before {
    height: 38px;
    /* // 可以自己调节到合适数值 */
  }

  /* // 横线 */
  .el-tree-node:after {
    content: "";
    width: 16px;
    height: 20px;
    position: absolute;
    left: -3px;
    top: 12px;
    border-width: 1px;
    border-top: 1px dashed #c4c4c4;
  }

  /* // 去掉最顶层的虚线，放最下面样式才不会被上面的覆了 */
  & > .el-tree-node::after {
    border-top: none;
  }
  & > .el-tree-node::before {
    border-left: none;
  }

  .el-tree-node__expand-icon.expanded {
    transform: rotate(180deg) !important;
  }
  .el-icon-caret-right:before {
    font-family: "element-icons" !important;
    content: "\e6d9";
    border: 1px solid #aaa;
    border-radius: 2px;
  }
  .is-expanded {
    & > .el-tree-node__content > .el-icon-caret-right:before {
      font-family: "element-icons" !important;
      content: "\e6d8" !important;
      border: 1px solid #aaa;
      border-radius: 2px;
    }
  }
  /* // 展开关闭的icon */
  >>> .el-tree-node__expnd-icon {
    font-size: 16px;
    /* // 叶子节点（子节点） */
    &.is-leaf {
      color: transparent;
      /* // 也可以去掉 */
      display: none !important;
    }
  }
  .el-tree-node__expand-icon.is-leaf {
    display: none;
  }
}
.form-upload {
  >>> .el-form-item__content {
    display: flex;
    .el-radio-button__inner,
    .el-radio-group {
      line-height: 50px;
    }
  }
  .upload-wrap {
    margin-left: 10px;
  }
}
.el-form {
  >>> .import-tip-bg {
    margin-bottom: 15px;
  }
  .upload-mode {
    margin-top: -20px;
  }
}
</style>
