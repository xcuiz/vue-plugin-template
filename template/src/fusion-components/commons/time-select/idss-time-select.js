/**
 * Created by ligang on 2018/7/26.
 */
import { formatDate } from 'fusion-utils'

const TIME_UNIT = {
  s: '秒',
  m: '分钟',
  h: '小时',
  d: '天',
  w: '周',
  M: '月',
  y: '年'
}
let MODE = {
  1: 'noTimeRange',
  2: 'absolute',
  3: 'relative',
  4: 'quick', // quick 选项状态只存在组件内部，与后台数据无关系
  'noTimeRange': 1,
  'absolute': 2,
  'relative': 3
}

const TIMESTAMP = {
  /** 1秒的毫秒值 */
  SECOND: 1000,
  /** 1分钟的毫秒值 */
  MINUTE: 1000 * 60,
  /** 1小时 */
  HOUR: 1000 * 60 * 60,
  /** 1天的毫秒值 */
  DAY: 1000 * 60 * 60 * 24,
  /** 1周的毫秒值 */
  WEEK: 1000 * 60 * 60 * 24 * 7,
  /** 1月的毫秒值(按30天算) */
  MONTH: 1000 * 60 * 60 * 24 * 30
}

const QUICK_TIME = {
  abs: [
    {
      name: '今天',
      interval: 0,
      unit: 'd',
      key: 'today'
    },
    {
      name: '昨天',
      interval: 1,
      unit: 'd',
      key: 'yesterday'
    },
    {
      name: '前天',
      interval: 2,
      unit: 'd',
      key: 'tdby'
    },
    {
      name: '本周',
      interval: 0,
      unit: 'w',
      key: 'week'
    },
    {
      name: '上一周',
      interval: 1,
      unit: 'w',
      key: 'lastWeek'
    },
    {
      name: '本月',
      interval: 0,
      unit: 'M',
      key: 'month'
    },
    {
      name: '上个月',
      interval: 1,
      unit: 'M',
      key: 'lastMonth'
    },
    {
      name: '今年',
      interval: 0,
      unit: 'y',
      key: 'year'
    },
    {
      name: '去年',
      interval: 1,
      unit: 'y',
      key: 'lastYear'
    }
  ],
  last: [
    {
      name: '最近1分钟',
      interval: 1,
      unit: 'm',
      key: 'lastMin1'
    },
    {
      name: '最近10分钟',
      interval: 10,
      unit: 'm',
      key: 'lastMin10'
    },
    {
      name: '最近15分钟',
      interval: 15,
      unit: 'm',
      key: 'lastMin15'
    },
    {
      name: '最近30分钟',
      interval: 30,
      unit: 'm',
      key: 'lastMin30'
    },
    {
      name: '最近1小时',
      interval: 1,
      unit: 'h',
      key: 'lastHour1'
    },
    {
      name: '最近4小时',
      interval: 4,
      unit: 'h',
      key: 'lastHour4'
    },
    {
      name: '最近12小时',
      interval: 12,
      unit: 'h',
      key: 'lastHour12'
    },
    {
      name: '最近24小时',
      interval: 24,
      unit: 'h',
      key: 'lastHour24'
    },
    {
      name: '最近7天',
      interval: 7,
      unit: 'd',
      key: 'lastDay7'
    },
    {
      name: '最近30天',
      interval: 30,
      unit: 'd',
      key: 'lastDay30'
    },
    {
      name: '最近60天',
      interval: 60,
      unit: 'd',
      key: 'lastDay60'
    },
    {
      name: '最近90天',
      interval: 90,
      unit: 'd',
      key: 'lastDay90'
    },
    {
      name: '最近6个月',
      interval: 6,
      unit: 'M',
      key: 'lastMonth6'
    },
    {
      name: '最近1年',
      interval: 1,
      unit: 'y',
      key: 'lastYear1'
    }
  ]
}
let DEFAULT_TIME = {
  timeFlag: 2,                                                      // 日历时间标识 1:无 2:绝对时间 3:相对时间
  startTime: +new Date().setHours(0, 0, 0, 0),                      // 开始时间（时间标识为2时，其他为空）
  endTime: +new Date().setHours(0, 0, 0, 0) - 24 * 3600 * 1000,     // 结束时间（时间标识为2时，其他为空）
  timeInterval: 1,                                                  // 间隔（时间标识为3时，其他为空）
  timeUnit: 'd'                                                     // 间隔单位（时间标识为3时，其他为空）s:秒 m:分 h:时 d:天 w:周 M:月
}

/**
 * @cnName 日期时间组件
 * @event {Function} change 用户确认选定的值时触发
 */

