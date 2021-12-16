<template>
  <div class="idss-widget" :class="`is-${shadow}`" :style="globalStyle">
    <!----- Header 左-中-右布局----->
    <header v-bind="headerDomAttribute" :style="headerStyle" v-if="isShowHeader">
      <div class="title" :class="item" v-for="(item, index) in titleSlots" :key="index">
        <idss-tooltip
          v-bind="$attrs[item]"
          :content="($attrs[item] && $attrs[item].content) ? $attrs[item].content : `${tooltipContent[item]}`"
          :over-width-display="true">
          <div class="title-tooltip" :ref="item">
            <slot :name="item"></slot>
          </div>
        </idss-tooltip>
      </div>
    </header>
    <main :style="mainStyle">
      <slot></slot>
    </main>
    <footer :style="footerStyle">
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
import { IdssTooltip } from './index.js'
// title类型
const titleSlotsTypes = ['title-left', 'title-center', 'title-right']
export default {
  name: 'idss-widget',
  components: { IdssTooltip },
  props: {
    // 是否有阴影
    shadow: {
      type: String,
      default: 'always' // always: 一直有阴影；never: 不加阴影； hover: 鼠标移动上去显示阴影
    },
    /** 控制 header 渐变背景类型 */
    headerType: {
      type: String,
      default: '' // primary（渐变）、plain-border（透明背景有下边框）、header-float-right（tab 菜单 + 右边显示操作按钮）
    },
    /** 定义整个组件全局样式 */
    globalStyle: Object,
    /** 定义 Header 样式 */
    headerStyle: Object,
    /** 定义 Main 的样式 */
    mainStyle: Object,
    /** 定义 Footer 的样式 */
    footerStyle: Object

  },
  computed: {
    headerDomAttribute () {
      if (!this.headerType) return
      return { class: `is-${this.headerType}` }
    },
    // 判断 Header 显示/隐藏
    isShowHeader () {
      // 判断title slots是否存在
      return titleSlotsTypes.some(name => !!this.$slots[name])
    },
    // 缓存获取的 $slot 兼容 v-slot
    titleSlots () {
      // 获取 title 模版
      return titleSlotsTypes.filter(name => !!this.$slots[name])
    }
  },
  data () {
    return {
      tooltipContent: {
        'title-left': '',
        'title-center': '',
        'title-right': ''
      }
    }
  },
  methods: {
    // 获取 tooltip 提示内容
    getTooltipContent () {
      titleSlotsTypes.forEach(item => {
        this.tooltipContent[item] = this.$refs[item] && this.$refs[item].length ? this.$refs[item][0].innerText : ''
      })
    }
  },
  mounted () {
    // Dom节点渲染完后获取title的内容
    this.getTooltipContent()
  }
}
</script>

<style lang="postcss" scoped>
.idss-widget {
  --widget-bg: var(--color-bg-5,#fff);
  --widget-corner: var(--corner-default, 2px);
  --widget-header-bg: var(--color-bg-5,#fff);
  --widget-header-color: var(--color-font-2, #6a7280);
  --widget-header-font-size: var(--font-size-4, 14px);
  --widget-header-primary-bg: linear-gradient(
    180deg,
    var(--light-gray-1,#fff) 0%,
    var(--light-gray-2,#f2f2f2) 100%
  );
  --widget-header-plain-border-bg: transparent;

  margin: 0 12px 12px 0;
  /* border: var(--widget-border); */
  border-radius: var(--widget-corner);
  background-color: var(--widget-bg);

  & > header {
    display: flex;
    padding: 10px 16px;
    color: var(--widget-header-color);
    background: var(--widget-header-bg);
    font-size: var(--widget-header-font-size);
    line-height: 1.2;
    align-items: center;
    justify-content: space-between;

    & > .title {
      /* width: 100%; */
      overflow: hidden;
      display: inline-block;
      font-weight: bold;
      line-height: inherit;
      white-space: nowrap;
      text-overflow: ellipsis;

      & .title-tooltip {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    /* 剧中显示 */
    & > .title-center {
      margin: 0 auto;
      text-align: center;
    }

    /* 右侧显示 */
    & > .title-right {
      flex-shrink: 0;
      text-align: right;
    }

    /* 样式类型【可定义常用的几种】 */
    /* header： 背景设置为渐变色 */
    &.is-primary {
      background: var(--widget-header-primary-bg);
      border-bottom: var(--color-line-3,rgba(204,211,217,0.3)) solid
    var(--line-size-default,1px);
    }
    /* header： 透明背景 + 显示下边框 */
    &.is-plain-border {
      background: var(--widget-header-plain-border-bg);
      border-bottom: var(--color-line-3,rgba(204,211,217,0.3)) solid
    var(--line-size-default,1px);
    }
    /* header： tab 菜单 + 右边显示按钮 */
    &.is-header-float-right {
      float: right;
      padding: 2px 10px 0 0;
      z-index: 1;
      position: relative;
    }
  }
  & > main {
    padding: 0;
  }
  & > footer {
    text-align: center;
  }
}
/* shadow 样式处理 */
.is-always {
  box-shadow: var(--shadow-default,1px 2px 5px rgba(204,211,217,0.5));
}
.is-never {
  box-shadow: none;
}
.is-hover:hover {
  box-shadow: var(--shadow-default,1px 2px 5px rgba(204,211,217,0.5));
}
</style>
