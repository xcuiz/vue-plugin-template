<template>
  <div class="time-select-container">
    <i
      v-if="closable"
      class="el-icon-error"
      title="删除该过滤器"
      @click="deleteFilter"
    ></i>
    <el-popover
      v-model="unfold"
      class="popover-button"
      :placement="placement"
      width="199"
      trigger="click"
      popper-class="time-select-popover-container"
      @show="handleShow"
      @hide="handleHide"
    >
      <!-- 下拉框内容区域 -->
      <div class="popover-wrapper">
        <h3 class="title">{{ meta.name }}</h3>
        <div class="checkbox-wrapper">
          <el-select
            v-model="operator"
            size="mini"
            placeholder="请选择"
            @change="handleSelectChange"
          >
            <el-option
              v-for="item in options"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            >
            </el-option>
          </el-select>
        </div>
        <!-- 非区间 -->
        <div v-if="!isRegion" class="footer">
          <el-date-picker
            v-model="time"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
        <!-- 区间 -->
        <div v-else class="footer">
          <el-date-picker
            v-model="startTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
          <i class="separator">至</i>
          <el-date-picker
            v-model="endTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </div>
      </div>

      <!--触发下拉弹出的button-->
      <div slot="reference" class="button" :class="{ error: showError }">
        <span v-if="showTip" class="timeRegion">{{ timeText }}</span>
        <span v-else class="text">{{ buttonText }}</span>
        <i :class="arrowIconCls"></i>
      </div>
    </el-popover>
    <i v-if="showError" class="error-tips">字段不能为空</i>
  </div>
</template>

<script>
/**
 * 代码阅读提示：
 * 1. 首先阅读 handleShow 方法，
 *    此方法是popover弹框出现时的回调，用于动态获取ajax数据
 * 2. 然后阅读 handleHide 方法，
 *    此方法是popover弹框消失时的回调，
 *    主要用于根据 "用户是否产生了实质性的操作" 来判断需不需要向父组件触发 trigger 事件
 */
import { dateFormat } from "./common/js/util";
import Filter from "@/components/filter.js";

