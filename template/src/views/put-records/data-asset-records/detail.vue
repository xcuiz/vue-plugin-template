<template>
  <div class="container">
    <FilingBasicInfo
      :filing-id="filingId"
      :data="filingData"
      style="margin-bottom: 12px"
      @success="getData"
    />
    <el-tabs v-model="activeName">
      <el-tab-pane label="备案信息" name="first">
        <el-row :gutter="12">
          <el-col :span="16">
            <el-row>
              <FilingInfo :filing-id="filingId" style="margin-bottom: 12px" />
            </el-row>
            <el-row>
              <AssetInfo :filing-id="filingId" :data="filingData" />
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row>
              <FilingTimeline :filing-id="filingId" />
            </el-row>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="涉敏数据" name="second">
        <SensitiveTable
          :filing-id="filingId"
          :asset-id="assetId"
          :mode="filingData.storageMode"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import FilingBasicInfo from "./components/filing-basic-info";
import FilingInfo from "./components/filing-info";
import FilingTimeline from "./components/filing-timeline";
import AssetInfo from "./components/asset-info";
import SensitiveTable from "./components/sensitive-table";
import { getFilingData } from "./api";
export default {
  components: {
    FilingBasicInfo,
    FilingInfo,
    FilingTimeline,
    AssetInfo,
    SensitiveTable,
  },
  props: {
    filingId: {
      type: [Number, String],
      require: true,
    },
    assetId: {
      type: [Number, String],
      require: true,
    },
  },
  data() {
    return {
      activeName: "first",
      filingData: {},
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      getFilingData(this.filingId).then((res) => {
        const storageModeMap = {
          BigData: "大数据",
          DataBase: "数据库",
          File: "文件",
        };
        const isFilingMap = {
          1: "已备案",
          0: "未备案",
        };
        this.filingData = res;
        this.filingData.storageModeDesc = storageModeMap[res.storageMode];
        this.filingData.isFilingDesc = isFilingMap[res.isFiling];
      });
    },
  },
};
</script>

<style scoped lang="postcss">
.container {
  padding: 10px 15px;
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
