<!--
 * @Author: 范祥龙
 * @Date: 2021-04-22 16:13:16
 * @LastEditTime: 2021-04-28 16:41:50
 * @LastEditors: yincheng
 * @Description: In User Settings Edit
 * @FilePath: /ueba-web/src/views/model/components/TextInfoDialog.vue
-->
<template>
  <el-dialog
    append-to-body
    :close-on-click-modal="false"
    class="log-box"
    :class="{ fullScreen: true }"
    custom
    :visible="visible"
    width="30%"
    @close="closeDialog"
  >
    <div slot="title" class="title">
      <span>查看日志</span>
      <!-- <div class="full-screen">
        <el-tooltip
          class="item"
          effect="dark"
          content="进入全屏"
          placement="top"
        >
          <a
            v-show="!isScreen"
            href="javascript:"
            class="max-btn"
            @click="_screenOpen"
          >
            <idss-icon-svg
              name="ans-icon-max"
              style="fill: 0097"
            ></idss-icon-svg>
          </a>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="取消全屏"
          placement="top"
        >
          <a v-show="isScreen" href="javascript:" @click="_screenClose">
            <i class="iconfont iconans-icon-min"></i>
          </a>
        </el-tooltip>
      </div> -->
    </div>
    <div
      v-loading="loading"
      class="content"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
    >
      <textarea
        id="textarea-log"
        class="textarea-ft"
        style="width: 100%"
        spellcheck="false"
      ></textarea>
    </div>
  </el-dialog>
</template>
<script>
/**
 * Calculate text size
 */
const handerTextareaSize = (isH = 17) => {
  return $(".textarea-ft").css({
    height: `${$(".log-box .content").height() - isH}px`,
  });
};

export default {
  name: "Log",
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    params: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isScreen: false,
      loadingIndex: 0,
      isData: true,
      loading: false,
      content: "",
    };
  },
  watch: {
    visible: {
      async handler(val) {
        if (!val) {
          return;
        }
        await this.$nextTick();
        this._ckLog();
      },
      immediate: true,
    },
  },
  mounted() {
    this._onTextareaScroll();
  },
  methods: {
    /**
     * 关闭弹窗
     */
    closeDialog() {
      this.$emit("update:visible", false);
    },
    initText() {
      this.$nextTick(() => {
        handerTextareaSize()
          .html("")
          .text(this.content || "暂无日志");
      });
    },
    _screenOpen() {
      this.isScreen = true;
      let $logBox = $(".log-box").find(".el-dialog");
      $logBox.find(".textarea-ft").animate({ scrollTop: 0 }, 0);
      // Handling text field size
      this.initText();
    },
    _screenClose() {
      this.isScreen = false;
      let $logBox = $(".log-box").find(".el-dialog");
      $logBox.find(".textarea-ft").animate({ scrollTop: 0 }, 0);
      // Handling text field size
      this.initText();
    },
    async _ckLog() {
      this.content = this.params;
      this.initText();
      // this.loading = false
    },
    /**
     * up
     */
    _onUp: _.debounce(
      function () {
        this.loadingIndex = this.loadingIndex - 1;
        this._ckLog();
      },
      1000,
      {
        leading: false,
        trailing: true,
      }
    ),
    /**
     * down
     */
    _onDown: _.debounce(
      function () {
        this.loadingIndex = this.loadingIndex + 1;
        this._ckLog();
      },
      1000,
      {
        leading: false,
        trailing: true,
      }
    ),
    /**
     * Monitor scroll bar
     */
    _onTextareaScroll() {
      let self = this;
      $("#textarea-log").scroll(function () {
        let $this = $(this);
        // Listen for scrollbar events
        if ($this.scrollTop() + $this.height() === $this.height()) {
          if (self.loadingIndex > 0) {
            self.$message.loading({
              content: "正在努力请求日志中...",
              duration: 0,
              closable: false,
            });
            self._onUp();
          }
        }
        // Listen for scrollbar events
        if ($this.get(0).scrollHeight === $this.height() + $this.scrollTop()) {
          // No data is not requested
          if (self.isData) {
            self.$message.loading({
              content: "正在努力请求日志中...",
              duration: 0,
              closable: false,
            });
            self._onDown();
          }
        }
      });
    },
    /**
     * close
     */
    close() {
      this.isScreen = false;
      this.$emit("close");
    },
  },
};
</script>

<style lang="postcss" scoped>
.log-box {
  &.fullScreen {
    >>> .el-dialog {
      width: 80% !important;
      margin-top: 10vh !important;
      .content {
        min-height: calc(80vh - 50px);
      }
    }
  }
  >>> .el-dialog {
    .title {
      position: relative;
      span {
        display: inline-block;
      }
      .full-screen {
        position: absolute;
        right: 30px;
        top: -3px;
        a {
          color: #0097e0;
          font-size: 16px;
          margin-left: 10px;
          i {
            vertical-align: middle;
          }
        }
        .max-btn {
          .idss-svg-icon {
            width: 14px;
            height: 14px;
            vertical-align: middle;
          }
        }
        .clock {
          > i {
            font-size: 16px;
            vertical-align: middle;
            transform: scale(1);
          }
        }
        .refresh-log {
          > i {
            font-size: 16px;
            vertical-align: middle;
            transform: scale(1);
          }
          &.active {
            > i {
              -webkit-transition-property: -webkit-transform;
              -webkit-transition-duration: 1s;
              -moz-transition-property: -moz-transform;
              -moz-transition-duration: 1s;
              -webkit-animation: rotateloading 0.4s linear infinite;
              -moz-animation: rotateloading 0.4s linear infinite;
              -o-animation: rotateloading 0.4s linear infinite;
              animation: rotateloading 0.4s linear infinite;
              transform: scale(0.4);
              color: #999;
            }
          }
        }
      }
    }
    .content {
      min-height: 220px;
      max-height: 420px;
      overflow-y: auto;
      overflow: hidden;
      overflow-x: hidden;
      background: #002a35;
      padding: 6px 2px;
      word-break: break-all;

      textarea {
        background: none;
        color: #9cabaf;
        border: 0;
        font-family: "Microsoft Yahei,Arial,Hiragino Sans GB,tahoma,SimSun,sans-serif";
        font-weight: bold;
        resize: none;
        line-height: 1.6;
        padding: 0px;
      }
    }
    .operation {
      text-align: right;
      height: 50px;
      line-height: 44px;
      border-top: 1px solid #dcdedc;
      padding-right: 20px;
      background: #fff;
      position: relative;
    }
  }
}
</style>
