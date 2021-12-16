<template>
  <div class="container">
    <BasicInfo
      :filing-id="filingId"
      :status-title="statusTitle"
      :data="filingData"
      style="margin-bottom: 12px"
      @success="getData"
    />
    <div class="tabs-content-box">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="`${statusTitle}信息`" name="first">
          <el-row :gutter="12">
            <el-col :span="16">
              <record-info
                :asset-id="assetId"
                :filing-state="filingState"
                :status-title="statusTitle"
                :mode="filingData.mode"
                @update-data="updateData"
              />
            </el-col>
            <el-col :span="8">
              <el-row>
                <FilingTimeline
                  ref="timeline"
                  :filing-id="assetId"
                  :filing-state="filingState"
                  :status-title="statusTitle"
                />
              </el-row>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="涉敏数据" name="second">
          <SensitiveTable
            :filing-id="filingId"
            :asset-id="assetId"
            :mode="filingData.mode"
            :filing-state="filingState"
          />
        </el-tab-pane>
        <!-- 只有在认领状态显示 -->
        <el-tab-pane
          v-if="[1, 2].includes(filingData.isFiling)"
          :label="`表${statusTitle}`"
          name="third"
        >
          <TableRecord
            :asset-id="assetId"
            :filing-state="filingState"
            :status-title="statusTitle"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import BasicInfo from "./coms/basic-info";
import FilingTimeline from "./components/filing-timeline";
import SensitiveTable from "./coms/sensitive-table";
import RecordInfo from "./components/record-info";
import TableRecord from "./components/table-record";
import { getFilingData } from "./api";
export default {
  components: {
    BasicInfo,
    FilingTimeline,
    SensitiveTable,
    RecordInfo,
    TableRecord,
  },
  data() {
    return {
      filingId: "",
      assetId: "",
      filingState: null,
      activeName: "first",
      filingData: {},
    };
  },
  computed: {
    statusTitle() {
      const { isFiling } = this.filingData;

      const titles = {
        1: "认领",
        2: "认领",
        3: "备案",
        4: "备案",
      };

      return titles[isFiling];
    },
  },
  created() {
    const { filingId, assetId, filingState } = this.$route.query;
    this.filingId = filingId;
    this.assetId = assetId;
    this.filingState =
      typeof filingState === "string" ? parseInt(filingState) : filingState;
    this.getData();
  },
  methods: {
    getData() {
      getFilingData(this.assetId).then((res) => {
        const storageModeMap = {
          BigData: "大数据",
          DataBase: "数据库",
          File: "文件",
        };
        // const isFilingMap = {
        //   1: "已备案",
        //   0: "未备案",
        // };
        this.filingData = res;
        this.filingData.storageModeDesc = storageModeMap[res.storageMode];
        // this.filingData.isFilingDesc = isFilingMap[res.isFiling];
      });
    },
    updateData() {
      this.getData();

      this.$refs.timeline.getData();
    },
  },
};
</script>

<style scoped lang="postcss">
.container {
  padding: 10px 15px;

  .tabs-content-box {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border: 1px solid #ebeef5;
    background-color: #fff;
  }

  .idss-font--title {
    font-size: var(--font-size-16);
    margin-bottom: 10px;
  }
  .el-form-item {
    margin-bottom: 6px;
  }
  .bold-item {
    font-weight: 500;
    font-size: 20px;
  }
}
>>> .page-header {
  padding-top: 6px;
  padding-bottom: 6px;
}

>>> {
  .el-tabs__header {
    padding: 0 12px;
  }
  .el-tabs__item.is-active {
    border-bottom-color: #f4f6f9 !important;
  }
}
</style>
