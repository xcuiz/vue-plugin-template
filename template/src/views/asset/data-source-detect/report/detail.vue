<!--
 * @Author: yincheng
 * @Date: 2021-08-10 15:16:34
 * @LastEditors: yincheng
 * @LastEditTime: 2021-08-24 15:57:14
-->
<template>
  <div class="container">
    <div class="content">
      <WidgetGroup :title="title" hide-shadow padding="20px 0px 0px 20px">
        <!-- <h4 class="idss-font--title idss-container-header">{{ title }}</h4> -->
        <el-row style="">
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
                maxlength="30"
              ></el-input>
            </el-form-item>
            <el-form-item label="报表内容" prop="executeContent">
              <SqlInput
                ref="gpl"
                v-model="form.executeContent"
                style="min-height: 78px; max-width: 768px"
              />
              <el-button type="text" size="mini" @click="preview"
                >预览数据<idss-icon-svg name="share"></idss-icon-svg
              ></el-button>
            </el-form-item>
            <div v-if="isPreview">
              <TableList v-bind="table" />
            </div>
            <el-form-item label="执行计划" prop="crontab">
              <el-col :span="18">
                <CrontabSelect v-model="form.crontab" show-perview />
              </el-col>
            </el-form-item>
            <el-form-item label="触发操作" prop="sendType">
              <el-select v-model="form.sendType" multiple placeholder="请选择">
                <el-option
                  v-for="option in sendOptions"
                  :key="option.code"
                  :value="option.code"
                  :label="option.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="报表格式" prop="sendFormat">
              <el-radio-group v-model="form.sendFormat">
                <el-radio label="csv">csv</el-radio>
                <el-radio label="txt">txt</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-show="form.sendFormat === 'txt'"
              label="分隔符"
              prop="splitChar"
            >
              <el-input
                v-model="form.splitChar"
                size="mini"
                maxlength="20"
                placeholder="不输入时默认以,分隔"
              ></el-input>
            </el-form-item>
            <div v-if="form.sendType.indexOf('mail') !== -1">
              <div class="form-title">
                <h3>发送邮件列表</h3>
                <el-button
                  type="text"
                  size="mini"
                  @click="removeSendType('mail')"
                  >删除</el-button
                >
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
              <el-form-item label="密送" prop="sc">
                <el-input
                  v-model="form.sc"
                  placeholder="多个邮箱请使用 , 分割"
                ></el-input>
              </el-form-item>
              <el-form-item label="邮件主题" prop="subject">
                <el-input
                  v-model="form.subject"
                  placeholder="例：运维周报$report_name$-$report_time$"
                ></el-input>
              </el-form-item>
              <el-form-item label="文件名" prop="emailFileName">
                <el-input
                  v-model="form.emailFileName"
                  placeholder="例：运维周报$report_name$-$report_time$"
                ></el-input>
              </el-form-item>
            </div>
            <div v-if="form.sendType.indexOf('local') !== -1">
              <div class="form-title">
                <h3>输出结果到本地</h3>
                <el-button
                  type="text"
                  size="mini"
                  @click="removeSendType('local')"
                  >删除</el-button
                >
              </div>
              <el-form-item label="文件名" prop="localFileName">
                <el-input
                  v-model="form.localFileName"
                  placeholder="例：运维周报$report_name$-$report_time$"
                ></el-input>
              </el-form-item>
            </div>
            <div v-if="form.sendType.indexOf('sftp') !== -1">
              <div class="form-title">
                <h3>输出到FTP/SFTP</h3>
                <el-button
                  type="text"
                  size="mini"
                  @click="removeSendType('sftp')"
                  >删除</el-button
                >
              </div>
              <el-form-item label="文件名" prop="ftpFileName">
                <el-input
                  v-model="form.ftpFileName"
                  placeholder="例：运维周报$report_name$-$report_time$"
                ></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-radio-group v-model="form.type">
                  <el-radio label="ftp">FTP</el-radio>
                  <el-radio label="sftp">SFTP</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="ip" prop="ip">
                <el-input v-model="form.ip" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="端口号" prop="port">
                <el-input v-model="form.port" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item
                label="用户名"
                prop="username"
                :rules="ftpRules.username"
              >
                <el-input
                  v-model="form.username"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="密码"
                prop="password"
                :rules="ftpRules.password"
              >
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button
                size="mini"
                type="primary"
                :loading="loading.submit"
                @click="handleSubmit"
                >确 定</el-button
              >
              <el-button size="mini" @click="handleClose">取 消</el-button>
            </el-form-item>
          </el-form>
          <span> </span>
        </el-row>
      </WidgetGroup>
    </div>
  </div>
