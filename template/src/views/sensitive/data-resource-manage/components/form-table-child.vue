<!--
 * @Author: your name
 * @Date: 2021-03-18 14:52:47
 * @LastEditTime: 2021-04-19 10:45:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\sensitive\data-resource-manage\components\form-table-child.vue
-->
<template>
  <el-row class="detail-child-table">
    <el-table
      v-loading="loading.table"
      :data="subtableData.data"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      size="mini"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" />
      <el-table-column
        label="业务IP地址"
        width="100"
        prop="childBussinessIP"
        show-overflow-tooltip
      />
      <el-table-column
        label="业务网端口号"
        width="115"
        prop="childBussinessPort"
        show-overflow-tooltip
      />
      <el-table-column
        label="承载网IP地址"
        width="115"
        prop="childCarryingNetworkIp"
        show-overflow-tooltip
      />
      <el-table-column
        label="承载网端口号"
        width="115"
        prop="childCarryingPort"
        show-overflow-tooltip
      />
      <el-table-column
        label="CMNET IP地址"
        width="125"
        prop="childCmnetIp"
        show-overflow-tooltip
      />
      <el-table-column
        label="CMNET端口号"
        width="115"
        prop="childCmnetPort"
        show-overflow-tooltip
      />
      <el-table-column label="操作" prop="element" show-overflow-tooltip>
        <template slot-scope="scope">
          <i
            class="el-icon-delete"
            @click="handleMultipleDelete(scope.$index, subtableData.data)"
          ></i>
        </template>
      </el-table-column>
    </el-table>
    <div class="add-data-btn" @click="addData">
      <el-button type="primary"><i class="el-icon-plus"></i> 添加行</el-button>
    </div>
    <div v-show="formFlag" class="add-data">
      <div class="opreat-btn">
        <el-button type="primary" plain @click="saveData">保存</el-button>
        <el-button type="info" plain @click="formFlag = false">关闭</el-button>
      </div>
      <el-form
        ref="childForm"
        v-loading="loading.chileTable"
        primary
        :model="childForm"
        :rules="childRules"
        size="mini"
        label-width="120px"
        label-suffix=":"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="业务IP地址" prop="childBussinessIP">
              <el-input
                v-model="childForm.childBussinessIP"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="业务网端口号" prop="childBussinessPort">
              <el-input
                v-model="childForm.childBussinessPort"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="承载网IP地址" prop="">
              <el-input
                v-model="childForm.childCarryingNetworkIp"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="承载网端口号" prop="">
              <el-input
                v-model="childForm.childCarryingPort"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="CMNET IP地址" prop="">
              <el-input
                v-model="childForm.childCmnetIp"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="CMNET端口号" prop="">
              <el-input
                v-model="childForm.childCmnetPort"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 分页 -->
    <idss-pagination
      background
      :table-data="subtableData"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, prev, pager, next,sizes, jumper"
      @page-change="tTableChange"
      @size-change="tTableChange"
    />
  </el-row>
</template>
<script>
import { IP_RE, PORT_RE } from "@/constants";
import _ from "lodash";
export default {
  props: {
    childTableData: {
      type: Array,
    },
  },
  data() {
    return {
      // 表格数据
      subtableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
        multipleSelection: [], // 多选
        orderField: "", // 排序字段 updateDate(创建时间) updateDate(更新时间)
        orderType: "desc", // 排序方式 asc正序 desc 倒序
      },
      childForm: {
        childBussinessIP: null,
        childBussinessPort: null,
        childCarryingNetworkIp: null,
        childCarryingPort: null,
        childCmnetIp: null,
        childCmnetPort: null,
      },
      formFlag: false,
      childRules: {
        childBussinessPort: [
          {
            required: true,
            message: "请输入业务网端口号",
          },
          {
            pattern: PORT_RE,
            message: "请输入正确的端口号",
          },
        ],
        childBussinessIP: [
          {
            required: true,
            message: "请输入业务网IP地址",
          },
          {
            pattern: IP_RE,
            message: "请输入正确的端口号",
          },
        ],
      },
      loading: {
        table: false,
        chileTable: false,
      },
      data: [],
    };
  },
  computed: {
    selectedIds() {
      return this.subtableData.multipleSelection.map((item) => item.id);
    },
  },
  watch: {
    childTableData(newValue) {
      if (newValue) {
        this.subtableData.data = newValue;
      }
    },
  },
  methods: {
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.subtableData, this.getList);
    },
    getTableData(type = "init") {
      this.tableChange({ type: type }, this.subtableData, this.getList);
    },
    addData() {
      this.formFlag = true;
      this.$refs.childForm.resetFields();
    },
    saveData() {
      this.$refs.childForm.validate((valid) => {
        if (valid) {
          this.subtableData.data.push(_.cloneDeep(this.childForm));
          for (let i in this.childForm) {
            this.childForm[i] = null;
          }
          this.$refs.childForm.resetFields();
          this.$emit("getChildTable", this.subtableData.data);
        }
      });
    },
    handleMultipleDelete(index, rows) {
      rows.splice(index, 1);
    },
  },
};
</script>
<style lang="postcss" scoped>
>>> th {
  .cell {
    font-weight: normal;
  }
}
.detail-child-table {
  padding-bottom: 10px;
  border-bottom: 1px solid #eaeaea;
}
.flex-sb-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.add-data-btn {
  margin: 10px 0 0 0;
}
.add-data {
  background: #f9f9f9;
  padding: 10px 10px 0 0;
  .opreat-btn {
    text-align: right;
    margin-bottom: 15px;
  }
}
</style>
