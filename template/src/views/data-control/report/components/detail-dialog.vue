<template>
  <el-dialog
    custom
    :title="title"
    :visible="visible"
    :modal-append-to-body="false"
    class="report-dialog"
    top="5vh"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="form"
      v-loading="loading.detail"
      primary
      :model="form"
      :rules="rules"
      size="mini"
      label-width="120px"
      label-suffix=":"
    >
      <el-form-item label="报表名称" prop="reportName">
        <el-input
          v-model="form.reportName"
          size="mini"
          maxlength="20"
          placeholder="请输入"
        ></el-input>
      </el-form-item>

      <div class="form-title">
        <h3>监控数据范围:</h3>
      </div>
      <el-form-item label="归属应用" prop="businessSysId">
        <el-select v-model="form.businessSysIdList" multiple>
          <el-option
            v-for="item in options.businessSys"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属网络域" prop="netdistrictIdList">
        <idss-select-tree
          v-model="form.netdistrictIdList"
          size="mini"
          node-key="code"
          :data="options.netdistrict"
          :select="{
            multiple: true,
            'collapse-tags': true,
          }"
          :tree="{
            'show-checkbox': true,
            'default-expand-all': true,
          }"
          :props="{
            label: 'name',
            children: 'children',
          }"
        >
        </idss-select-tree>
      </el-form-item>
      <el-form-item label="归属部门" prop="deptIdList">
        <idss-select-tree
          v-model="form.deptIdList"
          size="mini"
          node-key="code"
          :data="options.dept"
          :select="{
            multiple: true,
            'collapse-tags': true,
          }"
          :tree="{
            'show-checkbox': true,
            'default-expand-all': true,
          }"
          :props="{
            label: 'name',
            children: 'children',
          }"
        >
        </idss-select-tree>
      </el-form-item>
      <el-form-item label="存储类型" prop="storageModeList">
        <el-select
          v-model="form.storageModeList"
          multiple
          @change="getDBOptions"
        >
          <el-option
            v-for="item in options.storage"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数据库类型" prop="assetTypeList">
        <el-select v-model="form.assetTypeList" multiple>
          <el-option
            v-for="item in options.dbOptions"
            :key="item.code"
            :value="item.code"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="owner">
        <el-input v-model="form.owner" placeholder="请输入" />
      </el-form-item>
      <el-form-item key="executeCycle" label="执行方式" prop="executeCycle">
        <el-col :span="18">
          <el-select v-model="form.executeCycle">
            <el-option value="02" label="周期执行"></el-option>
            <el-option value="01" label="立即执行"></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item
        v-if="form.executeCycle === '02'"
        label="执行频率"
        prop="crontab"
      >
        <el-col :span="18">
          <CrontabSelect v-model="form.crontab" />
        </el-col>
      </el-form-item>
      <div>
        <div class="form-title">
          <h3>发送邮件列表:</h3>
        </div>
        <el-form-item label="目标邮箱" prop="to">
          <el-input
            v-model="form.to"
            placeholder="多个邮箱请使用 , 分割"
          ></el-input>
        </el-form-item>
        <el-form-item label="抄送" prop="cc">
          <el-input
            v-model="form.cc"
            placeholder="多个邮箱请使用 , 分割"
          ></el-input>
        </el-form-item>
        <el-form-item label="密送" prop="bcc">
          <el-input
            v-model="form.bcc"
            placeholder="多个邮箱请使用 , 分割"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮件主题" prop="subject">
          <el-input
            v-model="form.subject"
            placeholder="例：运维周报$report_name$-$report_time$"
          ></el-input>
        </el-form-item>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button
        size="mini"
        type="primary"
        :loading="loading.submit"
        @click="handleSubmit"
        >确 定</el-button
      >
      <el-button size="mini" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  addReportConfig,
  getReportConfig,
  updateReportConfig,
  getCommonSelectOptions,
  getDBOptions,
} from "../api";

