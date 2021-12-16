// 数据库表关系图形化配置 基础配置
export default {
  tableWidth: 200,
  // 纵向table间距
  rowSpace: 50,
  // 横向table间距
  colSpace: 50,
  // 最小x轴差值
  minDvalue: 15,
  // 关联线 拐角半径
  lineRx: 5,
  table: {
    // 表头配置
    header: {
      height: 46
    },
    // 表头文本配置
    headerText: {
      'font-size': 14,
      'text-anchor': 'middle',
      fill: '#333'
    },
    // 字段配置
    field: {
      height: 32
    },
    // 字段文本配置
    fieldText: {
      'text-anchor': 'start',
      'font-size': 14
    },
    // 字段类型配置
    fieldType: {
      'text-anchor': 'end',
      'font-size': 12
    }
  },
  // 关联线
  refs: {
    // 是否绘制有向箭头
    isDrawArrow: false,
    line: {
      fill: 'none'
    },
    // 箭头配置
    arrow: {}
  }
}
