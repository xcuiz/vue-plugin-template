import position from '../position.js'
export default {
  show: true,
  type: 'continuous',
  min: 0,
  max: 100,
  text: ['高', '低'],
  calculable: true,
  ...position['left-end']
}
