/**
 * 空心圆饼名称高亮service
 * created by liuyu
 */

/**
 * 判断当前操作是否为legend图例
 * @param {object<echarNode>} element
 * @returns {Boolean}
 */
function isOperateLengend (element) {
  let isLengend = false
  if (element &&
      element.tooltip &&
      element.tooltip.formatterParams &&
      element.tooltip.formatterParams.componentType === 'legend') {
    isLengend = true
  }
  return isLengend
}
export default {
  data () {
    return {
      defaultHighName: '' // 默认设置选中的高亮名称
    }
  },
  watch: {
    defaultHighName (newV) {
      this.myChart.highName = newV
    }
  },
  methods: {
    // 设置pie 始终存在某一项高亮
    setPieOneHighlight () {
      // legend 图例选中改变事件
      this.myChart.on('legendselectchanged', (...params) => {
        // 图例change事件，返回的selectd对象返回所有图例是否展示清空 {name1: false, name2: true, name3: true}
        const selectedList = params[0].selected
        // 判断当前默认高亮项是否在select对象中，没有则补全（用于兼容某一项不在图例中展示）
        if (this.defaultHighName && selectedList[this.defaultHighName] === undefined) {
          selectedList[this.defaultHighName] = true
        }
        // 过滤当前被选中的item list
        const selectArr = Object.entries(selectedList).filter(item => !!item[1])
        // 判断当前选中的item list中是否存在当前高亮的item
        const isHightNameExsit = selectArr.some(item => item[0] === this.myChart.highName)
        // 判断当前选中legend数组中不存在 highName，重新赋值highName(不存在的话，默认第一项))
        if (selectArr && selectArr.length && !isHightNameExsit) {
          this.myChart.highName = selectArr[0][0]
        }
        this.setItemHighName(this.myChart.highName)
      })
      // 图标mouseover事件
      this.myChart.on('mouseover', (params) => {
        // 高亮当前hover高亮的item
        this.setItemHighName(params.name)
      })

      // 图表mouseout事件
      this.myChart.on('mouseout', (params) => {
        this.setItemHighName(this.myChart.highName)
      })

      // 监听图列mouseout 事件
      this.myChart._api.getZr().on('mouseout', (e) => {
        const el = e.target
        if (isOperateLengend(el)) {
          const item = el.tooltip.formatterParams
          // 鼠标移除显示当前默认高亮项
          this.setItemHighName(this.myChart.highName)
          // console.log(this.myChart.highName)
          // 调用组件图例自定义mouseout事件
          this.customLengendMouseout && this.customLengendMouseout(item)
        }
      })

      // 监听图列mouseover 事件
      this.myChart._api.getZr().on('mouseover', (e) => {
        const el = e.target
        if (isOperateLengend(el)) {
          const item = el.tooltip.formatterParams
          // 鼠标移入，将当前图例对应item高亮
          this.setItemHighName(item.name)
          // console.log(item.name)
          // 调用组件图例自定义mouseover事件
          this.customLengendMouseover && this.customLengendMouseover(item)
        }
      })

      // 监听图列切换分页事件
      this.myChart._api.getZr().on('click', (e) => {
        const el = e.target
        // 点击legend 分页切换时，高亮当前默认项
        if (el && el.name && (el.name === 'pageNext' || el.name === 'pagePrev')) {
          this.setItemHighName(this.myChart.highName)
        }
      })
    },
    /**
     * pie点击事件切换默认高亮
     */
    clickSwitchHighlight () {
      // 图表点击事件,目的是选中某一项之后，高亮名默认为该项
      this.myChart.on('click', (params) => {
        this.myChart.highName = params.name
      })
    },
    /**
     * 设置某一项高亮
     * @param {string} name item高亮的name值
     */
    setItemHighName (name) {
      this.myChart.dispatchAction({
        type: 'downplay'
      })
      this.myChart.dispatchAction({
        type: 'highlight',
        name: name
      })
    },

    /**
     * 图标resize事件回调触发
     */
    _chartResizeCb () {
      // @NOTE 初始化高亮设置
      this.setItemHighName(this.myChart.highName)
    }
  },

  mounted () {
    // 设置默认高亮名称
    this.myChart.highName = this.defaultHighName
  }
}
