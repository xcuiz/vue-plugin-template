<template>
  <div class="crontab-container">
    <el-select
      v-model="form.executeType"
      size="mini"
      placeholder="请选择运行配置"
    >
      <el-option
        v-for="item in runConfigOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <div class="time-zone">
      <!--天-->
      <div v-if="form.executeType === 'day'" key="day" class="day">
        <el-form-item prop="time" label="时间" label-width="68px">
          <el-time-picker
            v-model="form.executeConfig.time"
            size="mini"
            value-format="HH:mm:ss"
            :clearable="false"
            format="HH:mm:ss"
          >
          </el-time-picker>
        </el-form-item>
      </div>
      <!--周-->
      <div v-if="form.executeType === 'week'" key="week" class="week">
        <div style="float: left; width: 160px">
          <el-form-item prop="week" label="星期为" label-width="68px">
            <WeekDaySelect v-model="form.executeConfig.week" size="mini" />
          </el-form-item>
        </div>
        <div style="float: left; width: 150px">
          <el-form-item prop="time" label="时间为" label-width="68px">
            <el-time-picker
              v-model="form.executeConfig.time"
              size="mini"
              value-format="HH:mm:ss"
              :clearable="false"
              format="HH:mm:ss"
            >
            </el-time-picker>
          </el-form-item>
        </div>
      </div>
      <!--月-->
      <div v-if="form.executeType === 'month'" key="month" class="month">
        <div style="float: left; width: 160px">
          <el-form-item prop="day" label="日期为" label-width="68px">
            <el-select v-model="form.executeConfig.day" size="mini">
              <el-option
                v-for="num in 31"
                :key="num"
                :label="num + '号'"
                :value="num"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="float: left; width: 150px">
          <el-form-item prop="time" label="时间为" label-width="68px">
            <el-time-picker
              v-model="form.executeConfig.time"
              size="mini"
              value-format="HH:mm:ss"
              :clearable="false"
              format="HH:mm:ss"
            >
            </el-time-picker>
          </el-form-item>
        </div>
      </div>
      <!--年-->
      <div v-if="form.executeType === 'year'" key="year" class="year">
        <div style="float: left; width: 140px">
          <el-form-item prop="month" label="月份为" label-width="68px">
            <el-select v-model="form.executeConfig.month" size="mini">
              <el-option
                v-for="num in 12"
                :key="num"
                :label="num + '月'"
                :value="num"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="float: left; width: 140px">
          <el-form-item prop="day" label="日期为" label-width="68px">
            <el-select v-model="form.executeConfig.day" size="mini">
              <el-option
                v-for="num in DAYS_OF_MONTH[form.executeConfig.month]"
                :key="num"
                :label="num + '号'"
                :value="num"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div style="float: left; width: 140px">
          <el-form-item prop="time" label="时间为" label-width="68px">
            <el-time-picker
              v-model="form.executeConfig.time"
              size="mini"
              value-format="HH:mm:ss"
              :clearable="false"
              format="HH:mm:ss"
            >
            </el-time-picker>
          </el-form-item>
        </div>
      </div>
      <!--cron-->
      <div v-if="form.executeType === 'cron'" key="cron" class="cron">
        <div class="cron-item">
          <el-form-item
            prop="executeCron"
            label="Cron表达式"
            label-width="98px"
          >
            <!-- 时间弹窗 -->
            <el-popover ref="poptip" placement="bottom-start">
              <div class="crontab-box">
                <v-crontab v-model="form.executeCron"></v-crontab>
              </div>
              <el-input
                slot="reference"
                size="mini"
                style="width: 190px"
                type="text"
                readonly
                :value="form.executeCron"
                autocomplete="off"
              >
                <el-button
                  v-if="showPerview"
                  slot="append"
                  :loading="loading.preview"
                  @click.stop="previewCron"
                  >预览</el-button
                >
              </el-input>
            </el-popover>
          </el-form-item>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { cloneDeep, isEqual } from "lodash";
