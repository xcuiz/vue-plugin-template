/**
 * 饼图--使用title富文本显示详情数据
 */
import 'echarts/lib/component/title'
import roundPieChart from './pie-round-chart'
import { merge, isFunction, isNumber } from '../../util/base.js'
import defaultBaseColor from '../../theme/default-base-color.js'
import { data2DetailPie } from '../../data-factory'

const BASE_OPTION = {
  legend: {
    orient: 'horizontal',
    x: 'center',
    y: 'bottom',
    icon: 'circle'
  },
  title: {
    show: true,
    x: '55%',
    y: 'center',
    textStyle: {}
  },
  series: [{
    type: 'pie',
    radius: ['50%', '70%'],
    avoidLabelOverlap: false,
    label: {
      normal: {
        show: false,
        position: 'center'
      },
      emphasis: {
        show: true,
        textStyle: {
          fontSize: '20',
          fontWeight: 'bold'
        }
      }
    }
  }]
}

export default {
  name: 'idss-pie-detail-chart',
  extends: roundPieChart,
  data () {
    return {
      baseOption: BASE_OPTION,              // 图表基础Option
      processedColor: {},                   // 加工后的颜色
      highlightItemName: '',                // 当前高亮Name
      outputOption: {}                      // 输出Option FIXME: 触发事件后用于重新setOption
    }
  },
  props: {
    // 富文本样式
    detailStyle: {
      type: Object,
      default: () => {
        return {
          width: '50%',
          height: 30
        }
      }
    },
    // 渐变色
    gradientColor: {
      type: Array,
      default: () => {
        return defaultBaseColor.PIE.DETAIL.GRADIENT_COLOR
      }
    },
    // 饼图无高亮时默认显示的颜色
    defaultColor: {
      type: Array,
      default: () => {
        return defaultBaseColor.PIE.DETAIL.DEFAULT_COLOR
      }
    },
    // 是否显示比率
    showRate: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2DetailPie(data)
    },
    /**
     * 此函数的目的为了加工颜色数组
     * [ [colorArr1], [colorArr2] ... ]  => { name1: { isShow: true, color: [colorArr1] }, name2: { isShow: true, color: [colorArr2] } ..  }
     * 加工颜色数组的目的是为了便于通过对象的key值进行索引
     */
    handleData () {
      this.highlightItemName = this.transformData.series[0].data[this.highlightIndex || 0].name
      let nameList = this.transformData.series[0].data.map(e => e.name)
      nameList.forEach((item, index) => {
        this.processedColor[item] = {
          isShow: true,
          color: this.gradientColor[index]
        }
      })
    },

    initChartOption () {
      this.handleData()
      let option = this.getChartOption()
      option.series = option.series.map(val => {
        // 添加默认显示title
        this.addDefaultitle(val)
        return merge(val, this.baseOption)
      })
      // 初始化时默认显示高亮项详情
      this.setDetailInfo(this.highlightItemName, this.highlightIndex)
      option = merge(option, this.baseOption, this.getDefaultTmplOpt())
      // 为label formatter绑定this
      if (option.series[0] && option.series[0].label && option.series[0].label.normal && isFunction(option.series[0].label.normal.formatter)) {
        option.series[0].label.normal.formatter = option.series[0].label.normal.formatter.bind(this)
      }
      this.showDetail()
      return option
    },

    /**
     * 事件监听改变详情数据
     */
    showDetail () {
      // 鼠标移入悬浮传递数据
      this.myChart.on('highlight', e => {
        this.setDetailInfo(e.name, e.dataIndex)
        this.myChart.setOption(merge(this.outputOption, this.option))
      })

      // 鼠标移出恢复默认
      this.myChart.on('downplay', e => {
        this.setDetailInfo(this.myChart.highName, this.highlightIndex)
        this.myChart.setOption(merge(this.outputOption, this.option))
      })

      // 图例选中变化
      if (isNumber(this.highlightIndex)) {
        this.myChart.on('legendselectchanged', async e => {
          await this.setPieOneHighlight()
          // 过滤颜色数组
          Object.keys(e.selected).forEach((k, i) => {
            if (e.selected[k] === false) {
              this.processedColor[k].isShow = false
            }
          })
          let highIndex = 0
          this.transformData.series[0].data.forEach((item, index) => {
            highIndex = (item.name === this.myChart.highName ? index : 0)
          })
          this.setDetailInfo(this.myChart.highName, highIndex)
          this.outputOption = Object.assign({}, this.option, this.baseOption)
          this.myChart.setOption(merge(this.outputOption, this.option))
        })
      }
    },

    /**
     *
     * 动态改变需要展示的详细信息
     * @param {*} name  当前高亮项数据name
     * @param {*} id    当前高亮项dataindex
     * @returns
     */
    setDetailInfo (name, id) {
      // 如果没有高亮显示的项, 则展示详情数据的综合占比
      let detail
      let color
      if (!isNumber(id) || !name || !this.processedColor[name]) {
        detail = this.transformData.series[0].detailTotalData
        color = this.defaultColor
      } else {
        detail = (this.transformData.series[0].data[id] || {}).detail
        color = this.processedColor[name].color
      }
      let formatterStr = ''
      let rich = {}
      detail.forEach((item, index) => {
        formatterStr += `{colorBlock${[index + 1]}|}{text|${item.name}}{text|${this.showRate ? item.rate : ''}}{text|${item.value}}\n`
        rich[`colorBlock${index + 1}`] = {
          backgroundColor: color[index],
          width: this.detailStyle.width,
          height: this.detailStyle.height
        }
      })
      rich.text = {
        fontSize: 12,
        width: 25,
        padding: [0, 10, 0, 20],
        align: 'left',
        color: defaultBaseColor.PIE.DETAIL.TEXT_COLOR
      }
      this.baseOption.title.text = formatterStr
      this.baseOption.title.textStyle.rich = rich
      this.outputOption = Object.assign({}, this.option, { title: this.baseOption.title })
    }
  }
}
