<!--
 * @Author: yincheng
 * @Date: 2021-04-26 14:47:55
 * @LastEditors: yincheng
 * @LastEditTime: 2021-04-26 16:29:50
-->
<template>
  <el-dialog
    custom
    title="端口组"
    :visible="visible"
    :modal-append-to-body="false"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <p style="margin-bottom: 12px">
      <idss-icon-svg name="help" />
      从列表中选择要扫描的端口组，然后单击“下一步”
    </p>
    <el-row style="position: relative">
      <!-- 列表 -->
      <el-table
        v-loading="loading.table"
        row-key="id"
        :data="tableData.data"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        max-height="700"
        size="mini"
        stripe
        fit
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <!-- <el-table-column
          label="选择"
          width="60px"
          align="center"
          header-align="center"
        >
          <template slot-scope="scope">
            <el-radio
              v-model="selectedRadio"
              :label="scope.row.id"
              style="margin-left: 10px"
              @change.native="setSelectedRow(scope.row)"
              >&nbsp;</el-radio
            >
          </template>
        </el-table-column> -->
        <el-table-column
          label="端口组名称"
          prop="portGroupName"
          show-overflow-tooltip
        />
        <el-table-column label="端口" prop="ports" show-overflow-tooltip />
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
    <span slot="footer" class="dialog-footer">
      <el-button
        size="mini"
        type="primary"
        :loading="loading.submit"
        @click="handleSubmit"
        >下一步</el-button
      >
      <el-button size="mini" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { pick } from "lodash";
import globalMixins from "@/mixins/globalMixins.js";
import { getPortGroup } from "../api";
export default {
  mixins: [globalMixins],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: {
        table: false,
      },
      // selectedRow: {},
      selectedRow: [],
      selectedRadio: null,
      // 表格数据
      tableData: {
        data: [], // 当前数据
        pageSize: 20, // 分页数量
        pageNum: 1, // 当前页面位置
        total: 0, // 数据总数
      },
    };
  },
  computed: {
    // 筛选条件整合（左侧一级、二级选项）
    filterFormData() {
      const global = pick(this.tableData, ["pageSize", "pageNum"]);
      return {
        global,
        param: {},
      };
    },
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading.table = true;
      getPortGroup(this.filterFormData)
        .then((res) => {
          this.tableData = { ...this.tableData, ...res };
        })
        .finally(() => {
          this.loading.table = false;
        });
    },
    // 分页触发
    tTableChange(params) {
      this.tableChange(params, this.tableData, this.getList);
    },
    setSelectedRow(row) {
      this.selectedRow = row;
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleSubmit() {
      this.$emit("submit", this.selectedRow);
      this.$emit("update:visible", false);
    },
    handleSelectionChange(data) {
      this.selectedRow = data;
    },
  },
};
</script>
