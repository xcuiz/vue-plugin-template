<template>
  <div class='idss-table-scheme' :style="`width: ${width}; height: ${height}`">
    <!-- 流程图展示区域 -->
    <div id='canvas' ref='canvas' v-show="hasData" @mousedown="dragCanvas"/>
    <!-- 暂无数据 -->
    <div class="empty-text" v-show="!hasData">{{emptyText}}</div>
    <!-- 工具箱 -->
    <div class="toolbox">
      缩放：
      <!-- 缩小按钮 -->
      <el-button
        :disabled="scaleNum <= minScale"
        size="mini"
        icon="el-icon-minus"
        circle
        @click="scaleView(-0.1)">
      </el-button>
      <!-- 当前缩放比例 -->
      <span class="percent">
        {{(scaleNum * 100).toFixed(0)}}%
      </span>
      <!-- 放大按钮 -->
      <el-button
        :disabled="scaleNum >= maxScale"
        size="mini"
        icon="el-icon-plus"
        circle
        @click="scaleView(0.1)">
      </el-button>
    </div>
  </div>
</template>

<script>
import DbDiagram from './db-diagram.service'
import ElementResizeDetectorMaker from 'element-resize-detector'
import { throttle } from '../../util/base'
/**
 * created by liuyu
 * 数据库表结构关系图，主要展现关联关系，不作添加table功能
 */
export default {
  name: 'idss-db-diagram',
  props: {
    emptyText: {
      type: String,
      default: '暂无数据'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    },
    // 画布的全局配置项
    config: {
      type: Object,
      default: () => ({})
    },
    // 画布数据
    data: {
      type: Object
    },
    // 放大缩小比例
    scale: {
      type: Number,
      default: 1
    },
    // 设置默认偏移量
    transform: {
      type: Array,
      default: () => ([0, 0])
    }
  },
  data () {
    return {
      scaleNum: 1,
      // 最小可缩放
      minScale: 0.2,
      // 最大可缩放
      maxScale: 2
    }
  },
  watch: {
    canvasData: {
      handler () {
        this.$nextTick(() => {
          // 重新绘制
          this.canvas.init(this.canvasData)
        })
      }
    },
    scale: {
      immediate: true,
      handler (scale) {
        this.scaleNum = scale
      }
    }
  },
  computed: {
    // 画布数据
    canvasData () {
      return JSON.parse(JSON.stringify(this.data || {}))
    },
    hasData () {
      return this.canvasData && this.canvasData.tables && this.canvasData.tables.length
    }
  },
  methods: {
    /**
     * 放大缩小画布
     * @param {number} diff 放大缩小的比例
     */
    scaleView (diff) {
      // js math 不精确
      const nextScale = +(this.scaleNum + diff).toFixed(2)
      // 最大最小可缩放控制
      if (nextScale >= this.minScale && nextScale <= this.maxScale) {
        this.scaleNum = nextScale
        // 调用画布的缩放
        this.canvas.scaleView(this.scaleNum)
      }
    },
    /**
     * 拖拽画布
     */
    dragCanvas (e) {
      // 非拖拽标记元素，跳出
      const view = this.$refs['canvas'].querySelector('svg')
      if (e.target !== view) return
      let oldX = e.pageX
      let oldY = e.pageY
      const oldP = this.canvas.getTransform()
      view.onmousemove = throttle((e) => {
        const absX = e.pageX - oldX
        const absY = e.pageY - oldY
        // 设置当前拖拽的偏移量
        this.canvas.setTransform([
          oldP[0] + absX * (1 / this.scaleNum),
          oldP[1] + absY * (1 / this.scaleNum)
        ])
      })
      document.onmouseup = () => {
        view.onmousemove = null
      }
    }
  },
  mounted () {
    // 初始化画布
    const container = this.$refs['canvas']
    this.canvas = new DbDiagram({
      container,
      scale: this.scaleNum,
      transform: this.transform,
      config: this.config
    })
    this.canvas.init(this.canvasData)

    // 图表resize监听
    this.elementResizeDetector = ElementResizeDetectorMaker({
      strategy: 'scroll',
      callOnAdd: false
    })
    this.elementResizeDetector.listenTo(container, () => {
      // 画布resize
      this.canvas.resizeEvent()
    })
  },
  beforeDestroy () {
    this.elementResizeDetector.uninstall(this.$refs['canvas'])
    this.elementResizeDetector = null
  }
}
</script>

