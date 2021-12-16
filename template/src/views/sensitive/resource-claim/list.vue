<!--
 * @Author: your name
 * @Date: 2021-02-25 10:38:32
 * @LastEditTime: 2021-08-17 11:25:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \goe-web\data-gov-web\src\views\sensitive\data-source-manage\list.vue
-->
<template>
  <div class="sinsitive-resource-page">
    <div class="sinsitive-page-header">
      <PageHeader title="资源认领"></PageHeader>
      <div class="flex-sb-box">
        <FilterBar
          v-model="filterValue"
          :fields="filterFields"
          module-code="assetClaim"
        />
        <div class="filter-items">
          <template>
            <!-- <el-button type="primary" size="mini" disabled @click="batchHandle">
              批量认领
            </el-button> -->
            <el-button
              type="primary"
              size="mini"
              plain
              @click="isShowImportDialog = true"
            >
              导入
            </el-button>
            <!--  -->
            <el-button type="primary" plain size="mini" @click="toExport">
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
    <el-container
      class="el-container"
      style="display: flex; position: relative"
    >
      <!-- 聚合条件 -->
      <AggFilter
        v-model="aggFilter.value"
        :select="aggFilter.select"
        :list="aggFilter.list"
        @select-change="getAggData"
        @list-change="pageNumChange({ pageNum: 1 })"
      />
      <!-- 列表 -->
      <div style="margin-left: 10px; width: 500px; flex: 1">
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
              {{ scope.row.name }}
              <!-- <el-button
                type="text"
                custom
                size="mini"
                @click="handleCheck(scope.row.id)"
              >
                {{ scope.row.name }}
              </el-button> -->
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
            width="120"
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
            width="100"
            prop="netDistrict"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            v-if="showCol('businessSys')"
            label="所属应用"
            prop="businessSys"
            show-overflow-tooltip
          >
          </el-table-column>

          <el-table-column
            v-if="showCol('isClaim')"
            label="认领状态"
            prop="isClaim"
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- <el-table-column
            v-if="showCol('isSensitive')"
            label="是否涉敏"
            prop="isSensitive"
            show-overflow-tooltip
          >
          </el-table-column> -->
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
            v-if="showCol('createTime')"
            label="录入时间"
            prop="createTime"
            width="150"
            sortable="custom"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showCol('sourceFrom')"
            label="来源途径"
            prop="sourceFrom"
            show-overflow-tooltip
          />
          <el-table-column
            v-if="showCol('sourceTag')"
            label="来源标记"
            prop="sourceTag"
            show-overflow-tooltip
          />
          <!-- <el-table-column
            v-if="showCol('claimTime')"
            label="认领时间"
            prop="claimTime"
            width="150"
            show-overflow-tooltip
          /> -->
          <el-table-column fixed="right" label="操作" width="150px">
            <template slot-scope="scope">
              <el-button
                type="text"
                custom
                size="mini"
                @click="handleEdit(scope.row.id, scope.row.name)"
                >认领</el-button
              >
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
      </div>
    </el-container>
    <BatchClaim
      v-bind="formBatchDialog"
      :visible.sync="formBatchDialog.visible"
    />
    <el-drawer
      ref="drawer"
      :title="title"
      :visible.sync="drawer.visible"
      destroy-on-close
      size="800px"
      :wrapper-closable="false"
    >
      <Form
        ref="drawerForm"
        v-bind="drawer"
        :visible.sync="drawer.visible"
        @success="getList"
      />
    </el-drawer>
    <el-dialog
      custom
      :close-on-click-modal="false"
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
          <div class="upload-wrap">
            <el-upload
              :on-success="handleSuccess"
              :before-upload="beforeUpload"
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
import AggFilter from "@/components/agg-filter";
import BatchClaim from "./components/batch-claim-dialog";
import Form from "./components/claim-form-dialog";
// import SideList from "./components/side-list.vue";
import {
  getDataResourceList,
  getListFilterFields,
  getFilterValue,
  deleteResourceList,
  ImportFile,
  getAggData,
  getAggFilters,
  downloadTemplate,
} from "./api";
import ColumnsSelect from "@/components/columns-select";
export default {
  components: {
    PageHeader,
    BatchClaim,
    FilterBar,
    Form,
    ColumnsSelect,
    AggFilter,
    // SideList,
  },
  data() {
    return {
      searchForm: {
        type: "1", // 一级下拉框值
        value: "", // 联动的二级值
      },
      drawer: {
        visible: false,
        type: "add",
        id: null,
      },
      aggFilter: {
        value: {
          select: null,
          list: null,
        },
        select: [],
        list: [],
      },
      formBatchDialog: {
        visible: false,
        type: "add",
        id: null,
      },
      isShowImportDialog: false,
      isShowBatchDialog: false,
      filterValue: {},
      filterFields: [],
      fileList: [],
      // 表格数据
      tableData: {
        data: [
          {
            name: "",
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
          name: "业务IP地址",
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
          name: "资源池",
          checked: false,
        },
        {
          code: "pod",
          name: "所属POD",
          checked: false,
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
        {
          code: "owner",
          name: "责任人",
          checked: false,
        },
        {
          code: "sourceTag",
          name: "来源标记",
          checked: false,
        },
        {
          code: "sourceFrom",
          name: "来源途径",
          checked: false,
        },
        {
          code: "isClaim",
          name: "认领状态",
          checked: true,
          disabled: true,
        },
        // {
        //   code: "isSensitive",
        //   name: "是否涉敏",
        //   checked: true,
        //   disabled: true,
        // },
        // {
        //   code: "claimTime",
        //   name: "认领时间",
        //   checked: true,
        //   disabled: true,
        // },
        {
          code: "createTime",
          name: "录入时间",
          checked: true,
          disabled: true,
        },
      ],
      loading: {
        table: true,
      },
      importForm: {
        dataBase: "DataBase",
        importFile: "DataBase",
        isCover: "true",
        file: null,
      },
      importRule: {
        file: [{ required: true, trigger: "change", message: "请上传文件" }],
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
        param: {
          ...this.filterValue,
          moduleCode: "assetClaim",
          aggCode: this.aggFilter.value.select,
          aggValue: this.aggFilter.value.list,
        },
      };
    },
    title() {
      const obj = {
        add: "新增",
        edit: "认领",
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
        // this.filterFormData.param = this.filterValue;
        // this.getList();
        this.getAggFilter();
      },
      deep: true,
    },
    clickFilter: {
      handler() {
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
    // this.getList();
    this.getFilterFields();
    this.getAggFilter();
  },
  methods: {
    showCol(code) {
      return _.find(this.columns, { code })?.checked;
    },
    async getAggFilter() {
      this.aggFilter.select = await getAggFilters();
      this.aggFilter.value.select = _.get(
        this.aggFilter,
        "select[0].children[0].code",
        ""
      );
      this.getAggData();
    },
    getAggData() {
      getAggData(this.filterFormData).then((res) => {
        this.aggFilter.list = [
          {
            code: null,
            name: res.totalName,
            num: res.totalNum,
          },
          ...res.data.map(({ aggValue, aggName, num }) => ({
            code: aggValue,
            name: aggName,
            num,
          })),
        ];
        this.aggFilter.value.list = null;
        this.getList();
      });
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
    batchHandle() {
      this.formBatchDialog = {
        visible: true,
        id: null,
        type: "add",
      };
    },
    //上传文件让第二次覆盖第一的文件
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
      }
    },
    async toExport() {
      let param = {
        moduleCode: "assetClaim",
      };

      const { list, select } = this.aggFilter.value;
      param.aggCode = select;
      param.aggValue = list;

      if (Object.keys(this.filterValue).length > 0) {
        param = {
          ...this.filterValue,
          ...param,
        };
      }

      if (this.selectedIds.length > 0) {
        param.idList = this.selectedIds;
      }

      // if (
      //   JSON.stringify(this.filterValue) === "{}" &&
      //   this.selectedIds.length === 0
      // ) {
      //   param = {};
      // } else {
      //   param = { ...this.filterValue, idList: this.selectedIds };
      // }
      this.loading = true;
      try {
        const { data } = await this.$request(
          {
            url: `/gov/api/asset/claim/export`,
            method: "POST",
            data: {
              param,
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
      } finally {
        this.loading = false;
      }
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
    submitUpload() {
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
    upLoadChange() {
      this.importRule.file = true;
      this.$refs.importForm.clearValidate();
    },
    handleSuccess(response) {
      if (response.status != "success") {
        this.$message.error(response.message);
      } else {
        this.backFilePath = response.content.filePath;
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
    async getFilterFields() {
      const fields = await getListFilterFields();
      for (let i = 0; i < fields.length; i++) {
        for (let n = 0; n < fields[i].children.length; n++) {
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
    handleEdit(id) {
      this.drawer = {
        visible: true,
        id,
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
    min-width: 75px;
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
  /* padding: 10px 0 10px 10x; */
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
