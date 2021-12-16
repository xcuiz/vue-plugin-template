<template>
  <el-row :gutter="12">
    <el-col v-for="item in list" :key="item.code" :span="4" style="width: 20%">
      <el-card shadow="hover" class="info-card">
        <idss-icon-svg class="card-icon" :name="item.icon"></idss-icon-svg>
        <div>
          <div class="title">{{ item.name }}</div>
          <div class="card-info-content">{{ data[item.code] || "-" }}</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import idssIconSvg from "@/fusion-components/commons/idss-icon-svg.vue";
import { getCount } from "../api";
export default {
  components: { idssIconSvg },
  data() {
    return {
      list: [
        {
          icon: "ctaskall",
          code: "taskTotalNum",
          name: "扫描任务总数",
        },
        {
          icon: "ctasknot",
          code: "finshTaskNum",
          name: "已执行完成任务数",
        },
        {
          icon: "ctaskdoing",
          code: "netDistrictNum",
          name: "扫描网络域个数",
        },
        {
          icon: "ctaskr",
          code: "assetNum",
          name: "发现数据资源个数",
        },
        {
          icon: "ctaskadd",
          code: "assetTypeNum",
          name: "数据资源类别数",
        },
        // {
        //   icon: "ctaskf",
        //   code: "failedTaskNum",
        //   name: "执行失败任务数",
        // },
      ],
      data: {
        taskTotalNum: null,
        waitTaskNum: null,
        runningTaskNum: null,
        finshTaskNum: null,
        newTaskNumOfToday: null,
        failedTaskNum: null,
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getCount().then((res) => {
        this.data = res;
      });
    },
  },
};
</script>
<style lang="postcss" scoped>
.info-card {
  >>> .el-card__body {
    display: flex;
    height: 99px;
  }
  .card-icon {
    width: 36px;
    height: 36px;
    margin-right: 20px;
  }

  .title {
    color: #777;
    font-size: 14px;
    line-height: 22px;
  }

  .card-info-content {
    font-size: 26px;
  }

  .normal-style {
    font-size: 16px;
    line-height: 28px;
  }
}
</style>
