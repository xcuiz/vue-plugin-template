import { merge } from '../../../util/base.js'
import tinycolor from 'tinycolor2'
// 散点图默认五组配置项（依照海通大屏配置）
const DATA_LIST = [{
  offset: [400, 30],
  symbolSize: 90,
  opacity: 0.95
}, {
  offset: [170, 150],
  symbolSize: 70,
  opacity: 0.84
}, {
  offset: [0, 80],
  symbolSize: 60,
  opacity: 1
}, {
  offset: [-200, 0],
  symbolSize: 45,
  opacity: 0.88
}, {
  offset: [-430, 130],
  symbolSize: 40,
  opacity: 0.8
}]
const getChartOptionVal = function (that) {
  // 考虑数据结构的不一致会导致模版渲染不了数据，因此提前处理一次数据，保证模版最终渲染使用的数据结构是一致的
  // @FIXME 需要注意的是：因value值差异太大时会出现某个散点不显示的情况，所以在data[2]赋了一个固定值80
  let dealArray = []
  if (that.transformData.series.length > 1) {
    dealArray = that.transformData.series
  } else {
    that.transformData.series.forEach(item => {
      let newData = {}
      item.data.forEach((v, i) => {
        newData = { name: v.name, key: v.key, data: [v.value[0], 80, v.value[1]] }
        dealArray.push(newData)
      })
    })
  }

  /** 处理borderColor根据传入的颜色生成rgba
   * borderColor渲染的优先级：dataList > defaultBaseColor > defaultThemeColor
  */
  const dealColor = function (i, type) {
    // @FIXME merge三种颜色得到最终可渲染颜色集合
    let defaultThemeColor = that.myChart._theme.color
    let colorList = merge([], defaultThemeColor, that.dataList.map((item, index) => {
      return item.color || that.BASE_COLOR.SCATTER_TMPL_COLOR[index] || defaultThemeColor[index]
    }).filter(i => i))
    // @FIXME 分别处理bordercolor && color，保证渲染颜色一样
    if (type === 'borderColor') {
      // 如果i数量超出所有borderColor颜色值，颜色从头再次循环一次
      let { _r, _g, _b } = tinycolor(!colorList[i] ? colorList[i % colorList.length] : colorList[i])
      return `rgba(${_r}, ${_g}, ${_b}, 0.25)`
    }
    return !colorList[i] ? colorList[i % colorList.length] : colorList[i]
  }
  return {
    legend: {
      show: that.isShowLegend,
      data: that.transformData.series.length > 1 ? that.transformData.legend : dealArray.map((item, index) => merge({}, {
        name: item.data[0],
        icon: 'roundRect'
      }))
    },
    xAxis: [{
      show: false
    }],
    yAxis: [{
      show: false
    }],
    tooltip: {
      trigger: 'item'
    },
    grid: {
      top: '10%',
      left: '10%',
      right: '10%',
      bottom: '10%'
    },
    series: dealArray.map((item, index) => merge({}, {
      type: 'scatter',
      name: item.name,
      color: dealColor(index, 'color'),
      label: { show: true, formatter (name) { return name.data.key + '\n' + name.data.value[2] + that.unit } },
      data: that.transformData.series.length > 1 ? item.data : [{
        name: item.name,
        value: item.data,
        key: item.key,
        tooltip: {
          show: true,
          formatter: function (name) {
            return `${name.name}</br>${name.data.key}: ${name.data.value[2]}${that.unit}`
          }
        },
        symbolSize: that.dataList[index] && merge(DATA_LIST, that.dataList[index]).symbolSize,
        symbolOffset: that.dataList[index] && that.dataList[index].offset,
        itemStyle: {
          borderWidth: 6,
          borderColor: (that.dataList[index] && that.dataList[index].borderColor) || dealColor(index, 'borderColor'),
          opacity: that.dataList[index] && that.dataList[index].opacity
        }
      }]
    }, that.transformData.series[0].data[index]))
  }
}
export {
  getChartOptionVal,
  DATA_LIST
}
