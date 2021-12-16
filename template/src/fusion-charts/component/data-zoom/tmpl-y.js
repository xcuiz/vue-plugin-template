// Y 轴上的数据缩放配置模板
import position from '../position.js'
export default {
  type: 'slider',   // 数据轴在图表外显示
  yAxisIndex: 0,    // 默认第一个y轴(直角坐标系中的y轴，其他坐标系需要手动指定对应的轴)
  filterMode: 'filter', // https://www.echartsjs.com/option.html#dataZoom-slider.filterMode
  // 默认控制范围 0-40%
  start: 0,
  end: '40',
  ...position['left-start']
}
