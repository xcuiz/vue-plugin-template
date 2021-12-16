<template>
  <div>
    <el-card style="margin-bottom: 15px">
      <div slot="header" class="flex-sb-box">
        <div>
          <PageHeader :title="data.jobName" />
          <h3 class="sub-title">任务编号：{{ data.taskNo }}</h3>
        </div>
        <el-button-group>
          <el-button size="mini" @click="handleBack">返回</el-button>
          <!-- <el-button size="mini" @click="handleDownload">下载报告</el-button> -->
        </el-button-group>
      </div>
      <el-form size="mini">
        <el-row>
          <el-col :span="8">
            <el-col
              :span="4"
              style="
                text-align: center;
                padding-right: 20px;
                height: 56px;
                line-height: 56px;
              "
            >
              <img
                src="../../../../../assets/images/u754.svg"
                style="vertical-align: middle"
              />
            </el-col>
            <el-col :span="20">
              <el-form-item
                label="ip地址"
                style="margin-bottom: 0"
              ></el-form-item>
              <p class="bold-item">{{ data.ip }}</p>
            </el-col>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <div slot="label">
                <span class="level-dot level-4"></span>
                {{ data.senList[3].senLevel }}：
              </div>
              {{ data.senList[3].cnt }}
            </el-form-item>
            <el-form-item>
              <div slot="label">
                <span class="level-dot level-3"></span>
                {{ data.senList[2].senLevel }}：
              </div>
              {{ data.senList[2].cnt }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <div slot="label">
                <span class="level-dot level-2"></span>
                {{ data.senList[1].senLevel }}：
              </div>
              {{ data.senList[1].cnt }}
            </el-form-item>
            <el-form-item>
              <div slot="label">
                <span class="level-dot level-1"></span>
                {{ data.senList[0].senLevel }}：
              </div>
              {{ data.senList[0].cnt }}
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="涉敏项：">{{
              data.sensitiveTables + "/" + data.allTables
            }}</el-form-item>
            <el-form-item label="表结构变化："></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="所属部门：">{{ data.deptName }}</el-form-item>
            <el-form-item label="数据资产类型：">{{
              data.assetType
            }}</el-form-item>
            <el-form-item label="所属网络域：">{{
              data.netdistrictName
            }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import PageHeader from "@/components/PageHeader";
import { formatSecond } from "@/util/format";
import { getAssetReportDetail } from "../api";
export default {
  components: {
    PageHeader,
  },
  props: {
    assetId: {
      type: Number,
      required: true,
    },
    taskId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      data: {
        ip: "",
        port: "",
        deptName: "",
        assetType: "",
        businessSystem: "",
        netDistrictName: "",
        startTime: "",
        endTime: "",
        sensitiveLevel: "",
        dataNum: "",
        sensitiveDataNum: "",
        executeTime: "",
        sensitiveTables: "",
        allTables: "",
        senList: [
          {
            senLevel: "S1-低敏感级",
            cnt: null,
          },
          {
            senLevel: "S2-较敏感级",
            cnt: null,
          },
          {
            senLevel: "S3-敏感级",
            cnt: null,
          },
          {
            senLevel: "S4-极敏感级",
            cnt: null,
          },
        ],
      },
      formatSecond,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getAssetReportDetail(this.assetId, this.taskId).then((res) => {
        this.data = res;
      });
    },
    handleBack() {
      this.$router.back();
    },
  },
};
</script>
<style lang="postcss" scoped>
.el-form {
  .el-form-item {
    margin-bottom: 6px;
  }
}
.sub-title {
  color: #6b6b6b;
  font-size: 12px;
  line-height: 20px;
}
.bold-item {
  font-weight: 500;
  font-size: 20px;
}

.level-dot {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 8px;
  display: inline-block;

  &.level-1 {
    background-color: #fce165;
  }
  &.level-2 {
    background-color: #f5a351;
  }
  &.level-3 {
    background-color: #ed3c59;
  }
  &.level-4 {
    background-color: #cf0e2e;
  }
}
</style>
