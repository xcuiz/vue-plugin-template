<template>
  <div class="wrapper" ref="gradientBarRef">
    <div class="nodata" v-if="!data || (data && !data.length)">
      <span>暂无数据</span>
    </div>
    <div class="gradient-container" v-else>
      <el-row
        class="header"
        type="flex">
        <el-col
          :style="merge({width: options.nameOption.width}, options.nameTitleOption)"
          class="small-title">
          {{titleObj.nameTitle}}
        </el-col>
        <el-col
          :style="merge({width: barDefaultWidth}, options.barTitleOption)">
          {{titleObj.barTitle}}
        </el-col>
        <el-col
          :style="merge({width: options.valueOption.width}, options.valueTitleOption)">
          {{titleObj.valueTitle}}
        </el-col>
      </el-row>
      <ul class="gradient-bar">
        <li v-for="item in processData" :key="`${item.name}-${item.value}`" class="item">
          <div
            class="name"
            v-if="isShowName"
            :style="options.nameOption">
            <span v-if="item.url" class="gradient-bar-box">
              <slot v-bind:data="item">
              </slot>
            </span>
            {{item.name}}
          </div>
          <span class="bar" :style="options.barWrapperOption">
            <i
              v-for="(b, idx) in isFixedPlace ? barWrapperTotalNum : item.highlightColors"
              :key="idx"
              :style="merge(options.barOption, {background: item.highlightColors[idx] || options.barOption.background})"></i>
          </span>
          <span class="value" :style="options.valueOption">{{item.value | formatNumber}}</span>
        </li>

        <li class="item" v-show="false">
          <div
            class="name"
            :style="options.nameOption">
          </div>
          <span class="bar" :style="options.barWrapperOption">
            <i class="bar-i" :style="options.barOption"></i>
          </span>
          <span class="value" :style="options.valueOption"></span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
/**
 * 颜色渐变 top 排序
 * created by jing 2019-12-26
 *
 */
/**
 * @cnName 渐变柱图
 * @slot default 组件label的自定义内容
 */
import { charCodeLength, gradientColor, merge } from '../util/base.js'
import { getDomStyle } from '../util/dom.js'
import ElementResizeDetectorMaker from 'element-resize-detector'
import { formatNumber } from '../filters'
let defaultOptions = {
  // 名字标题样式设置
  nameTitleOption: {
    textAlign: 'center'
  },
  // 柱子标题样式设置
  barTitleOption: {
    marginLeft: '10px',
    marginRight: '10px',
    textAlign: 'center'
  },
  // 数值标题样式设置
  valueTitleOption: {
    textAlign: 'center'
  },
  titleOption: {},
  nameOption: {
    fontSize: '16px'
  },
  barWrapperOption: {
    marginLeft: '10px',
    marginRight: '10px'
  },
  barOption: {
    width: '5px',
    height: '18px',
    marginRight: '3px',
    background: '#1b3b84'
  },
  valueOption: {
    width: '40px'
  }
}
/**
 * 在 Firefox 浏览器 getComputedStyle 返回的属性如果没有设置的话，默认返回 '' 空字符串，parseInt('') 会返回 NaN
 * 最终导致 barWrapperWidth 为 NaN （有根据此字段计算作为数组长度） 所以会导致此组件在 Firefox 中不显示此组件
 * 这里对 parseInt 涉及到的计算场景，默认返回 0
 */
function _parseInt (str) {
  return parseInt(str || 0)
}

