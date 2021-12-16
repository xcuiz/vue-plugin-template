<template>
  <el-row>
    <el-card class="box-card">
      <div class="file-table-header-box">
        <FilterBar
          v-model="filterValue"
          :fields="filterFields"
          :module-code="moduleCode"
        />
        <div class="operate">
          <div style="margin-right: 10px">
            <el-button size="mini" plain type="primary" @click="toMulWhite"
              >批量转例外</el-button
            >
          </div>
          <div>
            <el-button size="mini" plain type="primary" @click="toMulEdit"
              >批量修改</el-button
            >
          </div>
        </div>
      </div>
      <div class="db-table-container">
        <el-table
          v-loading="loading.table"
          row-key="tableId"
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
          <el-table-column fixed type="selection" width="50" />
          <el-table-column
            v-for="column of checkedColumns"
            :key="column.code"
            :label="column.name"
            :show-overflow-tooltip="true"
            :sortable="column.sortable"
            :prop="column.code"
            :width="column.width"
            :fixed="column.isFixed"
          >
            <template slot-scope="scope">
              {{ column.isFixed }}
              {{
                column.formatter
                  ? column.formatter(scope.row[column.code])
                  : formatter(scope.row[column.code])
              }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="mini"
                custom
                @click="toWhite(scope.row)"
                >转例外</el-button
              >
              <el-button
                type="text"
                size="mini"
                custom
                @click="toEdit(scope.row)"
                >修改</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <ColumnsSelect v-model="selectColumns" />
      </div>

      <!-- 分页 -->
      <idss-pagination
        background
        :table-data="tableData"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, prev, pager, next,sizes, jumper"
        @page-change="tTableChange"
        @size-change="tTableChange"
      />

      <el-dialog
        :close-on-click-modal="false"
        custom
        width="500px"
        title="修改敏感信息"
        :visible="visible"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        class="extend-attr-dialog"
        @close="closeDialog"
      >
        <div v-loading="loadingDetail" class="increased-field-box">
          <el-form
            ref="form"
            size="mini"
            :model="formData"
            :rules="rules"
            label-width="120px"
          >
            <el-form-item label="敏感数据分类:" prop="senType">
              <el-select v-model="formData.senType" style="width: 100%">
                <el-option
                  v-for="classify of classifyList"
                  :key="classify.id"
                  :value="classify.classify_name"
                  :label="classify.classify_name"
                  placeholder="请输入敏感数据分类"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="敏感数据分级:" prop="senLevel">
              <el-select v-model="formData.senLevel" style="width: 100%">
                <el-option
                  v-for="level of levelList"
                  :key="level.id"
                  :value="level.gradeName"
                  :label="level.gradeName"
                  placeholder="请输入敏感数据分级"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button
            :loading="saveLoading"
            size="small"
            type="primary"
            :disabled="saveLoading"
            @click="handleSaveForm"
          >
            保 存
          </el-button>
          <el-button size="small" @click="closeDialog"> 取 消 </el-button>
        </div>
      </el-dialog>
    </el-card>
  </el-row>
</template>
<script>
/* eslint-disable no-empty */
import _ from "lodash";
import globalMixins from "@/mixins/globalMixins.js";
import ColumnsSelect from "@/components/columns-select";
import {
  getFilterByModuleCode,
  getDBPageSelectOptions,
  getSensitiveList,
} from "../api";
import FilterBar from "@/components/filter-bar";
export default {
  components: {
    FilterBar,
    ColumnsSelect,
  },
  mixins: [globalMixins],
  props: {
    assetId: {
      type: [Number, String],
      required: true,
    },
    storageMode: {
      type: String,
    },
    mode: {
      type: String,
    },
  },
  data() {
    const policyLevels = [
      { key: "low", value: "低敏感级" },
      { key: "medium", value: "较敏感级" },
      { key: "high", value: "敏感级" },
      { key: "extremely-high", value: "极敏感级" },
    ];
    return {
      moduleCode: "filingFile",

      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "foundTime", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      loading: {
        table: false,
      },
      policyLevels,
      // 筛选项
      searchForm: {
        type: "isSensitiveList", // 一级下拉框值
        value: [], // 联动的二级值
      },
      filterOptions: [
        {
          value: "是否涉敏",
          key: "isSensitiveList",
          multiple: true,
          stype: "select",
          selOptions: [
            {
              key: "0",
              value: "不涉敏",
            },
            {
              key: "1",
              value: "涉敏",
            },
          ],
        },
      ],
      filterValue: {},
      filterFields: [],

      columns: [
        {
          name: "数据资源名称",
          code: "name",
          sortable: false,
          width: 110,
          checked: true,
          disabled: true,
        },
        {
          name: "IP地址",
          code: "ip",
          sortable: "custom",
          width: 100,
          checked: true,
          disabled: true,
        },
        {
          name: "端口",
          code: "port",
          sortable: false,
          checked: true,
          disabled: true,
        },
        {
          name: "类型",
          code: "assetType",
          sortable: "custom",
          checked: true,
        },
        {
          name: "所在网络域",
          code: "netDistrictName",
          sortable: false,
          width: 110,
          checked: true,
        },
        {
          name: "所属部门",
          code: "deptName",
          sortable: false,
          checked: true,
        },
        {
          name: "所属业务系统",
          code: "businesSysName",
          sortable: false,
          width: 120,
          checked: true,
        },
        {
          name: "发现时间",
          code: "foundTime",
          sortable: "custom",
          width: 160,
          checked: true,
          disabled: true,
        },
        {
          name: "环境类型",
          code: "dbType",
          sortable: false,
          width: 100,
          checked: true,
          disabled: false,
        },
        {
          name: "目录",
          code: "fileDir",
          sortable: false,
          checked: true,
          disabled: true,
        },
        {
          name: "文件名",
          code: "fileName",
          sortable: false,
          checked: true,
          disabled: true,
        },
        {
          name: "涉敏级别",
          code: "senLevel",
          sortable: false,
          checked: true,
        },
        {
          name: "涉敏分类",
          code: "senType",
          sortable: false,
          checked: true,
        },
        {
          name: "涉敏特征",
          code: "aimElementName",
          sortable: false,
          checked: true,
        },
        {
          name: "识别方式",
          code: "discernmentType",
          sortable: false,
          checked: true,
        },
        {
          name: "样例数据",
          code: "sampleData",
          sortable: false,
          checked: true,
        },
      ],
      selectColumns: [],

      ids: [],
      visible: false,
      loadingDetail: false,
      saveLoading: false,
      classifyList: [],
      levelList: [],

      formData: {
        senTypeId: "",
        senType: "",
        senLevelId: "",
        senLevel: "",
      },
      rules: {
        senTypeId: [
          {
            required: true,
            message: "请输入敏感数据分类",
          },
        ],
        senLevelId: [
          {
            required: true,
            message: "请输入敏感数据分级",
          },
        ],
      },
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
        param: this.filterValue,
      };
    },
    title() {
      const t = {
        DataBase: "数据库结果",
        BigData: "大数据结果",
      };
      return t[this.storageMode] || "结果";
    },
    checkedColumns() {
      const { selectColumns } = this;

      if (Array.isArray(selectColumns)) {
        return selectColumns.filter(({ checked }) => checked);
      }

      return [];
    },
  },
  watch: {
    filterValue: {
      handler() {
        this.getList();
      },
      deep: true,
    },
    columns: {
      handler(val) {
        this.selectColumns = _.cloneDeep(val);
      },
      immediate: true,
    },
    mode: {
      handler(newVal, oldVal) {
        if (newVal && oldVal !== newVal) {
          this.getList();
        }
      },
      immediate: true,
    },
  },
  created() {
    this.selectColumns = _.cloneDeep(this.columns);

    // this.getList();
    this.getFilterFields();
    this.getSelectList();
  },
  methods: {
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.tableData, this.getList);
    },
    // 排序
    sortChange({ order, prop }) {
      this.orderField = prop;
      // 排序方式 asc正序 desc 倒序
      this.orderType = order === "ascending" ? "asc" : "desc";

      // 排序后重新获取数据
      this.getList();
    },
    getList() {
      if (!this.mode) {
        return;
      }

      this.loading.table = true;

      const body = {
        ...this.filterFormData,
      };
      body.param.mode = this.mode;
      body.param.assetId = this.assetId;

      getSensitiveList(body)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    async getFilterFields() {
      const fields = await getFilterByModuleCode(this.moduleCode);
      for (let i = 0; i < fields.length; i++) {
        for (let n = 0; n < fields[i].children.length; n++) {
          if (
            fields[i].children[n].type === "select" ||
            fields[i].children[n].type === "treeSelect"
          ) {
            try {
              fields[i].children[n].options = await getDBPageSelectOptions(
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
    formatter(v) {
      return v || "-";
    },
    getSelectList() {
      this.getClassifyList();
      this.getLevelList();
    },
    async getClassifyList() {
      const result = await this.$request({
        url: "/gov/api/strategy/classify/listThirdLeveData",
        method: "GET",
      });

      if (Array.isArray(result)) {
        this.classifyList = result;
      }
    },
    async getLevelList() {
      const { list } = await this.$request({
        url: "/gov/api/strategy/grade/list",
        method: "POST",
        data: {
          gradeName: "",
        },
      });

      if (Array.isArray(list)) {
        this.levelList = list;
      }
    },
    classifyIdChange(classifyId) {
      const { classify_name } = this.classifyList.find(
        ({ id }) => id === classifyId
      );

      this.formData.senType = classify_name;
    },
    levelIdChange(levelId) {
      const { gradeName } = this.levelList.find(({ id }) => id === levelId);

      this.formData.senLevel = gradeName;
    },
    handleSaveForm() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.saveLoading = true;
          try {
            await this.$request({
              url: "/gov/api/data/increasedFile/updateSen",
              method: "POST",
              data: {
                dataIncreasedFileIds: this.ids,
                ...this.formData,
              },
            });

            this.$message.success("修改成功");

            this.closeDialog();

            this.getList();
          } catch (e) {
          } finally {
            this.saveLoading = false;
          }
        }
      });
    },
    closeDialog() {
      this.$refs.form.resetFields();
      this.formData = {
        senTypeId: "",
        senType: "",
        senLevelId: "",
        senLevel: "",
      };

      this.visible = false;
      this.ids = [];
      this.cb = null;
    },
    handleSelectionChange(selected) {
      if (Array.isArray(selected) && selected.length > 0) {
        this.ids = selected.map(({ id }) => id);
      }
    },
    toEdit(row) {
      const { id, senTypeId, senType, senLevelId, senLevel } = row;
      this.visible = true;

      this.formData = {
        senTypeId,
        senType,
        senLevelId,
        senLevel,
      };

      this.ids = [id];
    },
    toWhite(row) {
      this.$confirm("确定是否将涉敏字段转例外", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$request({
              url: "/gov/api/data/increasedFile/transferNormal",
              method: "POST",
              data: {
                ids: [row.id],
                isNormal: "0",
              },
            });

            this.$message.success("操作成功");

            this.getList();
          } catch (e) {}
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    toMulEdit() {
      if (this.ids.length === 0) {
        this.$message.warning("请选择数据");

        return;
      }

      this.visible = true;
    },
    toMulWhite() {
      if (this.ids.length === 0) {
        this.$message.warning("请选择数据");

        return;
      }
      this.$confirm("确定是否将选中的涉敏字段转例外", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$request({
              url: "/gov/api/data/increasedFile/transferNormal",
              method: "POST",
              data: {
                ids: this.ids,
                isNormal: "0",
              },
            });

            this.$message.success("操作成功");

            this.getList();
          } catch (e) {}
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
<style lang="postcss" scoped>
.flex-sb-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.db-table-container {
  position: relative;
}

.file-table-header-box {
  display: flex;
  justify-content: space-between;

  .operate {
    display: flex;
  }
}
</style>