const OPERATORS = [
  { key: "between", value: "介于", region: true },
  { key: "before", value: "之前", region: false },
  { key: "after", value: "之后", region: false },
];
const REGION_MAP = {
  between: true,
  before: false,
  after: false,
};
export default {
  name: "TimeSelect",
  props: {
    meta: {
      type: Object,
      required: true,
      default() {
        return {
          filterMode: 6,
          code: "",
          name: "",
          sourceValue: "",
        };
      },
    },
    closable: {
      type: Boolean,
      default: true,
    },
    placement: {
      type: String,
      default: "left",
      validator(placement) {
        return (
          [
            "top",
            "top-start",
            "top-end",
            "bottom",
            "bottom-start",
            "bottom-end",
            "left",
            "left-start",
            "left-end",
            "right",
            "right-start",
            "right-end",
          ].indexOf(placement) !== -1
        );
      },
    },
  },
  data() {
    return {
      showError: false,
      unfold: false, // 是否展开
      time: dateFormat("yyyy-MM-dd HH:mm:ss", new Date()), // 非区间类型对应的时间
      startTime: dateFormat("yyyy-MM-dd HH:mm:ss", new Date()), // 区间类型对应的最小值
      endTime: dateFormat("yyyy-MM-dd HH:mm:ss", new Date()), // 区间类型对应的最大值
      isRegion: true, // 是否是区间
      operator: OPERATORS[0].key, // key
      options: OPERATORS, // 操作符下拉选框option
      pickerOptions: {
        // element ui 时间日期选择器特有的选项
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      openedCount: 0, // 记录popover弹框被打开的次数
    };
  },
  computed: {
    arrowIconCls() {
      if (this.unfold) {
        return "el-icon-arrow-up";
      }
      return "el-icon-arrow-down";
    },
    buttonText() {
      if (this.unfold) {
        return "请选择";
      }
      return this.meta.name;
    },
    timeText() {
      if (this.operator === "between") {
        // 区间
        return (
          this.startTime.substr(5, 11) + " 至 " + this.endTime.substr(5, 11)
        );
      } else {
        return this.time;
      }
    },
    showTip() {
      return this.openedCount !== 0;
    },
  },
  watch: {
    meta() {
      // vuex 恢复
      this._recoverFromMeta();
    },
  },
  mounted() {
    // 从已保存中恢复
    this._recoverFromMeta();
  },
  methods: {
    // 验证
    validate() {
      if (this.openedCount > 0) {
        this.showError = false;
        return true;
      } else {
        this.showError = true;
        return false;
      }
    },
    // 处理操作符改变事件
    handleSelectChange(operatorKey) {
      let options = this.options;
      let len = options.length;
      for (let i = 0; i < len; i++) {
        if (options[i].key === operatorKey) {
          this.isRegion = options[i].region;
          break;
        }
      }
    },
    // popover弹框出现
    handleShow() {
      ++this.openedCount;

      this.copyStartTime = this.startTime;
      this.copyEndTime = this.endTime;
      this.copyTime = this.time;
      this.copyOperator = this.operator;

      // 恢复
      const { recoverData } = this.meta;
      if (recoverData) {
        const { operator, startValue, endValue } = recoverData;
        this.operator = operator;
        this.isRegion = REGION_MAP[operator];
        if (operator === "between") {
          // 之间
          this.time = "";
          this.startTime = startValue;
          this.endTime = endValue;
        } else if (operator === "before") {
          // 之前
          this.time = endValue;
          this.startTime = "";
          this.endTime = "";
        } else {
          // 之后
          this.time = startValue;
          this.startTime = "";
          this.endTime = "";
        }
      }
    },
    // popover弹框消失
    handleHide() {
      let {
        meta: { code, filterMode, name, sourceValue },
        operator,
        startTime,
        endTime,
        time,
      } = this;

      let value = {};
      if (this.operator === "between") {
        // 之间
        value = {
          startValue: startTime,
          endValue: endTime,
        };
      } else if (this.operator === "before") {
        // 之前
        value = {
          startValue: "",
          endValue: time,
        };
      } else {
        // 之后
        value = {
          startValue: time,
          endValue: "",
        };
      }
      let filter = new Filter({
        code,
        filterMode,
        name,
        sourceValue,
        status: Object.assign({}, { operator }, value),
      });
      if (this.openedCount === 1) {
        // 第一次打开，必定触发trigger
        this.$emit("trigger", filter);
      } else {
        if (!this._changed()) {
          // 没有实质性的操作
          // this.$message({
          //   message: '当前过滤器状态没有改变',
          //   type: 'warning'
          // })
          return;
        }
        this.$emit("trigger", filter);
      }
    },
    deleteFilter() {
      this.$emit("delete-filter", this.meta.code);
    },
    _recoverFromMeta() {
      const { recoverData } = this.meta;
      if (recoverData) {
        const { operator, startValue, endValue } = recoverData;
        this.operator = operator;
        switch (this.operator) {
          case "between":
            this.startTime = startValue;
            this.endTime = endValue;
            break;
          case "before":
            this.time = endValue;
            break;
          case "after":
            this.time = startValue;
            break;
        }
        this.isRegion = REGION_MAP[operator];
        ++this.openedCount;
      }
    },
    // 是否有实质性的操作
    _changed() {
      return (
        this.startTime !== this.copyStartTime ||
        this.endTime !== this.copyEndTime ||
        this.time !== this.copyTime ||
        this.operator !== this.copyOperator
      );
    },
  },
};
</script>

<!--scoped-->
<style scoped lang="postcss">
.time-select-container {
  position: relative;
  width: 199px;
  display: inline-block;
  vertical-align: top;

  &:hover {
    > .el-icon-error {
      opacity: 1;
    }
  }

  > .el-icon-error {
    opacity: 0;
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    padding: 3px;
    box-sizing: border-box;
    right: 0;
    color: #cecfd1;
    top: -18px;
    transition: all 0.3s;

    &:hover {
      color: orangered;
    }
  }

  .popover-button {
    .button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 8px 0 5px;
      width: 100%;
      height: 28px;
      line-height: 28px;
      cursor: pointer;
      border: 1px solid #dcdfe6;
      border-radius: 2px;
      font-size: var(--font-size-13);
      color: #3c5679;
      background: #fff;
      transition: all 0.5s;
      outline: none;

      &.error {
        border: 1px solid red !important;
      }

      &:hover {
        border-color: #c0c4cc;
      }

      .timeRegion {
        display: inline-block;
        vertical-align: top;
        font-size: var(--font-size-12);
        height: 20px;
        line-height: 20px;
        background-color: #f4f4f5;
        border-color: #e9e9eb;
        color: #909399;
        border-radius: 2px;
        white-space: nowrap;
        padding: 0 4px;
        margin-right: 4px;
      }
    }
  }

  .error-tips {
    position: absolute;
    bottom: -16px;
    color: #f33d3d;
    font-size: 12px;
  }
}
</style>
<!--global:慎用，加前缀-->
<style lang="postcss">
.time-select-popover-container {
  margin-top: 6px !important;
  padding: 0;
  border: none;
  border-radius: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  .popover-wrapper {
    .title {
      height: 27px;
      line-height: 27px;
      background-color: #f2f2f2;
      text-align: center;
      margin-bottom: 10px;
      font-size: var(--font-size-13);
    }

    .checkbox-wrapper {
      text-align: center;
      margin-bottom: 10px;
    }

    .footer {
      border-top: 1px solid #eee;
      padding: 12px 10px;

      .separator {
        display: block;
        padding: 5px 0;
      }

      .el-date-editor {
        width: 100%;

        .el-input__inner {
          padding-right: 20px;
        }
      }
    }
  }
}
</style>