export default {
  name: 'idss-gradient-bar',
  filters: {
    formatNumber
  },
  props: {
    // @propCnName 是否固定统一右侧数据位置
    isFixedPlace: {
      type: Boolean,
      default: true
    },
    // @propCnName 数据项
    // @propIsApi
    data: {
      type: Array
    },
    // @propCnName 样式配置项
    propsOptions: {
      type: Object,
      default: function () {
        return {}
      }
    },
    // @propCnName 标题设置
    titleObj: {
      type: Object,
      default: function () {
        return {
          nameTitle: '',
          barTitle: '',
          valueTitle: ''
        }
      }
    },
    // @propCnName name的显示控制
    isShowName: {
      type: Boolean,
      default: true
    },
    // @propCnName 高亮颜色配置
    highlightColor: {
      type: [String, Array],
      default: 'linear-gradient(to bottom, #41beff, #1d7fc4)'
    }
  },
  data () {
    return {
      processData: [],
      options: merge(defaultOptions, this.propsOptions),
      barWrapperTotalNum: 0,
      barDefaultWidth: ''  // 由于柱子宽度是动态计算的，所以缓存计算后柱子默认宽度，给柱子相应标题使用
    }
  },
  watch: {
    data: {
      immediate: true,
      async handler (val, oldVal) {
        // 需要先保证能获取到DOM
        await this.$nextTick()
        // 初始化动态计算相应宽度
        this.init()
      },
      deep: true
    }
  },
  methods: {
    merge,
    // 初始化计算组件宽度
    init () {
      if (!Array.isArray(this.data) || !this.data.length) return
      // 求最大值，类似于 X 轴的最大值
      let maxBaseValue = this.getMathBaseValue(this.data)
      let containerWidth = _parseInt(getDomStyle(this.gradientBarRef, 'width'))
      let nameWidth = this.getDomWidth({ selectors: '.name', key: 'nameOption', className: 'name' })['allWidth']
      let valueWidth = this.getDomWidth({ selectors: '.value', key: 'valueOption' })['allWidth']
      let barWrapperObj = getDomStyle((this.gradientBarRef || {}).querySelector('.bar'))
      // 求 bar 的实际内容宽度
      let barWrapperWidth = !this.options.barWrapperOption.width
        ? containerWidth -
          nameWidth -
          valueWidth -
          _parseInt(barWrapperObj['paddingLeft']) -
          _parseInt(barWrapperObj['paddingRight']) -
          _parseInt(barWrapperObj['marginLeft']) -
          _parseInt(barWrapperObj['marginRight']) -
          _parseInt(barWrapperObj['borderWidth']) * 2
        : _parseInt(this.options.barWrapperOption.width)
      this.barDefaultWidth = `${barWrapperWidth}px` // 缓存柱子宽度，用作相应的标题宽度使用
      let singleBar = this.getDomWidth({ selectors: '.bar-i', key: 'barOption', className: 'i' })['allWidth']
      // 求 bar 的总个数
      this.barWrapperTotalNum = Math.floor(barWrapperWidth / singleBar)
      // 原始数据加工
      this.processData = this.data.map((item, index) => {
        let highlightStep = Math.floor(item.value * this.barWrapperTotalNum / maxBaseValue)
        let highlightColors = []
        highlightColors = !Array.isArray(this.highlightColor)
          ? Array(highlightStep).fill(this.highlightColor)
          : this.computeColors(this.highlightColor, highlightStep)
        return Object.assign({}, item, {
          highlightColors: highlightColors
        })
      })
    },
    /**
     * 获取目前元素的内容宽度以及所有宽度（包括padding、margin、borderWidth）
     * @param {String} selectors 选择器
     * @param {String} key 属性值
     * @param {className} className 类名
     */
    getDomWidth ({ selectors, key, className = '' }) {
      let obj = getDomStyle((this.gradientBarRef || {}).querySelector(selectors))
      let width
      let allWidth
      // 判断是否传了相应的宽度值
      if (!(this.propsOptions[key] || {}).width) {
        // 如果className为name时，需要根据字体大小动态计算相应宽度
        width = className === 'name' ? Math.max(...this.data.map(item => charCodeLength(item.name) * Math.ceil(_parseInt(this.options[key].fontSize) / 2)))
          : _parseInt(obj['width'])
        if (className === 'name') this.options[key].width = `${width}px`
      } else {
        width = _parseInt(this.options[key].width)
      }
      allWidth = width +
          _parseInt(obj['paddingLeft']) +
          _parseInt(obj['paddingRight']) +
          _parseInt(obj['marginLeft']) +
          _parseInt(obj['marginRight']) +
          _parseInt(obj['borderWidth']) * 2
      return {
        width,
        allWidth
      }
    },
    /**
     * 求最大值，类似于 X 轴的最大值
     * @param {Array} data
     */
    getMathBaseValue (data) {
      if (!Array.isArray(data)) return
      let maxValue = Math.max(...data.map(item => item.value))
      return Math.ceil(maxValue / 50) * 50
    },
    /**
     * 颜色值渐变分级计算
     * @param {Array} colorArray 初始颜色数组
     * @param {Number} step 最终分级数
     */
    computeColors (colorArray, step) {
      let result = []
      let splitNum = colorArray.length - 1
      for (let i = 0; i < splitNum; i++) {
        let currentColor = colorArray[i]
        let nextColor = colorArray[i + 1]
        let splitStep = Math.round(step / splitNum)
        let splitColorArray = gradientColor(currentColor, nextColor, splitStep)
        result.push(...splitColorArray)
      }
      return result
    }
  },
  mounted () {
    // 确保获取到dom
    this.$refs['gradientBarRef'] && (this.gradientBarRef = this.$refs['gradientBarRef'])
    // 监听父组件变化重新计算
    this.elementResizeDetector = ElementResizeDetectorMaker({
      strategy: 'scroll',
      callOnAdd: false
    })
    this.elementResizeDetector.listenTo(this.gradientBarRef, () => {
      this.init()
    })
  },
  beforeDestroy () {
    // 解绑监听
    this.elementResizeDetector.uninstall(this.gradientBarRef)
    this.elementResizeDetector = null
  }
}
</script>
<style scoped lang="postcss">
.wrapper {
  --gradient-bar-header-color: #41beff;
  --gradient-bar-nodata-color: #66ccff;
  --gradient-bar-title-color: #97e0ff;
  --gradient-bar-value-color: #a8c4d9;
  --gradient-bar-bar-i-bg-color: #ccc;
  width: 100%;
  height: 100%;
  position: relative;
  padding: 10px 0;
  & .gradient-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  & .nodata {
    display: table;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    color: var(--gradient-bar-nodata-color);
    & > span {
      display: table-cell;
      vertical-align: middle;
      text-align: center;
    }
  }
  .small-title:nth-child(2) {
    margin:auto;
  }
  .gradient-bar {
    flex-grow:1;
    display: flex;
    flex-direction: column;
    & .item + .item {
      margin-top: 10px;
    }

    & .item {
      flex-grow: 1;
      display: inline-flex;
      align-items: center;
      width: 100%;
      .gradient-bar-box {
        display: inline-block;
        height: 22px;
        width: 27px;
        min-width: 27px;
        padding-right: 5px;
      }
      & img {
        width: 100%;
        height: 100%;
        vertical-align: middle;
      }
      & .name {
        text-align: left;
        font-size: 16px;
        max-width: 117px;
        color: var(--gradient-bar-title-color);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      & .bar {
        display: inline-flex;
        & i {
          width: 5px;
          margin-right: 3px;
          height: 16px;
          border-radius: 2px;
          background-color: var(--gradient-bar-bar-i-bg-color);
        }
      }

      & .value {
        display: inline-block;
        text-align: left;
        font-size: 14px;
        color: var(--gradient-bar-value-color);
        font-family: Arial, Helvetica, sans-serif;
      }
    }
  }
}
</style>
