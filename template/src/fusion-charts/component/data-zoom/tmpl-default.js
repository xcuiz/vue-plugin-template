export default {
  type: 'slider',   // 数据轴在图表外显示
  xAxisIndex: 0,    // 默认第一个x轴(直角坐标系中x轴，其他坐标系需要手动指定对应的轴)
  filterMode: 'filter', // https://www.echartsjs.com/option.html#dataZoom-slider.filterMode
  // 默认控制范围 0-40%
  start: 0,
  end: '100'
}
