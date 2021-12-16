<template>
  <div class="idss-collapse">
    <header v-if="!hideHeader">
      <span class="collapse-title">
        <idss-icon-svg :name="iconName" v-if="isShowIcon"></idss-icon-svg> {{title}}
      </span>
      <slot name="header"></slot>
      <!-- 按钮 -->
      <el-button size="small" @click="toggle" v-show="isButtonShow" :type="buttonType">
        <slot name="collapse-button">更多条件</slot>
      </el-button>
      <!-- 上下箭头 -->
      <span class="icon-content" @click="toggle" v-show="isArrowShow">
        <i class="el-icon-arrow-down" v-show="!isActive"></i>
        <i class="el-icon-arrow-up" v-show="isActive"></i>
      </span>
      <!-- 自定义展开按钮 -->
      <span @click="toggle" v-if="$slots.button" class="button">
        <slot name="button"></slot>
      </span>
    </header>
    <!-- 面板展示区域 -->
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
      @after-leave="afterLeave">
      <main v-show="isActive">
        <slot></slot>
      </main>
    </transition>
  </div>
</template>
<script>
import collapseTransition from './collapse-transition'
import { IdssIconSvg } from './../index.js'
import { debounce } from '../../util/base'
import ElButton from 'element-ui/lib/button'
import 'element-ui/lib/theme-chalk/button.css'
export default {
  name: 'idss-collapse',
  mixins: [collapseTransition],
  components: {
    ElButton,
    IdssIconSvg
  },
  props: {
    title: {
      type: String,
      default () {
        return ''
      }
    },
    isShowIcon: {
      type: Boolean,
      default: false
    },
    iconName: {
      type: String,
      default: ''
    },
    // 是否折叠
    collapse: {
      type: Boolean,
      default: true
    },
    // 是否显示Header，定制化使用
    hideHeader: {
      type: Boolean,
      default: false
    },
    // 是否显示按钮
    isButtonShow: {
      type: Boolean,
      default: true
    },
    // 按钮主题
    buttonType: {
      type: String,
      default: ''
    },
    // 是否显示箭头
    isArrowShow: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isActive: !this.collapse
    }
  },
  watch: {
    collapse: {
      handler: function (val) {
        this.isActive = !val
      },
      immediate: true
    }
  },
  methods: {
    toggle: debounce(function () {
      this.isActive = !this.isActive
      this.$emit('update:collapse', !this.isActive)
      this.$emit('collapseToggle', this.isActive)
    }, 300)
  }
}
</script>
<style scoped lang="postcss">
.idss-collapse {
  & header {
    position: relative;

    & .collapse-title {
      font-weight: bold;
    }

    & .icon-content {
      position: absolute;
      top: 1px;
      right: 2px;
      cursor: pointer;
      & .el-icon-arrow-down,
      & .el-icon-arrow-up {
        padding: 5px 0 5px 5px;
      }
    }
  }

  & .collapse-transition {
    -webkit-transition: height 0.3s ease-in-out, padding-top 0.3s ease-in-out,
      padding-bottom 0.3s ease-in-out;
    transition: height 0.3s ease-in-out, padding-top 0.3s ease-in-out,
      padding-bottom 0.3s ease-in-out;
  }

  & .button {
    cursor: pointer;
  }

  & > main {
    padding-top: 15px;
  }
}
</style>
