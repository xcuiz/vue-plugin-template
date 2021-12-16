// 实现 mini 图表的关键配置，这里的配置bar与line可以共用
import BASE_COLOR from '../../theme/default-base-color'
export default {
  visualMap: {
    show: false,
    type: 'piecewise',
    dimension: 0,
    pieces: [],
    outOfRange: {
      color: BASE_COLOR.CARTESIAN.BASELINE.OUTOFRANGE_COLOR
    }
  },
  series: [{
    symbol: 'none'
  }, {
    symbol: 'none',
    lineStyle: {
      opacity: 0
    }
  }, {
    stack: 'idss-baseline',
    symbol: 'none',
    lineStyle: {
      opacity: 0
    }
  }, {
    stack: 'idss-baseline',
    symbol: 'none',
    lineStyle: {
      opacity: 0
    },
    areaStyle: {
      opacity: 1,
      color: BASE_COLOR.CARTESIAN.BASELINE.AREASTYLE_COLOR
    }
  }]
}
