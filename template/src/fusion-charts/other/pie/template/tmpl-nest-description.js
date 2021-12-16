import defaultBaseColor from '../../../theme/default-base-color.js'
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
          backgroundColor: defaultBaseColor.PIE.NEST.BACK_COLOR,
          borderColor: defaultBaseColor.PIE.NEST.BORDER_COLOR, // @FIXME color
          borderWidth: 1,
          borderRadius: 4,
          formatter: '{a|{b}}{abg|}\n{hr|}\n {b|{c}} {per|{d}%}  ',
          rich: {
            a: {
              lineHeight: 22,
              align: 'center'
            },
            hr: {
              borderColor: defaultBaseColor.PIE.NEST.BORDER_COLOR, // @FIXME color
              width: '100%',
              borderWidth: 0.5,
              height: 0
            },
            b: {
              fontSize: 16,
              lineHeight: 33
            },
            per: {
              color: defaultBaseColor.PIE.NEST.TEXT_COLOR, // @FIXME color
              backgroundColor: defaultBaseColor.PIE.NEST.RICH_BACK_COLOR, // @FIXME color
              padding: [2, 4],
              borderRadius: 2
            }
          }
        }
      }
    }
  ]
}
