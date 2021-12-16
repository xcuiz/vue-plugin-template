<template>
  <div class="container">
    <div class="content">
      <PageHeader :title="title" />
      <div class="form-container">
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
          <widget-group title="基础配置" hide-shadow padding="0px 0px 0px 20px">
            <el-row :gutter="15">
              <el-form-item label="任务名称" prop="etlName">
                <el-col :span="18">
                  <el-input
                    v-model="form.etlName"
                    size="mini"
                    maxlength="64"
                    placeholder="请输入"
                  ></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="描述" prop="etlDesc">
                <el-col :span="18">
                  <el-input
                    v-model="form.etlDesc"
                    size="mini"
                    maxlength="300"
                    placeholder="请输入"
                    type="textarea"
                  ></el-input>
                </el-col>
              </el-form-item>
              <el-form-item label="脚本" prop="scriptId">
                <el-col :span="18">
                  <el-select v-model="form.scriptId">
                    <el-option
                      v-for="item in options.scripts"
                      :key="item.code"
                      :value="item.code"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <el-form-item
                key="executeCycle"
                label="执行方式"
                prop="executeCycle"
              >
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
            </el-row>
          </widget-group>
          <el-row>
            <widget-group
              title="输出配置"
              hide-shadow
              padding="0px 0px 0px 20px"
            >
              <el-form-item label="输出表" prop="tableId">
                <el-col :span="18">
                  <el-select v-model="form.tableId" clearable>
                    <el-option
                      v-for="item in options.tables"
                      :key="item.code"
                      :value="item.code"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-col>
              </el-form-item>
              <div class="divider"></div>
              <el-form-item>
                <Table
                  v-if="!loading.detail"
                  ref="table"
                  :table-id="form.tableId"
                  :script-id="form.scriptId"
                  :col-config.sync="form.colConfig"
                  :type="type"
                />
              </el-form-item>
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
            </widget-group>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import CrontabSelect from "@/components/crontab-select";
import crontabRule from "@/components/crontab-select/rule";
import PageHeader from "@/components/PageHeader";
import Table from "./components/table";
import WidgetGroup from "@/components/widget-group.vue";
import {
  addCollect,
  getCollect,
  updateCollect,
  getScripts,
  getTables,
} from "./api";
const formDefaultValue = {
  etlName: null,
  etlDesc: null,
  scriptId: null,
  tableId: null,
  executeCycle: undefined,
  crontab: {},
  colConfig: [],
};
export default {
  components: {
    CrontabSelect,
    Table,
    PageHeader,
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
      loading: {
        detail: false,
        submit: false,
      },
      form: { ...formDefaultValue },
      rules: {
        etlName: [
          {
            required: true,
            message: "请输入",
          },
        ],
        scriptId: [
          {
            required: true,
            message: "请选择",
          },
        ],
        tableId: [
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
        crontab: [crontabRule],
      },
      options: {
        scripts: [],
        tables: [],
      },
    };
  },
  computed: {
    title() {
      const obj = {
        add: "新建",
        edit: "编辑",
        check: "查看",
      };
      return (obj[this.type] || "") + "同步任务";
    },
  },
  created() {
    this.getScripts();
    this.getTables();
    if (this.type !== "add" && this.id) {
      this.getDetail();
    }
  },
  methods: {
    getScripts() {
      getScripts().then((res) => {
        this.options.scripts = res;
      });
    },
    getTables() {
      getTables().then((res) => {
        this.options.tables = res;
      });
    },
    handleClose() {
      this.$router.back();
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.table.$refs.form.validate((valid) => {
            if (valid) {
              this.loading.submit = true;
              const data = this.getFormData();
              const func = this.type === "add" ? addCollect : updateCollect;
              const args = this.type === "add" ? [data] : [this.id, data];
              func(...args)
                .then(() => {
                  this.$message.success("保存成功");
                  this.handleClose();
                })
                .finally(() => {
                  this.loading.submit = false;
                });
            }
          });
        }
      });
    },
    getFormData() {
      const data = _.omit(this.form, ["crontab"]);

      const { crontab } = this.form;
      const executeConfig = JSON.stringify(crontab.executeConfig);
      return {
        ...data,
        ...crontab,
        executeConfig,
      };
    },
    setFormData(data) {
      const basic = _.pick(data, [
        "etlName",
        "etlDesc",
        "scriptId",
        "tableId",
        "executeCycle",
        "colConfig",
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
      this.form = {
        ...basic,
        crontab,
      };
    },
    getDetail() {
      this.loading.detail = true;
      getCollect(this.id)
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
<style lang="postcss" scoped>
.container {
  .content {
    padding: 10px 15px;
  }
  .el-button + .el-select {
    margin-left: 10px;
  }
}
.el-form[primary] >>> {
  .divider {
    width: 100%;
    height: 0;
    margin: 0 24px;
    border-bottom: 1px solid #e4e7ed;
  }
}
.form-container {
  background: #fff;
  padding: 20px 120px;
}
</style>
