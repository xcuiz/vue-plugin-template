<!--
 * @Author: your name
 * @Date: 2020-08-13 17:00:22
 * @LastEditTime: 2020-10-13 17:01:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/model/components/StepTabs.vue
-->
<template>
  <div class="stepContent clearfix">
    <el-steps v-bind="defaultProps" class="step-list" :active="active">
      <el-step
        v-for="(item, index) in stepList"
        :key="index"
        :title="item.title"
      >
      </el-step>
    </el-steps>
    <section v-show="isShowBtn" class="step-btn-group">
      <!--v-if="active!==0" 这样容易误点-->
      <el-button :disabled="active === 0" size="mini" @click="back()"
        >上一步</el-button
      >
      <el-button
        size="mini"
        type="primary"
        :loading="submitLoading"
        @click="next"
        >{{ nextStepName }}</el-button
      >
    </section>
  </div>
</template>

<script>
export default {
  props: {
    // 是否显示btnGroup
    isShowBtn: {
      type: Boolean,
      default: true,
    },
    submitLoading: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Number,
      default: 0,
    },
    // el-step数据
    stepList: {
      required: true,
      type: Array,
      default: () => [
        {
          title: "步骤一",
          description: "",
          icon: "",
        },
      ],
      validator(val) {
        if (!val.length) {
          return false;
        }
        return val.every((item) => {
          return item.hasOwnProperty("title") && item.title;
        });
      },
    },
    submitText: {
      type: String,
      default: "完 成",
    },
  },
  data() {
    return {
      // isShowStepBtn: true // 是否展示step button,
    };
  },
  computed: {
    // 返回step按钮名称，最后一步显示 完成，其他步骤显示下一步
    nextStepName() {
      // debugger
      return this.active === this.stepList.length - 1
        ? this.submitText
        : "下一步";
    },
    defaultProps() {
      return Object.assign(
        {
          "align-center": true,
        },
        this.$attrs
      );
    },
  },
  methods: {
    back() {
      this.$emit("back");
    },
    next() {
      this.$emit("next");
    },
  },
};
</script>

<style scoped lang="postcss">
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
</style>
