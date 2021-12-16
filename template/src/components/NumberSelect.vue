<template>
  <div class="number-select-container">
    <i
      v-if="closable"
      class="el-icon-error"
      title="删除该过滤器"
      @click="deleteFilter"
    ></i>
    <el-popover
      v-model="unfold"
      class="popover-button"
      placement="bottom"
      width="199"
      trigger="click"
      popper-class="number-select-popover-container"
      :visible-arrow="false"
      @show="handleShow"
      @hide="handleHide"
    >
      <!-- 下拉框内容区域 -->
      <div v-loading="loading" class="popover-wrapper">
        <h3 class="title">{{ meta.name }}</h3>
        <template v-if="status === 'success'">
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
          <div v-if="!isRegion" class="footer single">
            <el-input-number
              v-model="num"
              size="small"
              :min="min(meta.leftMin)"
              controls-position="right"
            />
            <p v-if="meta.unit" class="unit">单位：{{ meta.unit }}</p>
          </div>
          <!-- 区间 -->
          <div v-else class="footer">
            <el-input-number
              v-model="minNum"
              size="small"
              controls-position="right"
              :min="min(meta.leftMin)"
              @change="handleMinChange"
            />
            <i>至</i>
            <el-input-number
              v-model="maxNum"
              size="small"
              :min="min(meta.rightMin)"
              controls-position="right"
              @change="handleMaxChange"
            />
          </div>
          <p v-if="isRegion && meta.unit" class="unit">单位：{{ meta.unit }}</p>
        </template>
        <div v-else-if="status === 'error'" class="error">
          <i class="el-icon-error"></i>
          <p class="text">加载失败</p>
        </div>
      </div>

      <!--触发下拉弹出的button-->
      <div slot="reference" class="button" :class="{ error: showError }">
        <span v-if="operator !== '' || meta.recoverData" class="region">{{
          regionText
        }}</span>
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
import { getFilterOperatorAsync } from "@/components/api/filter";
import Filter from "@/components/filter.js";

