<template>
  <div>
    <div class="app-container">
      <el-form
        ref="form"
        primary
        size="mini"
        :rules="rules"
        :model="form"
        label-width="80px"
      >
        <div class="dataSource">
          <widget-group title="密码规则" hide-shadow padding="0px 0px 0px 20px">
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="最小字符数"
                  prop="minLength"
                  label-width="150px"
                >
                  <el-input-number
                    v-model.trim="form.minLength"
                    class="min-char"
                    size="mini"
                    :min="1"
                    :max="128"
                    placeholder="请输入最小字符数"
                    @input="loadNumber"
                  ></el-input-number>
                  (必须是1-128之间，建议8-16位)
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="密码复杂度"
                  prop="cubeName"
                  label-width="150px"
                >
                  <el-checkbox-group v-model="checkedpwd">
                    <el-checkbox
                      v-for="pwd in pwdoptions"
                      :key="pwd"
                      :label="pwd"
                      >{{ pwd }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>
          </widget-group>

          <widget-group
            title="过期时间"
            hide-shadow
            padding="10px 0px 0px 20px"
          >
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="开启选项"
                  prop="expirationOpen"
                  label-width="150px"
                >
                  <el-radio-group v-model="form.expirationOpen">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="过期天数"
                  prop="expiration"
                  label-width="150px"
                  :rules="
                    form.expirationOpen === 1
                      ? [{ required: true, message: '过期天数必填' }]
                      : null
                  "
                >
                  <el-input-number
                    v-model.trim.number="form.expiration"
                    :min="1"
                    class="expiration-number"
                    :disabled="form.expirationOpen === 0"
                    placeholder="请输入过期天数"
                    @input="loadExpirationNumber"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="过期告警天数"
                  prop="alterDay"
                  label-width="150px"
                  :rules="
                    form.expirationOpen === 1
                      ? [
                          {
                            required: true,
                            trigger: 'blur',
                            message: '过期告警天数必填',
                          },
                        ]
                      : null
                  "
                >
                  <el-input-number
                    v-model.trim.number="form.alterDay"
                    :min="1"
                    class="alterDay-number"
                    :disabled="form.expirationOpen === 0"
                    placeholder="请输入过期告警天数"
                    @input="loadAlterDayNumber"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </widget-group>

          <widget-group
            title="锁定设置"
            hide-shadow
            padding="10px 0px 0px 20px"
          >
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="开启选项"
                  prop="lockOpen"
                  label-width="150px"
                >
                  <el-radio-group v-model="form.lockOpen">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="尝试登录次数"
                  prop="loginNum"
                  label-width="150px"
                  :rules="
                    form.lockOpen === 1
                      ? [{ required: true, message: '尝试登录次数必填' }]
                      : null
                  "
                >
                  <el-input-number
                    v-model.trim.number="form.loginNum"
                    :min="1"
                    class="loginNum-number"
                    :disabled="form.lockOpen === 0"
                    placeholder="请输入尝试登录次数"
                    @input="loadLoginNumNumber"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="锁定阀值分钟"
                  prop="lockThreshold"
                  label-width="150px"
                  :rules="
                    form.lockOpen === 1
                      ? [{ required: true, message: '锁定阀值分钟必填' }]
                      : null
                  "
                >
                  <el-input-number
                    v-model.trim.number="form.lockThreshold"
                    :min="1"
                    class="lockThreshold-number"
                    :disabled="form.lockOpen === 0"
                    placeholder="请输入锁定阀值分钟"
                    @input="loadLockThresholdNumber"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="锁定持续分钟"
                  prop="lockTime"
                  label-width="150px"
                  :rules="
                    form.lockOpen === 1
                      ? [{ required: true, message: '锁定持续分钟必填' }]
                      : null
                  "
                >
                  <el-input-number
                    v-model.trim.number="form.lockTime"
                    :min="1"
                    class="lockTime-number"
                    :disabled="form.lockOpen === 0"
                    placeholder="请输入锁定持续分钟"
                    @input="loadLockTimeNumber"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </widget-group>

          <widget-group
            title="登录设置"
            hide-shadow
            padding="10px 0px 0px 20px"
          >
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="开启选项"
                  prop="logoutOpen"
                  label-width="150px"
                >
                  <el-radio-group v-model="form.logoutOpen">
                    <el-radio :label="1">启用</el-radio>
                    <el-radio :label="0">关闭</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="10" style="margin-bottom: 5px; margin-top: 10px">
              <el-col :span="20">
                <el-form-item
                  label="自动登出阀值分钟"
                  prop="logoutTime"
                  label-width="150px"
                  :rules="
                    form.logoutOpen === 1
                      ? [{ required: true, message: '自动登出阀值分钟必填' }]
                      : null
                  "
                >
                  <el-input-number
                    v-model.trim.number="form.logoutTime"
                    :min="1"
                    class="logoutTime-number"
                    step-strictly
                    :disabled="form.logoutOpen === 0"
                    placeholder="请输入尝试登录次数"
                    @input="loadLogoutTimeNumber"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </widget-group>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reqsave">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import indexServe from "./indexServe.js";
import WidgetGroup from "@/components/widget-group.vue";

export default {
  name: "PasswordStrategy",
  components: {
    WidgetGroup,
  },
  mixins: [indexServe],
  data() {
    var checkexpirationOpen = (rule, value, callback) => {
      if (this.form.expirationOpen === 1) {
        if (this.form.expiration === "" || this.form.alterDay === "") {
          this.$message.error("请输入过期天数和过期告警天数");
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checklockOpen = (rule, value, callback) => {
      if (this.form.lockOpen === 1) {
        if (
          this.form.loginNum === "" ||
          this.form.lockThreshold === "" ||
          this.form.lockTime === ""
        ) {
          this.$message.error("请输入登录次数,阀值分钟和过持续分钟");
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var checklogoutOpen = (rule, value, callback) => {
      if (this.form.logoutOpen === 1) {
        if (this.form.logoutTime === "") {
          this.$message.error("请输入登出阀值分钟");
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      checkedpwd: [],
      pwdoptions: [
        "数字",
        "小写字母",
        "大写字母",
        "特殊字符(可打印的ACSII字符)",
      ],
      form: {
        minLength: "8",
        isNumber: "",
        isLowerCase: "",
        isBigCase: "",
        isSpecialChar: "",
        expirationOpen: 0,
        expiration: "",
        alterDay: "",
        lockOpen: 0,
        loginNum: "",
        lockThreshold: "",
        lockTime: "",
        logoutOpen: 0,
        logoutTime: "",
      },
      rules: {
        minLength: [
          {
            required: true,
            trigger: "blur",
            message: "最小字符数必填",
          },
        ],
        expiration: [
          {
            validator: checkexpirationOpen,
            trigger: "blur",
          },
        ],
        alterDay: [
          {
            trigger: "blur",
            type: "number",
          },
        ],
        lockThreshold: [
          {
            trigger: "blur",
            type: "number",
          },
        ],
        lockTime: [
          {
            trigger: "blur",
            type: "number",
          },
        ],
        loginNum: [
          {
            validator: checklockOpen,
            trigger: "blur",
          },
        ],
        logoutTime: [
          {
            validator: checklogoutOpen,
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {
    "form.expirationOpen"(val) {
      if (val === 0) {
        this.$refs["form"].clearValidate(["expiration", "alterDay"]);
      }
    },
    "form.lockOpen"(val) {
      if (val === 0) {
        this.$refs["form"].clearValidate([
          "loginNum",
          "lockThreshold",
          "lockTime",
        ]);
      }
    },
    "form.logoutOpen"(val) {
      if (val === 0) {
        this.$refs["form"].clearValidate(["logoutTime"]);
      }
    },
  },
  async mounted() {
    this.reqQuery();
  },
  methods: {
    loadNumber(val) {
      if (val > 128) {
        this.form.minLength = 128;
      } else if (val < 0) {
        this.form.minLength = 1;
      }
    },
    loadExpirationNumber(val) {
      if (val < 0) {
        this.form.expiration = 1;
      }
    },
    loadAlterDayNumber(val) {
      if (val < 0) {
        this.form.alterDay = 1;
      }
    },
    loadLoginNumNumber(val) {
      if (val < 0) {
        this.form.loginNum = 1;
      }
    },
    loadLockThresholdNumber(val) {
      if (val < 0) {
        this.form.lockThreshold = 1;
      }
    },
    loadLockTimeNumber(val) {
      if (val < 0) {
        this.form.lockTime = 1;
      }
    },
    loadLogoutTimeNumber(val) {
      if (val < 0) {
        this.form.logoutTime = 1;
      }
    },
    reqsave() {
      if (this.checkedpwd.includes("数字")) {
        this.form = Object.assign(this.form, { isNumber: "1" });
      } else {
        this.form = Object.assign(this.form, { isNumber: "0" });
      }
      if (this.checkedpwd.includes("小写字母")) {
        this.form = Object.assign(this.form, { isLowerCase: "1" });
      } else {
        this.form = Object.assign(this.form, { isLowerCase: "0" });
      }
      if (this.checkedpwd.includes("大写字母")) {
        this.form = Object.assign(this.form, { isBigCase: "1" });
      } else {
        this.form = Object.assign(this.form, { isBigCase: "0" });
      }
      if (this.checkedpwd.includes("特殊字符(可打印的ACSII字符)")) {
        this.form = Object.assign(this.form, { isSpecialChar: "1" });
      } else {
        this.form = Object.assign(this.form, { isSpecialChar: "0" });
      }
      this.form = Object.assign(this.form, { ruleOpen: "1" });
      this.$refs.form.validate((res) => {
        if (res) {
          this.save(this.form)
            .then(() => {
              this.$message.success("保存成功");
            })
            .catch(() => {});
        }
      });
    },
    reqQuery() {
      this.query()
        .then((res) => {
          if (res.isNumber === "1") {
            this.checkedpwd.push("数字");
          }
          if (res.isLowerCase === "1") {
            this.checkedpwd.push("小写字母");
          }
          if (res.isBigCase === "1") {
            this.checkedpwd.push("大写字母");
          }
          if (res.isSpecialChar === "1") {
            this.checkedpwd.push("特殊字符(可打印的ACSII字符)");
          }
          this.form.expirationOpen = Number(res.expirationOpen);
          this.form.lockOpen = Number(res.lockOpen);
          this.form.logoutOpen = Number(res.logoutOpen);
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="postcss" scoped>
.content {
  padding: 10px 15px;
  .idss-font--title {
    font-size: var(--font-size-16);
    margin-bottom: 10px;
  }
}
>>> .el-input__suffix {
  align-items: center;
  display: flex;
}
.sql-textarea {
  >>> textarea {
    height: 440px;
    width: 961px;
    margin-top: 20px;
  }
}
.data-filter .cube-config {
  width: 100%;
  max-height: 900px;
  overflow-y: auto;
  margin-bottom: 20px;
}

>>> .data-filter input {
  width: 260px;
}
>>> .cube-config input {
  width: 150px;
}
.cube-config {
  >>> .el-input--suffix {
    width: 150px !important;
  }
}
>>> .el-table__body-wrapper {
  padding-top: 8px;
}

.dialog-footer {
  text-align: center;
  margin-top: 20px;
}
>>> .el-input--mini {
  line-height: 3 !important;
}
>>> .cell {
  padding-left: 0px;
}
>>> .el-table {
  padding-left: 0px !important;
  padding-right: 5px;
}
>>> td {
  border: 0px !important;
}
.el-table--border {
  border: 0px solid #ebeef5;
}
/*>>> ::after {*/
/*display: none !important;*/
/*height: 0px;*/
/*}*/
>>> input {
  height: 28px;
}
.inputStyle .el-radio.is-bordered {
  background: var(--white);
}
.inputStyle .el-checkbox.is-bordered {
  background: var(--white);
}
.el-checkbox__label label {
  padding: 12px 0;
}
.inputStyle {
  .el-radio {
    padding: 0;
    &.el-radio--mini {
      height: 92px;
      padding: 0 0 15px;
      width: 152px;
      box-shadow: var(--shadow-dark);
      >>> .el-radio__input {
        display: none;
      }
    }
    img {
      display: block;
      max-height: 26px;
      margin: 0 auto;
    }
    label {
      display: block;
      text-align: center;
      margin-top: 5px;
      margin-bottom: 5px;
      font-weight: bold;
      font-size: 14px;
    }
    p {
      text-align: center;
      color: #999;
    }
  }
}
.app-container {
  margin: 10px;
  /* background-color: #ffffff; */
  padding: 30px;
  padding-top: 10px;
  border-radius: 2px;
  min-height: calc(100vh - 152px);
  .titleBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    p {
      font-size: 22px;
      color: #333333;
      margin: 0;
    }
  }
  .stepContent {
    width: 70%;
    margin: 0 100px;
    .step-list {
      >>> .el-step__title {
        font-size: 14px !important;
        font-weight: 400 !important;
        color: rgb(51, 51, 51) !important;
      }
      width: 60%;
      float: left;
      >>> .el-step__line {
        height: 1px;
        top: 12px;
      }
      >>> .is-finish {
        .el-step__icon {
          background: var(--guan-6);
          border-color: var(--guan-6);
          color: #fff;
        }
        .el-step__line {
          background-color: #fff;
          border-top: 1px solid #4a90e2;
        }
        .el-step__line-inner {
          display: none;
        }
      }
      >>> .is-process {
        font-weight: normal;
        color: #4a90e2;
        .el-step__icon {
          background: #4a90e2;
          color: #fff;
          &.is-text {
            border: none;
          }
        }
        .el-step__line {
          background-color: #fff;
          border-top: 1px dashed #c0c4cc;
        }
      }
      >>> .is-wait {
        .el-step__line {
          background-color: #fff;
          border-top: 1px dashed #c0c4cc;
        }
      }
    }
    .step-btn-group {
      /* width: 40%; */
      float: left;
    }
  }
  .choice {
    color: #4a90e2;
  }
  .oneLeveltitle {
    line-height: 1.1;
    border-bottom: 1px solid #e3e7ec;
    padding: 5px 0;
    font-size: 14px;
    color: #999999;
    font-weight: 700;
    font-family: "Arial-BoldMT", "Arial Bold", "Arial";
  }
  .dataItem {
    height: 54px;
    line-height: 54px;
    background-color: #f1f4f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    div:first-of-type {
      span {
        font-size: 14px;
        color: #000000;
        margin: 0 20px;
        display: inline-block;
      }
    }
    div:last-of-type {
      span {
        margin: 0 20px;
        display: inline-block;
        font-size: 12px;
        color: #4a90e2;
      }
    }
  }
  .btn {
    cursor: pointer;
  }
  .dataSource {
    >>> .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      /*margin-bottom: 15px;*/
    }
    >>> .widget-group header {
      padding: 5px 0;
      .title {
        font-size: 14px;
      }
    }
    .base-info {
      padding-bottom: 20px;
    }
  }
  .source-radio:hover {
    border-color: #4a90e2;
  }
  .source-tooltip {
    line-height: 2;
    margin-left: 10px;
  }
  .active {
    border: 1px solid rgb(220, 223, 230);
    border-bottom: 4px solid #4a90e2;
  }
  .p-tip {
    margin-top: 15px;
    margin-bottom: 5px;
  }
  .span-tip {
    ont-weight: 500;
    font-style: normal;
    color: #3f3f3f;
  }
  .widget-group {
    padding-left: 120px;
    padding-right: 120px;
    padding-top: 20px;
    margin-top: 10px;
  }
  .data-source {
    padding-top: 0px;
  }
}
.add-feild {
  padding-top: 10px;
}
>>> .el-table::before {
  height: 0px !important;
}

.min-char,
.expiration-number,
.alterDay-number,
.loginNum-number,
.lockThreshold-number,
.lockTime-number,
.logoutTime-number {
  width: auto;

  >>> .el-input-number__decrease,
  >>> .el-input-number__increase {
    top: 5px;
  }
}
</style>
