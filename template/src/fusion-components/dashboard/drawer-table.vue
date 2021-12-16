<template>
  <transition name="fade">
    <div v-show="isShowDrawer" class="drawer-wrapper" :class="isCollapse ? 'moveto-collapse' : 'moveto-expand'">
      <div slot="title" class="drawer-title">
        <el-tabs class="tag-list" v-model="currentTag">
          <el-tab-pane v-for="tag in tagList" :key="tag" :name="tag">
            <el-tag slot="label" size="medium" closable @click="tagClickHandle(tag)" @close="tagCloseHandle(tag)"
              :class="tag === currentTag && 'active'">{{tag}}</el-tag>
          </el-tab-pane>
        </el-tabs>
        <div class="icon-list">
          <div class="icon-clear" @click="clearTag">
            <idss-icon-svg name="empty"></idss-icon-svg>
            <span>清空</span>
          </div>
          <idss-icon-svg name="arrow-botton" :style="isCollapse && 'transform: rotate(180deg);'"
            @click="isCollapse = !isCollapse"></idss-icon-svg>
        </div>
      </div>
      <transition name="fade">
        <div v-show="!isCollapse" style="height: 404px;">
          <slot :drawer-data="drawerData">
            <el-table :data="drawerData.data || []" max-height="404px" border style="width: 100%"
              @sort-change="sortTableHandle">
              <!-- 循环表头内容 -->
              <el-table-column v-for="title in drawerData.title || []" :key="title.key" :prop="title.key"
                :label="title.name" class-name="table-column-bg" align="center" sortable="custom"></el-table-column>
            </el-table>
          </slot>
        </div>
      </transition>
    </div>
  </transition>
</template>
<script>
/**
 * @name 抽屉-表格
 * @props {Object} data $$_数据项
 * @props {Boolean} visible 显示、隐藏控制
 * @slot default 抽屉的主要内容
 */
