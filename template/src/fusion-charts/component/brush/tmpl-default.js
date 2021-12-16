export default {
  // 利用 null 隐藏 toolbox列表的显示，不然需要单独配置 toolbox 选项
  toolbox: ['lineX', 'rect', 'clear'],
  xAxisIndex: 'all',
  yAxisIndex: 'all',
  geoIndex: 'all',
  brushType: 'lineX',
  // 单选
  brushMode: 'single',
  // 禁止点击空白区域，清空选择的区域
  removeOnClick: false,
  // 采用 debounce 机制
  throttleType: 'debounce',
  // debounce 时间
  throttleDelay: 300
}
