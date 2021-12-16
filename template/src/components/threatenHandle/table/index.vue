<!--
 * @Author: your name
 * @Date: 2020-06-12 17:55:28
 * @LastEditTime: 2020-06-30 16:53:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/demo/components/threatenHandle/table/index.vue
-->
<template>
  <article>
    <!-- 表格 -->
    <el-table
      :data="data"
      fit
      stripe
      size="mini"
      max-height="500"
      highlight-current-row
    >
      <el-table-column width="60px" align="left" label="#">
        <template slot-scope="scope">
          <span>{{ scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处置时间" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.surveyTime | filter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处置账号" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.account | filter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调查状态" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.surveyState | filter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="调查结果" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.surveyResult | filter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="showWarnCol"
        label="告警处置"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ scope.row.surveyWarn | filter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="处置说明" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.surveyOption | filter }}</span>
        </template>
      </el-table-column>
    </el-table>
  </article>
</template>

<script>
export default {
  filters: {
    filter(val) {
      return val || "-";
    },
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    showWarnCol: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style></style>