import { DAYS_OF_MONTH } from "@/constants";
import WeekDaySelect from "../week-day-select";
import { vCrontab } from "./crontab";
const defaultValue = {
  executeType: null,
  executeConfig: {
    week: null,
    month: null,
    day: null,
    time: null,
  },
  executeCron: "0 0 * * * ? *",
};
export default {
  components: {
    WeekDaySelect,
    vCrontab,
  },
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
    showPerview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        ...defaultValue,
        ...this.value,
      },
      runConfigOptions: [
        {
          value: "day",
          label: "每天运行",
        },
        {
          value: "week",
          label: "每周运行",
        },
        {
          value: "month",
          label: "每月运行",
        },
        {
          value: "year",
          label: "每年运行",
        },
        {
          value: "cron",
          label: "按Cron计划运行",
        },
      ],
      DAYS_OF_MONTH,
      loading: {
        preview: false,
      },
    };
  },
  watch: {
    form: {
      handler(newVal) {
        this.$emit("input", cloneDeep(newVal));
      },
      deep: true,
    },
    value: {
      handler(newVal) {
        if (!isEqual(newVal, this.form)) {
          this.form = cloneDeep(newVal);
        }
      },
      deep: true,
    },
  },
  methods: {
    previewCron() {
      this.loading.preview = true;
      this.$request({
        method: "post",
        url: "/gov/api/audit/cron/getNextExecuteTimeByCron",
        data: {
          cron: this.form.executeCron,
        },
      })
        .then((res) => {
          const time = res.join("<br>");
          this.$alert(
            `<p style="text-align: center">${time}</p>`,
            "接下来五次运行时间",
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: "确定",
              callback: () => {},
            }
          );
        })
        .finally(() => {
          this.loading.cron = false;
        });
    },
  },
};
</script>
<style lang="postcss" scoped>
.crontab-container .time-zone {
  >>> {
    .el-input {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
  }
  .el-input {
    width: inherit;
  }
  .el-input {
    width: 100%;
  }
  .el-select {
    width: 100%;
  }

  .el-form-item {
    margin-bottom: 0;
    .el-form-item__label {
      font-size: 13px;
      color: #666;
      font-weight: 700;
    }
  }

  .hour {
    margin-top: 10px;

    .el-input {
      width: 60px;

      .el-input__inner {
        padding: 0 5px 0 5px;
        text-align: center;
      }
    }
  }

  .day {
    margin-top: 10px;

    .el-input__prefix {
      display: none;
    }

    .el-date-editor {
      width: 120px;

      .el-input__inner {
        padding: 0 5px 0 5px;
        text-align: center;
      }
    }
  }

  .week {
    margin-top: 10px;

    .el-select {
      width: 80px;
      margin-right: 10px;

      .el-input__inner {
        padding: 0 25px 0 5px;
        text-align: center;
      }
    }

    .el-input__prefix {
      display: none;
    }

    .el-date-editor {
      width: 120px;

      .el-input__inner {
        padding: 0 5px 0 5px;
        text-align: center;
      }
    }
  }

  .month {
    margin-top: 10px;
    .el-select {
      width: 80px;
      margin-right: 10px;

      .el-input__inner {
        padding: 0 25px 0 5px;
        text-align: center;
      }
    }

    .el-input__prefix {
      display: none;
    }

    .el-date-editor {
      width: 120px;

      .el-input__inner {
        padding: 0 5px 0 5px;
        text-align: center;
      }
    }
  }
  .year {
    margin-top: 10px;
    .el-select {
      width: 80px;
      margin-right: 10px;

      .el-input__inner {
        padding: 0 25px 0 5px;
        text-align: center;
      }
    }

    .el-input__prefix {
      display: none;
    }

    .el-date-editor {
      width: 120px;

      .el-input__inner {
        padding: 0 5px 0 5px;
        text-align: center;
      }
    }
  }

  .cron {
    .cron-item {
      margin-top: 10px;
    }

    .time-controller {
      margin-bottom: 10px;

      .time-select-input {
        width: 270px !important;

        .el-input__inner {
          padding-left: 30px;
        }
      }
    }

    .el-input {
      width: 270px;

      .el-input__inner {
        padding: 0 5px 0 5px;
      }
    }
  }
}
</style>
