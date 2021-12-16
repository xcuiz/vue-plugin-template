<template>
  <div class="form-content">
    <el-form
      ref="form"
      v-loading="loading.detail"
      primary
      :model="form"
      :rules="rules"
      size="mini"
      label-width="140px"
      label-suffix=":"
    >
      <el-form-item label="扫描目标" prop="assetIds">
        <el-input
          v-model="selectedAssetsName"
          readonly
          style="cursor: pointer"
          placeholder="请选择"
          type="textarea"
          rows="5"
          @click.native="showAssetDialog"
        />
        <!-- <el-select v-model="form.assetIds" multiple>
          <el-option
            v-for="option in assets"
            :key="option.id"
            :value="option.id"
            :label="option.name"
          ></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
        <el-input
          v-model="form.name"
          size="mini"
          maxlength="64"
          placeholder="请输入"
        ></el-input>
      </el-form-item>
      <el-form-item label="识别模版" prop="featureId">
        <el-select v-model="form.featureId">
          <el-option
            v-for="item in options.selectFeatureList"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="扫描类型" prop="scanType">
        <el-radio-group v-model="form.scanType">
          <el-radio label="01">增量扫描</el-radio>
          <el-radio label="02">全量扫描</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="抽样方式" prop="sampleType">
        <el-radio v-model="form.sampleType" label="2">随机</el-radio>
        <el-radio v-model="form.sampleType" label="0">正数</el-radio>
        <el-radio v-model="form.sampleType" label="1">倒数</el-radio>
      </el-form-item>
      <el-form-item label="取样数量" prop="sampleNum">
        <el-input-number
          v-model="form.sampleNum"
          size="mini"
          controls-position="right"
          :min="1"
          :max="10000"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="获取表字段变更" prop="isGetTableUpdate">
        <el-switch
          v-model="form.isGetTableUpdate"
          active-value="1"
          inactive-value="0"
          active-text="开"
          inactive-text="关"
        ></el-switch>
      </el-form-item>
      <el-form-item label="返回字段" prop="returnFieldType">
        <el-radio v-model="form.returnFieldType" label="1">全量</el-radio>
        <el-radio v-model="form.returnFieldType" label="2">仅敏感</el-radio>
      </el-form-item>
      <el-form-item label="执行方式" prop="executeCycle">
        <el-select v-model="form.executeCycle">
          <el-option value="02" label="周期执行"></el-option>
          <el-option value="01" label="立即执行"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        v-if="form.executeCycle === '02'"
        label="执行频率"
        prop="crontab"
      >
        <CrontabSelect v-model="form.crontab" />
      </el-form-item>
      <el-form-item label="敏感识别配置" prop="probe">
        <AssetProbeTable v-model="form.probe" :data="selectedAssets" />
      </el-form-item>
      <div style="text-align: right; margin-top: -10px; margin-right: 5px">
        <el-button
          size="mini"
          type="primary"
          :loading="testLoading"
          :disabled="testLoading"
          @click="toTest"
          >连通性测试</el-button
        >
      </div>
    </el-form>
    <div v-if="type !== 'check'" class="form-footer">
      <el-button
        size="mini"
        type="primary"
        :loading="loading.submit"
        @click="handleSubmit"
        >确 定</el-button
      >
      <el-button size="mini" @click="handleClose">取 消</el-button>
    </div>
    <AssetsDialog
      :visible.sync="assetsDialog.visible"
      :assets="assetsDialog.assets"
      @submit="handleAssetsChange"
    />
    <ConnectTestDialog :visible.sync="errorVisible" :error-list="errorList" />
  </div>
