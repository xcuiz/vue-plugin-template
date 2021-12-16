import 'echarts/lib/chart/scatter'
import Calendar from '../calendar.js'
import { merge, isFunction } from '../../util/base.js'
import BASE_COLOR from '../../theme/default-base-color.js'
import GraphicButton from './graphic-button.js'
import * as echartsNumber from 'echarts/lib/util/number'
import * as echartsFormat from 'echarts/lib/util/format'
import { data2Calendar } from '../../data-factory'

export default {
  name: 'idss-calendar-chart',
  extends: Calendar,
  mixins: [GraphicButton],
  props: {
    hideButton: {
      type: Boolean,
      default: false
    },
    notAutoComplete: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      firstDay: 1,  // 周起始日是哪一天
      titleText: '',
      // 补全的日期样式
      nonCurrentMonthStyle: {
        itemStyle: {
          borderColor: 'none',
          color: BASE_COLOR.CALENDAR.CALENDAR.UNACTIVE_ITEM_COLOR
        },
        label: {
          show: true,
          color: BASE_COLOR.CALENDAR.CALENDAR.UNACTIVE_LABEL_COLOR
        }
      },
      // series 数据样式
      seriesDataStyle: {
        itemStyle: {
          color: BASE_COLOR.CALENDAR.CALENDAR.HIGHLIGHT_ITEM_COLOR,
          opacity: 1
        }
      }
    }
  },
  methods: {
    // 内置处理data数据的函数
    getDataFactory (data) {
      return data2Calendar(data)
    },

    initChartOption () {
      let defaultOption = this.getDefaultOption()
      let option = {
        title: {
          show: true,
          text: this.titleText,
          left: 'center',
          z: 5
        },
        tooltip: {
          trigger: 'item',
          position: 'top',
          formatter: (datas) => {
            let res = ''
            // 数据截取，获取tip数据
            if (datas.data && datas.data.value && Array.isArray(datas.data.value) && datas.data.value.length > 2) {
              const tipArr = datas.data.value.slice(2)
              tipArr.forEach(item => {
                const { name, value } = item
                // format为props传入callback，支持用户自定义
                if (this.transformData.format[name] && isFunction(this.transformData.format[name])) {
                  res += `${this.transformData.format[name](name, value)}</br>`
                } else {
                  res += `${name}:${value}</br>`
                }
              })
            }
            return res
          }
        },
        calendar: defaultOption.calendar,
        series: defaultOption.series
      }

      // 判断一下是否添加操作(前进后退)按钮
      if (!this.hideButton) {
        option = this.addGraphicButton(option)
      }
      return option
    },

    getDefaultOption () {
      let result = {
        calendar: [],
        series: []
      }
      // 判断range数据存在，获取年月数据
      if (Array.isArray(this.transformData.calendar) && this.transformData.calendar.length) {
        this.transformData.calendar.map(item => {
          if (Array.isArray(item.range) && item.range.length) {
            // 根据当前的日历坐标范围获取需要的各种数据
            const { currentYear, currentMonth, firstDay, lastDay, completeCalendar } = this.getCompleteCalendarData(item.range[0])
            // 添加标题文本
            this.titleText = `${currentYear} 年 ${currentMonth} 月`
            result.calendar.push(this.getDefaultCalendar(firstDay, lastDay))
            // 对 series 数据进行加工处理，例，添加 itemStyle，label等特殊样式
            let processSeriesData = this.processSeriesData(completeCalendar, this.seriesDataStyle)
            result.series.push(this.getDefaultSeries(processSeriesData))
          }
        })
      }
      return result
    },

    getDefaultCalendar (firstDate, lastDate) {
      return {
        orient: 'vertical',
        left: 10,
        right: 10,
        top: 60,
        cellSize: 40,
        splitLine: {
          show: false
        },
        itemStyle: {
          borderWidth: 0
        },
        yearLabel: {
          show: false // 不显示年份标签
        },
        dayLabel: {
          margin: 10,
          firstDay: this.firstDay,
          nameMap: 'cn'
        },
        monthLabel: {
          show: false,
          position: 'start'
        },
        range: [firstDate, lastDate]
      }
    },

    getDefaultSeries (data) {
      return {
        type: 'scatter',
        coordinateSystem: 'calendar',
        symbolSize: 35,
        itemStyle: {
          opacity: 1
        },
        label: {
          show: true
        },
        data: data
      }
    },

    /**
     * 根据当前的月份和年份获取日历坐标需要的各种数据
     * @param {string} range
     * @return {object<>} 日期列表
     */
    getCompleteCalendarData (range) {
      let currentYear = echartsFormat.formatTime('yyyy', range)
      let currentMonth = echartsFormat.formatTime('MM', range)

      // 参数不传默认为当前月
      if (!currentYear && !currentMonth) {
        let startMonth = echartsFormat.formatTime('yyyy-MM', new Date()).split('-')
        currentYear = startMonth[0]
        currentMonth = startMonth[1]
      }
      // echarts parseData 支持 2018-15-56的解析
      let firstDayParse = +echartsNumber.parseDate(`${currentYear}-${currentMonth}-01`)
      let endDayParse = +echartsNumber.parseDate(`${currentYear}-${+currentMonth + 1}-01`)
      let dayTime = 3600 * 24 * 1000

      let completeCalendar = []
      for (var time = firstDayParse; time < endDayParse; time += dayTime) {
        completeCalendar.push({
          name: echartsFormat.formatTime('yyyy-MM-dd', time),
          value: [echartsFormat.formatTime('yyyy-MM-dd', time), echartsFormat.formatTime('d', time)]
        })
      }

      // 判断是否自动补全
      if (!this.notAutoComplete) {
        // 头补全
        completeCalendar.splice(0, 0, ...this.autoCompleteCalendar(firstDayParse, 'start'))
        // 尾补全
        completeCalendar.push(...this.autoCompleteCalendar(endDayParse, 'end'))
      }

      return {
        currentYear,
        currentMonth,
        firstDay: completeCalendar[0].name,
        lastDay: completeCalendar[completeCalendar.length - 1].name,
        completeCalendar
      }
    },

    /**
     * 对 series 数据进行加工处理，例，添加 itemStyle，label等特殊样式
     * @param {array<{object}>} calendarData
     * @param {array} calendarData 日历坐标数据
     * @param {object} processObj
     * @return {array} 处理后的 series data
     */
    processSeriesData (calendarData, processObj) {
      const hasData = {}
      this.transformData.series.forEach(item => {
        item.data.forEach(d => {
          hasData[d['name']] = d.value
        })
      })

      return calendarData.map(item => {
        if (hasData[item.name]) {
          item.value.push(...hasData[item.name])
          return merge(item, processObj)
        }
        return item
      })
    },

    /**
     * 补全日历日期
     * @param {string} parseDate
     * @param {string} type 'start'/'end'
     * @return {array}
     */
    autoCompleteCalendar (parseDate, type) {
      const completeDate = []

      if (parseDate) {
        let getDay = new Date(parseDate).getDay()
        const dayTime = 3600 * 24 * 1000

        switch (type) {
          case 'start':  // 头补全
            if (getDay !== this.firstDay) {
              getDay = getDay === 0 ? 7 : getDay
              for (let i = this.firstDay; i < getDay; i++) {
                parseDate -= dayTime
                completeDate.unshift(this.fulnessNonCurrentMonth(parseDate))
              }
            }
            break
          case 'end': // 尾补全
            let lastDay = (this.firstDay - 1) >= 0 ? (this.firstDay - 1) : 6
            if (lastDay !== getDay - 1) {
              lastDay = lastDay === 0 ? 7 : lastDay
              for (let i = getDay - 1; i < lastDay; i++) {
                completeDate.push(this.fulnessNonCurrentMonth(parseDate))
                parseDate += dayTime
              }
            }
            break
        }
        return completeDate
      }
    },

    /**
     * 完善补全日期(非当前月日期)数据及样式
     * @param {string} parseDate
     * @returns {object}
     */
    fulnessNonCurrentMonth (parseDate) {
      return {
        name: echartsFormat.formatTime('yyyy-MM-dd', parseDate),
        value: [echartsFormat.formatTime('yyyy-MM-dd', parseDate), echartsFormat.formatTime('d', parseDate)],
        ...this.nonCurrentMonthStyle
      }
    }
  }
}