</template>
<script>
import { saveReportConfig, getReportConfig, getPreviewData } from "./api";
import SqlInput from "@/components/sql-input";
import WidgetGroup from "@/components/widget-group.vue";
// import { vCrontab } from '@/views/dolphinScheduler/module/components/crontab/index'
import CrontabSelect from "@/components/crontab-select";
import TableList from "@/components/TableList";
import crontabRule from "@/components/crontab-select/rule";
import { checkLetterLine } from "@/utils/rules";
const formDefaultValue = {
  reportName: null,
  executeContent: "",
  executeType: null,
  hourM: null,
  dayOfweek: null,
  monthOfYear: null,
  dayOfMonth: null,
  crontab: {},
  executeConfig: "0 0 * * * ? *",
  sendType: [],
  sendFormat: "csv",
  splitChar: "",
  to: null,
  cc: null,
  sc: null,
  subject: null,
  emailFileName: null,
  localFileName: null,
  ftpFileName: null,
  type: null,
  username: null,
  ip: null,
  port: null,
  password: null,
};
export default {
  components: {
    SqlInput,
    CrontabSelect,
    TableList,
    WidgetGroup,
  },
  props: {
    id: {
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
      isPreview: false,
      table: {
        data: [],
        columns: [],
        loading: false,
      },
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
          {
            pattern: checkLetterLine,
            trigger: "blur",
            message: "仅支持中英文字母、数字、下划线",
          },
        ],
        executeContent: [
          {
            required: true,
            message: "请输入报表内容",
            trigger: "change",
          },
        ],
        crontab: [crontabRule],
        sendType: [
          {
            type: "array",
            required: true,
            message: "请选择触发操作",
          },
        ],
        sendFormat: [
          {
            required: true,
            message: "请选择报表格式",
          },
        ],
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
        emailFileName: [
          {
            required: true,
            message: "请输入文件名",
          },
        ],
        localFileName: [
          {
            required: true,
            message: "请输入文件名",
          },
        ],
        ftpFileName: [
          {
            required: true,
            message: "请输入文件名",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择FTP/SFTP",
          },
        ],
        ip: [
          {
            required: true,
            message: "请输入ip",
          },
        ],
        port: [
          {
            required: true,
            message: "请输入ip",
          },
        ],
      },
      sendOptions: [
        {
          code: "mail",
          label: "发送邮件列表",
        },
        {
          code: "local",
          label: "输出结果到本地",
        },
        {
          code: "sftp",
          label: "输出到FTP/SFTP",
        },
      ],
    };
  },
  computed: {
    title() {
      const obj = {
        add: "新增",
        edit: "编辑",
        check: "查看",
      };
      return (obj[this.type] || "") + "报表配置";
    },
    ftpRules() {
      const isSftp = this.form.type === "sftp";
      return {
        username: [
          {
            required: isSftp,
            message: "请输入用户名",
          },
        ],
        password: [
          {
            required: isSftp,
            message: "请输入密码",
          },
        ],
      };
    },
  },
  created() {
    if (this.type !== "add") {
      this.getDetail();
    }
  },
  methods: {
    removeSendType(type) {
      const index = this.form.sendType.indexOf(type);
      this.form.sendType.splice(index, 1);
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading.submit = true;
          const data = this.getFormData();
          if (this.type !== "add") {
            data.id = this.id;
          }
          saveReportConfig(data)
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
    handleClose() {
      this.$router.push({
        name: "report",
      });
    },
    getFormData() {
      const {
        reportName,
        executeContent,
        sendType,
        sendFormat,
        splitChar,
        to,
        cc,
        sc,
        subject,
        emailFileName,
        localFileName,
        ftpFileName,
        type,
        ip,
        port,
        username,
        password,
        crontab,
      } = this.form;
      const executeConfig = JSON.stringify(crontab.executeConfig);

      const sendFormatConfig = {
        sendFormat,
        splitChar: sendFormat === "txt" ? splitChar : "",
      };
      // 配置基础表单
      const data = {
        reportName,
        executeContent,
        ...sendFormatConfig,
        ...crontab,
        executeConfig,
        sendType: sendType.join(","),
        sendConfig: {},
      };
      // 配置邮件表单
      if (sendType.indexOf("mail") !== -1) {
        data.sendConfig.mail = {
          ...sendFormatConfig,
          fileName: emailFileName,
          subject,
          to,
          cc,
          sc,
        };
      }
      // 配置本地文件表单
      if (sendType.indexOf("local") !== -1) {
        data.sendConfig.local = {
          ...sendFormatConfig,
          fileName: localFileName,
        };
      }
      // 配置ftp表单
      if (sendType.indexOf("sftp") !== -1) {
        data.sendConfig[type] = {
          ...sendFormatConfig,
          fileName: ftpFileName,
          ip,
          port,
          username,
          password,
        };
      }
      return data;
    },
    setFormData(data) {
      const {
        reportName,
        executeContent,
        executeType,
        sendType,
        sendFormat,
        splitChar,
      } = data;
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
      const sendConfig = JSON.parse(data.sendConfig);
      let ftpType;
      if (sendConfig?.ftp) {
        ftpType = "ftp";
      } else if (sendConfig?.sftp) {
        ftpType = "sftp";
      }

      let result = {
        reportName,
        executeContent,
        executeType,
        sendFormat,
        splitChar,
        crontab,
        sendType: sendType.split(","),
        to: sendConfig?.mail?.to,
        cc: sendConfig?.mail?.cc,
        sc: sendConfig?.mail?.sc,
        subject: sendConfig?.mail?.subject,
        emailFileName: sendConfig?.mail?.fileName,
        localFileName: sendConfig?.local?.fileName,
      };
      if (ftpType) {
        result = {
          ...result,
          ftpFileName: sendConfig?.[ftpType]?.fileName,
          type: ftpType,
          ip: sendConfig?.[ftpType]?.ip,
          port: sendConfig?.[ftpType]?.port,
          username: sendConfig?.[ftpType]?.username,
          password: sendConfig?.[ftpType]?.password,
        };
      }
      this.form = { ...formDefaultValue, ...result };
      this.$refs.gpl.editor.setValue(result.executeContent);
    },
    getDetail() {
      this.loading.detail = true;
      getReportConfig(this.id)
        .then((res) => {
          this.setFormData(res);
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
    preview() {
      this.$refs.form.validateField("executeContent", (errorMessage) => {
        if (!errorMessage) {
          this.isPreview = true;
          this.table.loading = true;
          getPreviewData({
            selectSQL: this.form.executeContent,
          })
            .then((res) => {
              this.table.data = res.data;
              this.table.columns = res.columns;
            })
            .catch(() => {
              this.isPreview = false;
            })
            .finally(() => {
              this.table.loading = false;
            });
        }
      });
    },
  },
};
</script>
<style lang="postcss">
.container {
  padding: 12px;
  .content {
    padding: 32px 12px 12px 96px;
    background: #fff;
    .idss-font--title {
      font-size: var(--font-size-16);
      margin-bottom: 10px;
    }
  }
  .el-button + .el-select {
    margin-left: 10px;
  }
  .filter-items {
    .select.el-select {
      width: 85px;
    }
  }
  .el-table {
    margin-bottom: 10px;
    >>> .cell {
      white-space: nowrap;
    }
  }

  .form-title {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    margin-bottom: 18px;

    h3 {
      width: 148px;
      font-weight: bold;
      text-align: right;
    }
  }
}
.CodeMirror-hints {
  z-index: 3000 !important;
}
</style>