</template>
<script>
/* eslint-disable no-empty */
import _ from "lodash";
import {
  addJob,
  getJobDetail,
  updateJob,
  getAssets,
  getSelectFeature,
  getAsset,
} from "../api";
import { WEEK_DAYS } from "@/constants";
import CrontabSelect from "@/components/crontab-select";
import AssetProbeTable from "./asset-probe-table";
import AssetsDialog from "./assets-dialog";
import ConnectTestDialog from "./connect-test-dialog.vue";
const formDefaultValue = {
  assetIds: [],
  name: null,
  scanType: "02",
  sampleType: "2",
  sampleNum: 20,
  isGetTableUpdate: "1",
  returnFieldType: "1",
  executeCycle: "01",
  featureId: null,
  probe: {},
  crontab: {},
};
export default {
  components: {
    AssetProbeTable,
    CrontabSelect,
    AssetsDialog,
    ConnectTestDialog,
  },
  props: {
    id: {
      type: [String, Number],
    },
    assetId: {
      type: [String, Number],
    },
    visible: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      loading: {
        detail: false,
        submit: false,
      },
      form: {
        ...formDefaultValue,
        assetIds: this.assetId ? [this.assetId] : [],
      },
      rules: {
        assetIds: [
          {
            type: "array",
            required: true,
            message: "请选择",
          },
        ],
        name: [
          {
            required: true,
            message: "请输入",
          },
        ],
        scanType: [
          {
            required: true,
            message: "请选择",
          },
        ],
        sampleType: [
          {
            required: true,
            message: "请选择",
          },
        ],
        sampleNum: [
          {
            type: "number",
            required: true,
            message: "请输入",
          },
        ],
        returnFieldType: [
          {
            required: true,
            message: "请选择",
          },
        ],
        executeCycle: [
          {
            required: true,
            message: "请选择",
          },
        ],
        featureId: [
          {
            required: true,
            message: "请选择",
          },
        ],
        probe: [
          {
            trigger: "submit",
            validator: (rule, value, callback) => {
              const isAllSelected = !this.form.assetIds.filter(
                (id) => !(value[id] || value[id] === 0)
              ).length;
              if (isAllSelected) {
                callback();
              } else {
                callback("请选择探针");
              }
            },
          },
        ],
        crontab: [
          {
            required: true,
            trigger: "submit",
            validator: (rule, value, callback) => {
              const { executeType, executeCron, executeConfig } = value;
              const { time, day, week, month } = executeConfig;
              let message;
              switch (executeType) {
                case "day":
                  if (!time) {
                    message = "请选择时间";
                  }
                  break;
                case "week":
                  if (!time) {
                    message = "请选择时间";
                  } else if (!week) {
                    message = "请选择星期";
                  }
                  break;
                case "month":
                  if (!time) {
                    message = "请选择时间";
                  } else if (!day) {
                    message = "请选择日期";
                  }
                  break;
                case "year":
                  if (!time) {
                    message = "请选择时间";
                  } else if (!day) {
                    message = "请选择日期";
                  } else if (!month) {
                    message = "请选择月份";
                  }
                  break;
                case "cron":
                  if (!executeCron) {
                    message = "请输入Cron表达式";
                  }
                  break;
                default:
                  break;
              }
              if (message) {
                callback(message);
              } else {
                callback();
              }
            },
          },
        ],
      },
      options: {
        producerList: [],
        typeList: [],
        locationIdList: [],
        netDistrictIdList: [],
        runTimeWeekdayList: WEEK_DAYS,
        selectFeatureList: [],
      },
      assets: [],
      assetsDialog: {
        visible: false,
        assets: [],
      },
      selectedAssets: [],

      errorVisible: false,
      testLoading: false,
      errorList: [],
    };
  },
  computed: {
    selectedAssetsName() {
      return this.selectedAssets
        .map(
          (item) =>
            `${item.name}-${item.ip}-${item.assetType}-${
              item.businessSysName || ""
            }`
        )
        .join(",\n");
    },
  },
  watch: {
    selectedAssets: {
      handler(newVal) {
        if (this.type === "add") {
          this.form.name = `敏感识别任务[${newVal
            .map((item) => item.ip)
            .join(",")}]`;
        }
      },
      deep: true,
    },
  },
  async created() {
    await this.getAssets();
    this.getSelectFeatureList();
    if (this.id) {
      this.getDetail();
    }
    if (this.assetId) {
      this.getAssetDetail();
    }
  },
  methods: {
    async getAssets() {
      await getAssets({
        global: {
          pageSize: 20000,
          pageNum: 1,
          orderField: "",
          orderType: "desc",
        },
        param: { assetTypeList: [] },
      }).then((res) => {
        this.assets = res.data;
      });
    },
    getAssetDetail() {
      getAsset(this.assetId).then((res) => {
        this.selectedAssets = [
          { ...res.data, businessSysName: res.data.businessSystem },
        ];
      });
    },
    getSelectFeatureList() {
      getSelectFeature().then((res) => {
        this.options.selectFeatureList = res;
        if (this.type === "add") {
          this.form.featureId = this.options.selectFeatureList[0]?.code || null;
        }
      });
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading.submit = true;
          const data = this.getFormData();
          const func = this.type === "add" ? addJob : updateJob;
          const args = this.type === "add" ? [data] : [this.id, data];
          func(...args)
            .then(() => {
              this.$message.success("保存成功");
              this.$emit("success");
              this.handleClose();
            })
            .finally(() => {
              this.loading.submit = false;
            });
        }
      });
    },
    getFormData() {
      const result = _.pick(this.form, [
        "name",
        "scanType",
        "sampleType",
        "isGetTableUpdate",
        "sampleNum",
        "returnFieldType",
        "executeCycle",
        "featureId",
      ]);
      const { crontab } = this.form;
      const executeConfig = JSON.stringify(crontab.executeConfig);
      result.assets = this.form.assetIds.map((id) => {
        const find = this.errorList.find(({ assetId }) => id === assetId);

        return find
          ? {
              probeConnectStatus: find.status,
              probeConnectMsg: find.info,
              assetId: id,
              probeId: this.form.probe[id],
            }
          : {
              assetId: id,
              probeId: this.form.probe[id],
            };
      });
      return {
        ...result,
        ...crontab,
        executeConfig,
      };
    },
    setFormData(data) {
      const basic = _.pick(data, [
        "name",
        "scanType",
        "sampleType",
        "isGetTableUpdate",
        "sampleNum",
        "returnFieldType",
        "executeCycle",
        "featureId",
      ]);
      const crontab = _.pick(data, [
        "executeType",
        "executeCron",
        "executeConfig",
      ]);
      try {
        crontab.executeConfig = JSON.parse(crontab.executeConfig);
      } catch (error) {
        crontab.executeConfig = {};
      }
      const assets = data.assets || [];
      const assetIds = [];
      const probe = {};
      assets.forEach(({ assetId, probeId }) => {
        assetIds.push(assetId);
        probe[assetId] = probeId;
      });
      this.form = {
        ...basic,
        crontab,
        assetIds,
        probe,
      };
      const selectedAssets = [];

      this.assets.forEach((item) => {
        if (assetIds.indexOf(item.id) !== -1) {
          const find = assets.find(({ assetId }) => assetId === item.id);
          selectedAssets.push(
            find
              ? {
                  probeConnectStatus: find.probeConnectStatus,
                  probeConnectMsg: find.probeConnectMsg,
                  ...item,
                }
              : item
          );
        }
      });

      this.selectedAssets = selectedAssets;

      // const errorList = [];

      // assets.forEach(
      //   ({ assetId, assetName, probeConnectStatus, probeConnectMsg }) => {
      //     if (probeConnectStatus) {
      //       errorList.push({
      //         assetId: assetId,
      //         label: assetName,
      //         status: probeConnectStatus,
      //         info: probeConnectMsg,
      //       });
      //     }
      //   }
      // );

      // this.errorList = errorList;

      // this.selectedAssets = this.assets.filter((item) => {
      //   return assetIds.indexOf(item.id) !== -1;
      // });
    },
    getDetail() {
      this.loading.detail = true;
      getJobDetail(this.id)
        .then((res) => {
          this.setFormData(res);
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
    showAssetDialog() {
      this.assetsDialog = {
        visible: true,
        assets: this.form.assets,
      };
    },
    handleAssetsChange(value) {
      this.form.assetIds = value.map((item) => item.id);

      const selectedAssets = [];
      value.forEach((item) => {
        const find = this.errorList.find(({ assetId }) => item.id === assetId);
        selectedAssets.push(
          find
            ? {
                ...item,
                probeConnectStatus: find.status,
                probeConnectMsg: find.info,
              }
            : item
        );
      });

      this.selectedAssets = selectedAssets;
    },
    async toTest() {
      const { form, selectedAssets } = this;
      const { probe } = form;

      if (Array.isArray(selectedAssets) && selectedAssets.length > 0) {
        this.testLoading = true;
        try {
          const body = selectedAssets.map(({ id }) => {
            const probeId = probe[id] || null;
            return {
              assetId: id,
              probeId,
            };
          });
          const result = await this.$request({
            url: "/gov/api/data/job/task/testProbeConnect",
            method: "POST",
            data: {
              assetProbeIds: body,
            },
          });

          if (Array.isArray(result)) {
            const errorList = [];

            result.forEach(
              ({ assetId, probeName, probeConnectStatus, probeConnectMsg }) => {
                if (probeConnectStatus === "2") {
                  errorList.push({
                    assetId,
                    label: probeName,
                    status: probeConnectStatus,
                    info: probeConnectMsg,
                  });
                }
              }
            );

            this.errorList = errorList;
            this.errorVisible = true;

            this.selectedAssets.forEach((item, i) => {
              this.$set(this.selectedAssets, i, {
                ...item,
                probeConnectStatus: result[i].probeConnectStatus,
                probeConnectMsg: result[i].probeConnectMsg,
              });
            });
          }
        } catch (e) {
        } finally {
          this.testLoading = false;
        }
      }
    },
  },
};
</script>
<style lang="postcss" scoped>
.form-content {
  display: flex;
  flex-direction: column;
  height: 100%;

  form {
    height: calc(100vh - 150px);
    overflow-x: hidden;
    overflow-y: scroll;
  }

  .form-footer {
    margin-top: 12px;
    display: flex;
    justify-content: center;
  }
}
.el-form[primary] >>> {
  .el-input {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
  .el-textarea {
    width: 100%;
  }
}
</style>
