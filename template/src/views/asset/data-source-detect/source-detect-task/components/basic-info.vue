<template>
  <div>
    <el-card style="margin-bottom: 15px">
      <div slot="header" class="flex-sb-box">
        <div>
          <PageHeader :title="data.name" />
          <h3 class="sub-title">任务编号：{{ data.taskNo }}</h3>
        </div>
        <div>
          <el-button size="mini" :disabled="!allowStop" @click="handleStop"
            >停止</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="mini"
            type="primary"
            @click="toScanDetail"
            >扫描详情</el-button
          >
          <!-- <el-button size="mini" @click="handleDownload">下载报告</el-button> -->
        </div>
      </div>
      <el-form size="mini">
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="6">
                <el-form-item label="识别模版：">{{
                  data.featurName
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="扫描类型：">{{
                  data.scanType === "01" ? "增量扫描" : "全量扫描"
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建时间：">{{
                  data.createTime
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="扫描资源类型：">{{
                  data.scanType === "01" ? "增量扫描" : "全量扫描"
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="执行方式：">{{
                  data.executeCycle === "02" ? "周期执行" : "立即执行"
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="修改人：">{{
                  data.updateUser
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="抽样方式：">{{
                  data.sampleType
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="取样数量：">{{
                  data.sampleNum
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="最近修改时间：">{{
                  data.updateTime
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="创建人：">{{
                  data.createUser
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="开始时间：">{{
                  data.startTime
                }}</el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="结束时间：">{{
                  data.endTime
                }}</el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item label="开始时间：">{{ data.startTime }}</el-form-item>
            <el-form-item label="结束时间：">{{ data.endTime }}</el-form-item>
            <el-col :span="12">
              <el-form-item label="执行状态"></el-form-item>
              <p class="bold-item">
                {{ data.statusDesc }}
              </p>
            </el-col>
            <el-col :span="12">
              <el-form-item label="执行时长"></el-form-item>
              <p class="bold-item">
                {{ formatSecond(data.executeTimeLong) }}
              </p>
            </el-col>
          </el-col> -->
        </el-row>
      </el-form>
    </el-card>
    <div v-if="scanDetailVisible">
      <scan-detail :visible.sync="scanDetailVisible" :task-id="taskId" />
    </div>
  </div>
</template>
<script>
import {
  getReportDetail,
  getScanResult,
  downloadReport,
  operateTask,
} from "../api";
import PageHeader from "@/components/PageHeader";
import { downloadBlob } from "@/util/download";
import { TASK_STATUS } from "@/constants";
import { formatSecond } from "@/util/format";
import ScanDetail from "./ScanDetail.vue";
export default {
  components: {
    PageHeader,
    ScanDetail,
  },
  props: {
    taskId: {
      type: [Number, String],
    },
  },
  data() {
    return {
      data: {
        name: "",
        startTime: "",
        endTime: "",
      },
      scanResult: {
        sensitiveAssetNum: "",
        assetNum: "",
        sensitiveDataNum: "",
        executeTimeLong: "",
        checkAssetSuccessNum: "",
        checkAssetFailNum: "",
      },
      formatSecond,

      scanDetailVisible: false,
    };
  },
  computed: {
    allowStop() {
      const status = this.data.status;
      const { WAITING, RUNNING, PAUSED } = TASK_STATUS;
      return [WAITING, RUNNING, PAUSED].indexOf(status) !== -1;
    },
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getReportDetail(this.taskId).then((res) => {
        this.data = res;
      });
      getScanResult(this.taskId).then((res) => {
        this.scanResult = res;
      });
    },
    handleDownload() {
      downloadReport(this.taskId)
        .then((blob) => {
          if (blob.data.size) {
            downloadBlob(blob);
          } else {
            this.$message.error("下载失败");
          }
        })
        .catch(() => {
          this.$message.error("下载失败");
        });
    },
    handleStop() {
      this.$confirm(`确认将停止任务, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          operateTask({
            idList: [this.taskId],
            operateType: "stop",
          }).then(() => {
            this.$message.success("操作成功");
            this.getData();
            this.$emit("change");
          });
        })
        .catch(() => {});
    },
    toScanDetail() {
      this.scanDetailVisible = true;
    },
  },
};
</script>
<style lang="postcss" scoped>
.sub-title {
  color: #6b6b6b;
  font-size: 12px;
  line-height: 20px;
}

.info-card {
  >>> .el-card__body {
    display: flex;
    height: 99px;
  }
  .card-icon {
    width: 56px;
    height: 56px;
    margin-right: 20px;
  }

  .title {
    color: #777;
    font-size: 14px;
    line-height: 22px;
  }

  .content {
    font-size: 26px;
  }

  .normal-style {
    font-size: 16px;
    line-height: 28px;
  }
}
.el-form-item {
  margin-bottom: 6px;
}
.bold-item {
  font-weight: 500;
  font-size: 20px;
}
</style>
