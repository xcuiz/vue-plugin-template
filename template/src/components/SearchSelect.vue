<template>
  <div class="search-select-container">
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
      popper-class="search-select-popover-container"
      :visible-arrow="false"
      @show="handleShow"
      @hide="handleHide"
    >
      <!-- 下拉框内容区域 -->
      <div class="popover-wrapper">
        <h3 class="title">{{ meta.name }}</h3>
        <div class="search-wrapper">
          <el-input
            v-model="value"
            size="mini"
            placeholder="请输入"
            @change="handleValueChange"
          ></el-input>
        </div>
      </div>

      <!--触发下拉弹出的button-->
      <div slot="reference" class="button" :class="{ error: showError }">
        <span v-if="showTip" class="search-value">{{ value }}</span>
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
import Filter from "@/components/filter.js";
export default {
  name: "SearchSelect",
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
  },
  data() {
    return {
      showError: false,
      unfold: false, // 是否展开
      value: "", // 搜索框的值
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
      return this.value.trim() !== "";
    },
  },
  watch: {
    meta() {
      // 恢复 vuex 恢复
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
      if (this.value + "") {
        this.showError = false;
        return true;
      } else {
        this.showError = true;
        return false;
      }
    },
    handleValueChange(val) {
      if (val.trim() === "") {
        return;
      }
      let { code, filterMode, name, sourceValue } = this.meta;
      let filter = new Filter({
        code,
        filterMode,
        name,
        sourceValue,
        status: {
          startValue: val,
        },
      });
      this.unfold = false;
      // 向父组件派发trigger事件
      this.$emit("trigger", filter);
    },
    // popover弹框出现
    handleShow() {
      // 恢复
      const { recoverData } = this.meta;
      if (recoverData && this.value === "") {
        const { startValue } = recoverData;
        this.value = startValue;
      }
      this.copyValue = this.value;
    },
    // popover弹框消失
    handleHide() {
      // ...
      if (!this._changed()) {
        // this.$message({
        //   message: '当前过滤器状态没有改变',
        //   type: 'warning'
        // })
      }
    },
    deleteFilter() {
      this.$emit("delete-filter", this.meta.code);
    },
    _changed() {
      return this.value !== this.copyValue;
    },
    // 从meta中恢复
    _recoverFromMeta() {
      const { recoverData } = this.meta;
      if (recoverData) {
        const { startValue } = recoverData;
        this.value = startValue;
      }
    },
  },
};
</script>

<!--scoped-->
<style scoped lang="postcss">
.search-select-container {
  position: relative;
  width: 168px;
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

      .search-value {
        display: inline-block;
        vertical-align: top;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
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
.search-select-popover-container {
  margin-top: 6px !important;
  padding: 0;
  width: 168px !important;
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

    .search-wrapper {
      padding: 0 5px 10px;
    }
  }
}
</style>
