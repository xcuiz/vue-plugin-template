<template>
  <div class="table-container">
    <h4>映射对应字段预览</h4>
    <el-form ref="form" primary size="mini" :model="tableData">
      <el-table
        ref="table"
        :data="tableData"
        fit
        border
        highlight-current-row
        :header-row-style="{ backgroundColor: '#F7F7F7' }"
        style="width: 100%; margin-top: 16px"
      >
        <el-table-column
          label="数据库字段名"
          prop="colName"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="数据库字段类型"
          prop="colType"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="匹配对象">
          <template slot-scope="scope">
            <el-form-item
              :prop="scope.$index + '.dataName'"
              :rules="form.rules.dataName"
            >
              <el-select
                size="mini"
                filterable
                :value="scope.row.dataName"
                @change="handleDataChange(scope, $event, 'dataName')"
              >
                <el-option
                  v-for="item in scriptFields"
                  :key="item.code"
                  :value="item.code"
                  :label="item.name"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope">
            <el-form-item
              :prop="scope.$index + '.dataType'"
              :rules="form.rules.dataType"
            >
              <el-select
                size="mini"
                :value="scope.row.dataType"
                @change="handleDataChange(scope, $event, 'dataType')"
              >
                <el-option
                  v-for="item in dataTypes || []"
                  :key="item.code"
                  :value="item.code"
                  :label="item.dataType"
                />
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script>
import { getTableFields, getScriptFields, getDataTypes } from "../api";
export default {
  props: {
    // 索引名称
    tableId: {
      type: [String, Number],
    },
    scriptId: {
      type: [String, Number],
    },
    colConfig: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      form: {
        list: [],
        // 效验规则
        rules: {
          dataName: [
            {
              required: true,
              message: "请选择字段",
            },
          ],
          dataType: [
            {
              required: true,
              message: "请选择字段类型",
            },
          ],
        }, // 效验规则
      },
      scriptFields: [],
      tableFields: [],
      dataTypes: [],
      tableData: this.colConfig,
    };
  },
  // computed: {
  //   tableData: {
  //     get: function () {
  //       const result = this.tableFields.map((item) => {
  //         const scriptData =
  //           _.find(this.scriptData, {
  //             code: item.colName,
  //           }) || {};
  //         const dataType = (
  //           _.find(this.dataTypes, {
  //             code: item.colType,
  //           }) || {}
  //         ).code;
  //         return {
  //           ...item,
  //           dataType,
  //           dataName: scriptData.code,
  //         };
  //       });
  //       console.log("result: ", result);
  //       return result;
  //     },
  //     set: function () {},
  //   },
  // },
  watch: {
    async tableId() {
      await this.getTableFields();
      this.setTableData();
    },
    async scriptId() {
      await this.getScriptFields();
      this.setTableData();
    },
    tableData: {
      handler() {
        this.$emit("update:colConfig", this.tableData);
      },
      deep: true,
    },
  },
  created() {
    this.getDataTypes();
    this.getTableFields();
    this.getScriptFields();
    if (this.type !== "add") {
      this.tableData = this.colConfig;
    }
  },
  methods: {
    // 现有xx  type字段类型是否可以编辑
    // 1.log_timestamp,sourceDeviceType不可以编辑
    // 2.type下拉数据源长度为0，1时，禁用select
    //
    isEditTypeDisabled(item) {
      return (
        (item.fieldType && item.listSource.length <= 1) ||
        this.isFieldTypeDisabled(item)
      );
    },
    getTableFields() {
      return getTableFields(this.tableId).then((res) => {
        this.tableFields = res;
      });
    },
    getScriptFields() {
      return getScriptFields(this.scriptId).then((res) => {
        this.scriptFields = res;
      });
    },
    getDataTypes() {
      getDataTypes().then((res) => {
        this.dataTypes = res;
      });
    },
    handleDataChange({ $index }, val, field) {
      this.tableData[$index][field] = val;
    },
    setTableData() {
      const result = this.tableFields.map((item) => {
        const scriptData =
          _.find(this.scriptData, {
            code: item.colName,
          }) || {};
        const dataType = (
          _.find(this.dataTypes, {
            code: item.colType,
          }) || {}
        ).code;
        return {
          ...item,
          dataType,
          dataName: scriptData.code,
        };
      });
      this.tableData = result;
      this.$emit("update:colConfig", this.tableData);
    },
  },
};
</script>

<style lang="postcss" scoped>
.table-container {
  padding: 15px 0;
  .el-form-item {
    margin-bottom: 0;
  }
  >>> .el-input {
    width: auto;
  }
  .el-select {
    width: auto;
  }
  >>> .el-form-item__error {
    position: relative;
  }
}
</style>
