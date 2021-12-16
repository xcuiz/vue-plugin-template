/**
 * 空心圆饼图
 * created by liuyu
 */
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import PieChart from './pie-chart'
import { merge, isFunction } from '../../util/base.js'
import roundDescription from './template/tmpl-round-description.js'
import { data2Pie } from '../../data-factory'
// pie富文本魔板
const TMPL = {
  default: roundDescription
}
export default {
  name: 'idss-pie-round-chart',
  mixins: [PieChart],
  props: {
    // @propCnName label是否居中显示，true时=>标品空心饼图默认样式
    labelCenter: Boolean,
    // @propCnName 环饼图魔板配置
    idssTmpl: String,
    // @propCnName 默认饼图显示内容，不显示legend高亮选项（该参数必须与labelCenter配合使用,在idssTmpl=default情况下使用）
    defaultShowTitle: String
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Pie(data)
    },
    initChartOption () {
      // 获取 bar 的默认配置(继承与bar-chart.js)
      let option = this.getChartOption()
      option.series = option.series.map(val => {
        // 添加默认显示title
        this.addDefaultitle(val)
        return merge(val, {
          radius: ['50%', '70%'],
          avoidLabelOverlap: !this.labelCenter,
          // 饼图label居中处理
          label: this.labelCenter ? {
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
          } : {}
        })
      })
      option = merge(option, this.getDefaultTmplOpt())
      // 为label formatter绑定this
      if (option.series[0] && option.series[0].label && option.series[0].label.normal && isFunction(option.series[0].label.normal.formatter)) {
        option.series[0].label.normal.formatter = option.series[0].label.normal.formatter.bind(this)
      }
      return option
    },

    /**
     * 添加默认展示title值
     * @param {object} option 图标数据
     */
    addDefaultitle (option) {
      // 添加默认不显示，作为title显示的数据
      if (this.defaultShowTitle) {
        option.data.push({
          name: this.defaultShowTitle,
          value: '_r'
        })
        // 将默认名称显示为默认高亮
        const index = this.defaultShowTitle ? option.data.length - 1 : 0
        this.defaultHighName = option.data[index].name
        // 设置设置默认标题后，默认标题高亮初始化(排除设置索引值得情况)
        if (typeof this.highlightIndex !== 'number') {
          this._hightLightName()
        }
      }
    },
    /**
     * 获取内部饼图配置
     */
    getDefaultTmplOpt () {
      const res = TMPL[this.idssTmpl]
      return res || {}
    }
  }
}
