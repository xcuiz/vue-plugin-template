<template>
  <div class="filing-timeline-container">
    <div slot="header">
      <div class="timeline-title">{{ statusTitle }}记录</div>
    </div>
    <div class="block">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in data"
          :key="index"
          :timestamp="item.operateTime"
          placement="top"
        >
          <div>
            <h4 class="operate-content">
              {{ statusTitle }}内容：{{ item.operateContent }}
            </h4>
            <p>
              <span class="operate-user">{{ item.operateUser }}</span> 提交于
              {{ item.operateTime }}
            </p>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>
<script>
import { getFilingRecord } from "../api";
export default {
  props: {
    filingId: {
      type: [Number, String],
      require: true,
    },
    statusTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      data: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getFilingRecord(this.filingId).then((res) => {
        this.data = res;
      });
    },
  },
};
</script>
<style lang="postcss" scoped>
.filing-timeline-container {
  .timeline-title {
    border-left: 4px solid #4a90e2;
    padding-left: 15px;
    margin-bottom: 20px;
  }

  .operate-content {
    margin: 10px 0;
    word-break: break-all;
    line-height: 24px;
  }

  .operate-user {
    color: #4a90e2;
  }
}
.block {
  height: 555px;
  overflow-y: scroll;
  margin-left: -2px;
}
</style>
