<!--
 * @Author: your name
 * @Date: 2021-09-24 16:33:46
 * @LastEditTime: 2021-09-26 11:44:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \data-gov-web\src\views\asset\data-source-detect\scan-task\components\ScanDetail.vue
-->

<template>
  <el-dialog
    :close-on-click-modal="false"
    custom
    title="扫描详情"
    :visible="visible"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    width="900px"
    @close="closeDialog"
  >
    <el-table
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      max-height="780"
      size="mini"
      stripe
      fit
      highlight-current-row
      :data="tableData.data"
    >
      <el-table-column label="资产名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.name || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="ip" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.ip || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="端口" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.port || "-" }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="资产类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.assetType || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="业务系统" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.businessSysName || "-" }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="运行状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.status || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行结果" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.result || "-" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运行时长" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.executeTimeLong || "-" }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="closeDialog"> 取 消 </el-button>
    </span> -->
  </el-dialog>
</template>

<script>
/* eslint-disable no-empty */
import { formatSecond } from "@/util/format";
export default {
  name: "ScanDetail",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    taskId: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      loading: false,

      tableData: {
        data: [],
      },
    };
  },
  created() {
    if (this.taskId) {
      this.loadDetail();
    }
  },
  methods: {
    async loadDetail() {
      this.loading = true;
      try {
        const result = await this.$request({
          url: `/gov/api/asset/job/getDaqTaskInfosByTaskId/${this.taskId}`,
          method: "GET",
        });

        if (Array.isArray(result)) {
          this.tableData.data = result.map((v) => ({
            ...v,
            executeTimeLong: formatSecond(v.executeTimeLong),
          }));
        }
      } catch (e) {
      } finally {
        this.loading = false;
      }
    },
    closeDialog() {
      this.$emit("update:visible");
    },
  },
};
</script>