import CrontabSelect from "@/components/crontab-select";
import crontabRule from "@/components/crontab-select/rule";
const formDefaultValue = {
  reportName: null,
  businessSysIdList: [],
  netdistrictIdList: [],
  deptIdList: [],
  storageModeList: [],
  assetTypeList: [],
  owner: null,
  executeCycle: null,
  crontab: {},
  to: null,
  cc: null,
  bcc: null,
  subject: null,
};
export default {
  components: {
    CrontabSelect,
  },
  props: {
    reportId: {
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
      isPersit: false,
      loading: {
        detail: false,
        submit: false,
        cron: false,
      },
      form: { ...formDefaultValue },
      rules: {
        reportName: [
          {
            required: true,
            message: "请输入报表名称",
          },
        ],
        executeCycle: [
          {
            required: true,
            message: "请选择执行方式",
          },
        ],
        crontab: [crontabRule],
        to: [
          {
            required: true,
            message: "请输入目标邮箱",
          },
        ],
        subject: [
          {
            required: true,
            message: "请输入邮件主题",
          },
        ],
      },
      options: {
        netdistrict: [],
        dept: [],
        assetType: [],
        location: [],
        businessSys: [],
        storage: [],
        dbOptions: [],
      },
    };
  },
  computed: {
    title() {
      const obj = {
        add: "新增",
        edit: "编辑",
        check: "查看",
      };
      return (obj[this.type] || "") + "监控报表";
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        if (this.$refs.form) {
          this.form = { ...formDefaultValue };
          this.$refs.form.resetFields();
        }
        if (this.type !== "add") {
          this.getDetail();
        }
      }
    },
  },
  created() {
    this.getSelectOptions();
  },
  methods: {
    getSelectOptions() {
      const types = [
        "netdistrict",
        "dept",
        "assetType",
        "location",
        "businessSys",
        "storage",
      ];
      types.forEach((type) => {
        getCommonSelectOptions(type).then((res) => {
          this.$set(this.options, type, res);
        });
      });
    },
    getDBOptions() {
      getDBOptions({ storageList: this.form.storageModeList }).then((res) => {
        this.options.dbOptions = res;
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
          const func =
            this.type === "add" ? addReportConfig : updateReportConfig;
          const args = this.type === "add" ? [data] : [this.reportId, data];
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
      const basic = _.pick(this.form, [
        "reportName",
        "businessSysIdList",
        "netdistrictIdList",
        "deptIdList",
        "storageModeList",
        "assetTypeList",
        "executeCycle",
        "owner",
      ]);
      const { crontab } = this.form;

      const executeConfig = JSON.stringify(crontab.executeConfig);
      // 配置基础表单
      const data = {
        ...basic,
        ...crontab,
        executeConfig,
        // hardcode 后期需要根据实际情况添加 pdf 以逗号分割
        sendFormat: "csv",
        sendConfig: {},
      };
      // 配置邮件表单
      data.sendConfig = JSON.stringify(
        _.pick(this.form, ["subject", "to", "cc", "scc"])
      );
      return data;
    },
    setFormData(data) {
      const basic = _.pick(data, [
        "reportName",
        "businessSysIdList",
        "netdistrictIdList",
        "deptIdList",
        "storageModeList",
        "assetTypeList",
        "executeCycle",
        "owner",
      ]);
      const { sendConfig: _sendConfig } = data;
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
      const sendConfig = JSON.parse(_sendConfig) || {};

      let result = {
        ...basic,
        to: sendConfig.to,
        cc: sendConfig.cc,
        bcc: sendConfig.bcc,
        subject: sendConfig.subject,
        crontab,
      };
      this.form = { ...formDefaultValue, ...result };
    },
    getDetail() {
      this.loading.detail = true;
      getReportConfig(this.reportId)
        .then((res) => {
          this.setFormData(res);
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
  },
};
</script>
<style lang="postcss">
.report-dialog {
  &.el-dialog__wrapper[custom] .el-dialog {
  }
  .idss-svg-icon {
    fill: #409eff;
  }
  .run-config-form-item {
    .el-select {
      width: 350px;
    }
  }
  .form-title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 18px;
    line-height: 28px;

    h3 {
      width: 108px;
      font-weight: bold;
      text-align: right;
    }
  }
}
.CodeMirror-hints {
  z-index: 3000 !important;
}
</style>
