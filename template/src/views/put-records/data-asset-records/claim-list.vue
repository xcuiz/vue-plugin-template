<template>
  <div class="container">
    <div class="content">
      <PageHeader title="敏感数据资产认领"> </PageHeader>
      <div class="flex-sb-box">
        <FilterBar
          v-model="filterValue"
          :fields="filterFields"
          module-code="record-claim"
        />
        <div class="filter-items">
          <div>
            <el-button
              size="mini"
              type="primary"
              plain
              @click="openImportDialog"
            >
              导入
            </el-button>
          </div>
          <div style="margin: 0 10px">
            <el-button size="mini" type="primary" plain @click="toExport">
              导出
            </el-button>
          </div>
          <div>
            <el-button
              size="mini"
              plain
              class="operate-button"
              :disabled="!selectedIds.length"
              @click="handleMultipleDelete"
            >
              删除
            </el-button>
          </div>
        </div>
      </div>
      <el-row style="display: flex; position: relative">
        <!-- 聚合条件 -->
        <AggFilter
          v-model="aggFilter.value"
          :select="aggFilter.select"
          :list="aggFilter.list"
          @select-change="getAggData"
          @list-change="getList"
        />
        <!-- 列表 -->
        <div style="margin-left: 10px; width: 500px; flex: 1">
          <el-table
            ref="tableRef"
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
            @sort-change="handleSortChange"
          >
            <el-table-column fixed type="selection" width="50" />
            <el-table-column
              v-if="showCol('name')"
              fixed
              label="敏感资源名称"
              width="130"
              show-overflow-tooltip
            >
              <!-- @click="handleCheck(scope.row.id)" -->
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('storageMode')"
              label="存储类型"
              prop="storageMode"
              width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.storageMode || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('assetType')"
              prop="assetType"
              label="存储子类型"
              width="130"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.assetType || "-" }}
              </template>
            </el-table-column>
            <!-- <el-table-column
              v-if="showCol('')"
              label="业务地址"
              show-overflow-tooltip
            > -->
            <!-- </el-table-column> -->
            <el-table-column
              v-if="showCol('deptName')"
              label="所属部门"
              prop="deptName"
              width="120"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.deptName || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('businessSystem')"
              label="所属应用"
              width="120"
              prop="businessSystem"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.businessSystem || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('dbType')"
              label="环境类型"
              prop="dbType"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.dbType || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('isFiling')"
              label="认领状态"
              width="100"
              prop="isFiling"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.isFiling || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('createTime')"
              label="录入时间"
              width="160"
              prop="createTime"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.createTime || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('filingUser')"
              label="认领人"
              width="110"
              prop="filingUser"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.filingUser || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('resourcePool')"
              label="所属资源池"
              width="120"
              prop="resourcePool"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.resourcePool || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('pod')"
              label="所属POD"
              prop="pod"
              width="100"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.pod || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('filingTime')"
              label="首次认领时间"
              width="160"
              prop="filingTime"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{ scope.row.filingTime || "-" }}
              </template>
            </el-table-column>
            <el-table-column
              v-if="showCol('status')"
              label="状态"
              prop="status"
              width="70"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('netDistrictName')"
              label="所属网络域"
              width="120"
              prop="netDistrictName"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('include4a')"
              label="是否纳入4A"
              width="120"
              prop="include4a"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('adminUser')"
              label="系统管理员名称"
              width="130"
              prop="adminUser"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('adminContact')"
              label="系统管理员联系方式"
              prop="adminContact"
              width="160"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('appUser')"
              label="应用管理员"
              prop="appUser"
              width="120"
              show-overflow-tooltip
            />
            <!-- <el-table-column
              v-if="showCol('appContact')"
              label="应用管理员联系方式"
              prop="appContact"
              width="160"
              show-overflow-tooltip
            /> -->
            <el-table-column
              v-if="showCol('cooperateVendor')"
              label="合作厂商"
              width="100"
              prop="cooperateVendor"
              show-overflow-tooltip
            />
            <el-table-column
              v-if="showCol('devVendor')"
              label="开发厂商"
              width="120"
              prop="devVendor"
              show-overflow-tooltip
            />
            <el-table-column fixed="right" label="操作" min-width="120">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  custom
                  size="mini"
                  @click="recordCheck(scope.row)"
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
      </el-row>
    </div>
    <FormDialogRecord
      v-bind="formDialog"
      :visible.sync="formDialog.visible"
      @success="getList"
    />
    <el-dialog
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
import ColumnsSelect from "@/components/columns-select";
import AggFilter from "@/components/agg-filter";
import FormDialogRecord from "./components/records-dialog";