const REGION_MAP = {};
export default {
  name: "NumberSelect",
  props: {
    meta: {
      type: Object,
      required: true,
      default() {
        return {
          code: "", // 过滤器唯一标识码
          filterMode: "", // 过滤器模式(方式)
          name: "", // 过滤器名称
          sourceValue: "", // 过滤值来源（用于API请求参数）
          unit: "",
          leftMin: -Infinity,
          rightMin: Infinity,
        };
      },
    },
    closable: {
      type: Boolean,
      default: true,
    },
    compareOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      showError: false,
      unfold: false, // 是否展开
      num: 1, // 非区间类型对应的数值
      minNum: 1, // 区间类型对应的最小值
      maxNum: 1, // 区间类型对应的最大值
      isRegion: false, // 是否是区间
      operator: "", // key
      loading: true,
      options: [], // 操作符下拉选择框对应的options
      status: "",
      /* 状态，两种取值：success/error
       * success: 正常状态
       * error: 加载数据失败
       */
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
    regionText() {
      let { minNum: start, maxNum: end, num } = this;
      let res = "";
      switch (this.operator) {
        case "gt":
          res = "> " + num;
          break;
        case "lt":
          res = "< " + num;
          break;
        case "eq":
          res = "= " + num;
          break;
        case "ge":
          res = "≥ " + num;
          break;
        case "le":
          res = "≤ " + num;
          break;
        case "ne":
          res = "≠ " + num;
          break;
        case "btwe":
          res = `[${start} , ${end}]`;
          break;
        case "btw":
          res = `(${start} , ${end})`;
          break;
        case "oute":
          res = `(﹣∞ , ${start}] ∪ [${end} , ﹢∞)`;
          break;
        case "out":
          res = `(﹣∞ , ${start}) ∪ (${end} , ﹢∞)`;
          break;
        default:
          res = start + "-" + end;
          break;
      }
      return res;
    },
  },
  watch: {
    meta() {
      // 恢复
      this._recoverFromMeta();
    },
  },
  mounted() {
    // 恢复
    this._recoverFromMeta();
  },
  methods: {
    // 验证
    validate() {
      if (this.operator && this.minNum + "") {
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
    handleMinChange(minNum) {
      if (this.maxNum < minNum) {
        this.maxNum = minNum;
      }
    },
    handleMaxChange(maxNum) {
      if (maxNum < this.minNum) {
        this.minNum = maxNum;
      }
    },
    // popover弹框出现
    async handleShow() {
      if (this.options.length !== 0 && this.status !== "error") {
        // 之前已经被打开过并且status不为error，直接返回
        this.onceOpened = true; // 曾经被打开过

        this.copyMinNum = this.minNum;
        this.copyMaxNum = this.maxNum;
        this.copyNum = this.num;
        this.copyOperator = this.operator;
        return;
      }

      this.onceOpened = false; // 曾经没有被打开过
      let data;
      try {
        const { compareOptions } = this;
        if (Array.isArray(compareOptions) && compareOptions.length === 0) {
          data = await getFilterOperatorAsync();
        } else {
          data = this.compareOptions;
        }
      } catch (e) {
        // 出错
        this.status = "error";
        this.loading = false;
        return;
      }
      this.loading = false;
      this.status = "success";
      this.operator = data[0].key;
      this.options = data;
      this.options.map((option) => {
        REGION_MAP[option.key] = option.region;
        return option;
      });
      this.copyMinNum = this.minNum;
      this.copyMaxNum = this.maxNum;
      this.copyNum = this.num;
      this.copyOperator = this.operator;

      // 恢复
      const { recoverData } = this.meta;
      if (recoverData) {
        const { operator, startValue, endValue } = recoverData;
        this.minNum = parseInt(startValue) | 0;
        this.maxNum = parseInt(endValue) | 0;
        this.num = parseInt(startValue) | 0;
        this.operator = operator;
        this.isRegion = REGION_MAP[operator];
      }
    },
    // popover弹框消失
    handleHide() {
      if (this.status === "error") {
        // error 状态下，再次打开时依然loading
        this.loading = true;
        return;
      }

      let {
        meta: { code, filterMode, name, sourceValue },
        operator,
        minNum,
        maxNum,
        num,
      } = this;

      let filter = new Filter({
        code,
        filterMode,
        name,
        sourceValue,
        status: {
          operator,
          startValue: (REGION_MAP[operator] ? minNum : num).toString(),
          endValue: (REGION_MAP[operator] ? maxNum : "").toString(),
        },
      });

      if (!this.onceOpened) {
        // 曾经没有被打开过
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
        this.minNum = parseInt(startValue) | 0;
        this.maxNum = parseInt(endValue) | 0;
        this.num = parseInt(startValue) | 0;
        this.operator = operator;
        this.isRegion = REGION_MAP[operator];
      }
    },
    // 是否有实质性的操作
    _changed() {
      return (
        this.minNum !== this.copyMinNum ||
        this.maxNum !== this.copyMaxNum ||
        this.num !== this.copyNum ||
        this.operator !== this.copyOperator
      );
    },
    min(val) {
      if (val === 0 || val) {
        return val;
      }

      return -Infinity;
    },
  },
};
</script>

<!--scoped-->
<style scoped lang="postcss">
.number-select-container {
  position: relative;
  width: 210px;
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

      .region {
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
.number-select-popover-container {
  margin-top: 6px !important;
  width: 210px !important;
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
      margin: 0 5px 10px;

      .el-select {
        width: 100%;
      }
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #eee;
      padding: 12px 5px;

      &.single {
        .el-input-number {
          width: 140px;
        }

        .unit {
          margin-top: 0;
        }
      }

      .el-input-number {
        width: 85px;

        span {
          width: 20px;
          background-color: #fff;
        }

        .el-input {
          .el-input__inner {
            padding-right: 30px;
            padding-left: 10px;
          }
        }
      }
    }

    .unit {
      color: #aaa;
      font-size: 12px;
      padding-left: 6px;
      margin-top: -5px;
    }

    .error {
      text-align: center;
      padding: 5px 0;

      i {
        font-size: 28px;
        color: #e2e2e2;
      }

      .text {
        font-size: var(--font-size-13);
      }
    }
  }
}
</style>
