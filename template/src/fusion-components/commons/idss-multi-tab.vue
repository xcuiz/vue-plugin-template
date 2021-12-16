<template>
  <div
    class="idss-multi-tab"
    ref="mainWid">
    <ul class="tabs">
      <li
        class="tab-item"
        :class="{'isActive': activeTab === item}"
        v-for="(item,index) in showTabs"
        :key="index"
        @click="change(item)">
        {{item}}
      </li>
      <li
        class="ellipsis-tab"
        ref="ellipsis-tab"
        v-show="Array.isArray(moreTabs) && moreTabs.length">
        <el-menu class="el-menu-custom" mode="horizontal">
          <el-submenu index="1" :popper-append-to-body="false">
            <template slot="title">
              <i class="el-icon-more"></i>
            </template>
            <el-menu-item
              v-for="(subItem, subIndex) in moreTabs"
              :key="subIndex"
              :class="{'isActive':activeTab === subItem}"
              @click="change(subItem)"
              :index="`1-${subIndex}`">
              {{subItem}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </li>
    </ul>
    <slot name="content"></slot>
  </div>
</template>
<script>
import ElMenu from 'element-ui/lib/menu.js'
import ElSubmenu from 'element-ui/lib/submenu'
import ElMenuItem from 'element-ui/lib/menu-item'
import { computeWid, throttle } from '../util/base'
import { Bus } from 'vue-happy-bus'
const EventName = {
  WINDOW_RESIZE: 'window-resize'
}
let throttleFn
export default {
  name: 'idss-multi-tab',
  components: { ElMenu, ElSubmenu, ElMenuItem },
  props: {
    // 高亮 tab
    highlightTab: [String, Number],
    // 所有tab
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    data: {
      handler (val) {
        this.handleMenu()
      }
    },
    // https://github.com/vuejs/vue-test-utils/issues/480
    // https://github.com/vuejs/vue-test-utils/issues/1419
    highlightTab: {
      immediate: true,
      handler (val) {
        this.activeTab = val
      }
    }
  },
  data () {
    return {
      index: 0,
      activeTab: '',
      showTabs: [],
      moreTabs: []
    }
  },
  methods: {
    change (param) {
      this.activeTab = param
      this.$emit('tabChange', param)
    },
    /**
     * 处理菜单哪些直接展示出来，哪些需要放在省略号里面
     */
    handleMenu () {
      if (!Array.isArray(this.data) || !this.data.length) return
      let mainWid = this.$refs.mainWid.offsetWidth
      // 用于计算省略号的宽度
      let ellipsisWid = this.$refs['ellipsis-tab'].offsetWidth
      // 用于缓存展示菜单的宽度之和
      let tabWidSum = computeWid(this.data)
      let allTabWid = 0
      for (let i = 0, len = tabWidSum.length; i < len; i++) {
        let wid = tabWidSum[i] + 40
        allTabWid += wid
        // 如果当前显示菜单宽度加省略号所占宽度之和大于屏幕宽度
        if (mainWid && (allTabWid + ellipsisWid) > mainWid) {
          this.showTabs = this.data.slice(0, i)
          this.moreTabs = this.data.slice(i)
          return
        }
      }
      this.showTabs = this.data
      this.moreTabs = []
    }
  },
  mounted () {
    // 由于窗口事件默认不触发，因此需要手动触发一次
    this.handleMenu()
    throttleFn = throttle(this.handleMenu)
    Bus.$on(EventName.WINDOW_RESIZE, throttleFn)
  },
  destroyed () {
    Bus.$off(EventName.WINDOW_RESIZE, throttleFn)
  }
}
</script>
<style scoped lang="postcss">
.idss-multi-tab {
  --idss-multi-tab-bg: var(--color-bg-5, #fff);
  --idss-multi-tab-li-bg: var(--color-bg-5, #fff);
  --idss-multi-tab-li-bg-hover: var(--color-bg-5, #fff);
  --idss-multi-tab-li-color: var(--color-font-1, #464c59);
  --idss-multi-tab-li-color-hover: var(--color-font-default, #1890ff);

  display: flex;
  position: relative;
  border: var(--color-line-1, #d8e0e6) solid var(--line-size-default, 1px);
  background: var(--idss-multi-tab-bg);
  & > ul.tabs {
    height: 32px;
    width: 100%;
    display: flex;
    box-sizing: border-box;
    overflow: hidden;
    & > li.tab-item {
      padding: 6px 20px;
    }
    & > li.tab-item,
    & > li.ellipsis-tab {
      color: var(--idss-multi-tab-li-color);
      border-right: var(--color-line-1, #d8e0e6) solid var(--line-size-default, 1px);
      text-align: center;
      cursor: pointer;
    }
    & > li.ellipsis-tab /deep/ {
      & > .el-menu--horizontal {
        background: transparent;
        border: none;
        & .el-submenu {
          & .el-submenu__title {
            height: auto;
            color: var(--idss-multi-tab-li-color);
            padding: 6px 20px;
            line-height: normal;
            border: none;
          }
          & .el-submenu__title:hover {
            background: transparent;
            color: var(--idss-multi-tab-li-color-hover);
          }
        }

      }
      & .el-menu-custom {
        position: inherit;
        .el-submenu.is-opened {
          i {
            color: var(--idss-multi-tab-li-color-hover);
          }
          .el-menu--horizontal {
            right: 10px;
            left: unset !important;
            z-index: 1000 !important;
            .el-menu-item {
              color: var(--idss-multi-tab-li-color);
            }
            li.isActive {
              background: var(--idss-multi-tab-li-bg-hover);
              color: var(--idss-multi-tab-li-color-hover);
            }
            .el-menu-item:not(.is-disabled):hover {
              color: var(--idss-multi-tab-li-color-hover);
            }
          }
        }
      }
    }
    & > li:hover,
    & > li:active {
      background: var(--idss-multi-tab-li-bg-hover);
      color: var(--idss-multi-tab-li-color-hover);
    }
    & > li.isActive {
      background: var(--idss-multi-tab-li-bg-hover);
      color: var(--idss-multi-tab-li-color-hover);
    }
  }
}
</style>
