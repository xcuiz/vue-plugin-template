<template>
  <el-popover
    v-model="showExploreTime"
    popper-class="only-time-zone-self-popover"
    placement="right"
    trigger="click"
  >
    <exploreTime
      :reduced="reduced"
      no-limit
      :show-relative-time="showRelativeTime"
      :show-real-time="showRealTime"
      :passive="true"
      @selectTime="handleSelectTime"
      @confirmTime="handleConfirmTime"
      @confirmRelativeTime="handleConfirmRelativeTime"
      @confirmRealTime="handleConfirmRealTime"
    />
    <el-input
      slot="reference"
      size="mini"
      prefix-icon="el-icon-date"
      class="time-select-input el-date-editor"
      style="width: 200px; margin-right: 10px"
      :value="exploreTimeText"
      placeholder="请选择时间"
    ></el-input>
  </el-popover>
</template>

<script>
import { mapGetters } from "vuex";
import ExploreTime from "@/components/exploreTime";
import { deepClone, equals } from "./common/js/util";
import { TIME } from "./common/js/constant";
import { quickTimeList, getTimeText } from "@/components/timeConfig.js";
export default {
  name: "TimeController",
  components: { ExploreTime },
  props: {
    timeInfo: {
      type: Object,
      required: false,
      default() {
        return {
          startTime: "",
          endTime: "",
          quickTime: TIME.DEFAULT_QUICK_TIME,
          realTime: "",
        };
      },
    },
    equalCheck: {
      // 是否进行相等性检查
      type: Boolean,
      default: true,
    },
    // 精简模式（快捷时间较少）
    reduced: {
      type: Boolean,
      required: false,
      default: true,
    },
    // 是否显示相对时间
    showRelativeTime: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 返回数据是否涉及ms（毫秒）数据探索需要ms
    secondModel: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 是否展示实时
    showRealTime: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showExploreTime: false,
      // exploreTimeText: '', // 显示的文本
      time: {
        startTime: "",
        endTime: "",
        realTime: "",
        quickTime: "",
        params: {
          type: "",
          firstTime: "",
          lastTime: "",
        },
      },
    };
  },
  computed: {
    ...mapGetters("explore", ["timeUnitSource"]),
    exploreTimeText() {
      return getTimeText(this.time, quickTimeList, this.timeUnitSource);
    },
  },
  // mounted () {
  //   this.time = this.timeInfo
  // },
  watch: {
    timeInfo: {
      handler(val) {
        if (val && Object.keys(val).length) {
          this.time = val;
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 计算输入框展示的时间文本
    // getTimeText (
    //   {
    //     startTime,
    //     endTime,
    //     realTime,
    //     quickTime,
    //     params = {}
    //   } = {},
    //   quickTimeList = [],
    //   timeUnitSource = []
    // ) {
    //   let text
    //   if (quickTime) {
    //     text = quickTimeList.find(({ key }) => key === quickTime).value
    //     return text
    //   }
    //   if (!params) {
    //     return
    //   }
    //   const {
    //     type,
    //     firstTime,
    //     lastTime
    //   } = params

    //   switch (type) {
    //     case 'quickTime':
    //       text = firstTime
    //       break
    //     case 'relativeTime':
    //       // 1 天前---> 前 + 1 + 天
    //       // 获取timeUnitSource中code对应的label名称
    //       let unitName = timeUnitSource.find(({ key }) => key === lastTime).value
    //       // 删除最后一个字--即 ‘天’
    //       let name = unitName.substring(0, unitName.length - 1)

    //       text = '前' + firstTime + name
    //       break
    //     case 'realTime':
    //       text = firstTime + timeUnitSource.find(({ key }) => key === lastTime).value
    //       break
    //     default:
    //       text = endTime && startTime ? startTime + ' 至 ' + endTime : (startTime || endTime)
    //   }
    //   return text
    // },
    handleGetUnitSource(arr = []) {
      this.unitSource = arr;
    },
    handleSelectTime(text, code) {
      // debugger
      // this.exploreTimeText = text
      this.showExploreTime = false;
      const timeInfo = {
        startTime: "",
        endTime: "",
        realTime: "",
        quickTime: code,
        params: {
          type: "quickTime",
          firstTime: text,
          lastTime: code,
        },
      };
      // this.exploreTimeText = this.getTimeText(timeInfo)
      if (this.equalCheck && equals(timeInfo, this.timeInfo)) {
        this.$message({
          message: "时间信息没有改变",
          type: "warning",
        });
        return;
      }
      this.time = timeInfo;
      this.$emit("change", deepClone(timeInfo));
    },
    handleConfirmRelativeTime(
      relativeInputValue,
      relativeValue,
      relativeStart,
      relativeEnd,
      timeType,
      endTime,
      startTime
    ) {
      if (!this.secondModel) {
        let startIndex = startTime.lastIndexOf(".");
        let endIndex = endTime.lastIndexOf(".");
        startTime = startTime.substring(0, startIndex);
        endTime = endTime.substring(0, endIndex);
      }

      this.showExploreTime = false;
      const timeInfo = {
        startTime,
        endTime,
        quickTime: "",
        realTime: "",
        params: {
          type: "relativeTime",
          firstTime: relativeInputValue,
          lastTime: relativeValue,
        },
      };
      if (equals(timeInfo, this.timeInfo)) {
        this.$message({
          message: "时间信息没有改变",
          type: "warning",
        });
        return;
      }
      this.time = timeInfo;
      this.$emit("change", deepClone(timeInfo));
    },
    handleConfirmRealTime(time, unit) {
      this.showExploreTime = false;
      const timeInfo = {
        startTime: "",
        endTime: "",
        quickTime: "",
        realTime: time + "," + unit,
        params: {
          type: "realTime",
          firstTime: time,
          lastTime: unit,
        },
      };
      if (equals(timeInfo, this.timeInfo)) {
        this.$message({
          message: "时间信息没有改变",
          type: "warning",
        });
        return;
      }
      this.time = timeInfo;
      this.$emit("change", deepClone(timeInfo));
    },
    handleConfirmTime(startTime, endTime) {
      if (!this.secondModel) {
        let startIndex = startTime.lastIndexOf(".000");
        let endIndex = endTime.lastIndexOf(".000");
        startTime = startTime.substring(0, startIndex);
        endTime = endTime.substring(0, endIndex);
      }

      this.showExploreTime = false;
      const timeInfo = {
        startTime,
        endTime,
        quickTime: "",
        realTime: "",
        params: {
          type: "rangeTime",
          firstTime: "",
          lastTime: "",
        },
      };
      if (equals(timeInfo, this.timeInfo)) {
        this.$message("时间信息没有改变");
        return;
      }
      this.time = timeInfo;
      this.$emit("change", deepClone(timeInfo));
    },
  },
};
</script>

<style>
.only-time-zone-self-popover {
  padding: 0;
}
</style>

<style scoped lang="postcss">
.time-select-input {
  outline: none;
  width: 150px !important;
}
</style>
