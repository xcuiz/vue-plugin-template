import Container from '../../container'
// 高亮名称处理
import HighLight from './pie-highlight-service'
export default {
  extends: Container,
  mixins: [HighLight],
  props: {
    // @propCnName 高亮项索引值(-1为最后一项，默认为不高亮，<该参数对于饼图描述魔板，如果设置默认展示名称情况下，该参数不起作用>)
    highlightIndex: Number,
    // @propIsApi 基础数据
    data: {
      type: [Object, Array],
      default () {
        return {
          series: [],
          legend: []
        }
      }
    }
  },
  methods: {
    /**
     * 初始化polar默认配置
     */
    initDefaultOption () {
      // 设置饼图某项高亮
      this._setHighLight()
      return {
        // 继承覆盖式tooltip处理
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        }
      }
    },

    /**
     * 设置饼图某项高亮
     */
    _setHighLight () {
      if (typeof this.highlightIndex === 'number') {
        let index = this.highlightIndex === -1 ? this.transformData.legend.length - 1 : this.highlightIndex
        // 设置高亮显示名称
        this.defaultHighName = this.transformData.legend[index] && this.transformData.legend[index].name
        // 设置初始化高亮处理
        this._hightLightName()
      }
    },
    /**
     * 设置名称高亮，抽取该方法便于子组件继承
     */
    _hightLightName () {
      this.$nextTick(() => {
        // @FIX mychart重新setOption时，highName不存在
        this.myChart.highName = this.myChart.highName ? this.myChart.highName : this.defaultHighName
        // @NOTE 初始化高亮设置
        this.setItemHighName(this.myChart.highName)
        // @NOTE 绑定始终存在某一项高亮事件
        this.setPieOneHighlight()
      })
    }
  }
}
