import 'echarts/lib/component/calendar'
import Container from '../container'
import { merge } from '../util/base'

export default {
  extends: Container,
  props: {
    // @propCnName 日历坐标的布局朝向, 默认为 横向
    vertical: Boolean,
    // @propIsApi 基础数据
    data: {
      type: [Object, Array],
      default () {
        return {
          series: [],
          calendar: []
        }
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    initDefaultOption () {
      return {
        calendar: this.getDefaultCalendar()
      }
    },

    getDefaultCalendar () {
      let tempCalendar = {
        left: '80px',
        right: '3%',
        top: '60px',
        bottom: '3%',
        orient: this.vertical ? 'vertical' : 'horizontal',
        dayLabel: {
          nameMap: 'cn',
          firstDay: 1  // 从周一开始
        },
        monthLabel: {
          nameMap: 'cn'
        },
        yearLabel: {
        }
      }
      return this.transformData.calendar.map(c => merge(tempCalendar, c))
    }
  }
}
