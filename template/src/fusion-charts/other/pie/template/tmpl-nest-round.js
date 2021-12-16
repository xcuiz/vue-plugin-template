export default {
  series: [
    {
      radius: ['30%', '50%'],
      avoidLabelOverlap: false,
      // 饼图label居中处理
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '20',
            fontWeight: 'bold'
          }
        }
      }
    },
    {
      radius: ['60%', '80%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center'
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: '20',
            fontWeight: 'bold'
          }
        }
      }
    }
  ]
}