import _ from "lodash";
import {
  getAggFilters,
  getAggData,
  getListFilterFields,
  getFilterOptions,
  getFilingPage,
  deleteRecordList,
  downloadTemplate,
  ImportFile,
} from "./api";
export default {
  components: {
    PageHeader,
    FilterBar,
    ColumnsSelect,
    AggFilter,
    FormDialogRecord,
  },
  data() {
    return {
      moduleCode: "dataClaim",
      filterFields: [],
      filterValue: {},
      isShowImportDialog: false,
      formDialog: {
        visible: false,
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
      columns: [
        {
          code: "name",
          name: "敏感资源名称",
          checked: true,
          disabled: true,
        },
        {
          code: "status",
          name: "状态",
          checked: false,
        },
        {
          code: "netDistrictName",
          name: "所属网络域",
          checked: false,
        },
        {
          code: "include4a",
          name: "是否纳入4A",
          checked: false,
        },
        {
          code: "businessSystem",
          name: "所属应用系统",
          checked: true,
          disabled: true,
        },
        {
          code: "dbType",
          name: "环境类型",
          checked: true,
          disabled: false,
        },
        {
          code: "createTime",
          name: "录入时间",
          checked: true,
          disabled: true,
        },
        {
          code: "deptName",
          name: "部门",
          checked: true,
          disabled: true,
        },
        {
          code: "adminUser",
          name: "系统管理员名称",
          checked: false,
        },
        {
          code: "adminContact",
          name: "系统管理员联系方式",
          checked: false,
        },
        {
          code: "appUser",
          name: "应用管理员",
          checked: false,
        },
        // {
        //   code: "appContact",
        //   name: "应用管理员联系方式",
        //   checked: false,
        // },
        {
          code: "cooperateVendor",
          name: "合作厂商",
          checked: false,
        },
        {
          code: "devVendor",
          name: "开发厂商",
          checked: false,
        },
        {
          code: "resourcePool",
          name: "所属资源池",
          checked: false,
        },
        {
          code: "filingUser",
          name: "认领人",
          checked: true,
          disabled: true,
        },
        {
          code: "filingTime",
          name: "认领时间",
          checked: true,
          disabled: true,
        },
        {
          code: "isFiling",
          name: "是否认领",
          checked: true,
          disabled: true,
        },
        {
          code: "assetType",
          name: "数据类型",
          checked: true,
          disabled: true,
        },
      ],
      importForm: {
        dataBase: "DataBase",
        importFile: "DataBase",
        isCover: "true",
      },
      fileList: [],
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "filingTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: true,
      },

      parseDefaultFilter: null,
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
        param: {
          ...this.filterValue,
          moduleCode: this.moduleCode,
          aggCode: this.aggFilter.value.select,
          aggValue: this.aggFilter.value.list,

          dbType: [0],
        },
        global,
      };
    },
    cover() {
      return this.importForm.isCover === "true" ? true : false;
    },
    selectedIds() {
      return this.tableData.multipleSelection.map((item) => item.assetId);
    },
  },
  watch: {
    filterValue: {
      handler() {
        this.getAggFilter();
      },
      deep: true,
    },
  },
  created() {
    this.initFilter();
    this.getFilterFields();
    this.getAggFilter();
    // this.getList();
  },
  methods: {
    initFilter() {
      const { defaultFilter } = this.$route.query;

      if (defaultFilter) {
        this.parseDefaultFilter = JSON.parse(defaultFilter);

        for (const key in this.parseDefaultFilter) {
          this.$set(this.filterValue, key, this.parseDefaultFilter[key]);
        }
      }
    },
    showCol(code) {
      return _.find(this.columns, { code })?.checked;
    },
    async getFilterFields() {
      const fields = await getListFilterFields(this.moduleCode);
      for (let i = 0; i < fields.length; i++) {
        for (let n = 0; n < fields[i].children.length; n++) {
          if (
            fields[i].children[n].type === "select" ||
            fields[i].children[n].type === "treeSelect"
          ) {
            try {
              fields[i].children[n].options = await getFilterOptions(
                fields[i].children[n].code,
                this.moduleCode
              );
            } catch (error) {
              fields[i].children[n].options = [];
            }
          }

          if (this.parseDefaultFilter) {
            if (fields[i].children[n].code in this.parseDefaultFilter) {
              fields[i].children[n].isDefault = "1";
            } else {
              fields[i].children[n].isDefault = null;
            }
          }
          // if (fields[i].children[n].isDefault) {
          //   this.$set(this.filterValue, fields[i].children[n].code, null);
          // }
        }
      }
      this.filterFields = fields;
    },
    //上传文件让第二次覆盖第一的文件
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]];
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
    handleSuccess(response) {
      if (response.status != "success") {
        this.$message.error(response.message);
      } else {
        this.backFilePath = response.content.filePath;
      }
    },
    async toExport() {
      let param = { ...this.filterFormData.param, idList: this.selectedIds };
      this.loading.table = true;
      try {
        const { data } = await this.$request(
          {
            url: `/gov/api/asset/filing/export`,
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

          this.$refs.tableRef.clearSelection();
        }
      } catch (e) {
        this.$message.error("导出失败");
      } finally {
        this.loading.table = false;
      }
    },
    async getAggFilter() {
      this.aggFilter.select = await getAggFilters(this.moduleCode);
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
      getFilingPage(this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    handleSelectionChange(val) {
      this.tableData.multipleSelection = val;
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
          deleteRecordList({ idList: this.selectedIds }).then(() => {
            this.$message.success("删除成功！");
            this.getList();
          });
        })
        .catch(() => {});
    },
    pageNumChange({ pageNum }) {
      this.tableData.pageNum = pageNum;
      this.getList();
    },
    pageSizeChange({ pageSize }) {
      this.tableData.pageSize = pageSize;
      this.getList();
    },
    // 排序
    handleSortChange({ prop, order }) {
      this.tableData.orderField = prop;
      this.tableData.orderType = order === "descending" ? "desc" : "asc";
      this.getTableData("submit");
    },
    recordCheck({ filingId, assetId }) {
      this.$router.push({
        name: "data-asset-claim-detail",
        query: {
          filingId,
          assetId,
          filingState: 2,
        },
      });
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

    >>> .page-header .title {
      min-width: 112px;
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
.flex-sb-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.health-type.running {
  color: #68d279;
}
.health-type.warning {
  color: #f89d06;
  cursor: pointer;
}
.health-type.error {
  color: #d81e06;
  cursor: pointer;
}
.probe-test {
  display: flex;
  justify-content: center;
  align-items: center;
  >>> &-icon {
    width: 42px;
    height: 42px;
    margin-right: 28px;
    &.success {
      fill: #68d279;
    }
    &.error {
      fill: #d81e06;
    }
  }
}
.operate-columns-container {
  z-index: 100;
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
