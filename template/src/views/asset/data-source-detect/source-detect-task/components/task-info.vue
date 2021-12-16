<template>
  <div>
    <el-card>
      <PageHeader
        slot="header"
        :title="data.name + '- 任务编号：' + data.taskNo"
      />
      <el-form size="mini">
        <el-row>
          <el-col :span="8">
            <el-form-item label="已完成资产数：">{{
              data.completedAssetNum
            }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="开始时间：">{{ data.startTime }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="执行中资产数：">{{
              data.runningAssetNum
            }}</el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="已执行时间：">{{ data.time }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="待执行资产数：">{{
              data.waitAssetNum
            }}</el-form-item>
          </el-col>
          <el-col v-if="data.endTime" :span="16">
            <el-form-item label="结束时间：">{{ data.endTime }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import PageHeader from "@/components/PageHeader";
export default {
  components: {
    PageHeader,
  },
  props: {
    taskId: {
      type: String,
      required: true,
    },
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
};
</script>