export default {
  props: {
    placement: { // @propDesc tooltip出现位置
      type: String,
      default: 'bottom'
    },
    minWidth: {// @propDesc  最小宽度
      type: String,
      default: 'none'
    },
    noTimeRange: Boolean, // @propDesc  无需时间间隔
    time: {// @propDesc  组件绑定值
      type: Object,
      default: () => ({ ...DEFAULT_TIME })
    },
    disabled: {// @propDesc  Popover 是否可用
      type: Boolean,
      default: function () {
        return false
      }
    },
    formatter: {// @propDesc  显示在输入框中的格式
      type: String,
      default: function () {
        return 'yyyy-MM-dd hh:mm:ss'
      }
    },
    isInDialog: {// @propDesc  影响Popover的层级
      type: Boolean,
      default: function () {
        return false
      }
    },
    isShowTooltip: {// @propDesc  是否展示tooltip
      type: Boolean,
      default: false
    },
    disableChangeEndTime: {// @propDesc  是否禁用结束日期
      type: Boolean,
      default: false
    },
    customQuickTime: {// @propDesc  自定义快捷选项
      type: Object,
      default () {
        return { activeKey: '' }
      }
    },
    size: {// @propDesc  输入框尺寸
      type: String,
      default () {
        return ''
      }
    }
  },
  data () {
    const validateStart = (rule, value, callback) => {
      const end = this.absoluteForm.end
      if (!end) {
        callback()
      }
      // 毫秒值不受用户选择控制， 都置为0做对比（后续将开始时间统一置为000，结束时间统一置为999）
      if (+new Date(value).setMilliseconds(0) > +new Date(end).setMilliseconds(0)) {
        callback(new Error('开始时间不能大于结束时间'))
      }
      callback()
    }
    const validateEnd = (rule, value, callback) => {
      const start = this.absoluteForm.start
      if (!start) {
        callback()
      }
      // 毫秒值不受用户选择控制， 都置为0做对比（后续将开始时间统一置为000，结束时间统一置为999）
      if (+new Date(value).setMilliseconds(0) < +new Date(start).setMilliseconds(0)) {
        callback(new Error('结束时间不能小于开始时间'))
      }
      callback()
    }
    // 获取vue原型上 globalTime config配置
    const globalTimeConfig = this.$COMPONENTS_CONFIG && this.$COMPONENTS_CONFIG['timeSelect'] && this.$COMPONENTS_CONFIG['timeSelect'].globalTime
    DEFAULT_TIME = globalTimeConfig || DEFAULT_TIME
    return {
      activeKey: '',
      quickTime: Object.assign({}, QUICK_TIME, this.customQuickTime),
      timePopoverVisible: false,
      timeFlag: this.time.timeFlag || DEFAULT_TIME.timeFlag,
      // 用于 el-tabs 组件中 v-model
      currentTabs: MODE[4],
      // 相对时间的参数
      oppositeTimeInterval: this.time.timeInterval || DEFAULT_TIME.timeInterval,
      oppositeTimeUnit: this.time.timeUnit || DEFAULT_TIME.timeUnit,
      oppositeTimeUnitArray: TIME_UNIT,
      // 绝对时间的参数
      absoluteForm: {
        start: new Date(this.time.startTime || DEFAULT_TIME.startTime),
        end: new Date(this.time.endTime || DEFAULT_TIME.endTime)
      },
      // 绝对时间 开始时间的 禁选日期，大于结束时间的日期不可以选
      absoluteStartOption: {
        disabledDate: data => {
          const end = this.absoluteForm.end
          return end ? data > end.getTime() : false
        }
      },
      // 绝对时间 结束时间的 禁选日期，小于开始时间的日期不可以选
      absoluteEndOption: {
        disabledDate: data => {
          const start = this.absoluteForm.start
          const day = 24 * 3600 * 1000 // 可以选择开始时间同一天
          return start ? data < (start.getTime() - day) : false
        }
      },
      // 绝对时间的验证规则
      absoluteFormRule: {
        start: [
          { type: 'date', required: true, message: '请选择开始日期时间', trigger: 'change' },
          { validator: validateStart, trigger: 'change' }
        ],
        end: [
          { type: 'date', required: true, message: '请选择结束日期时间', trigger: 'change' },
          { validator: validateEnd, trigger: 'change' }
        ]
      },
      // 用于显示界面的字符串计算
      showTimeInterval: ''
    }
  },
  watch: {
    time: {
      deep: true,
      handler: function (newVal) {
        if (Object.keys(newVal).length) {
          this.initTime(newVal)
        } else {
          this.initTime(DEFAULT_TIME)
          this.$emit('update:time', DEFAULT_TIME)
        }
      }
    },
    formatter: {
      deep: true,
      handler: function (newVal) {
        this.displayTime()
      }
    }
  },
  methods: {
    initTime (time) {
      this.timeFlag = time.timeFlag
      // 当 timeFlag 等于 1的时候改变当前的 tab选项卡。当等于 quick 时不改变
      if (time.timeFlag === 1 || this.currentTabs !== 'quick') {
        // 用于 el-tabs 组件中 v-model
        this.currentTabs = MODE[time.timeFlag]
      }
      // 绝对时间的参数
      this.$refs.absolute.resetFields()
      this.absoluteForm.start = new Date(time.startTime)
      this.absoluteForm.end = new Date(time.endTime)
      // 相对时间的参数
      this.oppositeTimeInterval = time.timeInterval
      this.oppositeTimeUnit = time.timeUnit
      this.displayTime()
    },
    // 生成在界面显示的时间
    displayTime () {
      switch (MODE[this.timeFlag]) {
        case 'absolute':
          this.showTimeInterval = formatDate.call(this.absoluteForm.start, this.formatter) + ' - ' + formatDate.call(this.absoluteForm.end, this.formatter)
          break
        case 'relative':
          this.showTimeInterval = `最近${this.oppositeTimeInterval}${TIME_UNIT[this.oppositeTimeUnit]}`
          break
        case 'noTimeRange':
        default:
          this.showTimeInterval = '不依赖时间条件'
      }
      // 格式化显示字符串
      this.$emit('update:timeText', this.showTimeInterval)
    },
    /**
     * 快速选择时间，分为 相对时间 与 绝对时间的快速选择
     * @param {*} time
     * @param {*} type
     */
    quickSelect (time, type) {
      this.quickTime.activeKey = time.key
      // 相对时间选择项
      if (type === 'relative') {
        this.oppositeTimeInterval = time.interval
        this.oppositeTimeUnit = time.unit
      } else {
        const now = new Date()
        // 今天 凌晨
        const toDaymorning = new Date(now.toDateString() + ' 00:00:00')
        switch (time.unit) {
          case 'd':
            // 指定日期的时间
            const start = new Date(toDaymorning)
            start.setDate(toDaymorning.getDate() - time.interval)
            this.absoluteForm.start = start
            this.absoluteForm.end = this.generateTime(start, time)
            break
          case 'w':
            // 一周中的第几天。 因为美国一周的开始是周日，而中国是一周的结束是周日，所以getDay返回0时设置为7
            const weekDay = now.getDay() || 7
            // 本周一的凌晨
            toDaymorning.setDate(now.getDate() - weekDay + 1)
            const monday = toDaymorning
            if (time.interval === 'this') {
              this.absoluteForm.start = monday
              this.absoluteForm.end = now
            } else {
              // 指定日期的周一
              monday.setDate(monday.getDate() - time.interval * 7)
              this.absoluteForm.start = monday
              // 指定日期的周日 23:59:59
              this.absoluteForm.end = new Date(+monday + TIMESTAMP.WEEK - 1)
            }
            break
          case 'M':
            // 本月第一天的凌晨
            const fristDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
            fristDayOfMonth.setMonth(fristDayOfMonth.getMonth() - time.interval)
            this.absoluteForm.start = fristDayOfMonth
            this.absoluteForm.end = this.generateTime(fristDayOfMonth, time)
            break
          case 'y':
            const fristDayOfYear = new Date(now.getFullYear(), 0, 1)
            fristDayOfYear.setFullYear(fristDayOfYear.getFullYear() - time.interval)
            this.absoluteForm.start = fristDayOfYear
            this.absoluteForm.end = this.generateTime(fristDayOfYear, time)
        }
      }
      this.timeChanged(type)
    },
    /**
     * 生成一个周期内的结束时间
     * @param {*} start
     * @param {*} unit
     */
    generateTime (start, time) {
      if (time.interval === 0) {
        return new Date()
      }
      const methods = {
        d: 'Date',
        M: 'Month',
        y: 'FullYear'
      }
      const end = new Date(start)
      // 下一个周期的开始时间
      end[`set${methods[time.unit]}`](start[`get${methods[time.unit]}`]() + 1)
      // 减去1毫秒，变为上一个周期的结束时间
      end.setMilliseconds(-1)
      return end
    },
    async timeChanged (currentTab = this.currentTabs) {
      let params = {}
      switch (currentTab) {
        case 'noTimeRange':
          this.timeFlag = MODE['noTimeRange']
          params = Object.assign({}, this.time, {
            timeFlag: this.timeFlag
          })
          break
        case 'absolute':
          try {
            await this.$refs.absolute.validate()
          } catch (e) {
            console.log(e)
            return
          }
          this.timeFlag = MODE['absolute']
          // 已同后台确认，毫秒值按照 000 - 999 传输；要注意的是当前可能为到达999，但后台不会报错
          params = Object.assign({}, this.time, {
            timeFlag: this.timeFlag,
            startTime: +new Date(this.absoluteForm.start).setMilliseconds(0),
            endTime: +new Date(this.absoluteForm.end).setMilliseconds(999)
          })
          break
        case 'relative':
          if (!this.oppositeTimeInterval) {
            this.$message.error('请输入正确的时间间隔。')
            return
          }
          this.timeFlag = MODE['relative']
          params = Object.assign({}, this.time, {
            timeFlag: this.timeFlag,
            timeInterval: this.oppositeTimeInterval,
            timeUnit: this.oppositeTimeUnit
          })
          break
        default:
          params = Object.assign(this.time)
          this.showTimeInterval = '请选择时间'
      }
      // 生成界面显示的时间字符串
      this.displayTime()
      // 隐藏popover
      this.timePopoverVisible = false
      this.$refs['idssShowTimeRef'] && this.$refs['idssShowTimeRef'].focus()  // 让输入框获取焦点
      if (this.timeSelectVisible) {
        this.close()
      }
      // 通知父组件，发起修改请求的接口
      this.$emit('update:time', params)
      this.$emit('change', params)
    }
  },
  created () {
    this.displayTime()
  }
}
