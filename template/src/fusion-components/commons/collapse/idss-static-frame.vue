<template>
  <div
    v-show="visible"
    class="el-dialog__wrapper"
    :style="wrapperSize"
    @click.self="handleWrapperClick">
    <div class="idss-static-frame"
      :key="key">
      <transition
        :name="dealTransitionName()"
        @after-enter="afterEnter"
        @after-leave="afterLeave">
        <div
          class="outside"
          ref="dialog"
          v-show="isActive"
          :style="formaterStyle()">
          <!-- 滑框header -->
          <div class="frame-header"
            :style="headerStyleComputed"
            v-if="showClose || title">
            <div class="frame-title">
              <idss-tooltip
                :content="title"
                :over-width-display="true">
                <div class="frame-title-tooltip">
                  <slot name="title-left">
                    <span>{{title}}</span>
                  </slot>
                </div>
              </idss-tooltip>
            </div>
            <span class="frame-icon" v-if="showClose">
              <idss-icon-svg name="close" @click="handleClose"></idss-icon-svg>
            </span>
          </div>
          <!-- 其他内容 -->
          <main v-if="rendered" class="frame-main" :style="mainStyle">
            <slot></slot>
          </main>
          <div class="frame-footer" v-if="$slots.footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { IdssIconSvg, IdssTooltip } from './../index.js'
import ElDialog from 'element-ui/lib/dialog.js'
import 'element-ui/lib/theme-chalk/dialog.css'
/**
 * left 左侧
 * right: 右侧
 * left-center: 左侧垂直居中
 * right-center: 右侧垂直居中
 * left-bottom: 左侧底部
 * right-bottom: 右侧底部
 * fullscreen: 全屏
*/
let localtionObj = {
  'fullscreen': {
    style: { width: '100vw', height: '100vh' },
    transitionName: 'dialog-fade'
  },
  'left': {
    style: { left: '0px' },
    transitionName: 'left-draw'
  },
  'right': {
    style: { right: '0px' },
    transitionName: 'draw'
  },
  'left-center': {
    style: { left: '0px', top: '50%', transform: 'translate(0, -50%)' },
    transitionName: 'left-draw-center'
  },
  'right-center': {
    style: { right: '0px', top: '50%', transform: 'translate(0, -50%)' },
    transitionName: 'draw-center'
  },
  'left-bottom': {
    style: { left: '0px', bottom: '0px' },
    transitionName: 'left-draw'
  },
  'right-bottom': {
    style: { right: '0px', bottom: '0px' },
    transitionName: 'draw'
  }
}