<style lang="postcss">
  .idss-table-scheme {
    --db-diagrama-toolbox-bg: var(--color-bg-5,#fff);
    --db-diagrama-toolbox-font-size: var(--font-size-default, 12px);
    --db-diagrama-field-fill: var(--light-gray-1,#fff);
    --db-diagrama-ref-stroke-hover:var(--blue-6, #1890ff);
    --db-diagrame-relation-number-color: var(--color-font-2, #6a7280);
    --db-diagrama-table-header-text-color: var(--light-gray-1,#fff);
    --db-diagrama-table-header-text-font-size: var(--font-size-4, 14px);
    --db-diagrame-table-field-text-font-size: var(--font-size-default, 12px);
    --db-diagrame-table-field-text-color: var(--color-font-2, #6a7280);
    --db-diagrame-table-field-text-color-hover: var(--color-font-3,#a8acb3);
    --db-diagrame-table-field-text-left-color-hover: var(--color-font-6,#1890ff);
    --db-diagrame-table-field-type-color: var(--color-font-3,#a8acb3);

    position: relative;

    /* 工具箱 */
    .toolbox {
      position: absolute;
      width: 200px;
      left: 10px;
      top: 10px;
      text-align: center;
      z-index: 1;
      background-color: var(--db-diagrama-toolbox-bg);
      padding: 8px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0,0,0, 0.1);
      font-size: var(--db-diagrama-toolbox-font-size);

      /* 工具箱按钮 */
      & .el-button.el-button--mini.is-circle {
        padding: 3px;
      }

      & .percent {
        width: 40px;
        display: inline-block;
        text-align: center;
      }
    }

    /* 画布控制 */
    & #canvas {
      height: 100%;
      width: 100%;
      /* 允许拖拽 */
      cursor: move;
      > svg {
        user-select: none;
        outline: none;
      }
      /* table group处理 */
      g[id="table-group"] {

      }
      /* 单个表格 */
      g[table] {
        /* 不允许拖拽 */
        cursor: auto;
        /* 表格头部 */
        & g[table-header] {
          rect {
            fill: var(--blue-7-a80, rgba(9, 109, 217, 0.8));
          }
          text {
            fill: var(--db-diagrama-table-header-text-color);
            font-size: var(--db-diagrama-table-header-text-font-size);
            font-weight: bold;
          }
        }
        /* 单个字段 */
        g[field] {
          rect {
            fill: var(--db-diagrama-field-fill);
            stroke: var(--color-line-default, rgba(204,211,217,0.5));
            stroke-width: 0.4;
          }
          text:nth-child(even) {
            fill: var(--db-diagrame-table-field-text-color);
          }
          text:nth-child(odd) {
            fill: var(--db-diagrame-table-field-type-color);
          }
          &.active, &:hover {
            rect {
              fill: var(--blue-6-a20, rgba(24,144,255,0.2));
            }
            text:nth-child(even)[text-anchor="start"] {
              fill: var(--db-diagrame-table-field-text-left-color-hover);
            }
            text:nth-child(even) {
              fill: var(--db-diagrame-table-field-text-color-hover);
            }
          }
        }
      }
      /* 关联线 */
      g[id="refs-group"] {
        /* 不允许拖拽 */
        cursor: auto;
        g {
          path[show-path] {
            stroke: var(--color-line-default, rgba(204,211,217,0.5));
            stroke-width: 1px;
          }
          path[arrow] {
            fill: var(--color-line-default, rgba(204,211,217,0.5));
          }
          text {
            font-size: var(--db-diagrame-table-field-text-font-size);
            fill: none;
            text-anchor: middle;
          }
          &.active, &:hover {
            path[show-path] {
              stroke: var(--db-diagrama-ref-stroke-hover);
              stroke-width: 2px;
            }
            path[arrow] {
              fill: var(--db-diagrama-ref-stroke-hover);
            }
            text {
              fill: var(--db-diagrame-relation-number-color);
            }
          }
        }
      }
    }
    /* 空数据 */
    & .empty-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%, 0)
    }
  }
</style>
