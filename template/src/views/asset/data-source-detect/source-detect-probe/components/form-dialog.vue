<template>
  <el-dialog
    custom
    :title="title"
    :visible="visible"
    :modal-append-to-body="false"
    :close-on-click-modal="false"
    width="780px"
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="探针名称" prop="name">
            <el-input
              v-model="form.name"
              size="mini"
              maxlength="64"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="探针类型" prop="type">
            <el-select v-model="form.type" size="mini" placeholder="请选择">
              <el-option
                v-for="option in options.probeType"
                :key="option.code"
                :value="option.code"
                :label="option.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="探针IP" prop="ip">
            <el-col :span="14">
              <el-input
                v-model="form.ip"
                size="mini"
                placeholder="请输入"
              ></el-input>
            </el-col>
            <el-col :span="9" :offset="1">
              <el-input
                v-model="form.port"
                size="mini"
                maxlength="6"
                placeholder="端口号"
              ></el-input>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="探针厂商" prop="producer">
            <el-select v-model="form.producer" size="mini" placeholder="请选择">
              <el-option
                v-for="option in options.producerList"
                :key="option.code"
                :value="option.code"
                :label="option.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="探针型号" prop="probeModel">
            <el-select v-model="form.probeModel" size="mini">
              <el-option
                v-for="option in options.probeModel"
                :key="option.code"
                :value="option.code"
                :label="option.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="管辖网络域" prop="netDistrictIdList">
            <idss-select-tree
              v-model="form.netDistrictIdList"
              size="mini"
              node-key="code"
              :data="options.netDistrictIdList"
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
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="物理位置" prop="locationId">
            <idss-select-tree
              v-model="form.locationId"
              size="mini"
              node-key="code"
              :data="options.locationIdList"
              :tree="{
                'default-expand-all': true,
              }"
              :props="{
                label: 'name',
                children: 'children',
              }"
            >
            </idss-select-tree>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="运行时间段" prop="enableTimes">
            <div v-for="(item, index) in form.enableTimes" :key="index + 'e'">
              <RunTimeForm
                v-model="form.enableTimes[index]"
                :show-type-select="index === 0"
                :type="form.enableTimes[0].type"
              >
                <el-button
                  v-if="index !== 0"
                  type="text"
                  icon="el-icon-delete"
                  @click="removeRunTime(index, 'enable')"
                ></el-button>
                <el-button
                  v-if="index + 1 === form.enableTimes.length"
                  type="text"
                  icon="el-icon-plus"
                  @click="addRunTime('enable')"
                ></el-button>
              </RunTimeForm>
            </div>
            <el-form-item prop="disabledTimes">
              <el-checkbox v-model="enableNotRunTime"
                >不可运行时间段</el-checkbox
              >
            </el-form-item>
            <template v-if="enableNotRunTime">
              <div
                v-for="(item, index) in form.disabledTimes"
                :key="index + 'd'"
              >
                <RunTimeForm
                  v-model="form.disabledTimes[index]"
                  :show-type-select="index === 0"
                  :type="form.disabledTimes[0].type"
                >
                  <el-button
                    v-if="index !== 0"
                    type="text"
                    icon="el-icon-delete"
                    @click="removeRunTime(index, 'disabled')"
                  ></el-button>
                  <el-button
                    v-if="index + 1 === form.disabledTimes.length"
                    type="text"
                    icon="el-icon-plus"
                    @click="addRunTime('disabled')"
                  ></el-button>
                </RunTimeForm>
              </div>
            </template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer">
      <el-button size="mini" :loading="loading.test" @click="handleTest"
        >连通测试</el-button
      >
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
import _ from "lodash";
import {
  addProde,
  getProbeConfig,
  updateProbe,
  getSelectOptions,
  getProbeType,
  testProbe,
} from "../api";
import { PORT_RE, STR_RE, WEEK_DAYS } from "@/constants";
import RunTimeForm from "./run-time-form";

const DEFAULT_TIME_CONFIG_VALUE = {
  type: 1,
  day: null,
  week: null,
  startTime: "00:00:00",
  endTime: "23:59:59",
};

