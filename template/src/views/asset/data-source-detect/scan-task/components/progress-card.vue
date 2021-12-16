<template>
  <el-card>
    <div slot="header" class="flex-sb-box">
      <PageHeader title="任务进度" />
      <!-- <el-button-group>
        <el-button
          :disabled="!allowContinue"
          size="mini"
          @click="handleOperate('continue')"
          >继续</el-button
        >
        <el-button
          :disabled="!allowSuspend"
          size="mini"
          @click="handleOperate('suspend')"
          >暂停</el-button
        >
        <el-button
          :disabled="!allowStop"
          size="mini"
          @click="handleOperate('stop')"
          >停止</el-button
        >
        <el-button size="mini" @click="handleBack">返回</el-button>
      </el-button-group> -->
    </div>
    <Progress :value="Number(taskProgress.runProcess)">
      <span slot="start"> 开始时间: {{ taskProgress.startTime }} </span>
      <span v-if="taskProgress.endTime" slot="end">
        结束时间: {{ taskProgress.endTime }}
      </span>
    </Progress>
  </el-card>
</template>
<script>
import PageHeader from "@/components/PageHeader";
import Progress from "@/components/progress";
import { operateTask, getTaskProgress } from "../api";
export default {
  components: {
    PageHeader,
    Progress,
  },
  props: {
    taskId: {
      type: [Number, String],
      required: true,
    },
    data: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      taskProgress: {},
    };
  },
  computed: {
    allowContinue() {
      return this.data.status === 5;
    },
    allowSuspend() {
      return [2, 3].indexOf(this.data.status) !== -1;
    },
    allowStop() {
      return [2, 3, 5].indexOf(this.data.status) !== -1;
    },
  },
  created() {
    this.getProgress();
  },
  methods: {
    handleBack() {
      this.$router.back();
    },
    handleOperate(operate) {
      const actionText = {
        scan: "重新扫描",
        suspend: "暂停",
        continue: "继续",
        stop: "停止",
        delete: "删除",
      };
      const text = actionText[operate];
      this.$confirm(`确认将${text}任务, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          operateTask(this.taskId, { operate }).then(() => {
            this.$message.success("操作成功");
            this.$emit("operate", operate);
          });
        })
        .catch(() => {});
    },
    getProgress() {
      getTaskProgress(this.taskId).then((res) => {
        this.taskProgress = res;
      });
    },
  },
};
</script>
