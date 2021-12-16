import { merge } from '../../../util/base.js'
// 显示低危、中危、高危、严重数组
const NEST_GRADE = [{
  name: '低危',
  color: 'LOW_GRADE'
}, {
  name: '中危',
  color: 'MIDDLE_GRADE'
}, {
  name: '高危',
  color: 'HIGH_GRADE'
}, {
  name: '严重',
  color: 'SERIOUS_GRADE'
}]

const getGaugeChartOption = function (that) {
  // 计算value / max
  let val = that.transformData.data[0].value / that.transformData.max
  // 如果比值大于1了，按照1处理(当前值除以最大大值，理论上不应该大于1的，这里主要兼容后台数据可能错误的情况)
  val = val > 1 ? 1 : val
  // value 小于 NEST_GRADE 中某一项的 grade
  const itemIndex = that.nestGrade.findIndex((item) => {
    return that.nestGradeFindIndex(val, item)
  })
  const gaugeColor = that.BASE_COLOR.GAUGEGRADE
  const indexData = that.nestOption[itemIndex]
  // 对 name 以及 color 动态处理配置
  let dataOption = merge(that.getChartOption(), initGaugeChartOption(that), {
    series: [{
      data: [{
        // 如果有传递name使用传递过来的，否则使用默认对应的级别
        name: that.transformData.data[0].name || indexData.name
      }],
      detail: {
        color: gaugeColor[indexData.color]
      },
      axisLine: {
        lineStyle: {
          color: [[val, gaugeColor.LOW_GRADE], [1, gaugeColor.SHADOW_GAUGE_COLOR]]
        }
      }
    }]
  })
  return dataOption
}

// 模版默认配置项
function initGaugeChartOption (that) {
  return {
    backgroundColor: 'transparent',
    series: [{
      show: true,
      startAngle: 220,
      endAngle: -40,
      splitNumber: '42',
      center: ['50%', '55%'], // 仪表位置
      radius: '100%', // 仪表大小
      type: 'gauge',
      axisLine: {
        show: false,
        lineStyle: {
          width: 14 // 轴线宽度
        }
      },
      splitLine: {
        length: 14,
        lineStyle: {
          width: 6,
          opacity: 1,
          color: that.BASE_COLOR.GAUGEGRADE.GAUGE_BGCOLOR
        }
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: true,
        color: that.BASE_COLOR.GAUGEGRADE.LOW_GRADE,
        formatter (value) {
          if (value === 0 || value === that.transformData.max) {
            return value
          }
        },
        distance: 25
      },
      pointer: {
        show: false
      },
      detail: {
        offsetCenter: [0, -15],
        formatter (value) {
          return Math.round(value)
        },
        fontWeight: 'bold',
        fontSize: 80
      },
      title: {
        show: true,
        color: that.BASE_COLOR.GAUGEGRADE.LOW_GRADE,
        fontSize: 20,
        offsetCenter: [0, '50%']
      }
    },
    {
      type: 'gauge',
      center: ['50%', '55%'],
      radius: '80%',
      axisLine: {
        show: false,
        lineStyle: {
          width: 3,
          color: [[1, that.BASE_COLOR.GAUGEGRADE.INNER_CIRCLE]] // 内层圈颜色
        }
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false
      },
      pointer: {
        show: false
      },
      detail: {
        show: false
      }
    }]
  }
}

export {
  getGaugeChartOption,
  NEST_GRADE
}
