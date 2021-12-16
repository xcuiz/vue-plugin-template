/**
 * echarts 主题工具覆盖不到的颜色，统一在这里补充。
 * ！！！所有的颜色必须注释清楚，什么地方用，什么场景用(hover或者click之类的场景)!!!
 */

/* 基础颜色 */
const BASE = {
  WHITE: '#fff',
  RED: '#f00'
}

/* 笛卡尔坐标 */
const CARTESIAN = {
  BASELINE: {
    PIECES_COLOR: BASE.RED,
    OUTOFRANGE_COLOR: '#6299EC',
    AREASTYLE_COLOR: 'rgba(72,177,255,0.3)'
  }
}

/* 极坐标 */
const POLAR = {
  BORDER_COLOR: BASE.WHITE
}

export default {
  CARTESIAN,
  POLAR
}
