/**
 * 饼图图例描述legend魔板
 * created by liuyu
 * @NOTE customFormatter函数为formatter内部调用函数，方便用户继承该魔板使用
 */
import Echarts from 'echarts/lib/echarts'
import { checkFormatter, formatNumber, merge } from '../../util/base.js'
import defaultBaseColor from '../../theme/default-base-color.js'
// 纵向图表图例标题长度(该数据用于处理graphic图形定位参照)
const legendNameWidth = 80

// 饼图图例描述，富文本样式名
const pieDscriptionClass = {
  title: 'name',
  line: 'line',
  percent: 'time',
  percentUnit: 'percent',
  count: 'time',
  unit: 'unit',
  placehoder: 'placehoder'
}
/**
 * 设置横向图表图例的富文本配置
 */
function legendRich ({ title, line, percent, percentUnit, count, unit, placehoder }) {
  const res = {
    // 名称
    [title]: {
      width: legendNameWidth,
      fontSize: 16
    },
    // 竖线
    [line]: {
      fontSize: 18,
      fontWeight: 100
    },
    // 百分比
    [percent]: {
      align: 'right',
      fontSize: 18,
      color: defaultBaseColor.PIE.DISCRIPTION.TEXT_COLOR,
      fontWeight: 500,
      width: 60,
      padding: [0, 0, 0, 20]
    },
    // 百分比 单位
    [percentUnit]: {},
    // 单组统计值
    [count]: {
      align: 'right',
      fontSize: 18,
      color: defaultBaseColor.PIE.DISCRIPTION.TEXT_COLOR,
      fontWeight: 500,
      width: 60,
      padding: [0, 0, 0, 20]
    },
    // 单位
    [unit]: {},
    // 占位
    [placehoder]: {
      width: 50
    }
  }
  // 次数 hover 样式
  res[`${title}Emphasis`] = {
    ...res[title],
    color: defaultBaseColor.PIE.DISCRIPTION.EMPHASIS
  }
  res[`${line}Emphasis`] = {
    ...res[line],
    color: defaultBaseColor.PIE.DISCRIPTION.EMPHASIS
  }
  res[`${percent}Emphasis`] = {
    ...res[percent],
    color: defaultBaseColor.PIE.DISCRIPTION.EMPHASIS
  }
  res[`${percentUnit}Emphasis`] = {
    ...res[percentUnit],
    color: defaultBaseColor.PIE.DISCRIPTION.EMPHASIS
  }
  res[`${count}Emphasis`] = {
    ...res[count],
    color: defaultBaseColor.PIE.DISCRIPTION.EMPHASIS
  }
  res[`${unit}Emphasis`] = {
    ...res[unit],
    color: defaultBaseColor.PIE.DISCRIPTION.EMPHASIS
  }
  return res
}
// 基础图例描述魔板 richClass 富文本样式名列表
export default function (richClass) {
  // 合并富文本样式配置
  const legendRichClassObj = merge({}, pieDscriptionClass, richClass)
  const { title, line, percent, percentUnit, count, unit, placehoder } = legendRichClassObj
  return {
    show: true,
    y: 'center', // 用于处理图例居中对齐
    left: '28%',
    width: '70%',
    padding: [20, 20, 20, 20],
    itemGap: 20,    // 图例之间的间隔
    itemHeight: 10,   // 图例标记的高度
    itemWidth: 10,
    icon: 'rect',
    tooltip: {
      show: true
    },
    formatter: function (name) {
      // @FIXME 该方法只针对单组数据的formatter
      const option = this.myChart.getOption()
      const series = option.series.reduce((a, b) => {
        a.push(...b.data)
        return a
      }, [])
      const index = series.findIndex(item => item.name === name)
      // 获取当前索引数据项
      const item = series[index]
      // 获取当前选中的select数据
      const selectdData = option.legend[0].selected
      // 获取所有数量
      const selectTotal = series.filter(v => {
        return !(selectdData[v.name] === false)
      }).reduce((a, b) => a + (isNaN(b.value) ? 0 : +b.value), 0)
      // 获取当前项是否选中
      const isSelected = !(selectdData[name] === false)
      // 将自定义函数this指向为vue实例，方便后续获取
      const format = option.legend[0].customFormatter.bind(this)
      return checkFormatter(format, item, index, selectTotal, isSelected, option)
    },
    customFormatter (item, index, selectTotal, isSelected, option) {
      // 选中状态的样式，尾缀处理
      const isSelectedFix = isSelected ? '' : 'Emphasis'
      return [
        `{${title + isSelectedFix}|${Echarts.format.truncateText(item.name, option.legend[0].textStyle.rich[title].width - 10, '14px Microsoft Yahei', '…')}}`,
        `{${line + isSelectedFix}||}`,
        `{${percent + isSelectedFix}|${(!isSelected || !selectTotal) ? 0 : (item.value / selectTotal * 100).toFixed(2)}}{${percentUnit + isSelectedFix}|%}`,
        `{${count + isSelectedFix}|${formatNumber(item.value, 'zh')}}{${unit + isSelectedFix}|${this.unit}}`,
        `{${placehoder}|}`
      ].join('')
    },
    textStyle: {
      fontSize: 12,
      align: 'right',
      rich: legendRich(legendRichClassObj)
    }
  }
}
