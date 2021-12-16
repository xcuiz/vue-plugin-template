import * as echartsNumber from 'echarts/lib/util/number'
import * as echartsFormat from 'echarts/lib/util/format'
import BASE_COLOR from '../../theme/default-base-color.js'

export default {
  methods: {
    /**
     * 添加切换按钮
     * @param {object} option
     */
    addGraphicButton (option) {
      let defaultGraphic = [
        {
          type: 'group',
          left: 60,
          top: 0,
          z: 100,
          bouding: 'all',
          children: [
            {
              type: 'circle',
              shape: {
                cx: 12,
                cy: 8,
                r: 12
              },
              style: {
                fill: 'transparent'
              },
              z: 12
            },
            {
              type: 'polyline',
              shape: {
                points: [[16, 0], [8, 8], [16, 16]]
              },
              style: {
                stroke: BASE_COLOR.CALENDAR.CALENDAR.GRAPHIC_STROKE_COLOR,
                lineWidth: 1.5
              },
              z: 10
            }
          ],
          onmouseover: this.mouseHandle(0, BASE_COLOR.CALENDAR.CALENDAR.GRAPHIC_STROKE_HOVER_COLOR, option),
          onmouseout: this.mouseHandle(0, BASE_COLOR.CALENDAR.CALENDAR.GRAPHIC_STROKE_COLOR, option),
          onclick: () => {
            // 获取上一个月数据
            this.getPrevMonthData()
          }
        },
        {
          type: 'group',
          right: 60,
          top: 0,
          z: 10,
          bouding: 'all',
          children: [
            {
              type: 'circle',
              shape: {
                cx: 4,
                cy: 8,
                r: 12
              },
              style: {
                fill: 'transparent'
              },
              z: 12
            },
            {
              type: 'polyline',
              shape: {
                points: [[0, 0], [8, 8], [0, 16]]
              },
              style: {
                stroke: BASE_COLOR.CALENDAR.CALENDAR.GRAPHIC_STROKE_COLOR,
                lineWidth: 1.5
              },
              z: 10
            }
          ],
          onmouseover: this.mouseHandle(1, BASE_COLOR.CALENDAR.CALENDAR.GRAPHIC_STROKE_HOVER_COLOR, option),
          onmouseout: this.mouseHandle(1, BASE_COLOR.CALENDAR.CALENDAR.GRAPHIC_STROKE_COLOR, option),
          onclick: () => {
            // 获取下一个月数据
            this.getNextMonthData()
          }
        }
      ]
      option.graphic = defaultGraphic
      return option
    },

    /**
     * 获取上一个月的数据
     */
    getPrevMonthData () {
      this.$emit('getPrevMonthData', this.getYearMonth('prev'))
    },

    /**
     * 获取上一个月的数据
     */
    getNextMonthData () {
      this.$emit('getNextMonthData', this.getYearMonth('next'))
    },

    /**
     * 获取上一个/下一个年月
     * @param {string} type prev/next
     */
    getYearMonth (type) {
      // 获取当前日期
      let year = this.year
      let month = this.month
      // 获取要操作日期
      let date = type === 'prev' ? `${year}-${+month - 1}-01` : `${year}-${+month + 1}-01`
      date = +echartsNumber.parseDate(date)
      return echartsFormat.formatTime('yyyy-MM', date)
    },

    /**
     * 处理鼠标经过事件
     * @param {number} index 索引值
     * @param {string} color 色值
     * @param {object} option
     */
    mouseHandle (index, color, option) {
      return () => {
        option.graphic[index].children[1].style.stroke = color
        this.myChart.setOption(option, true)
      }
    }
  }
}
