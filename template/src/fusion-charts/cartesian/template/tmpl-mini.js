// 实现 mini 图表的关键配置，这里的配置bar与line可以共用
export default {
  legend: {
    show: false
  },
  xAxis: [{
    axisLine: {
      show: false
    },
    axisLabel: {
      show: false
    },
    axisTick: {
      show: false
    }
  }],
  yAxis: [{
    axisLine: {
      show: false
    },
    axisLabel: {
      show: false
    },
    axisTick: {
      show: false
    },
    splitLine: {
      show: false
    }
  }]
}
