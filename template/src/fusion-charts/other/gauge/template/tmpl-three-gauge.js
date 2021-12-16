/**
 * 仪表盘: 三个仪表盘的模板~
 * FIXME: 需要注意后台数据的顺序 中 - 左 - 右
 */

export default {
  series: [
    {
      splitNumber: 10,
      radius: '50%',
      axisLabel: {
        backgroundColor: 'auto',
        borderRadius: 2,
        color: '#eee',
        padding: 3,
        textShadowBlur: 2,
        textShadowOffsetX: 1,
        textShadowOffsetY: 1,
        textShadowColor: '#222'
      }
    },
    {
      center: ['33%', '55%'],
      radius: '35%',
      endAngle: 45,
      splitNumber: 5,
      pointer: {
        width: 5
      }
    },
    {
      center: ['67%', '55%'],
      radius: '35%',
      startAngle: 135,
      endAngle: -45,
      splitNumber: 5,
      pointer: {
        width: 5
      }
    }
  ]
}
