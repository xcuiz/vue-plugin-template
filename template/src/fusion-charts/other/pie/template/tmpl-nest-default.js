export default {
  series: [
    {
      selectedMode: 'single',
      hoverAnimation: true,
      radius: ['0%', '30%'],
      label: {
        normal: {
          position: 'inner',
          formatter: '{b}'
        }
      }
    },
    {
      hoverAnimation: true,
      radius: ['40%', '55%'],
      label: {
        normal: {
          borderWidth: 1,
          borderRadius: 4,
          formatter: '{b}'
        }
      }
    }
  ]
}
