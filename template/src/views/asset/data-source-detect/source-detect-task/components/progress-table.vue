<template>
  <el-card>
    <div slot="header">
      <h2>各资产检查进度</h2>
    </div>
    <el-table
      row-key="id"
      :data="data"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      size="mini"
      stripe
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" type="index" />
      <el-table-column label="资产名" prop="assetName" show-overflow-tooltip />
      <el-table-column label="ip&端口" prop="ip" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.ip + ":" + scope.row.port }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="storageMode" show-overflow-tooltip />
      <el-table-column label="探针" prop="probeName" show-overflow-tooltip />
      <el-table-column label="进度" prop="runProcess" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-progress :percentage="Number(scope.row.runProcess)"></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
};
</script>