import { IdssIconSvg } from './../commons'
export default {
  name: 'idss-drawer-table',
  components: { IdssIconSvg },
  props: {
    data: {
      type: Object,
      default () {
        return {
          tag: '',
          title: [],
          data: []
        }
      }
    },
    visible: Boolean
  },
  data () {
    return {
      // 是否显示抽屉
      isShowDrawer: false,
      // 缓存所有的数据
      dataMap: {},
      // 是否收起, 收起会 留一块bar 在界面上，并不是完全隐藏
      isCollapse: false,
      tagList: [],
      currentTag: '',
      // 排序字段
      sorts: []
    }
  },
  computed: {
    drawerData () {
      return this.dataMap[this.currentTag] || {}
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler (newVal) {
        const { tag, data } = newVal
        if (tag) {
          this.$set(this.dataMap, tag, data)
          !this.tagList.includes(tag) && this.tagList.push(tag)
          this.currentTag = tag
        }
      }
    },
    visible: {
      immediate: true,
      handler (newVal) {
        this.isShowDrawer = newVal
      }
    }
  },
  methods: {
    tagCloseHandle (tag) {
      this.tagList = this.tagList.filter(val => val !== tag)
      // 如果删除的是当前激活的tag
      if (this.currentTag === tag) {
        const tags = this.tagList
        if (tags.length > 0) {
          // 激活最后一个tag
          this.currentTag = tags[tags.length - 1]
        }
      }
    },
    tagClickHandle (tag) {
      this.currentTag = tag
    },
    clearTag () {
      this.isShowDrawer = false
      this.$emit('update:visible', false)
      this.tableData = {}
      this.tagList = []
    },
    sortTableHandle (params = {}) {
      const { order, prop } = params
      this.sorts = order === 'ascending' ? [prop] : [`-${prop}`]
      // @FIXME 此处排序的操作 需要根据大屏工程的交互方案来处理
      // this.init()
    }
  }
}
</script>
<style lang="postcss" scoped>
  /* 过渡动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: 0.3s cubic-bezier(0.355, 0.045, 0.645, 1);
  }

  .fade-enter,
  .fade-leave-to {
    transform: translateY(100%);
  }

  .fade-enter-to,
  .fade-leave {
    transform: translateY(0);
  }

  .drawer-wrapper {
    z-index: 10;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(11, 24, 58, 0.95);
    padding: 0 44px 10px;
    box-shadow: 0 -20px 60px #0099ff;

    &.moveto-collapse {
      animation: movetoCollapse 0.3s linear 0.05s;
    }

    &.moveto-expand {
      animation: movetoExpand 0.3s;
    }

    & .drawer-title {
      height: 72px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;

      & .tag-list {
        flex-grow: 1;
        overflow: hidden;

        /* 覆盖element-ui的 el-tab 组件，因为业务表现相关 所以在这里单独覆盖 */
        &>>>.el-tabs__header {
          margin: 0;

          & .el-tabs__nav-prev,
          & .el-tabs__nav-next {
            color: #57a5e5;
          }

          & .el-tabs__nav-wrap::after {
            display: none;
          }

          & .el-tabs__nav {
            & .el-tabs__active-bar {
              opacity: 0;
            }

            & .el-tabs__item {
              height: 43px;
              padding: 0;
            }
          }
        }
      }

      & .icon-list {
        flex-shrink: 1;
        display: flex;

        & svg {
          fill: #57a5e5;
          width: 32px;
          height: 32px;
          cursor: pointer;
        }

        & .icon-clear {
          cursor: pointer;
          color: #57a5e5;
          width: 32px;
          height: 32px;
          margin-right: 20px;

          & span {
            display: none;
            line-height: 32px;
          }

          &:hover svg {
            display: none;
          }

          &:hover span {
            display: inline-block;
          }
        }
      }
    }

    &>>>.el-tag {
      cursor: pointer;
      border-color: #57a5e5;
      line-height: 42px;
      height: 42px;
      font-size: 16px;
      background-color: transparent;
      margin-right: 10px;

      &:hover {
        color: #88c7fb;
        border-color: #88c7fb;

        & i {
          color: #88c7fb;
        }
      }

      & .el-icon-close {
        font-size: 16px;
        font-weight: bold;
      }

      &.active {
        color: #ffffff;
        background-color: #57a5e5;
        border-style: none;

        & .el-icon-close {
          color: #ffffff;
        }
      }
    }

    &>>>.el-table td,
    &>>>.el-table th {
      padding: 0;
    }

    &>>>.el-table {
      background-color: transparent !important;

      & .table-column-bg {
        background-color: rgba(15, 102, 169, 0.3) !important;
      }

      & tr:hover td {
        background: rgba(15, 102, 169, 0.5) !important;
      }

      & td,
      & tr,
      & th,
      &::before,
      &::after {
        background-color: transparent !important;
      }

      & td,
      & th.is-leaf {
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }

      &.el-table--border td,
      &.el-table--border th,
      & .el-table__body-wrapper .el-table--border.is-scrolling-left~.el-table__fixed {
        border-right: 1px solid rgba(255, 255, 255, 0.3);
      }

      &.el-table--border,
      & .el-table--group {
        border-top: 1px solid rgba(255, 255, 255, 0.3);
        border-left: 1px solid rgba(255, 255, 255, 0.3);
      }

      & .el-table__empty-block {
        box-sizing: border-box;
        border-right: 1px solid rgba(255, 255, 255, 0.3);
        border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      }

      & thead .cell {
        color: #a8c4d9;
      }

      & .cell {
        color: #c9f6ff;
        height: 30px;
        line-height: 30px;
      }
    }
  }

  @keyframes movetoCollapse {
    form {
      transform: translateY(0);
    }

    to {
      transform: translateY(460px);
    }
  }

  @keyframes movetoExpand {
    form {
      transform: translateY(460px);
    }

    to {
      transform: translateY(0);
    }
  }
</style>
