<template>
  <div class="score-select-container">
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
      popper-class="score-select-popover-container"
      :visible-arrow="false"
      @show="handleShow"
      @hide="handleHide"
    >
      <!-- 下拉框内容区域 -->
      <div v-loading="loading" class="popover-wrapper">
        <h3 class="title">{{ meta.name }}</h3>
        <template v-if="status === 'success'">
          <div class="list-wrapper">
            <!--全选-->
            <el-checkbox
              v-model="checkAll"
              class="check-all"
              :indeterminate="indeterminate"
              size="mini"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <ul class="list">
              <li v-for="item in options" :key="item.code" class="item">
                <el-checkbox
                  v-model="item.checked"
                  size="mini"
                  class="item-checkbox"
                  @change="handleCheckedOptionChange(item)"
                >
                  {{ item.name }}
                </el-checkbox>
              </li>
            </ul>
          </div>
          <div class="footer" :class="{ grey }">
            <p class="text">
              <span>范围区间</span> <i>{{ range[0] }}-{{ range[1] }}分</i>
            </p>
            <el-slider
              v-model="range"
              range
              :min="1"
              :max="10"
              :marks="marks"
              @change="handleSliderChange"
              @input="handleSliderInput"
            >
            </el-slider>
          </div>
        </template>
        <div v-else-if="status === 'error'" class="error">
          <i class="el-icon-error"></i>
          <p class="text">加载失败</p>
        </div>
      </div>

      <!--触发下拉弹出的button-->
      <div slot="reference" class="button" :class="{ error: showError }">
        <span v-if="showTip" class="score"
          >评分 {{ startValue }}-{{ endValue }}</span
        >
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
 *    // 主要用于根据 "用户是否产生了实质性的操作" 来判断需不需要向父组件触发 trigger 事件
 */
import { deepClone } from "./common/js/util";
import { getFilterTypeValueAsync } from "@/components/api/filter";
import Filter from "@/components/filter.js";

