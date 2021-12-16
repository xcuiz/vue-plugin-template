<template>
  <div class="honeycomb-chart-container">
    <svg
      width="100%"
      height="100%"
      version="1.1"
      viewBox="0 0 1600 800"
      xmlns="http://www.w3.org/2000/svg">
      <!-- 绘制单个菱形 -->
      <template v-for="(item, key, index) in honeyInfo">
        <g
          :transform="`translate(${getRealPosition(key)})`"
          :key="index"
          @click="handleClick(item, index)"
          v-show="item.show">
          <path
            d="M 100 100 L 186.6 150 L 186.6 250 L 100 300 L 13.4 250 L 13.4 150 z"
            :style="item.style"/>
          <!-- 默认slot 为所有菱形统一设置 -->
          <slot :info="item" v-if="showDefaultSlots(item.position)">
            <foreignObject
              x="16.6"
              y="150"
              width="173.2"
              height="200"
              v-if="item.position">
              <span class="text" v-if="showPosition">坐标: {{ key }}</span>
              <div class="text" v-if="item.value">{{ item.value | formatNumber }}</div>
              <idss-tooltip
                class="item"
                effect="dark"
                :content="item.name"
                placement="top-start">
                <div class="text">{{ item.name }}</div>
              </idss-tooltip>
            </foreignObject>
          </slot>
          <!-- slot 为单个菱形设置 -->
          <slot :name="item.position" :info="item"></slot>
        </g>
      </template>
    </svg>
  </div>
</template>

<script>
/**
 * @name 蜂窝图
 * @props {Object} data $$_数据项
 * @props {Array} tmplName 模板名称
 * @props {Number} row 蜂窝图行数
 * @props {Number} col 蜂窝图列数
 * @props {Object} singleHoneyInfo 单个菱形样式配置
 * @props {Object} config 菱形样式配置
 * @props {Boolean} showPosition 是否显示菱形坐标位置, 该功能主要是为了便于知晓需要更改样式的坐标位置
 */

/**
 * 蜂窝图组件
 * 规则: Props: singleHoneyInfo(最底层配置, 用于菱形的通用样式) =>                                                  base
 *      Const: DEFAULT_CONFIG(基础配置,这里设置为不可修改, 相当于蜂窝图的一个模板)                                    template
 *      Props: data(外层传入配置, 如果不指定特定坐标, 则按模板来平铺数据, 如果指定了坐标, 同时指定了style, 则会覆盖上两层))  option
 *
 * 使用slot替换内容时,如需使用除svg外标签, 请参考svg - foreignObject标签
 * 参考链接: https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/foreignObject
 */
import { merge } from '../../util/base.js'
import TMPL_CONFIG from './tmpl-config.js'
import { formatNumber } from './../../filters'
import { IdssTooltip } from './../../commons'
const setDefaultProps = function (key) {
  return function () {
    return (TMPL_CONFIG[this.tmplName] || TMPL_CONFIG['default'])[key]
  }
}
export default {
  name: 'idss-honeycomb-chart',
  filters: {
    formatNumber
  },
  components: {
    IdssTooltip
  },
  props: {
    // 蜂窝图模板
    tmplName: {
      type: String,
      default: 'default'
    },
    // 蜂窝行数
    row: {
      type: Number,
      default: setDefaultProps('row')
    },
    // 蜂窝列数
    col: {
      type: Number,
      default: setDefaultProps('col')
    },
    // 菱形的默认配置
    singleHoneyInfo: {
      type: Object,
      default: setDefaultProps('singleHoneyConfig')
    },
    // 通过坐标更改具体菱形的样式和是否显示
    config: {
      type: Object,
      default: setDefaultProps('config') || {}
    },
    data: {
      type: Object,
      default () {
        return {
          data: []
        }
      }
    },
    // 是否显示菱形坐标位置, 该功能主要是为了便于知晓需要更改样式的坐标位置
    showPosition: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 蜂窝图配置, 每个蜂窝菱形都有其特定属性
      honeyInfo: {}
    }
  },
  watch: {
    'data.data': {
      immediate: true,
      deep: true,
      handler () {
        this.produceInitData()
      }
    }
  },
  methods: {
    /**
     * 工厂函数, 生成所有菱形初始化数据, 处理数据
     */
    produceInitData () {
      const { row, col, singleHoneyInfo, config, tmplName, data } = this
      // 合并基础配置, 主要用于渲染菱形的背景颜色
      let honeyInfo = {}
      for (let i = 1; i <= row; i++) {
        for (let j = 1; j <= col; j++) {
          honeyInfo[[i, j]] = merge(
            singleHoneyInfo,
            ((TMPL_CONFIG[tmplName] || TMPL_CONFIG['default']).config || {})[[i, j]] || {},
            (config || {})[[i, j]] || {})
        }
      }
      let outerList = Object.values(honeyInfo).filter(info => info.position)
      // 与外部传入data合并, merge得到最终数据, 用于渲染数据
      data.data.map((item, index) => {
        if (item.position && Array.isArray(item.position)) {
          honeyInfo[item.position] = merge(
            honeyInfo[item.position],
            (TMPL_CONFIG[tmplName] || TMPL_CONFIG['default']).config[item.position],
            (config || {})[item.position] || {},
            item)
        } else {
          // 外部仅传入数据的情况, 按从左到右, 从上到下的顺序渲染
          outerList.map((singleInfo, singleIdx) => {
            index === singleIdx && (honeyInfo[singleInfo.position] = merge(
              honeyInfo[singleInfo.position],
              singleInfo,
              (TMPL_CONFIG[tmplName] || TMPL_CONFIG['default']).config[singleInfo.position],
              (config || {})[singleInfo.position] || {},
              item)
            )
          })
        }
      })
      this.honeyInfo = honeyInfo
    },

    /**
     * 计算菱形需要平移的位置, 区分行数为奇数和偶数
     * @param { Array } pos 指定菱形位置
     * @return { String } translate 位移值
     */
    getRealPosition (pos) {
      let posArr = pos.split(',')
      return `${(+posArr[1] - 1) * 173.2 + (+posArr[0] % 2 === 1 ? 100 : 186.6)}, ${(+posArr[0] - 1) * 150}`
    },
    /**
     * 是否显示默认插槽, 传入具名插槽时不显示默认插槽
     */
    showDefaultSlots (position) {
      // 判断是否有可枚举属性
      if (!Object.entries(this.$scopedSlots).length) return true
      if (Array.isArray(position)) {
        return !(Object.entries(this.$scopedSlots)[0] || []).includes(position.join(','))
      } else {
        return true
      }
    },
    // 冒出事件
    handleClick (item, index) {
      // 仅当点击的是传入的数据时才会触发
      item.position && this.$emit('clickItem', item, index)
    }
  }
}
</script>
<style lang="postcss" scoped>
.honeycomb-chart-container {
  width: 100%;
  height: 100%;
  background: var(--honeycomb-chart-background-color);
  & .text {
    font-size: 28px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: bold;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