const formDefaultValue = {
  name: null,
  producer: null,
  type: null,
  ip: null,
  port: null,
  probeModel: null,
  netDistrictIdList: [],
  locationId: null,
  runtimeConfigs: [],
  enableTimes: [DEFAULT_TIME_CONFIG_VALUE],
  disabledTimes: [DEFAULT_TIME_CONFIG_VALUE],
};
export default {
  components: {
    RunTimeForm,
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
        test: false,
        detail: false,
        submit: false,
      },
      form: _.cloneDeep(formDefaultValue),
      rules: {
        name: [
          {
            required: true,
            message: "请输入",
          },
          {
            pattern: STR_RE,
            message: "不能包含空格或特殊字符",
          },
        ],
        producer: [
          {
            required: true,
            message: "请选择",
          },
        ],
        type: [
          {
            required: true,
            message: "请选择",
          },
        ],
        ip: [
          {
            required: true,
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (!value) {
                callback("请输入ip");
              } else if (!this.form.port) {
                callback("请输入端口号");
              } else if (!PORT_RE.test(this.form.port)) {
                callback("请输入正确的端口号");
              } else {
                callback();
              }
            },
          },
        ],
        netDistrictIdList: [
          {
            type: "array",
            required: true,
            message: "请选择",
          },
        ],
        enableTimes: [
          {
            required: true,
            validator: (rule, value, callback) => {
              let message = "请选择运行时间段";
              let valid = true;
              value = [...this.form.enableTimes, ...this.form.disabledTimes];
              for (let i = 0; i < value.length; i++) {
                // 未选择日周月
                if (!value[i].type) {
                  valid = false;
                  break;
                }
                // 类型为周时，未选择周几
                if (
                  value[i].type === 2 &&
                  !value[i].week &&
                  value[i].week !== 0
                ) {
                  valid = false;
                  break;
                }
                // 类型为月时，未选择几号
                if (value[i].type === 3 && !value[i].day) {
                  valid = false;
                  break;
                }
                if (!value[i].startTime || !value[i].endTime) {
                  valid = false;
                  break;
                }
              }
              if (valid) {
                callback();
              } else {
                callback(message);
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
        probeType: [],
        probeModel: [],
      },
      enableNotRunTime: false,
    };
  },
  computed: {
    title() {
      const obj = {
        add: "新增",
        edit: "编辑",
        check: "查看",
      };
      return (obj[this.type] || "") + "扫描探针";
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
    this.getProbeTypes();
  },
  methods: {
    getSelectOptions() {
      const types = [
        "producerList",
        "typeList",
        "locationIdList",
        "netDistrictIdList",
      ];
      types.forEach((type) => {
        getSelectOptions(type).then((res) => {
          this.$set(this.options, type, res);
        });
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
          const func = this.type === "add" ? addProde : updateProbe;
          const args = this.type === "add" ? [data] : [data, this.id];
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
      const data = _.omit(this.form, ["enableTimes", "disabledTimes"]);
      const enableTimes = this.form.enableTimes.map((item) => ({
        ...item,
        isCanRun: 1,
      }));
      const disabledTimes = this.form.disabledTimes.map((item) => ({
        ...item,
        isCanRun: 0,
      }));
      let runtimeConfigs = enableTimes;
      if (this.enableNotRunTime) {
        runtimeConfigs = [...enableTimes, ...disabledTimes];
      }
      return {
        ...data,
        runtimeConfigs,
      };
    },
    setFormData(data) {
      const { runtimeConfigs = [] } = data;
      const enableTimes = runtimeConfigs.filter((item) => item.isCanRun);
      let disabledTimes = runtimeConfigs.filter((item) => !item.isCanRun);
      // 存在不可运行时间段时，把checkbox设为true
      if (disabledTimes.length) {
        this.enableNotRunTime = true;
      } else {
        // 添加一个默认值，避免空数组无法渲染出不可运行时间段
        disabledTimes = formDefaultValue.disabledTimes;
      }
      this.form = {
        ...formDefaultValue,
        ...data,
        enableTimes,
        disabledTimes,
      };
    },
    getDetail() {
      this.loading.detail = true;
      getProbeConfig(this.id)
        .then((res) => {
          this.setFormData(res);
        })
        .finally(() => {
          this.loading.detail = false;
        });
    },
    getProbeTypes() {
      const types = ["probeType", "probeModel"];
      types.forEach((type) => {
        getProbeType(type).then((res) => {
          this.$set(this.options, type, res);
        });
      });
    },
    handleTest() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading.test = true;
          const data = this.getFormData();
          testProbe(data)
            .then(() => {
              this.$message.success("连通成功");
            })
            .finally(() => {
              this.loading.test = false;
            });
        }
      });
    },
    removeRunTime(index, type) {
      if (type === "enable") {
        this.form.enableTimes.splice(index, 1);
      } else {
        this.form.disabledTimes.splice(index, 1);
      }
    },
    addRunTime(type) {
      if (type === "enable") {
        this.form.enableTimes.push(DEFAULT_TIME_CONFIG_VALUE);
      } else {
        this.form.disabledTimes.push(DEFAULT_TIME_CONFIG_VALUE);
      }
    },
  },
};
</script>
<style lang="postcss" scoped>
.el-form[primary] >>> {
  .el-input {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }
}
</style>