export default {
  name: "ScoreSelect",
  props: {
    meta: {
      // 过滤器的元信息
      type: Object,
      required: true,
      default() {
        return {
          code: "", // 过滤器唯一标识码
          filterMode: "", // 过滤器模式(方式)
          name: "", // 过滤器名称
          sourceValue: "", // 过滤值来源（用于API请求参数）
        };
      },
    },
    closable: {
      type: Boolean,
      default: true,
    },
    sourceUrl: {
      type: String,
      default: "/gov/api/insight/anomaly/filtertypevalue",
    },
  },
  data() {
    return {
      showError: false,
      unfold: false, // 是否展开
      checkAll: false, // 是否全选
      indeterminate: false, // 不确定的状态
      options: [], // 选项列表数据
      range: [1, 10], // 数值滑块的区间值
      loading: true,
      startValue: "", // 开始值，用于传递给ajax接口
      endValue: "", // 结束值，用于传递给ajax接口
      marks: {
        // 数值滑块的标记 marks
        1: "1",
        10: "10",
      },
      grey: false, // footer 是否置灰
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
    showTip() {
      return this.startValue || this.endValue;
    },
  },
  watch: {
    meta() {
      // 从 vuex 恢复
      this._recoverFromMeta();
    },
  },
  mounted() {
    // 恢复 （点击已保存过滤条件恢复）
    this._recoverFromMeta();
  },
  methods: {
    // 验证
    validate() {
      if (this.startValue + "" && this.endValue + "") {
        this.showError = false;
        return true;
      } else {
        this.showError = true;
        return false;
      }
    },
    /**
     * checkAll
     * @param checkAll
     */
    handleCheckAllChange(checkAll) {
      this.options = this.options.map((option) => {
        option.checked = checkAll;
        return option;
      });

      if (checkAll) {
        this.startValue = "1";
        this.endValue = "10";
        this.grey = true;
      } else {
        this.startValue = this.range[0].toString();
        this.endValue = this.range[1].toString();
        this.grey = false;
      }

      this.indeterminate = false;
    },
    /**
     * 点击选项时的处理函数
     * @param option
     */
    handleCheckedOptionChange() {
      let checkedCount = 0; // 选中的个数
      let min = Infinity;
      let max = -Infinity;
      this.options.map((option) => {
        if (option.checked) {
          ++checkedCount;
          let { startValue, endValue } = option;
          startValue = parseInt(startValue);
          endValue = parseInt(endValue);
          if (startValue < min) {
            min = startValue;
          }
          if (endValue > max) {
            max = endValue;
          }
        }
        return option;
      });
      if (checkedCount > 0) {
        this.startValue = min.toString();
        this.endValue = max.toString();
        this.grey = true;
      } else {
        // 一个都没选
        this.startValue = this.range[0].toString();
        this.endValue = this.range[1].toString();
        this.grey = false;
      }

      // checkAll
      this.checkAll = checkedCount === this.options.length;
      // indeterminate
      this.indeterminate =
        checkedCount > 0 && checkedCount < this.options.length;
    },
    // 滑块改变时的处理函数
    handleSliderChange(range) {
      this.startValue = range[0].toString();
      this.endValue = range[1].toString();
    },
    // 滑块改变时的处理函数 实时
    handleSliderInput() {
      this.grey = false;
      this.checkAll = false;
      this.indeterminate = false;
      this.options = this.options.map((option) => {
        option.checked = false;
        return option;
      });
    },
    // popover弹框出现
    async handleShow() {
      if (this.options.length !== 0 && this.status !== "error") {
        // 之前已经被打开过并且status不为error，直接返回
        this.copyStartValue = this.startValue;
        this.copyEndValue = this.endValue;
        return;
      }
      const { filterMode, sourceValue: filterSource } = this.meta;

      let data;
      try {
        data = await getFilterTypeValueAsync(
          filterMode,
          filterSource,
          this.sourceUrl
        );
      } catch (e) {
        // 出错
        this.status = "error";
        this.loading = false;
        return;
      }
      this.status = "success";
      this.loading = false;
      this.options = this._getOptions(data.list);
      this.copyStartValue = this.startValue;
      this.copyEndValue = this.endValue;

      // 恢复
      const { recoverData } = this.meta;
      if (recoverData) {
        const { startValue, endValue } = recoverData;
        this.startValue = startValue;
        this.endValue = endValue;
        this.range = [parseInt(startValue), parseInt(endValue)];
      }
    },
    // popover弹框消失
    handleHide() {
      if (this.status === "error") {
        // error 状态下，再次打开时依然loading
        this.loading = true;
        return;
      }

      // 非 error 状态下如果没有任何实质性的改变，则不 trigger
      if (!this._changed()) {
        // this.$message({
        //   message: '当前过滤器状态没有改变',
        //   type: 'warning'
        // })
        return;
      }
      let {
        meta: { code, filterMode, name, sourceValue },
        startValue,
        endValue,
      } = this;

      let filter = new Filter({
        code,
        filterMode,
        name,
        sourceValue,
        checked: true,
        status: {
          // 过滤器的列表状态
          startValue,
          endValue,
        },
      });
      this.$emit("trigger", filter);
    },
    deleteFilter() {
      this.$emit("delete-filter", this.meta.code);
    },
    // 从meta中恢复
    _recoverFromMeta() {
      const { recoverData } = this.meta;
      if (recoverData) {
        const { startValue, endValue } = recoverData;
        this.startValue = startValue;
        this.endValue = endValue;
      }
    },
    // 判断用户是否进行的实质性的操作
    _changed() {
      return (
        this.startValue !== this.copyStartValue ||
        this.endValue !== this.copyEndValue
      );
    },
    _getOptions(data) {
      return this._initOptions(deepClone(data));
    },
    _initOptions(options) {
      return options.map((option) => {
        option.checked = false;
        return option;
      });
    },
  },
};
</script>

<!--scoped-->
<style scoped lang="postcss">
.score-select-container {
  position: relative;
  width: 160px;
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

      .score {
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

      &:hover {
        border-color: #c0c4cc;
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
.score-select-popover-container {
  margin-top: 6px !important;
  width: 160px !important;
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
      margin-bottom: 5px;
      font-size: var(--font-size-13);
    }

    .list-wrapper {
      padding: 0 10px;

      .check-all {
        height: 27px;
        line-height: 27px;

        .el-checkbox__label {
          color: #3c5679;
          font-size: var(--font-size-13);
        }
      }

      .list {
        .item {
          height: 27px;
          line-height: 27px;

          .item-checkbox {
            .el-checkbox__label {
              color: #3c5679;
              font-weight: normal;
              font-size: var(--font-size-13);
            }
          }
        }
      }
    }

    .footer {
      border-top: 1px solid #eee;
      padding: 12px 25px;

      &.grey {
        .el-slider__bar {
          background-color: #ccc;
        }

        .el-slider__button {
          border: 2px solid #ccc;
        }

        .text {
          i,
          span {
            color: #ccc;
          }
        }
      }

      .el-slider__button {
        transition: all 0.2s;
      }

      .text {
        font-size: var(--font-size-12);

        i,
        span {
          transition: all 0.2s;
        }

        span {
          color: #999;
          margin-right: 10px;
        }
      }

      .el-slider {
        width: 100%;
        transition: all 0.2s;

        .el-slider__stop {
          display: none;
        }

        .el-slider__marks-text {
          width: 20px;
          text-align: center;
          font-size: var(--font-size-12);
        }
      }
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