export default {
  name: 'idss-static-frame',
  extends: ElDialog,
  components: { IdssIconSvg, IdssTooltip },
  data () {
    return {
      isActive: this.visible // 为了动画
    }
  },
  /**
   *  props继承了Dialog的全部props
   *  为了保持之前依赖本组件的代码的一致性，特此将一些默认值修改为false
   *  写在本组件内的props均为已验证实现可用的功能
   */
  props: {
    /* 是否展示右上角关闭按钮 */
    showClose: {
      type: Boolean,
      default: true
    },
    /* 点击空白区域是否隐藏弹框 */
    closeOnClickModal: {
      type: Boolean,
      default: true
    },
    /* Esc键关闭 */
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    /* 关闭前的回调，实参为done函数。done()执行关闭 */
    beforeClose: Function,
    /* 关闭是销毁 */
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    /* 遮罩层 */
    modal: {
      type: Boolean,
      default: false
    },
    /* 遮罩层插入body */
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    /* 内容插入body */
    appendToBody: {
      type: Boolean,
      default: false
    },
    /* 锁定body的滚动条 */
    lockScroll: {
      type: Boolean,
      default: false
    },

    /* 是否显示侧边栏 */
    visible: {
      type: Boolean,
      default: false
    },
    /* 侧边栏宽度 */
    width: {
      type: String,
      default: '30%'
    },
    /* 组件距离浏览器上边距 */
    top: {
      type: String,
      default: '0px'
    },
    /* 弹出框位置 */
    localtion: {
      type: String,
      default: 'right-center'
    },
    /* 最大高度 */
    maxHeight: {
      type: String,
      default: '100vh'
    },
    /* 高度 */
    height: {
      type: String,
      default: 'auto'
    },
    /* 滑入框title */
    title: {
      type: String,
      default: ''
    },
    // header样式设置
    headerStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // main样式设置
    mainStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 全局样式设置
    globalStyle: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  watch: {
    // extends中的data和methods是覆盖的，其他会继承原有的
    visible (val) {
      this.isActive = val
    }
  },
  computed: {
    wrapperSize () {
      return this.closeOnClickModal ? {} : {
        height: '0px',
        width: '0px'
      }
    },
    headerStyleComputed () {
      let { headerStyle } = this
      let style = {
        ...headerStyle
      }
      return style
    },
    disabledTop () {
      return ['left-center', 'right-center', 'left-bottom', 'right-bottom'].includes(this.localtion)
    }
  },
  methods: {
    // 处理style样式
    formaterStyle () {
      let { width, maxHeight, height, globalStyle, localtion, top, disabledTop } = this
      let renderStyle = {
        ...globalStyle,
        'width': width,
        'max-height': maxHeight,
        'height': height,
        ...localtionObj[localtion].style
      }
      // 非居中位置时可以设置top
      !disabledTop && (renderStyle['top'] = top)
      return renderStyle
    },
    // 最终使用动画的name
    dealTransitionName () {
      return localtionObj[this.localtion].transitionName
    }
  }
}
</script>
<style scoped lang="postcss">
.idss-static-frame {
  /* 收起区域：默认右侧收起 */
  & > .outside {
    position: fixed;
    background-color: var(--color-bg-5,#fff);
    display: flex;
    flex-direction: column;
    & .frame-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.4rem;
      line-height: 1.2;
      padding: 10px 16px;
      background: var(--widget-header-bg);
      & .frame-title {
        display: inline-block;
        font-size: 1.4rem;
        font-weight: bold;
        line-height: inherit;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        & .frame-title-tooltip {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      & .frame-icon {
        & > svg {
          font-size: 1.0rem;
          font-weight: bold;
          cursor: pointer;
        }
      }
    }
    & .frame-main {
      flex: 1;
      overflow-y: scroll;
    }
    & .frame-footer {
      width: 100%;
      padding: 10px 16px;
      text-align: center;
    }
  }
  /* 右侧弹出框动画（垂直居中效果）控制 */
  & .draw-center-enter-active,
  & .draw-center-leave-active {
    transition: all 0.5s ease !important;
  }
  & .draw-center-enter,
  & .draw-center-leave-to {
    transform: translate(100%, -50%) !important;
  }
  & .draw-center-enter-to,
  & .draw-center-leave {
    transform: translate(0, -50%)!important;
  }

  /* 右侧弹出框动画非垂直居中控制 */
  & .draw-enter-active,
  & .draw-leave-active {
    transition: all 0.5s ease !important;
  }
  & .draw-enter,
  & .draw-leave-to {
    transform: translateX(100%)!important;
  }
  & .draw-enter-to,
  & .draw-leave {
    transform: translateX(0)!important;
  }

  /* 左侧弹出框动画垂直居中效果控制 */
  & .left-draw-center-enter-active,
  & .left-draw-center-leave-active {
    transition: all 0.5s ease !important;
  }
  & .left-draw-center-enter,
  & .left-draw-center-leave-to {
    transform: translate(-100%, -50%)!important;
  }
  & .left-draw-center-enter-to,
  & .left-draw-center-leave {
    transform: translate(0, -50%)!important;
  }

    /* 左侧弹出框动画非垂直居中控制 */
  & .left-draw-enter-active,
  & .left-draw-leave-active {
    transition: all 0.5s ease !important;
  }
  & .left-draw-enter,
  & .left-draw-leave-to {
    transform: translateX(-100%)!important;
  }
  & .left-draw-enter-to,
  & .left-draw-leave {
    transform: translateX(0)!important;
  }
}
</style>
