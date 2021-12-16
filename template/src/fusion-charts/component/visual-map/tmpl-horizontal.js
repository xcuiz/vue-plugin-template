import position from '../position.js'
export default {
  show: true,
  type: 'continuous',
  text: ['高', '低'],
  min: 0,
  max: 100,
  calculable: true,
  orient: 'horizontal',
  align: 'left',
  ...position.bottom
}
