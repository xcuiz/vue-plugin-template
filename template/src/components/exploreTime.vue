<template>
  <div class="time-zone-container">
    <el-collapse v-model="activeNames" style="width: 420px" accordion>
      <el-collapse-item name="1">
        <span slot="title" class="collapse-title">快捷时间</span>
        <template v-if="!reduced">
          <el-row class="collapse-title">
            <el-col :span="6">
              <el-link class="today" @click="selectTime">今天</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="1min" @click="selectTime">最近1分钟</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="1day" @click="selectTime">最近1天</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="all" @click="selectTime">所有时间</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-link class="yesterday" @click="selectTime">昨天</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="10min" @click="selectTime">最近10分钟</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="7day" @click="selectTime">最近7天</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-link class="thisweek" @click="selectTime">本周</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="15min" @click="selectTime">最近15分钟</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="30day" @click="selectTime">最近30天</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-link class="lastweek" @click="selectTime">上周</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="30min" @click="selectTime">最近30分钟</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="3mon" @click="selectTime">最近3个月</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-link class="thismonth" @click="selectTime">本月</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="1hour" @click="selectTime">最近1小时</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="6mon" @click="selectTime">最近6个月</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-link class="lastmonth" @click="selectTime">上月</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="4hour" @click="selectTime">最近4小时</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="1year" @click="selectTime">最近1年</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-link class="thisyear" @click="selectTime">本年</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="12hour" @click="selectTime">最近12小时</el-link>
            </el-col>
            <!-- <el-col :span="6">
              <el-link @click="selectTime" class="all">所有时间</el-link>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-link class="lastyear" @click="selectTime">去年</el-link>
            </el-col>
          </el-row>
        </template>
        <template v-else>
          <el-row class="collapse-title">
            <el-col :span="6">
              <el-link class="1hour" @click="selectTime">最近1小时</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="1day" @click="selectTime">最近1天</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="7day" @click="selectTime">最近7天</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="all" @click="selectTime">所有时间</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-link class="30day" @click="selectTime">最近30天</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="3mon" @click="selectTime">最近3个月</el-link>
            </el-col>
            <el-col :span="6">
              <el-link class="6mon" @click="selectTime">最近6个月</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-link class="1year" @click="selectTime">最近1年</el-link>
            </el-col>
            <!-- <el-col :span="8">
              <el-link @click="selectTime" class="all">所有时间</el-link>
            </el-col> -->
          </el-row>
        </template>
      </el-collapse-item>

      <el-collapse-item v-if="showRelativeTime" name="2" accordion>
        <span slot="title" class="collapse-title">相对时间</span>
        <el-row style="margin-bottom: 5px">
          <el-col :span="24">
            <el-row style="margin-bottom: 5px">
              <el-col :span="15">
                <el-input
                  v-model="relativeInputValue"
                  size="mini"
                  placeholder="请输入"
                  style="width: 100px; margin-right: 5px"
                >
                </el-input>
                <el-select
                  v-model="relativeValue"
                  size="mini"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in timeUnitSource"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="2"> - </el-col>
              <el-col :span="2">
                <el-radio v-model="relativeEnd" label="0">当前</el-radio>
              </el-col>

              <!-- <el-col :span="4" :offset="3">
                <el-button
                  size="mini"
                  type="primary"
                  @click="preview">
                  预览
                </el-button>
              </el-col> -->
            </el-row>

            <el-row>
              <el-col :span="15">
                <el-radio v-model="relativeStart" label="0">当前</el-radio>
                <el-radio v-model="relativeStart" label="1">整点</el-radio>
              </el-col>
              <el-col :span="2"> &nbsp; </el-col>
              <el-col :span="2">
                <el-radio v-model="relativeEnd" label="1">整点</el-radio>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                {{ relativeStartTime }}
              </el-col>
              <el-col :span="11" style="margin-left: 10px">
                {{ relativeEndTime }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" :offset="19">
            <div class="bottom" style="text-align: right">
              <el-button
                size="mini"
                type="primary"
                @click="confirmRelativeTime"
              >
                确定
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item v-if="showRealTime" name="4" accordion>
        <span slot="title" class="collapse-title">实时</span>
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="15"> 最早： </el-col>

              <el-col :span="6" :push="1"> 最晚： </el-col>
            </el-row>
            <el-row style="margin-top: 5px">
              <el-col :span="15">
                <el-input
                  v-model="realTime"
                  size="mini"
                  placeholder="请输入"
                  style="width: 100px; margin-right: 5px"
                >
                </el-input>
                <el-select
                  v-model="realTimeUnit"
                  size="mini"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in timeUnitSource"
                    :key="item.key"
                    :label="item.value"
                    :value="item.key"
                  >
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="8" :push="1">
                <el-input size="mini" :value="'立即'" disabled></el-input>
              </el-col>
            </el-row>
            <el-row style="margin-top: 5px">
              <el-col :span="12">
                {{ realDate }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="5" :offset="19">
            <div class="bottom" style="text-align: right">
              <el-button size="mini" type="primary" @click="confirmRealTime">
                确定
              </el-button>
            </div>
          </el-col>
        </el-row>
      </el-collapse-item>
      <el-collapse-item name="3" accordion>
        <span slot="title" class="collapse-title">时间范围</span>
        <el-row>
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="grid-content bg-purple">
                <el-select
                  v-model="scopeValue"
                  stretch
                  size="mini"
                  placeholder="请选择"
                  @change="selectTimeScope"
                >
                  <el-option
                    v-for="item in scopeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="grid-content bg-purple-light">
                <el-date-picker
                  v-if="
                    scopeValue === '3' ||
                    scopeValue === '1' ||
                    scopeValue === ''
                  "
                  v-model="startTime"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间"
                  :picker-options="noLimit ? {} : pickerOptionsStart"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss.sss"
                  @change="dealStartDate"
                >
                </el-date-picker>
                <span
                  v-if="
                    scopeValue === '2' ||
                    scopeValue === '1' ||
                    scopeValue === ''
                  "
                  >&nbsp;- &nbsp;</span
                >
                <el-date-picker
                  v-if="
                    scopeValue === '2' ||
                    scopeValue === '1' ||
                    scopeValue === ''
                  "
                  v-model="endTime"
                  type="datetime"
                  size="mini"
                  placeholder="选择日期时间"
                  :picker-options="noLimit ? {} : pickerOptionsEnd"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss.sss"
                  @change="dealEndDate"
                >
                </el-date-picker>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="5" :offset="19">
              <div class="bottom" style="text-align: right; margin-top: 10px">
                <el-button size="mini" type="primary" @click="confirmTime">
                  确定
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-row>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import dayjs from "dayjs";
import exploreTime from "./api/exploreTime.js";
import globalMixins from "@/mixins/globalMixins.js";
import { mapActions, mapGetters } from "vuex";
import { EXPLORE } from "@/store/type";
export default {
  components: {},
  mixins: [exploreTime, globalMixins],
  props: {
    conditionRow: Object,
    showRelativeTime: {
      type: Boolean,
      require: false,
      default: true,
    },
    // 是否展示实时
    showRealTime: {
      type: Boolean,
      default: false,
    },
    // 一开始是否就触发
    passive: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 精简模式
    reduced: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 有无时间限制
    noLimit: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      realTimeUnit: "second",
      realTime: "",
      activeNames: "1",
      timeType: "",
      // 相对时间
      // relativeTime: '',
      // nowTime: '',
      relativeStartTime: "", //
      relativeEndTime: "", // 相对时间预览值
      relativeStart: "0",
      relativeEnd: "0",
      relativeInputValue: "",
      startTime: "",
      endTime: "",
      // reletiveOptions: [],
      scopeOptions: [
        {
          value: "1",
          label: "介于",
        },
        {
          value: "2",
          label: "之前",
        },
        {
          value: "3",
          label: "之后",
        },
      ],
      relativeValue: "second",
      scopeValue: "",
      pickerOptionsStart: {
        // 限制开始时间
        disabledDate: (time) => {
          if (this.endTime) {
            // 如果结束时间不为空，则小于结束时间
            return new Date(this.endTime).getTime() < time.getTime();
          } else {
            // return time.getTime() < new Date(new Date().toLocaleDateString()).getTime()
          }
        },
      },
      pickerOptionsEnd: {
        // 限制开始时间
        disabledDate: (time) => {
          if (this.startTime) {
            // 如果开始时间不为空，则结束时间大于开始时间
            return new Date(this.startTime).getTime() > time.getTime();
          } else {
            return (
              time.getTime() <
              new Date(new Date().toLocaleDateString()).getTime()
            );
          }
        },
      },
    };
  },
  computed: {
    ...mapGetters("explore", ["timeUnitSource"]),
    // 计算展示的实时时间
    realDate() {
      if (!this.showRealTime) {
        return "";
      }
      const { realTime, realTimeUnit } = this.$data;
      return this.getCurrentPreviewTime({
        time: realTime,
        unit: realTimeUnit,
      });
    },
    // 聚合相对时间的所有变动参数
    allRelativeProps() {
      const {
        relativeInputValue,
        relativeValue,
        relativeStart,
        relativeEnd,
      } = this.$data;
      return {
        relativeInputValue,
        relativeValue,
        relativeStart,
        relativeEnd,
      };
    },
  },
  watch: {
    allRelativeProps: {
      handler({
        relativeInputValue,
        relativeValue,
        relativeStart,
        relativeEnd,
      }) {
        const currentTime = new Date();

        this.relativeStartTime = this.getCurrentPreviewTime({
          time: relativeInputValue,
          unit: relativeValue,
          integral: relativeStart === "1",
          currentTime,
        });
        this.relativeEndTime = this.getCurrentPreviewTime({
          unit: relativeValue,
          integral: relativeEnd === "1",
          currentTime,
        });
      },
      immediate: true,
    },
    mounted() {
      if (!this.passive) {
        this.$emit("selectTime", "最近30分钟", "30min", 1);
      }
      // this.reqRelativetime()
      this.setTimeUnitSource();
    },
    methods: {
      ...mapActions("explore", {
        setTimeUnitSource: EXPLORE.SET_TIME_UNIT_SOURCE,
      }),
      /**
       * @param {number} time 时间
       * @param {string} unit 单位
       * @param {boolean} integral 是否整点
       */
      getCurrentPreviewTime({
        time = 0,
        unit = "second",
        integral = false,
        currentTime = new Date(),
      }) {
        let showTime = "";
        // 默认时间formate参数，非整点
        let formate = "YYYY-MM-DD HH:mm:ss.SSS";
        // this.reletiveOptions
        switch (unit) {
          case "second":
          case "minute":
          case "hour":
          case "day":
          case "month":
          case "year":
            showTime = dayjs(currentTime).subtract(time, unit);
            break;
          case "week":
            showTime = dayjs(currentTime).subtract(7 * time, "day");
            break;
          case "quarter": // 季度
            showTime = dayjs(currentTime).subtract(3 * time, "month");
            break;
          default:
        }
        // 时间是否需要取整
        if (integral) {
          switch (unit) {
            case "second":
              formate = "YYYY-MM-DD HH:mm:ss.000";
              break;
            case "minute":
              formate = "YYYY-MM-DD HH:mm:00.000";
              break;
            default:
              formate = "YYYY-MM-DD HH:00:00.000";
          }
        }

        return dayjs(showTime).format(formate);
      },

      selectTimeScope() {
        if (this.scopeValue === "2") {
          this.startTime = "";
        } else if (this.scopeValue === "3") {
          this.endTime = "";
        }
        this.startTime = "";
        this.endTime = "";
      },
      selectRelativeValue(val) {
        this.relativeValue = val;
      },
      // async preview () {
      //   let req = {
      //     relativeDays: Number(this.relativeInputValue),
      //     relativeType: this.relativeValue,
      //     relativeOnTime: this.relativeStart,
      //     nowOnTime: this.relativeEnd
      //   }
      //   return this.previewtime(req).then(content => {
      //     this.nowTime = content.nowTime
      //     this.relativeTime = content.relativeTime
      //   }, () => {
      //     this.showMessage('查询失败!', 'error')
      //   })
      // },
      confirmTime() {
        this.timeType = 3;
        if (this.startTime !== "" && !this.startTime.includes(".000")) {
          this.startTime = this.startTime + ".000";
        }
        if (this.endTime !== "" && !this.endTime.includes(".000")) {
          this.endTime = this.endTime + ".000";
        }
        this.relativeInputValue = "";
        this.$emit(
          "confirmTime",
          this.startTime.trim(),
          this.endTime.trim(),
          this.timeType,
          this.scopeValue
        );
      },
      // 实时确认
      confirmRealTime() {
        this.$emit("confirmRealTime", this.realTime, this.realTimeUnit);
      },
      async confirmRelativeTime() {
        // await this.preview()
        this.timeType = 2;
        this.startTime = "";
        this.endTime = "";
        // debugger
        this.$emit(
          "confirmRelativeTime",
          this.relativeInputValue,
          this.relativeValue,
          this.relativeStart,
          this.relativeEnd,
          this.timeType,
          this.relativeEndTime,
          this.relativeStartTime
        );
      },
      dealEndDate(value) {
        if (this.startTime) {
          if (new Date(this.startTime).getTime() > new Date(value).getTime()) {
            this.endTime = "";
          }
        }
      },
      dealStartDate(value) {
        if (this.endTime) {
          if (new Date(this.endTime).getTime() < new Date(value).getTime()) {
            this.startTime = "";
          }
        }
      },
      selectTime(val) {
        this.timeType = 1;
        this.$emit(
          "selectTime",
          val.target.innerText,
          val.currentTarget.classList[0],
          this.timeType
        );
      },
      // reqRelativetime () {
      //   this.getRelativetime().then(content => {
      //     this.reletiveOptions = content
      //     this.$emit('setUnitSource', content)
      //   }, () => {
      //     this.showMessage('查询失败!', 'error')
      //   })
      // }
    },
    conditionRow() {
      if (this.conditionRow) {
        this.relativeInputValue = this.conditionRow.relativeDays;
        this.relativeValue = this.conditionRow.relativeType;
        this.relativeStart = this.conditionRow.relativeOntime;
        this.relativeEnd = this.conditionRow.nowOntime;
        this.scopeValue = this.conditionRow.rangeType;
        this.startTime = this.conditionRow.startTime;
        this.endTime = this.conditionRow.endTime;
        this.activeNames = this.conditionRow.timeType;
      } else {
        this.activeNames = "1";
      }
    },
  },
};
</script>

<style scoped lang="postcss">
.time-zone-container {
  .collapse-title {
    flex: 1 0 90%;
    order: 1;
  }
  .el-collapse-item {
    >>> .el-collapse-item__header {
      flex: 1 0 auto;
      order: -1;
      padding: 0 10px;

      height: 32px;
      line-height: 32px;
      background: #f0f2f5;
      /* border-bottom-color: #fff; */
      border-bottom: 2px solid #fff;
    }
    &:last-child {
      >>> .el-collapse-item__header {
        border-bottom: none;
      }
    }
    >>> .el-collapse-item__wrap {
      padding: 10px 10px 0 30px;
      .el-collapse-item__content {
        padding-bottom: 10px;
      }
    }
  }

  .right-panel {
    margin-top: 30px;
    margin-left: 30px;
  }

  .grid-content {
    .el-date-editor {
      width: 140px;
    }
  }
  >>> .el-input-group {
    width: 200px;
    background-color: #fff;
  }
  >>> .el-select {
    width: 65px;
  }
  /* >>> .el-input:not(.el-date-editor) {
    width: 100px;
  } */
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
