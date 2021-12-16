/**
 * echarts 主题工具覆盖不到的颜色，统一在这里补充。
 * ！！！所有的颜色必须注释清楚，什么地方用，什么场景用(hover或者click之类的场景)!!!
 */

/* 基础颜色 */
const BASE = {
  WHITE: '#fff',
  RED: '#f00',
  GAINSBORO: '#eee',
  SILVER: '#ccc',
  DARK_SILVER: '#aaa',
  DIM_GRAY: '#666',
  DARK_GRAY: '#999'
}

/* 笛卡尔坐标 */
const CARTESIAN = {
  BASELINE: {
    PIECES_COLOR: BASE.RED,
    OUTOFRANGE_COLOR: '#6299EC',
    AREASTYLE_COLOR: 'rgba(72,177,255,0.3)'
  },
  QUADRANT: {
    QUADRAN_TCOLOR: ['#C23531', '#2F4554', '#61A0A8', '#D48265', '#91C7AE', '#749F83', '#CA8622', '#BDA29A', '#6E7074', '#546570', '#C4CCD3'], // 象限图颜色
    QUADRANT_TXT_COLOR: '#000'
  }
}

/* 极坐标 */
const POLAR = {
  BORDER_COLOR: BASE.WHITE
}
/** pie */
const PIE = {
  BASE: {
    SHADOW_COLOR: 'rgba(0, 0, 0, 0.2)'
  },
  NEST: {
    BORDER_COLOR: BASE.DARK_SILVER,
    TEXT_COLOR: BASE.WHITE,
    BACK_COLOR: BASE.GAINSBORO,
    RICH_BACK_COLOR: BASE.DARK_GRAY
  },
  ROUND: {
    TEXT_COLOR: BASE.DIM_GRAY
  },
  DISCRIPTION: {
    TEXT_COLOR: BASE.DIM_GRAY,
    EMPHASIS: BASE.SILVER
  },
  DETAIL: {
    TEXT_COLOR: BASE.DIM_GRAY,
    // FIXME: 梯度颜色, 色彩需要修改, 考虑搭配主体色
    GRADIENT_COLOR: [
      ['#283593', '#303F9F', '#3949AB', '#3F51B5', '#5C6BC0'],
      ['#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A'],
      ['#0277BD', '#0288D1', '#039BE5', '#03A9F4', '#29B6F6'],
      ['#F9A825', '#FBC02D', '#FDD835', '#FFEB3B', '#FFEE58'],
      ['#1565C0', '#1976D2', '#1E88E5', '#2196F3', '#42A5F5']
    ]
  }
}

// 日历坐标
const CALENDAR = {
  CALENDAR: {
    UNACTIVE_LABEL_COLOR: '#bbb',
    UNACTIVE_ITEM_COLOR: '#fff',
    HIGHLIGHT_ITEM_COLOR: '#f00',
    GRAPHIC_STROKE_COLOR: '#999',
    GRAPHIC_STROKE_HOVER_COLOR: '#5D87DD'
  }
}

export default {
  CARTESIAN,
  POLAR,
  CALENDAR,
  PIE
}
