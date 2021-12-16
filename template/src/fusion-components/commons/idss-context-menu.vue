<template>
  <div class="context-menu-container" ref="contextMenuContainer" v-clickoutside="closeMenu">
    <slot></slot>
    <div
      class="context-menu"
      v-show="visible"
      :style="{left: left + 'px' ,top: top + 'px', 'z-index': zIndex}">
      <slot name="context-menu"></slot>
    </div>
  </div>
</template>

<script>
import Clickoutside from 'element-ui/src/utils/clickoutside'
/**
   * 右击菜单
   * [关闭菜单] 通过监听document.body
   * [打开菜单] 通过refs需要传递event
   * slot：
   *    default为触发的目标元素
   *    context-menu为右击菜单内容，DOM展示及相关逻辑处置在子组件中实现
   */
export default {
  name: 'idss-context-menu',
  directives: { Clickoutside },
  props: {
    zIndex: {
      type: Number,
      default: 100
    }
  },
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      contextMenuElm: null
    }
  },
  methods: {
    openMenu (e) {
      let { clientX, clientY } = e
      let { x, y } = this.$refs['contextMenuContainer'].getBoundingClientRect()
      this.left = clientX - x
      this.top = clientY - y
      this.visible = true
    },
    closeMenu () {
      this.visible = false
    }
  },
  mounted () {
    // 获取右击菜单元素，监听click事件，选择相关项时关闭右击菜单
    this.contextMenuElm = this.$slots['context-menu'][0].elm
    this.contextMenuElm.addEventListener('click', this.closeMenu)
  },
  destroyed () {
    this.contextMenuElm.removeEventListener('click', this.closeMenu)
  }
}
</script>

<style lang="postcss" scoped>
.context-menu-container {
  --context-menu-color: var(--color-font-5,#ffffff);
  --context-menu-font-size: var(--font-size-6, 12px);
  /* --context-menu-bg-hover: var(--color-bg-1); */
  --context-menu-icon-close-color-hover: var(--color-font-7,#fa541c);
  --context-menu-icon-refresh-color-hover: var(--color-font-6,#1890ff);
  --context-menu-box-item-color: var(--color-font-5,#ffffff);
  position: relative;
  & .context-menu {
    position: absolute;
    z-index: 100;
    margin: 0;
    background: var(--color-bg-6,rgba(9,10,13,.8));
    list-style-type: none;
    border-radius: var(--corner-m);
    padding: 4px 0;
    font-size: var(--context-menu-font-size);
    font-weight: 400;
    color: var(--context-menu-color);
    box-shadow: var(--shadow-default,1px 2px 5px rgba(204,211,217,0.5));

    .context-menu-box {
      .context-menu-box-item {
        margin: 0;
        padding: 7px 16px;
        cursor: pointer;
        color: var(--context-menu-box-item-color);
      }
      .context-menu-box-item:hover {
        color: var(--context-menu-box-item-color);
        background-color: var(--guan-highlight-6-a40,rgba(74,144,226,0.4));
      }
    }
    li {
      margin: 0;
      padding: 6px 16px;
      cursor: pointer;
      /* &:hover {
        background: var(--context-menu-bg-hover);
      } */
      svg {
        width: 14px;
        height: 14px;
        margin-right: 4px;
        vertical-align: sub;
        vertical-align: -0.24em;
        fill: var(--context-menu-color);
      }
    }
    li.close {
      &:hover {
        color: var(--context-menu-icon-close-color-hover);
        svg {
          fill: var(--context-menu-icon-close-color-hover);
        }
      }
    }
    li.refresh {
      &:hover {
        color: var(--context-menu-icon-refresh-color-hover);
        svg {
          fill: var(--context-menu-icon-refresh-color-hover);
        }
      }
    }
  }
}
</style>
